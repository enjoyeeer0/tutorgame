<template>
  <div class="container" style="padding-top: 40px; padding-bottom: 60px">
    <h1 class="section-title" style="font-size: 1.6rem; margin-bottom: 28px">Игры в базе</h1>

    <div class="games-grid">
      <div
        v-for="game in gamesList"
        :key="game.id"
        class="game-card"
        @click="goToGame(game.id)"
      >
        <!-- Обложка игры — картинка если есть, иначе цветной блок с эмодзи -->
        <div class="game-cover-wrapper" :style="{ background: getGameColor(game.name) }">
          <img
            v-if="getGameImage(game.name)"
            :src="getGameImage(game.name)"
            :alt="game.name"
            class="game-cover-img"
            @error="handleImageError(game.name)"
            :ref="el => imgRefs[game.name] = el"
          />
          <!-- Эмодзи показывается поверх если картинка не загрузилась -->
          <span
            v-if="failedImages[game.name] || !getGameImage(game.name)"
            class="game-cover-emoji"
          >{{ getGameEmoji(game.name) }}</span>
        </div>

        <!-- Название игры -->
        <div class="game-card-body">
          <h4>{{ game.name }}</h4>
          <div class="genre">{{ game.genre }}</div>
          <div class="guide-count">{{ countByGame(game.id) }} гайдов</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGames, getGuides } from '../api'

const router = useRouter()

// Список игр и гайдов из базы данных
const gamesList = ref([])
const allGuides = ref([])

// Хранит названия игр у которых не загрузилась картинка
const failedImages = ref({})

// Хранит ссылки на img-элементы (нужно для @error обработчика)
const imgRefs = ref({})

// ===== КАРТА ЛОКАЛЬНЫХ ИЗОБРАЖЕНИЙ =====
// Файлы лежат в frontend/public/images/ и отдаются Vite как статика
const GAME_IMAGES = {
  'Minecraft':           '/images/minecraft.jpg',
  'Dota 2':              '/images/dota2.jpg',
  'Elden Ring':          '/images/eldenring.jpg',
  'Escape from Tarkov':  '/images/tarkov.jpg',
  'Arc Raiders':         '/images/arcraiders.jpg',
  'Dark Souls III':      '/images/darksouls3.jpg',
}

// ===== КАРТА ЭМОДЗИ (фоллбэк и фон для Tarkov) =====
const GAME_EMOJIS = {
  'Minecraft':           '🧱',
  'Dota 2':              '⚔️',
  'Elden Ring':          '🗡️',
  'Escape from Tarkov':  '🎯',
  'Arc Raiders':         '🤖',
  'Dark Souls III':      '💀',
}

// ===== КАРТА ЦВЕТОВ ФОНА =====
const GAME_COLORS = {
  'Minecraft':           '#14401a',
  'Dota 2':              '#3a0a0a',
  'Elden Ring':          '#3a2800',
  'Escape from Tarkov':  '#0a2a14',
  'Arc Raiders':         '#0a1a3a',
  'Dark Souls III':      '#1a0a30',
}

// Возвращает путь к локальной картинке или null
function getGameImage(gameName) {
  return GAME_IMAGES[gameName] || null
}

// Возвращает эмодзи по названию игры
function getGameEmoji(gameName) {
  return GAME_EMOJIS[gameName] || '🎮'
}

// Возвращает цвет фона карточки
function getGameColor(gameName) {
  return GAME_COLORS[gameName] || '#1a1a2a'
}

// Вызывается если картинка не загрузилась — показываем эмодзи
function handleImageError(gameName) {
  failedImages.value[gameName] = true
}

// Считает сколько гайдов у данной игры
function countByGame(gameId) {
  return allGuides.value.filter(function(guide) {
    return guide.game_id === gameId
  }).length
}

// При клике на игру — переходим на главную с фильтром
function goToGame(gameId) {
  router.push({ path: '/', query: { game_id: gameId } })
}

// При загрузке страницы получаем данные
onMounted(async function() {
  const [gamesResponse, guidesResponse] = await Promise.all([
    getGames(),
    getGuides({})
  ])
  gamesList.value = gamesResponse.data
  allGuides.value = guidesResponse.data
})
</script>
