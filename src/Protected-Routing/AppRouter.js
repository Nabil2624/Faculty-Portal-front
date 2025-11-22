import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
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

import JobGradeForm from "../components/JobGradeForm";
import EditJobGrade from "../components/EditJobGrade";
import EditAdminPosition from "../components/EditAdminPosition";
import AddAdministrativePosition from "../components/AddAdministrativePosition";
import AddScientificTask from "../components/AddScientificTask";
import EditScientificTask from "../components/EditScientificTask";
import AddAcademicQualification from "../components/AddAcademicQualification";
import EditAcademicQualification from "../components/EditAcademicQualification";
import AddConference from "../components/AddConference";
import EditConference from "../components/EditConference";
import AddTrainingProgram from "../components/AddTrainingProgram";
import EditTrainingProgram from "../components/EditTrainingProgram";

import AcademicQualifications from "../components/AcademicQualifications";
import JobRanks from "../components/JobRanks";
import AdministrativePositions from "../components/AdministrativePositions";
import ScientificMissions from "../components/ScientificMissions";
import SeminarsAndConferences from "../components/SeminarsAndConferences";
import TrainingPrograms from "../components/TrainingPrograms";

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
      <Route path="/add-scientific-task" element={<AddScientificTask />} />
      <Route path="/edit-scientific-task" element={<EditScientificTask />} />
      <Route
        path="/add-academic-qualification"
        element={<AddAcademicQualification />}
      />
      <Route
        path="/edit-academic-qualification"
        element={<EditAcademicQualification />}
      />
      <Route path="/add-conference" element={<AddConference />} />
      <Route path="/edit-conference" element={<EditConference />} />
      <Route path="/add-Training-program" element={<AddTrainingProgram />} />
      <Route path="/edit-Training-program" element={<EditTrainingProgram />} />
      <Route
        path="/academic-qualifications"
        element={<AcademicQualifications />}
      />
      <Route path="/job-rankings" element={<JobRanks />} />
      <Route
        path="/administrative-positions"
        element={<AdministrativePositions />}
      />
      <Route path="/scientific-missions" element={<ScientificMissions />} />
      <Route
        path="/seminars-and-conferences"
        element={<SeminarsAndConferences />}
      />
      <Route path="/personal" element={<PersonalDataPage />} />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}>
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
        <Route
          path="/edit-identification-card"
          element={<EditIdentificationCard />}
        />
        <Route path="/training-programs" element={<TrainingPrograms />} />

        <Route path="/job-grade-form" element={<JobGradeForm />} />
        <Route path="/edit-job-grade" element={<EditJobGrade />} />
        <Route path="/edit-admin-pos" element={<EditAdminPosition />} />
        <Route path="/add-admin-pos" element={<AddAdministrativePosition />} />
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
