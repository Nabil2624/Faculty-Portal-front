import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionExpiredPopup from "../components/ui/SessionExpiredPopup";

export default function ProtectedRoute() {
  const {  isCheckingAuth, isSessionPopupVisible } = useAuth();


  if (isCheckingAuth) return null;


  
  return (
    <>
      {isSessionPopupVisible && <SessionExpiredPopup />}
      <Outlet />
    </>
  );
}