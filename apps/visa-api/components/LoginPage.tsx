import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  t: (key: string) => string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would make a network request to your auth backend.
      // Here, we simulate it with hardcoded credentials.
      if (email === 'admin@vistos.guru' && password === 'password') {
        onLoginSuccess();
      } else {
        setError(t('loginError'));
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="relative w-full max-w-md">
            <button onClick={onBack} className="absolute top-0 right-0 m-4 text-slate-400 hover:text-slate-600">&times;</button>
            <div className="bg-white p-8 rounded-xl shadow-lg animate__animated animate__fadeInUp">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        <span className="text-indigo-600">Vistos.guru</span> Data Manager
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">{t('loginSubtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('emailLabel')}</label>
                    <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="admin@vistos.guru"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="password">{t('passwordLabel')}</label>
                    <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="password"
                    />
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                    {isLoading ? <LoadingSpinner size="w-5 h-5" /> : t('loginButton')}
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
  );
};
