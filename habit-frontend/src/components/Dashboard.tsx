import React, { useState, useEffect } from 'react';
import api, { saveDisciplines, fetchDisciplines } from '../services/api';
import { Send, CheckCircle2, Sparkles, Check, X, Plus, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { DisciplineKey, DISCIPLINE_LABELS, UserDailyDiscipline } from '../types';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [disciplineHistory, setDisciplineHistory] = useState<UserDailyDiscipline[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');

  const [filterType, setFilterType] = useState<'last14' | 'month'>('last14');
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedMonth, setSelectedMonth] = useState<string>(todayStr.substring(0, 7));

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

  const getDatesList = (): string[] => {
    const dates: string[] = [];
    if (filterType === 'last14') {
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month - 1, day);
        const dateStr = d.toISOString().split('T')[0];
        if (dateStr <= todayStr) {
          dates.push(dateStr);
        }
      }
    }
    return dates;
  };

  const datesList = getDatesList();

  const historyMap = new Map<string, UserDailyDiscipline>();
  disciplineHistory.forEach((h) => {
    historyMap.set(h.disciplineDate, h);
  });

  const handleCellToggle = async (dateStr: string, disciplineKey: DisciplineKey) => {
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-200">Дисциплина</h1>
          <p className="text-xs text-slate-400 mt-0.5">Отмечайте привычки. Доступно для изменения только сегодня.</p>
        </div>
        <button
          onClick={() => {
            setSuccess(false);
            setReportText('');
            setShowReportModal(true);
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors border border-slate-700 flex items-center space-x-2 text-xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
          <span>Отчёт для AI</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800/40 rounded-lg text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-slate-300 text-xs font-medium">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span>Период отслеживания</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterType('last14')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'last14'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Последние 14 дней
          </button>
          <button
            onClick={() => setFilterType('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'month'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'bg-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            По месяцам
          </button>
          {filterType === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-slate-600"
            />
          )}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-2.5 px-3 font-medium text-slate-400 sticky left-0 bg-slate-900/90 z-10 min-w-[160px]">
                Привычка
              </th>
              {datesList.map((dateStr) => {
                const isToday = dateStr === todayStr;
                const dateObj = new Date(dateStr);
                const formattedDate = `${dateObj.getDate()}.${dateObj.getMonth() + 1}`;
                return (
                  <th
                    key={dateStr}
                    className={`py-2.5 px-1.5 text-center font-normal min-w-[42px] ${
                      isToday ? 'text-slate-200 font-medium bg-slate-800/40' : 'text-slate-500'
                    }`}
                  >
                    <div>{formattedDate}</div>
                    {isToday && <span className="text-[9px] text-slate-400 block mt-0.5">сегодня</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {disciplineKeys.map((key) => (
              <tr key={key} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-3 font-normal text-slate-200 sticky left-0 bg-slate-900/90 z-10 border-r border-slate-800/80">
                  {DISCIPLINE_LABELS[key]}
                </td>
                {datesList.map((dateStr) => {
                  const checked = isChecked(dateStr, key);
                  const isToday = dateStr === todayStr;

                  return (
                    <td
                      key={dateStr}
                      className={`py-3 px-1.5 text-center border-r border-slate-800/30 ${
                        isToday ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      {isToday ? (
                        <button
                          type="button"
                          onClick={() => handleCellToggle(dateStr, key)}
                          className={`w-5 h-5 mx-auto rounded flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-slate-700 text-slate-100 border border-slate-600'
                              : 'bg-slate-950 border border-slate-800 hover:border-slate-600'
                          }`}
                          title="Отметить на сегодня"
                        >
                          {checked && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <div className="flex justify-center items-center">
                          {checked ? (
                            <Check className="w-4 h-4 text-slate-400" />
                          ) : (
                            <span className="text-slate-700 text-[10px]">—</span>
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

      {/* Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full relative space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Отчёт для AI-коуча</h2>
            </div>

            {success ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Отчёт успешно отправлен! Проверьте вкладку «Инсайты», скоро там появится рекомендация.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3">
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Как прошел день?"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-xs resize-none"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !reportText.trim()}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-white text-slate-900 font-medium rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>{loading ? 'Отправка...' : 'Отправить'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
