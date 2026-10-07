import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Insights } from './components/Insights';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard');

  const handleLogin = (user: string, jwt: string) => {
    setToken(jwt);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        username={username}
      />
      <main className="flex-1">
        {activeTab === 'dashboard' ? <Dashboard /> : <Insights />}
      </main>
    </div>
  );
}
