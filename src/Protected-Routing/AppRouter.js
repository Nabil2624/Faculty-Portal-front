import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { axiosEvent } from "../utils/axiosInstance"; // 👈 import our event
import ProtectedRoute from "./ProtectedRoute";

import RegisterPage from "../components/RegistrationPage";
import LoginPage from "../components/LoginPage";
import ForgotPasswordPage from "../components/ForgotPasswordPage";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import PersonalDataPage from "../components/PersonalDataPage";
import EditPersonalInfo from "../components/EditPersonalInfo";
import ContactInfo from "../components/ContactInfo";
import IdentificationCard from "../components/IdentificationCard";
import SocialNetworkingPages from "../components/SocialNetworkingPages";
import EditContactInfo from "../components/EditContactInfo";
import EditSocialNetworking from "../components/EditSocialNetworking";
import EditIdentificationCard from "../components/EditIdentificationCard";
import ErrorPage from "../components/ErrorPage";
import OtpPage from "../components/OtpPage";
import UnderDevelopment from "../components/UnderDevelopment";
import LoadingSpinner from "../components/LoadingSpinner";
import ResetPasswordPage from "../components/ResetPasswordPage";

function AppRouterInner() {
  const navigate = useNavigate();

  // ✅ Listen for global axios errors and navigate properly
  useEffect(() => {
    const handler = (e) => navigate(e.detail, { replace: true });
    axiosEvent.addEventListener("axios-error", handler);

    return () => axiosEvent.removeEventListener("axios-error", handler);
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/error/:code" element={<ErrorPage />} />
      <Route path="/OTP" element={<OtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/personal" element={<PersonalDataPage />} />
        <Route path="/under-development" element={<UnderDevelopment />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/header" element={<Header />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/editpersonal" element={<EditPersonalInfo />} />
        <Route path="/contact-info" element={<ContactInfo />} />
        <Route path="/identification-card" element={<IdentificationCard />} />
        <Route path="/social-networking" element={<SocialNetworkingPages />} />
        <Route path="/edit-contact-info" element={<EditContactInfo />} />
        <Route path="/edit-Social" element={<EditSocialNetworking />} />
        <Route path="/edit-identification-card" element={<EditIdentificationCard />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<ErrorPage code="404" />} />
    </Routes>
  );
}

// Wrap it in Router here
export default function AppRouter() {
  return (
    <Router>
      <AppRouterInner />
    </Router>
  );
}
