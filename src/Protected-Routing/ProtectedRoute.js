// ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, isCheckingAuth }) {
  // 1. لو لسه بنعمل Check على السيشن من الـ AuthMe.. متعملش Redirect دلوقتي
  if (isCheckingAuth) return null; 

  // 2. لو خلصنا فحص وطلع مش مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}