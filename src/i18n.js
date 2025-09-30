import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lang: "ar",                 // 👈 default language
    fallbackLng: "ar",            // 👈 default to Arabic
    supportedLngs: ["ar", "en"],

    // shared stuff
    ns: [],                       // 👈 dynamic namespaces

    backend: {
      loadPath: "locales/{{lng}}/{{ns}}.json"
    },

    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"]
    },

    load: "languageOnly",         // so "ar-EG" → "ar"
    debug: true
  });

export default i18n;