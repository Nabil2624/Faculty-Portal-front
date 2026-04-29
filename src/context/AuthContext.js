import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import { checkAuthMe } from "../services/auth.service";
import { axiosEvent } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSessionPopupVisible, setSessionPopupVisible] = useState(false);
  const [user, setUser] = useState(null);

  const verifySession = useCallback(async (showPopupOnError = true) => {
    setIsCheckingAuth(true);

    try {
      const response = await checkAuthMe();

      setUser(response.data);
      setIsAuthenticated(true);
      setSessionPopupVisible(false);

      return true;

    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      if (
        showPopupOnError &&
        error.response?.status === 401 &&
        window.location.pathname !== "/login"
      ) {
        setSessionPopupVisible(true);
      }

      return false;

    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);

    console.log("Waiting before AuthMe...");

    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    const ok = await verifySession(false);

    if (!ok) {
      throw new Error("AuthMe failed after login");
    }

    console.log("AuthMe finished!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSessionPopupVisible(false);
  };

  useEffect(() => {

    if (window.location.pathname !== "/login") {
      verifySession(false);
    }

    const handleGlobalErrors = (event) => {
      if (event.detail === "session-expired") {
        setIsAuthenticated(false);
        setUser(null);
        setSessionPopupVisible(true);
      }
    };

    axiosEvent.addEventListener(
      "axios-error",
      handleGlobalErrors
    );

    return () => {
      axiosEvent.removeEventListener(
        "axios-error",
        handleGlobalErrors
      );
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
        handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);