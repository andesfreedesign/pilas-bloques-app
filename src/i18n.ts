import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { selectedLanguage } from './language';

i18n
  // i18next-http-backend
  // loads translations from your server
  // https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'es-AR',
    lng: selectedLanguage() || 'es-AR',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
