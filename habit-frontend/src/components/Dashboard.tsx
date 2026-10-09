import React, { useState } from 'react';
import api, { saveDisciplines } from '../services/api';
import { Send, CheckCircle2, Sparkles, CheckSquare, Square } from 'lucide-react';
import { DisciplineKey, DISCIPLINE_LABELS } from '../types';

export const Dashboard: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [disciplines, setDisciplines] = useState<Record<DisciplineKey, boolean>>({
    WATER_2L: false,
    WORKOUT: false,
    RUNNING: false,
    STEPS_10K: false,
    OUTDOOR_WALK: false,
    LEETCODE: false,
  });
  const [disciplineLoading, setDisciplineLoading] = useState(false);
  const [disciplineSuccess, setDisciplineSuccess] = useState(false);

  const handleCheckboxChange = (key: DisciplineKey) => {
    setDisciplines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDisciplineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisciplineLoading(true);
    setDisciplineSuccess(false);
    setError('');

    try {
      await saveDisciplines(disciplines);
      setDisciplineSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить дисциплину');
    } finally {
      setDisciplineLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Дисциплина / Чекбоксы */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Трекер дисциплины на сегодня</h2>
            <p className="text-sm text-zinc-400">Отметьте выполненные активности.</p>
          </div>
        </div>

        {disciplineSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Дисциплина успешно сохранена!</span>
          </div>
        )}

        <form onSubmit={handleDisciplineSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(DISCIPLINE_LABELS) as DisciplineKey[]).map((key) => (
              <label
                key={key}
                className="flex items-center space-x-3 p-3 bg-zinc-900 border border-border rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={disciplines[key]}
                  onChange={() => handleCheckboxChange(key)}
                  className="w-4 h-4 text-indigo-600 bg-zinc-800 border-border rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-200">{DISCIPLINE_LABELS[key]}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={disciplineLoading}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl text-white transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            <span>{disciplineLoading ? 'Сохранение...' : 'Сохранить дисциплину'}</span>
          </button>
        </form>
      </div>

      {/* Дневной отчет по привычкам */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Дневной отчёт по привычкам</h2>
            <p className="text-sm text-zinc-400">Напишите, как прошёл ваш день, и AI-коуч проанализирует его.</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Отчёт успешно отправлен! AI уже анализирует его, скоро появится рекомендация в ленте.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              rows={5}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Например: Выпил 2л воды, сделал утреннюю зарядку 15 минут, но лег спать поздно..."
              className="w-full p-4 bg-zinc-900 border border-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !reportText.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl text-white transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Отправка...' : 'Отправить отчёт в AI'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
