// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './public/locales/en/common.json';
import de from './public/locales/de/common.json';

const resources = {
  en: {
    translation: en
  },
  de: {
    translation: de
  }
};

i18n
  .use(LanguageDetector) // detects the language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'de', // default language
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
