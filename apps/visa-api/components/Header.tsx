import React from 'react';

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface HeaderProps {
    t: (key: string) => string;
    onLogout?: () => void;
}


export const Header: React.FC<HeaderProps> = ({ t, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon />
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            <span className="text-indigo-600">Vistos.guru</span> Data Manager
          </h1>
        </div>
        {onLogout && (
             <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
             >
                {t('logout')}
             </button>
        )}
      </div>
    </header>
  );
};
