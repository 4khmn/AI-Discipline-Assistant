export interface HabitRecommendation {
  id: number;
  userId: number;
  habitId?: number;
  userInput: string;
  recommendationText: string;
  aiResponseDurationMs?: number;
  createdAt: string;
}

export interface User {
  username: string;
  email: string;
  token: string;
}

export type DisciplineKey = 
  | 'WATER_2L' 
  | 'WORKOUT' 
  | 'RUNNING' 
  | 'STEPS_10K' 
  | 'OUTDOOR_WALK' 
  | 'LEETCODE';

export const DISCIPLINE_LABELS: Record<DisciplineKey, string> = {
  WATER_2L: '2 литра воды',
  WORKOUT: 'Тренировка',
  RUNNING: 'Бег',
  STEPS_10K: '10к шагов',
  OUTDOOR_WALK: 'Прогулка на воздухе',
  LEETCODE: 'Литкод',
};
