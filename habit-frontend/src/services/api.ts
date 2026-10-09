import axios from 'axios';
import { DisciplineKey } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const saveDisciplines = async (disciplines: Record<DisciplineKey, boolean>) => {
  const response = await api.post('/api/habits/disciplines', { disciplines });
  return response.data;
};

export default api;
