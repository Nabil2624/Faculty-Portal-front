import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ar", // ✅ instead of "lang"
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],

    ns: ["translation"], // ✅ default namespace
    defaultNS: "translation",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // ✅ تأكد المسار يبدأ بـ "/"
    },

    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },

    load: "languageOnly",
    debug: true,

    react: { useSuspense: true }, // ✅ عشان الترجمة تشتغل حتى في صفحات global
  });

export default i18n;
