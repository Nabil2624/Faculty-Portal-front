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
import CommitteesAndAssociationsPage from "../pages/CommitteeAndAssociationPage";
import AddCommitteeAssociation from "../pages/AddCommitteeAssociation";
import EditCommitteeAssociation from "../pages/EditCommitteeAssociation";

import AddProject from "../pages/AddProject";
import EditProject from "../pages/EditProject";
import ParticipationInJournals from "../pages/ParticipationInJournals";

import ScientificResearches from "../pages/ScientificResearches";
import SupervisionThesis from "../pages/SupervisionThesis";
import Theses from "../pages/Theses";
import ScientificResearchDetails from "../pages/ScientificResearchDetails";
import ProjectsPage from "../pages/ProjectsPage";
import ArticleReviewsPage from "../pages/ArticleReviews";
import GeneralExperiencesPage from "../pages/GeneralExperiencesPage";
import AddGeneralExperience from "../pages/AddGeneralExperience";
import EditGeneralExperience from "../pages/EditGeneralExperience";

import TeachingExperiences from "../pages/TeachingExperiences";
import AddTeachingExperience from "../pages/AddTeachingExperience";
import EditTeachingExperience from "../pages/EditTeachingExperience";
import NominatedScientificResearch from "../pages/NominatedResearch";
import SupervisionInfo from "../pages/SupervisionInfo";
import ThesesDetails from "../pages/ThesisDetails";
import ScientificResearchFullDetails from "../pages/ScientificResearchFullDetails";
import ResearcherProfile from "../pages/ResearcherProfile";
import AddThesis from "../pages/AddThesis";
import AddScientificResearch from "../pages/AddScientificResearch";
import EditScientificResearch from "../pages/EditScientificResearch";
import EditThesis from "../pages/EditThesis";
import AddSupervisionOrJudgement from "../pages/AddSupervisionOrJudgement";
import EditSupervisionOrJudgement from "../pages/EditSupervisionOrJudgement";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";
import PrizesAndRewards from "../pages/PrizesAndRewards";
import AddPrizesAndRewards from "../pages/AddPrizesAndRewards";
import EditPrizesAndRewards from "../pages/EditPrizesAndRewards";
import ManifestationsOfScientificAppreciation from "../pages/ManifestationsOfScientificAppreciation";
import EditManifestation from "../pages/EditManifestation";
import AddManifestation from "../pages/AddManifestation";
import Patents from "../pages/Patents";
import AddPatent from "../pages/AddPatent";
import EditPatent from "../pages/EditPatent";
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

      <Route path="/theses" element={<Theses />} />
      <Route path="/scientific-researches" element={<ScientificResearches />} />
      <Route path="/supervision-thesis" element={<SupervisionThesis />} />
      <Route path="/supervision-info" element={<SupervisionInfo />} />
      <Route path="/theses-details/:id" element={<ThesesDetails />} />

      <Route path="/researcher-profile" element={<ResearcherProfile />} />
      <Route path="/add-thesis" element={<AddThesis />} />
      <Route path="/edit-thesis" element={<EditThesis />} />
      <Route path="/add-supervision" element={<AddSupervisionOrJudgement />} />
      <Route path="/missing-scholar-card" element={<MissingScholarCard />} />
      <Route path="/prizes-and-rewards" element={<PrizesAndRewards />} />
      <Route path="/add-prizes-and-rewards" element={<AddPrizesAndRewards />} />

      <Route
        path="/manifestations-of-scientific-appreciation"
        element={<ManifestationsOfScientificAppreciation />}
      />
      <Route path="/patents" element={<Patents />} />
      <Route path="/add-patent" element={<AddPatent />} />
      <Route path="/edit-patent" element={<EditPatent />} />
      <Route
        path="/add-manifestations-of-scientific-appreciation"
        element={<AddManifestation />}
      />
      <Route
        path="/edit-manifestations-of-scientific-appreciation"
        element={<EditManifestation />}
      />
      <Route
        path="/edit-prizes-and-rewards"
        element={<EditPrizesAndRewards />}
      />
      <Route
        path="/edit-supervision"
        element={<EditSupervisionOrJudgement />}
      />
      <Route
        path="edit-scientific-research/:id"
        element={<EditScientificResearch />}
      />
      <Route
        path="/add-scientific-research"
        element={<AddScientificResearch />}
      />
      <Route
        path="/scientific-research-full-details/:id"
        element={<ScientificResearchFullDetails />}
      />
      <Route
        path="/nominated-research"
        element={<NominatedScientificResearch />}
      />
      <Route
        path="/scientific-research-details/:id"
        element={<ScientificResearchDetails />}
      />
      <Route path="/" element={<ScientificResearchDetails />} />
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
      <Route
        path="/committee-associations"
        element={<CommitteesAndAssociationsPage />}
      />
      <Route
        path="/add-committee-associations"
        element={<AddCommitteeAssociation />}
      />
      <Route
        path="/edit-committee-associations"
        element={<EditCommitteeAssociation />}
      />
      <Route path="/journals" element={<ParticipationInJournals />} />
      <Route path="/add-project" element={<AddProject />} />
      <Route path="/edit-project" element={<EditProject />} />
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
      <Route path="/journals" element={<ParticipationInJournals />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/article-reviews" element={<ArticleReviewsPage />} />
      <Route path="/general-experiences" element={<GeneralExperiencesPage />} />
      <Route path="/teaching-experiences" element={<TeachingExperiences />} />
      <Route
        path="/add-teaching-experiences"
        element={<AddTeachingExperience />}
      />

      <Route
        path="/edit-teaching-experiences"
        element={<EditTeachingExperience />}
      />
      <Route
        path="/add-general-experiences"
        element={<AddGeneralExperience />}
      />
      <Route
        path="/edit-general-experiences"
        element={<EditGeneralExperience />}
      />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}></Route>

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
