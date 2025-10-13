import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppRouter from "./Protected-Routing/AppRouter";
import LoadingSpinner from "./components/LoadingSpinner";
import Spinner from "./components/Spinner";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update <html> tag for global font + direction
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter />
    </Suspense>
 
  );
}
