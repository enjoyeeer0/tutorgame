import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getGames = () => api.get('/games');
export const getCategories = () => api.get('/categories');
export const getGuides = (params) => api.get('/guides', { params });
export const getGuide = (id) => api.get(`/guides/${id}`);
export const createGuide = (data) => api.post('/guides', data);
export const likeGuide = (id) => api.post(`/guides/${id}/like`);
export const deleteGuide = (id) => api.delete(`/guides/${id}`);
export const getComments = (guideId) => api.get(`/comments/${guideId}`);
export const createComment = (guideId, data) => api.post(`/comments/${guideId}`, data);
