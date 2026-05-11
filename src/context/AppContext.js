import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import i18n from '../locales/i18n';

const AppContext = createContext(null);

const LANG_KEY = 'foxstore_lang';
const THEME_KEY = 'foxstore_theme_dark';

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('ar');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem(LANG_KEY);
      const dark = await AsyncStorage.getItem(THEME_KEY);
      if (lang) {
        setLanguage(lang);
        i18n.changeLanguage(lang);
      }
      if (dark != null) setIsDark(dark === 'true');
    })();
  }, []);

  const toggleLanguage = async () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    i18n.changeLanguage(next);
    I18nManager.allowRTL(next === 'ar');
    I18nManager.forceRTL(next === 'ar');
    await AsyncStorage.setItem(LANG_KEY, next);
  };

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_KEY, String(next));
  };

  const value = useMemo(() => ({ language, isDark, setIsDark, toggleTheme, toggleLanguage }), [language, isDark]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppSettings = () => useContext(AppContext);
