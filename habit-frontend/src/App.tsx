import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Insights } from './components/Insights';
import { Charts } from './components/Charts';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'charts'>(() => {
    return (localStorage.getItem('activeTab') as 'dashboard' | 'insights' | 'charts') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleLogin = (user: string, jwt: string) => {
    setToken(jwt);
    setUsername(user);
    localStorage.setItem('token', jwt);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('activeTab');
    setToken(null);
    setUsername('');
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        username={username}
      />
      <main className="flex-1">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'charts' && <Charts />}
        {activeTab === 'insights' && <Insights />}
      </main>
    </div>
  );
}
