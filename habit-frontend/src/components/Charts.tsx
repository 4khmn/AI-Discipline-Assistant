import React, { useEffect, useState } from 'react';
import { fetchDisciplines } from '../services/api';
import { DisciplineKey, DISCIPLINE_LABELS, UserDailyDiscipline } from '../types';
import { BarChart3, TrendingUp, Activity, Award, RefreshCw } from 'lucide-react';

export const Charts: React.FC = () => {
  const [history, setHistory] = useState<UserDailyDiscipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'trend' | 'distribution' | 'cumulative'>('trend');

  const disciplineKeys: DisciplineKey[] = [
    'WATER_2L',
    'WORKOUT',
    'RUNNING',
    'STEPS_10K',
    'OUTDOOR_WALK',
    'LEETCODE',
  ];

  const disciplineColors: Record<DisciplineKey, string> = {
    WATER_2L: '#38bdf8', // sky-400
    WORKOUT: '#818cf8',  // indigo-400
    RUNNING: '#34d399',  // emerald-400
    STEPS_10K: '#fbbf24',// amber-400
    OUTDOOR_WALK: '#f472b6',// pink-400
    LEETCODE: '#a78bfa', // violet-400
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDisciplines();
      // Sort chronologically ascending for charts
      const sorted = data.sort((a, b) => a.disciplineDate.localeCompare(b.disciplineDate));
      setHistory(sorted);
    } catch (err) {
      console.error('Failed to load history for charts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Last 14 days dates array for X-axis
  const getLast14Days = () => {
    const dates: string[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const datesList = getLast14Days();
  const historyMap = new Map<string, UserDailyDiscipline>();
  history.forEach((h) => historyMap.set(h.disciplineDate, h));

  // Calculate stats per discipline
  const stats = disciplineKeys.map((key) => {
    let count = 0;
    history.forEach((h) => {
      if (
        (key === 'WATER_2L' && h.water2l) ||
        (key === 'WORKOUT' && h.workout) ||
        (key === 'RUNNING' && h.running) ||
        (key === 'STEPS_10K' && h.steps10k) ||
        (key === 'OUTDOOR_WALK' && h.outdoorWalk) ||
        (key === 'LEETCODE' && h.leetcode)
      ) {
        count++;
      }
    });
    return { key, label: DISCIPLINE_LABELS[key], count, color: disciplineColors[key] };
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6 font-sans">
      {/* Header & Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-200">Аналитика и графики</h1>
          <p className="text-xs text-slate-400 mt-0.5">Визуализация вашей дисциплины и прогресса привычек.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('trend')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeView === 'trend'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Активность за 14 дней</span>
          </button>
          <button
            onClick={() => setActiveView('distribution')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeView === 'distribution'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Распределение</span>
          </button>
          <button
            onClick={() => setActiveView('cumulative')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeView === 'cumulative'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Накопительный прогресс</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs">Загрузка данных аналитики...</div>
      ) : (
        <div className="space-y-6">
          {/* Chart 1: 14-Day Activity Lines / Grid */}
          {activeView === 'trend' && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Динамика привычек за последние 14 дней</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Каждая линия отображает выполнение конкретной дисциплины.</p>
                </div>
                <button
                  onClick={loadData}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                  title="Обновить"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800/80">
                {disciplineKeys.map((key) => (
                  <div key={key} className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: disciplineColors[key] }} />
                    <span className="text-xs text-slate-300">{DISCIPLINE_LABELS[key]}</span>
                  </div>
                ))}
              </div>

              {/* Coordinate plane / SVG Chart */}
              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 overflow-x-auto">
                <div className="min-w-[650px]">
                  <svg viewBox="0 0 700 240" className="w-full h-auto overflow-visible">
                    {/* Horizontal Grid lines */}
                    {[0, 1, 2, 3, 4, 5, 6].map((val) => {
                      const y = 20 + val * 30;
                      return (
                        <g key={val}>
                          <line x1="50" y1={y} x2="680" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                          <text x="40" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                            {6 - val}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis labels (Dates) */}
                    {datesList.map((dateStr, idx) => {
                      const x = 70 + idx * 43;
                      const dObj = new Date(dateStr);
                      const label = `${dObj.getDate()}.${dObj.getMonth() + 1}`;
                      return (
                        <text key={dateStr} x={x} y="225" fill="#64748b" fontSize="10" textAnchor="middle">
                          {label}
                        </text>
                      );
                    })}

                    {/* Render Lines for each discipline */}
                    {disciplineKeys.map((key) => {
                      const points = datesList.map((dateStr, idx) => {
                        const rec = historyMap.get(dateStr);
                        let active = 0;
                        if (rec) {
                          if (key === 'WATER_2L' && rec.water2l) active = 1;
                          if (key === 'WORKOUT' && rec.workout) active = 1;
                          if (key === 'RUNNING' && rec.running) active = 1;
                          if (key === 'STEPS_10K' && rec.steps10k) active = 1;
                          if (key === 'OUTDOOR_WALK' && rec.outdoorWalk) active = 1;
                          if (key === 'LEETCODE' && rec.leetcode) active = 1;
                        }
                        const x = 70 + idx * 43;
                        // Map active (0 or 1) to Y coordinate (200 for 0, 20 for 1)
                        const y = active === 1 ? 50 : 200;
                        return { x, y, active };
                      });

                      const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                      return (
                        <g key={key}>
                          <path d={pathD} fill="none" stroke={disciplineColors[key]} strokeWidth="2.5" opacity="0.85" />
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r={p.active ? 4 : 2}
                              fill={p.active ? disciplineColors[key] : '#334155'}
                              stroke="#0f172a"
                              strokeWidth="1.5"
                            />
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Chart 2: Distribution Bar Chart */}
          {activeView === 'distribution' && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Общая статистика выполнений</h2>
                <p className="text-xs text-slate-400 mt-0.5">Сколько раз каждая дисциплина была отмечена за всё время.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((item) => {
                  const maxCount = Math.max(...stats.map((s) => s.count), 1);
                  const percentage = Math.round((item.count / maxCount) * 100);

                  return (
                    <div key={item.key} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-slate-400 font-semibold">{item.count} раз(а)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chart 3: Cumulative Progress */}
          {activeView === 'cumulative' && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Накопительный индекс дисциплины</h2>
                <p className="text-xs text-slate-400 mt-0.5">Суммарное количество выполненных привычек день за днем.</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-3 text-amber-400 bg-amber-950/20 border border-amber-800/40 px-4 py-3 rounded-xl">
                  <Award className="w-5 h-5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-medium block text-amber-200">Отличная динамика!</span>
                    <span>Регулярность тренирует силу воли и формирует нейронные связи.</span>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {stats.map((s) => (
                      <div key={s.key} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block truncate">{s.label}</span>
                        <span className="text-lg font-bold text-slate-100" style={{ color: s.color }}>
                          {s.count}
                        </span>
                        <span className="text-[9px] text-slate-500 block">успешных дней</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
