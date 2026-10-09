import React, { useState, useEffect } from 'react';
import api, { saveDisciplines, fetchDisciplines } from '../services/api';
import { Send, CheckCircle2, Sparkles, CheckSquare, Check, X, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { DisciplineKey, DISCIPLINE_LABELS, UserDailyDiscipline } from '../types';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [disciplineHistory, setDisciplineHistory] = useState<UserDailyDiscipline[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');

  // Filter: 'last30' or 'YYYY-MM'
  const [filterType, setFilterType] = useState<'last30' | 'month'>('last30');
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedMonth, setSelectedMonth] = useState<string>(todayStr.substring(0, 7)); // YYYY-MM

  const disciplineKeys: DisciplineKey[] = [
    'WATER_2L',
    'WORKOUT',
    'RUNNING',
    'STEPS_10K',
    'OUTDOOR_WALK',
    'LEETCODE',
  ];

  const loadData = async () => {
    try {
      const history = await fetchDisciplines();
      setDisciplineHistory(history);
    } catch (err) {
      console.error('Failed to load disciplines history', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate dates array based on filter
  const getDatesList = (): string[] => {
    const dates: string[] = [];
    if (filterType === 'last30') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
    } else {
      // selectedMonth is "YYYY-MM"
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month - 1, day);
        // Don't generate future dates beyond today if current month
        const dateStr = d.toISOString().split('T')[0];
        if (dateStr <= todayStr) {
          dates.push(dateStr);
        }
      }
    }
    return dates;
  };

  const datesList = getDatesList();

  // Map history records by date string for quick lookup
  const historyMap = new Map<string, UserDailyDiscipline>();
  disciplineHistory.forEach((h) => {
    historyMap.set(h.disciplineDate, h);
  });

  const handleCellToggle = async (dateStr: string, disciplineKey: DisciplineKey) => {
    // Only allow toggling for today
    if (dateStr !== todayStr) return;

    const existing = historyMap.get(dateStr);
    const currentDisciplines: Record<DisciplineKey, boolean> = {
      WATER_2L: existing?.water2l ?? false,
      WORKOUT: existing?.workout ?? false,
      RUNNING: existing?.running ?? false,
      STEPS_10K: existing?.steps10k ?? false,
      OUTDOOR_WALK: existing?.outdoorWalk ?? false,
      LEETCODE: existing?.leetcode ?? false,
    };

    const updated = {
      ...currentDisciplines,
      [disciplineKey]: !currentDisciplines[disciplineKey],
    };

    setError('');
    try {
      await saveDisciplines(dateStr, updated);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить дисциплину');
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

  const isChecked = (dateStr: string, key: DisciplineKey): boolean => {
    const record = historyMap.get(dateStr);
    if (!record) return false;
    switch (key) {
      case 'WATER_2L': return record.water2l;
      case 'WORKOUT': return record.workout;
      case 'RUNNING': return record.running;
      case 'STEPS_10K': return record.steps10k;
      case 'OUTDOOR_WALK': return record.outdoorWalk;
      case 'LEETCODE': return record.leetcode;
      default: return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      {/* Верхняя панель управления */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Трекер дисциплины</h1>
          <p className="text-sm text-zinc-400">Отмечайте привычки по дням. Кликать можно только по сегодняшнему дню.</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20 flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Написать отчёт для AI</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Фильтр периодов */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Матрица дисциплины</h2>
            <p className="text-sm text-zinc-400">Строки — привычки, столбцы — дни.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFilterType('last30')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterType === 'last30'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-border'
            }`}
          >
            Последние 30 дней
          </button>
          <button
            onClick={() => setFilterType('month')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterType === 'month'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-border'
            }`}
          >
            По месяцам
          </button>
          {filterType === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-zinc-900 border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>
      </div>

      {/* Таблица матрицы: Дисциплины по строкам, Даты по столбцам */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300 border-collapse">
          <thead>
            <tr className="border-b border-border bg-zinc-900/80">
              <th className="py-3 px-4 font-semibold text-white sticky left-0 bg-zinc-900 z-10 min-w-[180px]">
                Дисциплина
              </th>
              {datesList.map((dateStr) => {
                const isToday = dateStr === todayStr;
                const dateObj = new Date(dateStr);
                const formattedDate = `${dateObj.getDate()}.${dateObj.getMonth() + 1}`;
                return (
                  <th
                    key={dateStr}
                    className={`py-3 px-2 text-center text-xs font-medium min-w-[50px] ${
                      isToday ? 'text-indigo-400 font-bold bg-indigo-950/30' : 'text-zinc-400'
                    }`}
                  >
                    <div>{formattedDate}</div>
                    {isToday && <span className="text-[10px] uppercase tracking-wider block text-indigo-300">Сегодня</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {disciplineKeys.map((key) => (
              <tr key={key} className="hover:bg-zinc-900/40 transition-colors">
                <td className="py-4 px-4 font-medium text-white sticky left-0 bg-card z-10 border-r border-border">
                  {DISCIPLINE_LABELS[key]}
                </td>
                {datesList.map((dateStr) => {
                  const checked = isChecked(dateStr, key);
                  const isToday = dateStr === todayStr;

                  return (
                    <td
                      key={dateStr}
                      className={`py-4 px-2 text-center border-r border-border/40 ${
                        isToday ? 'bg-indigo-950/10' : ''
                      }`}
                    >
                      {isToday ? (
                        <button
                          type="button"
                          onClick={() => handleCellToggle(dateStr, key)}
                          className={`w-6 h-6 mx-auto rounded-lg flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                              : 'bg-zinc-900 border border-border hover:border-indigo-500'
                          }`}
                          title="Кликните, чтобы отметить сегодня"
                        >
                          {checked && <Check className="w-4 h-4" />}
                        </button>
                      ) : (
                        <div className="flex justify-center items-center">
                          {checked ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <span className="text-zinc-700">—</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
