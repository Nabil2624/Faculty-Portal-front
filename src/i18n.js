import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// ✅ i18n configuration
i18n
  .use(Backend) // Loads translations from /locales/{{lng}}/{{ns}}.json
  .use(LanguageDetector) // Detects language (from localStorage, cookies, etc.)
  .use(initReactI18next) // Connects i18n with React
  .init({
    fallbackLng: "ar", // Default if no language is detected
    supportedLngs: ["ar", "en"],

    // Namespaces (optional — keep simple if you use one file per page)
    ns: [""],
    defaultNS: "",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    },

    detection: {
      // Order of detection
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      // Where to cache the language
      caches: ["localStorage", "cookie"],
    },

    load: "languageOnly",
    debug: false, // set to true only for debugging

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: true, // Allows lazy translation loading
    },
  });

export default i18n;
