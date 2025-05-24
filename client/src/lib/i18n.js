import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr','sp','ar','ge','ja','vi','si','hi','be','te','mara','ta','gu','ur','kan','odi','pun','mal','assam','mai','konk','dogr','kash','sant','manip','bodo','mandarin'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // served from public folder
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
