import React from 'react';
import { Sparkles, LayoutDashboard, LogOut, MessageSquareText, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'insights' | 'charts';
  setActiveTab: (tab: 'dashboard' | 'insights' | 'charts') => void;
  onLogout: () => void;
  username: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, username }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 p-2 rounded-xl text-slate-200 border border-slate-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-semibold text-base tracking-tight text-slate-200">Habit Tracker</span>
        </div>

        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Главная</span>
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'charts'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Графики</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>AI Советы</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-400 hidden sm:inline">@{username}</span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-900/40"
            title="Выйти"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Выход</span>
          </button>
        </div>
      </div>
    </header>
  );
};
