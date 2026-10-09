import React, { useState, useEffect } from 'react';
import api, { saveDisciplines, fetchDisciplines } from '../services/api';
import { Send, CheckCircle2, Sparkles, CheckSquare, Calendar, Check, X, Plus } from 'lucide-react';
import { DisciplineKey, DISCIPLINE_LABELS, UserDailyDiscipline } from '../types';

export const Dashboard: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [disciplines, setDisciplines] = useState<Record<DisciplineKey, boolean>>({
    WATER_2L: false,
    WORKOUT: false,
    RUNNING: false,
    STEPS_10K: false,
    OUTDOOR_WALK: false,
    LEETCODE: false,
  });

  const [disciplineHistory, setDisciplineHistory] = useState<UserDailyDiscipline[]>([]);
  const [disciplineLoading, setDisciplineLoading] = useState(false);
  const [disciplineSuccess, setDisciplineSuccess] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const loadData = async () => {
    try {
      const history = await fetchDisciplines();
      setDisciplineHistory(history);

      // Find record for selectedDate
      const existing = history.find((h) => h.disciplineDate === selectedDate);
      if (existing) {
        setDisciplines({
          WATER_2L: existing.water2l,
          WORKOUT: existing.workout,
          RUNNING: existing.running,
          STEPS_10K: existing.steps10k,
          OUTDOOR_WALK: existing.outdoorWalk,
          LEETCODE: existing.leetcode,
        });
      } else {
        setDisciplines({
          WATER_2L: false,
          WORKOUT: false,
          RUNNING: false,
          STEPS_10K: false,
          OUTDOOR_WALK: false,
          LEETCODE: false,
        });
      }
    } catch (err) {
      console.error('Failed to load disciplines history', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleCheckboxChange = (key: DisciplineKey) => {
    setDisciplines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDisciplineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisciplineLoading(true);
    setDisciplineSuccess(false);
    setError('');

    try {
      await saveDisciplines(selectedDate, disciplines);
      setDisciplineSuccess(true);
      await loadData();
      setTimeout(() => setDisciplineSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить дисциплину');
    } finally {
      setDisciplineLoading(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await api.post('/api/habits/report', { reportText });
      setSuccess(true);
      setReportText('');
      setTimeout(() => setShowReportModal(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось отправить отчет');
    } finally {
      setLoading(false);
    }
  };

  const disciplineKeys: DisciplineKey[] = [
    'WATER_2L',
    'WORKOUT',
    'RUNNING',
    'STEPS_10K',
    'OUTDOOR_WALK',
    'LEETCODE',
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Верхняя панель управления */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Трекер дисциплины</h1>
          <p className="text-sm text-zinc-400">Отмечайте ежедневные привычки и следите за прогрессом.</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20 flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Написать отчёт для AI</span>
        </button>
      </div>

      {/* Выбор даты для отметки */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Отметка за день</h2>
              <p className="text-sm text-zinc-400">Выберите дату и отметьте выполненные задачи.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-900 border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {disciplineSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Дисциплина успешно сохранена!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleDisciplineSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {disciplineKeys.map((key) => (
              <label
                key={key}
                className="flex items-center space-x-3 p-4 bg-zinc-900 border border-border rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={disciplines[key]}
                  onChange={() => handleCheckboxChange(key)}
                  className="w-5 h-5 text-indigo-600 bg-zinc-800 border-border rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-zinc-200">{DISCIPLINE_LABELS[key]}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={disciplineLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl text-white transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 text-sm"
          >
            {disciplineLoading ? 'Сохранение...' : 'Сохранить дисциплину'}
          </button>
        </form>
      </div>

      {/* Общая таблица результатов */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-lg font-bold tracking-tight">История дисциплины</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs border-b border-border">
              <tr>
                <th className="py-3 px-4">Дата</th>
                {disciplineKeys.map((key) => (
                  <th key={key} className="py-3 px-4 text-center">{DISCIPLINE_LABELS[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {disciplineHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-500">
                    Нет сохранённых записей.
                  </td>
                </tr>
              ) : (
                disciplineHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{row.disciplineDate}</td>
                    <td className="py-3 px-4 text-center">
                      {row.water2l ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.workout ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.running ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.steps10k ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.outdoorWalk ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.leetcode ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно для отчёта AI */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Отчёт для AI-коуча</h2>
                <p className="text-sm text-zinc-400">Опишите свой день, чтобы получить рекомендации.</p>
              </div>
            </div>

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Отчёт отправлен! Проверьте вкладку «Инсайты».</span>
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <textarea
                rows={4}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Например: Сегодня продуктивно позанимался, но мало спал..."
                className="w-full p-4 bg-zinc-900 border border-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading || !reportText.trim()}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Отправка...' : 'Отправить'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
