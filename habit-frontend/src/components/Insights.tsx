import React, { useEffect, useState } from 'react';
import api, { deleteRecommendation } from '../services/api';
import { HabitRecommendation } from '../types';
import { Sparkles, Clock, RefreshCw, Quote, AlertTriangle, Trash2, X, Award } from 'lucide-react';

interface AiSummary {
  summaryText: string;
  totalAnalyzed: number;
}

export const Insights: React.FC = () => {
  const [recommendations, setRecommendations] = useState<HabitRecommendation[]>([]);
  const [summary, setSummary] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [recResponse, summaryResponse] = await Promise.all([
        api.get<HabitRecommendation[]>('/api/habits/recommendations'),
        api.get<AiSummary>('/api/habits/summary').catch(() => ({ data: null }))
      ]);
      setRecommendations(recResponse.data);
      setSummary(summaryResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (deleteModalId === null) return;
    setError('');
    try {
      await deleteRecommendation(deleteModalId);
      setRecommendations((prev) => prev.filter((rec) => rec.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось удалить рекомендацию');
      setDeleteModalId(null);
    }
  };

  const isErrorRecommendation = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('ошибка') ||
      lower.includes('error') ||
      lower.includes('400') ||
      lower.includes('failed') ||
      lower.includes('не удалось') ||
      lower.includes('недоступен')
    );
  };

  const totalAnalyzed = summary?.totalAnalyzed || 0;
  const reportsNeeded = Math.max(0, 3 - totalAnalyzed);

  const getReportWord = (count: number) => {
    if (count === 1) return 'отчёт';
    if (count >= 2 && count <= 4) return 'отчёта';
    return 'отчётов';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-200">Лента AI-советов</h2>
          <p className="text-xs text-slate-400 mt-1">Персональные рекомендации вашего AI-коуча</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800/40 rounded-lg text-red-300 text-xs mb-6">
          {error}
        </div>
      )}

      {/* AI Summary Section */}
      <div className="mb-6">
        {totalAnalyzed >= 3 && summary?.summaryText ? (
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 border border-indigo-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between text-[11px] text-indigo-300/80 mb-3 pb-2.5 border-b border-indigo-500/20">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 rounded font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>Общая рекомендация (Итоговое резюме)</span>
                </div>
              </div>
              <span className="text-slate-400">Проанализировано отчетов: {totalAnalyzed}</span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs whitespace-pre-line leading-relaxed text-slate-200">
                {summary.summaryText}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 text-center text-slate-400 text-xs">
            <div className="flex items-center justify-center space-x-1.5 mb-1 text-indigo-400 font-medium">
              <Award className="w-4 h-4" />
              <span>Итоговое резюме AI-коуча</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Сделайте еще {reportsNeeded} {getReportWord(reportsNeeded)} для получения итогового самари (проанализировано: {totalAnalyzed}/3).
            </p>
          </div>
        )}
      </div>

      {loading && recommendations.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">Загрузка рекомендаций...</div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800/80 rounded-xl">
          <Sparkles className="w-6 h-6 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium text-xs">Пока нет рекомендаций</p>
          <p className="text-[11px] text-slate-600 mt-1">Отправьте свой первый отчет на главной странице</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const hasError = isErrorRecommendation(rec.recommendationText) || rec.hasError;
            return (
              <div
                key={rec.id}
                className={`bg-slate-900/60 border rounded-xl p-5 shadow-lg transition-all ${
                  hasError ? 'border-red-900/50 bg-red-950/10' : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(rec.createdAt).toLocaleString()}</span>
                    </div>
                    {hasError && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 bg-red-900/20 border border-red-800/40 text-red-300 rounded font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Ошибка ИИ</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {rec.aiResponseDurationMs && !hasError && (
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                        {rec.aiResponseDurationMs} мс
                      </span>
                    )}
                    <button
                      onClick={() => setDeleteModalId(rec.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Удалить запись"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mb-3 bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 relative">
                  <Quote className="w-3.5 h-3.5 text-slate-700 absolute top-3 right-3" />
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Ваш отчёт</span>
                  <p className="text-slate-300 text-xs italic">"{rec.userInput}"</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Совет AI-коуча</span>
                  </div>
                  <div
                    className={`text-xs whitespace-pre-line leading-relaxed rounded-lg p-3.5 border ${
                      hasError
                        ? 'bg-red-950/20 border-red-900/40 text-red-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    {rec.recommendationText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full relative space-y-4 shadow-2xl">
            <button
              onClick={() => setDeleteModalId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-semibold text-slate-200">Удалить рекомендацию?</h3>
              <p className="text-xs text-slate-400 mt-1">Это действие необратимо. Данные удалятся безвозвратно.</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 bg-red-900/80 hover:bg-red-900 text-red-200 font-medium rounded-lg text-xs transition-colors border border-red-800"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
