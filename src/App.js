import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppRouter from "./Protected-Routing/AppRouter";
import LoadingSpinner from "./components/LoadingSpinner";
import { axiosEvent } from "./utils/axiosInstance"; 
import { checkAuthMe } from "./services/auth.service"; 

export default function App() {
  const { i18n } = useTranslation();
  const [isSessionPopupVisible, setSessionPopupVisible] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // 1. إضافة حالة التأكد من تسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. دالة تُنادى عند نجاح تسجيل الدخول من صفحة الـ Login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    // تحديث لغة واتجاه الصفحة
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

    const verifySession = async () => {
      try {
        await checkAuthMe();
        // لو الريكويست نجح (200)، يبقى المستخدم مسجل دخول
        setIsAuthenticated(true);
      } catch (error) {
        // لو فشل، المستخدم غير مسجل دخول
        setIsAuthenticated(false);
        console.warn("Session check failed on mount");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifySession();

    const handleGlobalErrors = (event) => {
      if (event.detail === "session-expired") {
        setSessionPopupVisible(true);
        setIsAuthenticated(false); 
      }
    };

    axiosEvent.addEventListener("axios-error", handleGlobalErrors);
    return () => {
      axiosEvent.removeEventListener("axios-error", handleGlobalErrors);
    };
  }, [i18n.language]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter 
        isSessionPopupVisible={isSessionPopupVisible} 
        setSessionPopupVisible={setSessionPopupVisible}
        isAuthenticated={isAuthenticated}
        isCheckingAuth={isCheckingAuth}   
        onLoginSuccess={handleLoginSuccess} 
      />
    </Suspense>
  );
}