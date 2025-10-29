import React, { useState, useEffect, useCallback } from 'react';
import { DataManager } from './components/DataManager';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { translations } from './i18n/translations';
import type { Language } from './types';

type View = 'landing' | 'login' | 'manager';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [view, setView] = useState<View>('landing');
  const [language, setLanguage] = useState<Language>('pt');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for persisted login state and language
    const loggedIn = localStorage.getItem('vistos_guru_auth') === 'true';
    const savedLang = localStorage.getItem('vistos_guru_lang') as Language;
    
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
    
    setIsAuthenticated(loggedIn);
    setView(loggedIn ? 'manager' : 'landing');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Persist language changes
    localStorage.setItem('vistos_guru_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const handleLoginSuccess = () => {
    localStorage.setItem('vistos_guru_auth', 'true');
    setIsAuthenticated(true);
    setView('manager');
  };

  const handleLogout = () => {
    localStorage.removeItem('vistos_guru_auth');
    setIsAuthenticated(false);
    setView('landing');
  };

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} t={t} onBack={() => setView('landing')} />;
      case 'manager':
        return <DataManager t={t} onLogout={handleLogout} />;
      case 'landing':
      default:
        return <LandingPage setLanguage={setLanguage} t={t} currentLanguage={language} onNavigateToLogin={() => setView('login')} />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center"></div>; // Or a proper loading screen
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {renderView()}
    </div>
  );
};

export default App;
