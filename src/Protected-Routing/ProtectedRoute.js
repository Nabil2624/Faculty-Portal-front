import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Checks for authentication before rendering protected pages
export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If no token → redirect to login
 if (!token) {
  return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
 }


  // Otherwise → render the child routes
  return <Outlet />;
}
