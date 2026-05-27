import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import GuideDetail from '../views/GuideDetail.vue';
import Games from '../views/Games.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/guide/:id', component: GuideDetail },
  { path: '/games', component: Games },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
