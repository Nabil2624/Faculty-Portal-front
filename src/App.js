// App.jsx
import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppRouter from "./Protected-Routing/AppRouter";
import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider, useAuth } from "./context/AuthContext";

// مكون فرعي عشان نقدر نستخدم الـ useAuth لظهور الـ Spinner
function AppContent() {
  const { isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter />
    </Suspense>
  );
}

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}