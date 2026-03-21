import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { axiosEvent } from "../utils/axiosInstance";
import ProtectedRoute from "./ProtectedRoute";
import SessionExpiredPopup from "../components/ui/SessionExpiredPopup";

// --- استيراد المكونات ---
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
import ResetPasswordPage from "../components/ResetPasswordPage";
import JobGradeForm from "../components/widgets/JobGrade/JobGradeForm";
import EditJobGrade from "../components/widgets/JobGrade/EditJobGrade";
import EditAdminPosition from "../components/widgets/AdminPosition/EditAdminPosition";
import AddAdministrativePosition from "../components/widgets/AdminPosition/AddAdministrativePosition";
import AddScientificMission from "../pages/AddScientificMission";
import EditScientificMission from "../pages/EditScientificMission";
import AddAcademicQualification from "../pages/AddAcademicQualification";
import EditAcademicQualification from "../pages/EditAcademicQualification";
import AddConferencePage from "../pages/AddConferencePage";
import EditConferencePage from "../pages/EditConferencePage";
import AddTrainingProgram from "../pages/AddTrainingProgram";
import EditTrainingProgram from "../pages/EditTrainingProgram";
import AcademicQualifications from "../pages/AcademicQualifications";
import ScientificMissions from "../pages/ScientificMissions";
import SeminarsAndConferences from "../pages/SeminarsAndConferences";
import TrainingPrograms from "../pages/TrainingPrograms";
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
import UniversityContributions from "../pages/UniversityContributions";
import CommunityServiceContributions from "../pages/CommunityServiceContributions";
import ParticipationInQualityWorks from "../pages/ParticipationInQualityWorks";
import ProfileDashboard from "../pages/ProfileDashboard";
import ScientificWriting from "../pages/ScientificWriting";
import AddScientificWriting from "../pages/AddScientificWriting";
import EditScientificWriting from "../pages/EditScientificWriting";
import RecommendedSupervisions from "../pages/RecommendedSupervisions";
import JobGrade from "../pages/JobGrade";
import AdminstrativePosition from "../pages/AdminstrativePosition";
import PersonalDataV2 from "../components/PersonalDataV2";
import PersonalData from "../pages/PersonalData";
import ResearchesPage from "../pages/ResearchesPage";
import ScientificResearchInternalProfile from "../pages/ScientificResearchInternalProfile";
import ScientificResearchExternalProfile from "../pages/ScientificResearchExternalProfile";
import ThesesDetails from "../pages/ThesisDetails";
import FacultyLandingPage from "../pages/HomePage";
import AddArticlePage from "../pages/AddArticlePage";
import EditArticlePage from "../pages/EditArticlePage";
import AddJournalPage from "../pages/AddJournalPage";
import EditJournalPage from "../pages/EditJournalPage";
import AddUniversityContribution from "../pages/AddUniversityContribution";
import EditUniversityContribution from "../pages/EditUniversityContribution";
import AddCommunityServiceContribution from "../pages/AddCommunityServiceContribution";
import EditCommunityServiceContribution from "../pages/EditCommunityServiceContribution";
import AddParticipationInQualityWork from "../pages/AddParticipationInQualityWork";
import EditParticipationInQualityWork from "../pages/EditParticipationInQualityWork";
import { AddAdminPositionPage } from "../pages/AddAdminPositionPage";
import { EditAdminPositionPage } from "../pages/EditAdminPositionPage";
import { AddJobGradePage } from "../pages/AddJobGradePage";
import { EditJobGradePage } from "../pages/EditJobGradePage";
import LogsPage from "../pages/LogsPage";
import LogsCategoryPage from "../pages/LogsCategoryPage";
import UsersPage from "../pages/UsersPage";
import AddUserPermissionPage from "../pages/AddUserPermissionPage";
import CreateUserPage from "../pages/CreateUserPage";
import EditUserPermissionsPage from "../pages/EditUserPermissionsPage";
import AdminFacultyDataPage from "../pages/AdminFacultyDataPage";
import TicketingPage from "../pages/TicketingPage";
import AdminTicketingPage from "../pages/AdminTicketingPage";
import SupportAdminTicketingPage from "../pages/SupportAdminTicketingPage";
import ChatPage from "../pages/ChatPage";
import CVPage from "../pages/CVPage";
import ManageCVPage from "../pages/ManageCVPage";
function AppRouterInner({
  isSessionPopupVisible,
  setSessionPopupVisible,
  isAuthenticated,
  isCheckingAuth,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "session-expired") {
        setSessionPopupVisible(true);
      } else if (
        typeof e.detail === "string" &&
        e.detail.startsWith("/error/")
      ) {
        navigate(e.detail, { replace: true });
      }
    };
    axiosEvent.addEventListener("axios-error", handler);
    return () => axiosEvent.removeEventListener("axios-error", handler);
  }, [navigate, setSessionPopupVisible]);

  return (
    <>
      <SessionExpiredPopup
        isVisible={isSessionPopupVisible}
        onClose={() => setSessionPopupVisible(false)}
      />

      <Routes>
        {/* --- 1. Public Routes --- */}
        <Route path="/" element={<FacultyLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
        <Route path="/OTP" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/error/:code" element={<ErrorPage />} />
        <Route path="/under-development" element={<UnderDevelopment />} />

        {/* --- 2. Protected Routes (Only accessible if authenticated) --- */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            />
          }
        >
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/logs-categories" element={<LogsCategoryPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route
            path="/admin/add-user-permission"
            element={<AddUserPermissionPage />}
          />
          <Route
            path="/admin/edit-user-permissions"
            element={<EditUserPermissionsPage />}
          />
          <Route path="/admin/create-user" element={<CreateUserPage />} />
          <Route
            path="/admin/faculty-data"
            element={<AdminFacultyDataPage />}
          />
          <Route
            path="/support-admin"
            element={<SupportAdminTicketingPage />}
          />
          <Route path="/tickets" element={<TicketingPage />} />
          <Route path="/admin/tickets" element={<AdminTicketingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/manage-cv" element={<ManageCVPage />} />
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/personal-data" element={<PersonalData />} />
          <Route path="/editpersonal" element={<EditPersonalInfo />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route path="/edit-contact-info" element={<EditContactInfo />} />
          <Route path="/identification-card" element={<IdentificationCard />} />
          <Route
            path="/edit-identification-card"
            element={<EditIdentificationCard />}
          />
          <Route
            path="/social-networking"
            element={<SocialNetworkingPages />}
          />
          <Route path="/edit-Social" element={<EditSocialNetworking />} />

          <Route
            path="/academic-qualifications"
            element={<AcademicQualifications />}
          />
          <Route
            path="/add-academic-qualification"
            element={<AddAcademicQualification />}
          />
          <Route
            path="/edit-academic-qualification"
            element={<EditAcademicQualification />}
          />

          <Route path="/job-rankings" element={<JobGrade />} />
          <Route path="/add-job-grade" element={<AddJobGradePage />} />
          <Route path="/edit-job-grade" element={<EditJobGradePage />} />

          <Route
            path="/administrative-positions"
            element={<AdminstrativePosition />}
          />
          <Route
            path="/add-admin-position"
            element={<AddAdminPositionPage />}
          />
          <Route
            path="/edit-admin-position"
            element={<EditAdminPositionPage />}
          />

          <Route path="/ResearchesPage" element={<ResearchesPage />} />
          <Route
            path="/add-scientific-research"
            element={<AddScientificResearch />}
          />
          <Route
            path="/edit-scientific-research"
            element={<EditScientificResearch />}
          />
          <Route
            path="/scientific-research-details"
            element={<ScientificResearchDetails />}
          />
          <Route
            path="/scientific-research-full-details"
            element={<ScientificResearchFullDetails />}
          />
          <Route
            path="/nominated-research"
            element={<NominatedScientificResearch />}
          />

          <Route path="/theses" element={<Theses />} />
          <Route path="/add-thesis" element={<AddThesis />} />
          <Route path="/edit-thesis" element={<EditThesis />} />
          <Route path="/ThesesDetails" element={<ThesesDetails />} />

          <Route path="/supervision-thesis" element={<SupervisionThesis />} />
          <Route path="/supervision-info" element={<SupervisionInfo />} />
          <Route
            path="/add-supervision"
            element={<AddSupervisionOrJudgement />}
          />
          <Route
            path="/edit-supervision"
            element={<EditSupervisionOrJudgement />}
          />
          <Route
            path="/recommended-supervisions"
            element={<RecommendedSupervisions />}
          />

          <Route path="/scientific-missions" element={<ScientificMissions />} />
          <Route
            path="/add-scientific-task"
            element={<AddScientificMission />}
          />
          <Route
            path="/edit-scientific-task"
            element={<EditScientificMission />}
          />

          <Route
            path="/seminars-and-conferences"
            element={<SeminarsAndConferences />}
          />
          <Route path="/add-conference" element={<AddConferencePage />} />
          <Route path="/edit-conference" element={<EditConferencePage />} />

          <Route path="/training-programs" element={<TrainingPrograms />} />
          <Route
            path="/add-Training-program"
            element={<AddTrainingProgram />}
          />
          <Route
            path="/edit-Training-program"
            element={<EditTrainingProgram />}
          />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/edit-project" element={<EditProject />} />

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

          <Route path="/article-reviews" element={<ArticleReviewsPage />} />
          <Route path="/add-article" element={<AddArticlePage />} />
          <Route path="/edit-article" element={<EditArticlePage />} />

          <Route path="/journals" element={<ParticipationInJournals />} />
          <Route path="/add-journal" element={<AddJournalPage />} />
          <Route path="/edit-journal" element={<EditJournalPage />} />

          <Route
            path="/general-experiences"
            element={<GeneralExperiencesPage />}
          />
          <Route
            path="/add-general-experiences"
            element={<AddGeneralExperience />}
          />
          <Route
            path="/edit-general-experiences"
            element={<EditGeneralExperience />}
          />

          <Route
            path="/teaching-experiences"
            element={<TeachingExperiences />}
          />
          <Route
            path="/add-teaching-experiences"
            element={<AddTeachingExperience />}
          />
          <Route
            path="/edit-teaching-experiences"
            element={<EditTeachingExperience />}
          />

          <Route path="/prizes-and-rewards" element={<PrizesAndRewards />} />
          <Route
            path="/add-prizes-and-rewards"
            element={<AddPrizesAndRewards />}
          />
          <Route
            path="/edit-prizes-and-rewards"
            element={<EditPrizesAndRewards />}
          />

          <Route
            path="/manifestations-of-scientific-appreciation"
            element={<ManifestationsOfScientificAppreciation />}
          />
          <Route
            path="/add-manifestations-of-scientific-appreciation"
            element={<AddManifestation />}
          />
          <Route
            path="/edit-manifestations-of-scientific-appreciation"
            element={<EditManifestation />}
          />

          <Route path="/patents" element={<Patents />} />
          <Route path="/add-patent" element={<AddPatent />} />
          <Route path="/edit-patent" element={<EditPatent />} />

          <Route path="/scientific-writing" element={<ScientificWriting />} />
          <Route
            path="/add-scientific-writing"
            element={<AddScientificWriting />}
          />
          <Route
            path="/edit-scientific-writing"
            element={<EditScientificWriting />}
          />

          <Route
            path="/university-contribution"
            element={<UniversityContributions />}
          />
          <Route
            path="/add-university-contribution"
            element={<AddUniversityContribution />}
          />
          <Route
            path="/edit-university-contribution"
            element={<EditUniversityContribution />}
          />

          <Route
            path="/Contributions-community-service"
            element={<CommunityServiceContributions />}
          />
          <Route
            path="/add-community-contribution"
            element={<AddCommunityServiceContribution />}
          />
          <Route
            path="/edit-community-contribution"
            element={<EditCommunityServiceContribution />}
          />

          <Route
            path="/participation-in-quality-work"
            element={<ParticipationInQualityWorks />}
          />
          <Route
            path="/add-participation-quality-work"
            element={<AddParticipationInQualityWork />}
          />
          <Route
            path="/edit-participation-quality-work"
            element={<EditParticipationInQualityWork />}
          />

          <Route path="/researcher-profile" element={<ResearcherProfile />} />
          <Route
            path="/InternalProfile"
            element={<ScientificResearchInternalProfile />}
          />
          <Route
            path="/ExternalProfile"
            element={<ScientificResearchExternalProfile />}
          />
        </Route>

        {/* --- 3. Catch All (Only if not loading) --- */}
        {!isCheckingAuth && (
          <Route path="*" element={<ErrorPage code="404" />} />
        )}
      </Routes>
    </>
  );
}

export default function AppRouter(props) {
  return (
    <Router>
      <AppRouterInner {...props} />
    </Router>
  );
}
