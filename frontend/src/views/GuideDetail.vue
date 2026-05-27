<template>
  <!-- Показываем страницу только когда гайд загружен -->
  <div class="guide-detail" v-if="currentGuide">

    <!-- Кнопка "назад" — возвращает на предыдущую страницу -->
    <span class="back-link" @click="$router.back()">← Назад</span>

    <!-- Теги: игра и тип гайда -->
    <div class="card-meta">
      <span class="tag game">{{ currentGuide.game_name }}</span>
      <span class="tag category">{{ currentGuide.category_name }}</span>
    </div>

    <!-- Заголовок и автор -->
    <h1>{{ currentGuide.title }}</h1>
    <p class="author">{{ currentGuide.author }} · {{ formatDate(currentGuide.created_at) }}</p>

    <!-- Основной текст гайда -->
    <div class="guide-body">{{ currentGuide.content }}</div>


    <!-- ===== КОММЕНТАРИИ ===== -->
    <div class="comments">
      <h2>Комментарии ({{ commentsList.length }})</h2>

      <!-- Пустое состояние -->
      <div v-if="commentsList.length === 0" class="empty" style="padding: 30px 0">
        <p>Пока нет комментариев. Будь первым!</p>
      </div>

      <!-- Список комментариев -->
      <div v-for="comment in commentsList" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
      </div>

      <!-- Форма добавления комментария -->
      <div class="comment-form">
        <div v-if="isCommentSent" class="success-msg">Комментарий добавлен!</div>

        <!-- Имя пользователя -->
        <input v-model="newCommentAuthor" placeholder="Твоё имя" />

        <!-- Текст комментария -->
        <textarea v-model="newCommentText" placeholder="Напиши комментарий..."></textarea>

        <button class="btn btn-dark" @click="submitComment">Отправить</button>
      </div>
    </div>

  </div>

  <!-- Показывается пока гайд ещё грузится -->
  <div v-else class="empty" style="padding: 80px 20px">
    <div class="icon">⏳</div>
    <p>Загружаем гайд...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGuide, deleteGuide, getComments, createComment } from '../api'

// Получаем id из URL (например /guide/3 → id = "3")
const route = useRoute()
const router = useRouter()

// Данные текущего гайда
const currentGuide = ref(null)

// Список комментариев к этому гайду
const commentsList = ref([])

// Поля формы нового комментария
const newCommentAuthor = ref('')
const newCommentText = ref('')

// Флаг — показывает уведомление после отправки комментария
const isCommentSent = ref(false)

// Форматирует дату в читаемый вид: "15 янв. 2024"
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Удаляет гайд и возвращает на главную
async function handleDelete() {
  // Спрашиваем подтверждение перед удалением
  const userConfirmed = confirm('Удалить этот гайд?')
  if (!userConfirmed) return

  await deleteGuide(route.params.id)
  router.push('/')
}

// Отправляет новый комментарий на сервер
async function submitComment() {
  // Не отправляем если поля пустые
  const authorIsFilled = newCommentAuthor.value.trim()
  const textIsFilled = newCommentText.value.trim()
  if (!authorIsFilled || !textIsFilled) return

  const response = await createComment(route.params.id, {
    author: newCommentAuthor.value.trim(),
    content: newCommentText.value.trim()
  })

  // Добавляем новый комментарий в список без перезагрузки страницы
  commentsList.value.push(response.data)

  // Очищаем форму
  newCommentAuthor.value = ''
  newCommentText.value = ''

  // Показываем уведомление на 2.5 секунды
  isCommentSent.value = true
  setTimeout(() => {
    isCommentSent.value = false
  }, 2500)
}

// При загрузке страницы получаем гайд и комментарии параллельно
onMounted(async () => {
  const [guideResponse, commentsResponse] = await Promise.all([
    getGuide(route.params.id),
    getComments(route.params.id)
  ])

  currentGuide.value = guideResponse.data
  commentsList.value = commentsResponse.data
})
</script>
