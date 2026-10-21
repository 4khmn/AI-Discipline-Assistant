import axios from 'axios';
import { DisciplineKey, UserDailyDiscipline } from '../types';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const saveDisciplines = async (date: string, disciplines: Record<DisciplineKey, boolean>) => {
  const response = await api.post('/api/habits/disciplines', { date, disciplines });
  return response.data;
};

export const fetchDisciplines = async (): Promise<UserDailyDiscipline[]> => {
  const response = await api.get('/api/habits/disciplines');
  return response.data;
};

export const deleteRecommendation = async (id: number) => {
  await api.delete(`/api/habits/recommendations/${id}`);
};

export default api;
