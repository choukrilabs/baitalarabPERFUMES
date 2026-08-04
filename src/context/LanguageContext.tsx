import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TRANSLATIONS, MOROCCAN_CITIES_FR, PERFUME_TERMS_FR } from '../utils/translations';
import { Product } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'rtl' | 'ltr';
  isArabic: boolean;
  isFrench: boolean;
  formatPrice: (price: number) => string;
  getCategoryName: (catId: string) => string;
  getCategoryDescription: (catId: string) => string;
  getGenderLabel: (gender?: string) => string | null;
  translateCity: (city: string) => string;
  translateProductTerm: (term: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'baitalarab_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'fr') return saved;
    } catch {
      // ignore
    }
    return 'ar';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  }, [setLanguage]);

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';
  const isFrench = language === 'fr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (language === 'fr') {
      document.body.classList.add('lang-fr');
      document.body.classList.remove('lang-ar');
    } else {
      document.body.classList.add('lang-ar');
      document.body.classList.remove('lang-fr');
    }
  }, [language, dir]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const entry = TRANSLATIONS[key];
      let text = entry ? entry[language] : key;

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }

      return text;
    },
    [language]
  );

  const formatPrice = useCallback(
    (price: number): string => {
      const num = Number(price) || 0;
      if (language === 'fr') {
        return `${num.toLocaleString('fr-FR')} DH`;
      }
      return `${num.toLocaleString('ar-MA')} د.م`;
    },
    [language]
  );

  const getCategoryName = useCallback(
    (catId: string): string => {
      const key = `category.${catId}`;
      if (TRANSLATIONS[key]) {
        return TRANSLATIONS[key][language];
      }
      return catId;
    },
    [language]
  );

  const getCategoryDescription = useCallback(
    (catId: string): string => {
      const key = `category.${catId}_desc`;
      if (TRANSLATIONS[key]) {
        return TRANSLATIONS[key][language];
      }
      return '';
    },
    [language]
  );

  const getGenderLabel = useCallback(
    (gender?: string): string | null => {
      if (!gender || gender === 'all') return null;
      if (gender === 'men') return language === 'ar' ? 'رجالي' : 'Pour Homme';
      if (gender === 'women') return language === 'ar' ? 'نسائي' : 'Pour Femme';
      if (gender === 'unisex') return language === 'ar' ? 'للجنسين' : 'Unisexe';
      return null;
    },
    [language]
  );

  const translateCity = useCallback(
    (city: string): string => {
      if (language === 'fr' && MOROCCAN_CITIES_FR[city]) {
        return MOROCCAN_CITIES_FR[city];
      }
      return city;
    },
    [language]
  );

  const translateProductTerm = useCallback(
    (term: string): string => {
      if (language === 'fr' && PERFUME_TERMS_FR[term]) {
        return PERFUME_TERMS_FR[term];
      }
      return term;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        dir,
        isArabic,
        isFrench,
        formatPrice,
        getCategoryName,
        getCategoryDescription,
        getGenderLabel,
        translateCity,
        translateProductTerm,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
