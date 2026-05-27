<template>
  <div class="form-page">
    <h1>Добавить гайд</h1>

    <div v-if="success" class="success-msg">Гайд успешно добавлен! <span @click="$router.push('/')" style="cursor:pointer;text-decoration:underline">Перейти на главную</span></div>
    <div v-if="error" class="error-msg">{{ error }}</div>

    <div class="form-group">
      <label>Заголовок</label>
      <input v-model="form.title" placeholder="Например: Лучший билд для новичка" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Игра</label>
        <select v-model="form.game_id">
          <option value="">Выбери игру</option>
          <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Тип контента</label>
        <select v-model="form.category_id">
          <option value="">Выбери тип</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Твоё имя (никнейм)</label>
      <input v-model="form.author" placeholder="Например: ProGamer228" />
    </div>

    <div class="form-group">
      <label>Содержание</label>
      <textarea v-model="form.content" placeholder="Опиши гайд подробно..."></textarea>
    </div>

    <button class="btn" @click="submit" :disabled="loading">
      {{ loading ? 'Сохраняем...' : 'Опубликовать гайд' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGames, getCategories, createGuide } from '../api';

const games = ref([]);
const categories = ref([]);
const success = ref(false);
const error = ref('');
const loading = ref(false);

const form = ref({ title: '', content: '', author: '', game_id: '', category_id: '' });

async function submit() {
  error.value = '';
  if (!form.value.title || !form.value.content || !form.value.author || !form.value.game_id || !form.value.category_id) {
    error.value = 'Заполни все поля!';
    return;
  }
  loading.value = true;
  try {
    await createGuide(form.value);
    success.value = true;
    form.value = { title: '', content: '', author: '', game_id: '', category_id: '' };
  } catch (e) {
    error.value = 'Ошибка при сохранении. Попробуй ещё раз.';
  }
  loading.value = false;
}

onMounted(async () => {
  const [g, c] = await Promise.all([getGames(), getCategories()]);
  games.value = g.data;
  categories.value = c.data;
});
</script>
