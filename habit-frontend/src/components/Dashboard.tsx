import React, { useState } from 'react';
import api from '../services/api';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-2xl mx-auto py-12 px-4">
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
