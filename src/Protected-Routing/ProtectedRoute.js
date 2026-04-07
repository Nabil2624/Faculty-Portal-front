// ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionExpiredPopup from "../components/ui/SessionExpiredPopup";
export default function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) return null; 

  if (!isAuthenticated) {
    
  }

  return (
    <>
      <SessionExpiredPopup /> {/* ✅ هيظهر هنا بس في الصفحات المحمية */}
      <Outlet />
    </>
  );
}