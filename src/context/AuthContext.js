import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkAuthMe } from "../services/auth.service";
import { axiosEvent } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSessionPopupVisible, setSessionPopupVisible] = useState(false);
  const [user, setUser] = useState(null); // اختياري: لتخزين بيانات اليوزر (الاسم، الايميل..)

  // 1. دالة فحص حالة المستخدم (AuthMe)
  const verifySession = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const response = await checkAuthMe();
      // افترضنا أن الـ API بيرجع بيانات اليوزر في الـ data
      setUser(response.data); 
      setIsAuthenticated(true);
      setSessionPopupVisible(false); // إخفاء البوب اب لو كانت ظاهرة
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.warn("Auth check failed: User is guest or session expired.");
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // 2. دالة تُستدعى عند نجاح تسجيل الدخول
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData || null);
    setSessionPopupVisible(false);
  };

  // 3. دالة تسجيل الخروج (تصفير كل شيء)
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSessionPopupVisible(false);
    // ملحوظة: لو عندك توكن في الـ LocalStorage اتمسحه هنا لو مش شغال Cookies
  };

  useEffect(() => {
    // تشغيل الفحص عند أول تحميل للموقع
    verifySession();

    // 4. الاستماع لـ Axios Interceptor (401 Unauthorized)
    const handleGlobalErrors = (event) => {
      if (event.detail === "session-expired") {
        // ✅ منطق ذكي: اظهر البوب اب "فقط" لو اليوزر كان مسجل دخول أصلاً
        // عشان نمنع ظهورها في صفحات اللوجن أو الصفحات العامة
        setIsAuthenticated((prev) => {
          if (prev === true) {
            setSessionPopupVisible(true);
          }
          return false;
        });
        setUser(null);
      }
    };

    axiosEvent.addEventListener("axios-error", handleGlobalErrors);
    
    return () => {
      axiosEvent.removeEventListener("axios-error", handleGlobalErrors);
    };
  }, [verifySession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingAuth,
        isSessionPopupVisible,
        user,
        setSessionPopupVisible,
        verifySession,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لسهولة الاستخدام في المكونات
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};