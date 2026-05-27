<template>
  <div>

    <!-- ===== HERO СЕКЦИЯ ===== -->
    <!-- Тёмный фон с декоративными кругами и стеклянным блоком поверх -->
    <section class="hero">

      <!-- Декоративные круги — они создают эффект для blur -->
      <div class="hero-blob hero-blob--topleft"></div>
      <div class="hero-blob hero-blob--bottomright"></div>
      <div class="hero-blob hero-blob--center"></div>

      <!-- Стеклянный блок с заголовком и поиском -->
      <div class="hero-glass">
        <h1>База знаний геймеров</h1>
        <p>Гайды, билды и советы от реальных игроков</p>

        <!-- Строка поиска — при нажатии Enter или кнопки запускает loadGuides() -->
        <div class="search-bar">
          <input
            v-model="searchQuery"
            placeholder="Поиск гайдов..."
            @keyup.enter="loadGuides"
          />
          <button class="btn" @click="loadGuides">Найти</button>
        </div>
      </div>

    </section>

    <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->
    <div class="container">

      <!-- Фильтр по играм -->
      <div class="filters">
        <span>Игра:</span>

        <!-- Кнопка "Все" сбрасывает фильтр -->
        <button
          class="filter-btn"
          :class="{ active: selectedGameId === null }"
          @click="selectGame(null)"
        >Все</button>

        <!-- Кнопка для каждой игры из базы данных -->
        <button
          v-for="game in gamesList"
          :key="game.id"
          class="filter-btn"
          :class="{ active: selectedGameId === game.id }"
          @click="selectGame(game.id)"
        >{{ game.name }}</button>
      </div>

      <!-- Фильтр по типу гайда -->
      <div class="filters">
        <span>Тип:</span>

        <button
          class="filter-btn"
          :class="{ active: selectedCategoryId === null }"
          @click="selectCategory(null)"
        >Все</button>

        <button
          v-for="category in categoriesList"
          :key="category.id"
          class="filter-btn"
          :class="{ active: selectedCategoryId === category.id }"
          @click="selectCategory(category.id)"
        >{{ category.name }}</button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="empty">
        <div class="icon">⏳</div>
        <p>Загружаем гайды...</p>
      </div>

      <!-- Нет результатов -->
      <div v-else-if="guidesList.length === 0" class="empty">
        <div class="icon">🎮</div>
        <p>Гайды не найдены. Будь первым — добавь свой!</p>
      </div>

      <!-- Сетка карточек -->
      <div v-else class="guides-grid">

        <!-- Карточка гайда — при клике переходим на страницу гайда -->
        <div
          v-for="guide in guidesList"
          :key="guide.id"
          class="guide-card"
          @click="$router.push('/guide/' + guide.id)"
        >
          <!-- Теги игры и категории -->
          <div class="card-meta">
            <span class="tag game">{{ guide.game_name }}</span>
            <span class="tag category">{{ guide.category_name }}</span>
          </div>

          <!-- Заголовок гайда -->
          <h3>{{ guide.title }}</h3>

          <!-- Превью текста (обрезается через CSS) -->
          <p>{{ guide.content }}</p>

          <!-- Автор и дата публикации -->
          <div class="card-footer">
            <span>{{ guide.author }}</span>
            <span>{{ formatDate(guide.created_at) }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getGuides, getGames, getCategories } from '../api'

// Читаем параметры из текущего URL (например ?game_id=3)
const route = useRoute()

// ===== РЕАКТИВНЫЕ ДАННЫЕ =====
// Список гайдов полученных с сервера
const guidesList = ref([])

// Список игр для фильтра
const gamesList = ref([])

// Список категорий для фильтра
const categoriesList = ref([])

// Текст из строки поиска
const searchQuery = ref('')

// Выбранный фильтр по игре (null = все)
const selectedGameId = ref(null)

// Выбранный фильтр по категории (null = все)
const selectedCategoryId = ref(null)

// Флаг загрузки — показывает спиннер пока грузятся данные
const isLoading = ref(true)

// ===== ФУНКЦИИ =====

// Загружает гайды с учётом текущих фильтров и поиска
async function loadGuides() {
  isLoading.value = true

  // Собираем параметры запроса только если они заданы
  const queryParams = {}
  if (selectedGameId.value) {
    queryParams.game_id = selectedGameId.value
  }
  if (selectedCategoryId.value) {
    queryParams.category_id = selectedCategoryId.value
  }
  if (searchQuery.value.trim()) {
    queryParams.search = searchQuery.value.trim()
  }

  const response = await getGuides(queryParams)
  guidesList.value = response.data

  isLoading.value = false
}

// Устанавливает фильтр по игре и перезагружает гайды
function selectGame(gameId) {
  selectedGameId.value = gameId
  loadGuides()
}

// Устанавливает фильтр по категории и перезагружает гайды
function selectCategory(categoryId) {
  selectedCategoryId.value = categoryId
  loadGuides()
}

// Форматирует дату в читаемый вид: "15 янв. 2024"
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// ===== ЗАПУСК =====
// При открытии страницы загружаем игры, категории и гайды параллельно
onMounted(async () => {
  const [gamesResponse, categoriesResponse] = await Promise.all([
    getGames(),
    getCategories()
  ])
  gamesList.value = gamesResponse.data
  categoriesList.value = categoriesResponse.data

  // Если в URL есть ?game_id=... — применяем фильтр по игре сразу
  // Например при переходе со страницы "Игры"
  if (route.query.game_id) {
    selectedGameId.value = Number(route.query.game_id)
  }

  await loadGuides()
})
</script>
