import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '@/locales/en.json';
import vi from '@/locales/vi.json';

const STORAGE_KEY = 'app_language';

async function getInitialLanguage() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const sys = Localization.locale?.split('-')[0] ?? 'en';
  return ['en', 'vi'].includes(sys) ? sys : 'en';
}

export async function changeLanguage(lang: 'en' | 'vi') {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(STORAGE_KEY, lang);
}

export async function initI18n() {
  const lng = await getInitialLanguage();
  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      resources: {
        en: { translation: en },
        vi: { translation: vi },
      },
    });
}

export default i18n;


