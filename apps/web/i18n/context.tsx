import React, { createContext, useState, useContext } from 'react';

type Language = 'pt' | 'en' | 'es' | 'fr' | 'de';

const ptTranslations: Record<string, string> = {
  "powered_by": "Designed by Norotec Cloud",
  "footer_rights": "Todos os direitos reservados.",
};

const enTranslations: Record<string, string> = {
  "powered_by": "Designed by Norotec Cloud",
  "footer_rights": "All rights reserved.",
};

const esTranslations: Record<string, string> = {
  "powered_by": "Designed by Norotec Cloud",
  "footer_rights": "Todos los direitos reservados.",
};

const frTranslations: Record<string, string> = {
  "powered_by": "Designed by Norotec Cloud",
  "footer_rights": "Tous droits réservés.",
};

const deTranslations: Record<string, string> = {
  "powered_by": "Designed by Norotec Cloud",
  "footer_rights": "Alle Rechte vorbehalten.",
};

const translations: Record<Language, Record<string, string>> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language]?.[key] || ptTranslations[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: 'pt' as Language,
      setLanguage: () => {},
      t: (key: string) => ptTranslations[key] || key,
    };
  }
  return context;
};
