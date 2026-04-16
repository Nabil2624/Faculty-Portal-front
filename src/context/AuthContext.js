import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkAuthMe } from "../services/auth.service";
import { axiosEvent } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSessionPopupVisible, setSessionPopupVisible] = useState(false);
  const [user, setUser] = useState(null);

  const verifySession = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const response = await checkAuthMe();
      setUser(response.data);
      setIsAuthenticated(true);
      setSessionPopupVisible(false);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      if (error.response && error.response.status === 401) {
        if (window.location.pathname !== "/login") {
          setSessionPopupVisible(true);
        }
      }
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setSessionPopupVisible(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSessionPopupVisible(false);
  };

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setSessionPopupVisible(false);
    }

    verifySession();

    const handleGlobalErrors = (event) => {
      if (event.detail === "session-expired") {
        setIsAuthenticated((prev) => {
          if (prev === true) setSessionPopupVisible(true);
          return false;
        });
        setUser(null);
      }
    };

    axiosEvent.addEventListener("axios-error", handleGlobalErrors);
    return () => axiosEvent.removeEventListener("axios-error", handleGlobalErrors);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};