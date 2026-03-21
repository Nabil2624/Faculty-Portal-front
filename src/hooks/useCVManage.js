import { useState } from "react";
import { updateCVVisibility } from "../services/cv.service";

const defaultVisibility = {
  personalData: {
    showPersonalData: true,
    showUniversity: true,
    showAuthority: true,
    showDepartment: true,
    showBirthDate: true,
    showProfilePicture: true,
    showSkills: true,
  },
  contactInfo: {
    showContactInfo: true,
    showMainPhone: true,
    showWorkPhone: true,
    showOfficialEmail: true,
    showFax: true,
  },
  socialMedia: {
    showSocialMedia: true,
    showLinkedIn: true,
    showInstagram: true,
    showPersonalWebsite: true,
    showGoogleScholar: true,
    showScopus: true,
    showFacebook: true,
    showX: true,
    showYouTube: true,
  },
  academicQualifications: {
    showAcademicQualifications: true,
    showQualification: true,
    showSpecialization: true,
    showGrade: true,
    showDispatchType: true,
    showUniversityOrFaculty: true,
    showCountryOrCity: true,
    showDateOfObtainingTheQualification: true,
  },
  jobRanks: {
    showJobRanks: true,
    showJobRank: true,
    showDateOfJobRank: true,
  },
  administrativePositions: {
    showAdministrativePositions: true,
    showPosition: true,
    showPositionStartDate: true,
    showPositionEndDate: true,
  },
  conferencesAndSeminars: {
    showConferencesAndSeminars: true,
    showConferenceOrSeminarName: true,
    showConferenceOrSeminarRoleOfParticipation: true,
    showConferenceOrSeminarOrganizingAuthority: true,
    showConferenceOrSeminarWebsite: true,
    showConferenceOrSeminarStartDate: true,
    showConferenceOrSeminarEndDate: true,
    showConferenceOrSeminarVenue: true,
  },
  scientificMissions: {
    showScientificMissions: true,
    showMissionName: true,
    showMissionStartDate: true,
    showMissionEndDate: true,
    showMissionUniversityOrFaculty: true,
    showMissionCountryOrCity: true,
  },
  trainingPrograms: {
    showTrainingPrograms: true,
    showTrainingProgramName: true,
    showTrainingProgramVenue: true,
    showTrainingProgramStartDate: true,
    showTrainingProgramEndDate: true,
  },
  committeesAndAssociations: {
    showCommitteesAndAssociations: true,
    showNameOfCommitteeOrAssociation: true,
    showTypeOfCommitteeOrAssociation: true,
    showDegreeOfSubscription: true,
    showCommitteesAndAssociationsStartDate: true,
    showCommitteesAndAssociationsEndDate: true,
  },
  participationInMagazines: {
    showParticipationInMagazines: true,
    showNameOfMagazine: true,
    showWebsiteOfMagazine: true,
    showTypeOfParticipation: true,
  },
  reviewingArticles: {
    showReviewingArticles: true,
    showTitleOfArticle: true,
    showAuthority: true,
    showReviewingDate: true,
  },
  projects: {
    showProjects: true,
    showNameOfProject: true,
    showTypeOfProject: true,
    showParticipationRole: true,
    showFinancingAuthority: true,
    showProjectStartDate: true,
    showProjectEndDate: true,
  },
  teachingExperiences: {
    showTeachingExperiences: true,
    showCourseName: true,
    showAcademicLevel: true,
    showUniversityOrFaculty: true,
    showTeachingExperienceStartDate: true,
    showTeachingExperienceEndDate: true,
  },
  generalExperiences: {
    showGeneralExperiences: true,
    showExperienceTitle: true,
    showAuthority: true,
    showCountryOrCity: true,
    showStartDate: true,
    showEndDate: true,
  },
  scientificWritings: {
    showScientificWritings: true,
    showTitle: true,
    showAuthorRole: true,
    showISBN: true,
    showPublishingHouse: true,
    showPublishingDate: true,
  },
  patents: {
    showPatents: true,
    showNameOfPatent: true,
    showAccreditingAuthorityOrCountry: true,
    showAccreditationDate: true,
  },
  prizesAndRewards: {
    showPrizesAndRewards: true,
    showPrizeName: true,
    showawardingAuthority: true,
    showDateReceived: true,
  },
  manifestationsOfScientificAppreciation: {
    showManifestationsOfScientificAppreciation: true,
    showTitleOfAppreciation: true,
    showIssuingAuthority: true,
    showDateOfAppreciation: true,
  },
  contributionsToCommunityService: {
    showContributionsToCommunityService: true,
    showContributionTitle: true,
    showDateOfContribution: true,
  },
  contributionsToUniversity: {
    showContributionsToUniversity: true,
    showContributionTitle: true,
    showTypeOfContribution: true,
    showDateOfContribution: true,
  },
  participationInQualityWork: {
    showparticipationsInQualityWork: true,
    showparticipationTitle: true,
    showParticipationStartDate: true,
    showParticipationEndDate: true,
  },
};

export { defaultVisibility };

export default function useCVManage() {
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const toggle = (section, field) => {
    setVisibility((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateCVVisibility(visibility);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { visibility, toggle, save, loading, error, success, setSuccess };
}
