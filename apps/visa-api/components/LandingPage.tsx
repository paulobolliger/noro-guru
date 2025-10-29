import React, { useState } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { LoadingSpinner } from './LoadingSpinner';


interface LandingPageProps {
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  currentLanguage: Language;
  onNavigateToLogin: () => void;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const WorldMapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-200" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8.3 14.83s.38.38.38.38c.38.38 1.04.38 1.42 0l2.12-2.12c.38-.38.38-1.04 0-1.42L8.3 7.71V5.59c.92-.37 1.93-.59 3-.59.43 0 .84.05 1.25.13L11 8.41l2.12-2.12c.38-.38 1.04-.38 1.42 0l.71.71-2.83 2.83c-.38.38-.38 1.04 0 1.42l2.83 2.83-.71.71c-.38.38-1.04.38-1.42 0L11 15.59l1.54 1.54c.38.38.38 1.04 0 1.42l-1.42 1.42c-.2.2-.45.29-.71.29s-.51-.09-.71-.29l-1.54-1.54-.71.71c-.38.38-.38 1.04 0 1.42l.71.71c.38.38 1.04.38 1.42 0l2.12-2.12.71.71c.38.38 1.04.38 1.42 0l2.12-2.12c.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93z" opacity=".3"/>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.91 9H16.1c-.48 0-.89.34-.98.8-.23 1.25-.85 2.36-1.68 3.28-.52.56-1.28.9-2.1.98-.16.02-.32.02-.48.02s-.32 0-.48-.02c-.82-.08-1.58-.42-2.1-.98-.83-.92-1.45-2.03-1.68-3.28-.09-.46-.5-.8-.98-.8H5.1c-.06 0-.12.01-.17.02.04-.33.07-.66.07-1.02 0-.36-.03-.69-.07-1.02.05.01.11.02.17.02h2.81c.48 0 .89-.34.98-.8.23-1.25.85-2.36 1.68-3.28.52-.56 1.28-.9 2.1-.98.16-.02.32-.02.48-.02s.32 0 .48.02c.82.08 1.58.42 2.1.98.83.92 1.45-2.03 1.68 3.28.09.46.5.8.98.8h2.81c.06 0 .12-.01.17-.02-.04.33-.07.66-.07 1.02 0 .36.03.69.07 1.02-.05-.01-.11-.02-.17-.02z"/>
    </svg>
);

const SignupForm: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate an API call
        setTimeout(() => {
            console.log('Lead captured:', { name, email, company });
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="text-center bg-green-50 border-2 border-green-200 rounded-xl p-8 animate__animated animate__fadeIn">
                <h3 className="text-2xl font-bold text-green-800">{t('signupSuccessTitle')}</h3>
                <p className="mt-2 text-green-700">{t('signupSuccessMessage')}</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t('nameFormLabel')}</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700">{t('emailFormLabel')}</label>
                <input type="email" id="email-signup" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700">{t('companyFormLabel')}</label>
                <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <button type="submit" disabled={status === 'submitting'} className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                {status === 'submitting' ? <LoadingSpinner size="w-5 h-5" /> : t('signupButton')}
            </button>
        </form>
    )
}


export const LandingPage: React.FC<LandingPageProps> = ({ t, setLanguage, currentLanguage, onNavigateToLogin }) => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 opacity-10">
              <WorldMapIcon />
          </div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-2xl font-bold text-slate-800">api.vistos.guru</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative">
                <select 
                    value={currentLanguage} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="appearance-none bg-slate-100 border border-slate-200 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                </select>
            </div>
            <button onClick={onNavigateToLogin} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              {t('login')}
            </button>
          </div>
        </div>
        <div className="py-24 sm:py-32 lg:py-40 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                {t('landingTitle')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                {t('landingSubtitle')}
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
                <button onClick={onNavigateToLogin} className="px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all">
                    {t('landingCtaButton')}
                </button>
                 <a href="mailto:contato@vistos.guru" className="px-8 py-3 text-base font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">
                    {t('landingContactButton')}
                </a>
            </div>
        </div>
      </div>
       <div className="relative bg-slate-50 py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-extrabold text-slate-900">{t('signupTitle')}</h2>
                        <p className="text-lg text-slate-600">{t('signupDescription')}</p>
                        <h3 className="text-xl font-semibold text-slate-800">{t('signupFeaturesTitle')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-3 mt-1">✓</span>
                                <span className="text-slate-600">{t('signupFeature1')}</span>
                            </li>
                             <li className="flex items-start">
                                <span className="text-indigo-500 mr-3 mt-1">✓</span>
                                <span className="text-slate-600">{t('signupFeature2')}</span>
                            </li>
                             <li className="flex items-start">
                                <span className="text-indigo-500 mr-3 mt-1">✓</span>
                                <span className="text-slate-600">{t('signupFeature3')}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-3 mt-1">✓</span>
                                <span className="text-slate-600">{t('signupFeature4')}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-xl">
                        <SignupForm t={t} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
