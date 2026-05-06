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
    ns: [
      "login", "dashboard", "HeaderAndSideBar", "PersonalData",
      "CV", "Chat", "OTP", "error", "form", "filter-sort",
      "forgetpassword", "register", "identification", "contactinfo",
      "ScientificResearches", "ScientificResearchDetails", "ScientificResearchFullDetails",
      "AddScientificResearch", "NominatedResearch", "ResearcherProfile",
      "AcademicQualifications", "add-academic-qualification",
      "AdministrativePositions", "GeneralExperiences", "add-general-experiences",
      "JobRanks", "Theses", "ThesesDetails", "AddThesis", "EditThesis",
      "SupervisionThesis", "SupervisionInfo", "AddSupervision", "RecommendedSupervisions",
      "AddProject", "projects", "AddArticleForm", "ParticipationJournals",
      "SeminarsAndConferences", "add-conference", "CommitteesAssociations",
      "add-committee", "TrainingPrograms", "add-training-program",
      "ScientificMissions", "add-scientific-task", "patents", "patent-form",
      "prizes-and-rewards", "prizes-and-rewards-form", "scientific-writing",
      "scientific-writing-form", "community-service", "participation-quality-work",
      "participation-quality-work-form", "journal-forms", "article-reviews",
      "teaching-experiences", "teaching-experience-form", "socialNetworkingPages",
      "google-scholer-popUp", "CitationsChart", "QuotesChart", "Logs",
      "LogsCategories", "Users", "AdminFacultyData", "admin-dashboard",
      "university-contribution", "university-contribution-form",
      "manifestations-of-scientific-appreciation", "manifestation-of-scientific-appreciation-form",
      "AddProject", "UnderDevelopment", "ResetPassword", "Ticketing",
      "session-popup", "unauthorizedModal", "HeaderAndSideBar"
    ],
    defaultNS: "login",

    
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
