import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
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

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/error/:code" element={<ErrorPage />} />
        <Route path="/OTP" element={<OtpPage />} />

        {/* ✅ Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/header" element={<Header />} />
          <Route path="/layout" element={<Layout />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/personal" element={<PersonalDataPage />} />
          <Route path="/editpersonal" element={<EditPersonalInfo />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route path="/identification-card" element={<IdentificationCard />} />
          <Route path="/social-networking" element={<SocialNetworkingPages />} />
          <Route path="/edit-contact-info" element={<EditContactInfo />} />
          <Route path="/edit-Social" element={<EditSocialNetworking />} />
          <Route path="/edit-identification-card" element={<EditIdentificationCard />} />
          <Route path="/under-development" element={<UnderDevelopment />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<ErrorPage code="404" />} />
      </Routes>
    </Router>
  );
}
