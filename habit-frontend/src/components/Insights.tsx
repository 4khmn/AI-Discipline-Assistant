import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HabitRecommendation } from '../types';
import { Sparkles, Clock, RefreshCw, Quote } from 'lucide-react';

export const Insights: React.FC = () => {
  const [recommendations, setRecommendations] = useState<HabitRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<HabitRecommendation[]>('/api/habits/recommendations');
      setRecommendations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить рекомендации');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Лента AI-советов</h2>
          <p className="text-sm text-zinc-400 mt-1">Персональные рекомендации вашего AI-коуча</p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-border hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && recommendations.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">Загрузка рекомендаций...</div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">Пока нет рекомендаций</p>
          <p className="text-sm text-zinc-600 mt-1">Отправьте свой первый отчет на главной странице</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 pb-3 border-b border-border">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(rec.createdAt).toLocaleString()}</span>
                </div>
                {rec.aiResponseDurationMs && (
                  <span className="bg-zinc-900 px-2.5 py-1 rounded-lg border border-border text-zinc-400">
                    AI отдал ответ за {rec.aiResponseDurationMs} мс
                  </span>
                )}
              </div>

              <div className="mb-4 bg-zinc-900/50 border border-border/60 rounded-xl p-4 relative">
                <Quote className="w-4 h-4 text-zinc-600 absolute top-3 right-3" />
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Ваш отчёт</span>
                <p className="text-zinc-300 text-sm italic">"{rec.userInput}"</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Совет AI-коуча</span>
                </div>
                <div className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4">
                  {rec.recommendationText}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
