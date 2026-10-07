import React from 'react';
import { Sparkles, LayoutDashboard, LogOut, MessageSquareText } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'insights') => void;
  onLogout: () => void;
  username: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, username }) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Habit Tracker AI</span>
        </div>

        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Главная</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>AI Советы</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-zinc-400 hidden sm:inline">@{username}</span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
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
