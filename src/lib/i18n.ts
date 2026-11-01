import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from '@/locales/de.json';
import en from '@/locales/en.json';

export const defaultNS = 'translation';

export const resources = {
  en: { translation: en },
  de: { translation: de },
} as const;

type SupportedLanguage = keyof typeof resources;

function isSupportedLanguage(code: string | null | undefined): code is SupportedLanguage {
  return code != null && code in resources;
}

function getDeviceLanguage(): SupportedLanguage {
  const code = getLocales()[0]?.languageCode;
  return isSupportedLanguage(code) ? code : 'en';
}

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  defaultNS,
  interpolation: { escapeValue: false },
  returnNull: false,
});
