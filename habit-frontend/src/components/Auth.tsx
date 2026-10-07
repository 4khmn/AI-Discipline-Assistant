import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (username: string, token: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/api/auth/login', { username, password });
        const { token, username: resUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', resUser);
        onLogin(resUser, token);
      } else {
        const response = await api.post('/api/auth/register', { username, email, password });
        const { token, username: resUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', resUser);
        onLogin(resUser, token);
      }
    } catch (err: any) {
      console.log('Auth error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Произошла ошибка авторизации';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Habit Tracker AI</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Имя пользователя</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-border rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="username"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-border rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                placeholder="name@example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-border rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl text-white transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 text-sm"
          >
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};
