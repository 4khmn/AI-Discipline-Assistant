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
