import axios from 'axios';

// На Vercel фронтенд и бэкенд на одном домене — используем /api
// Локально бэкенд на отдельном порту 3000
const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
const api = axios.create({ baseURL });

export const getGames = () => api.get('/games');
export const getCategories = () => api.get('/categories');
export const getGuides = (params) => api.get('/guides', { params });
export const getGuide = (id) => api.get(`/guides/${id}`);
export const createGuide = (data) => api.post('/guides', data);
export const likeGuide = (id) => api.post(`/guides/${id}/like`);
export const deleteGuide = (id) => api.delete(`/guides/${id}`);
export const getComments = (guideId) => api.get(`/comments/${guideId}`);
export const createComment = (guideId, data) => api.post(`/comments/${guideId}`, data);
