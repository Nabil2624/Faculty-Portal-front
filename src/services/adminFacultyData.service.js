import axiosInstance from "../utils/axiosInstance";

// ─── General Experiences ──────────────────────────────────────────────────────

export const adminGetGeneralExperiences = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/GeneralExperiences`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminGetGeneralExperienceById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/GeneralExperiences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateGeneralExperience = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/GeneralExperiences/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteGeneralExperience = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/GeneralExperiences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminAddGeneralExperience = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/GeneralExperiences`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Teaching Experiences ─────────────────────────────────────────────────────

export const adminGetTeachingExperiences = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/TeachingExperiences`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminGetTeachingExperienceById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/TeachingExperiences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateTeachingExperience = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/TeachingExperiences/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteTeachingExperience = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/TeachingExperiences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminAddTeachingExperience = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/TeachingExperiences`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Manifestations of Scientific Appreciation ───────────────────────────────

export const adminGetManifestations = (email, params = {}) =>
  axiosInstance.get(
    `/Admin/FacultyMember/ManifestationsOfScientificAppreciation`,
    {
      params: { FacultyMemberEmail: email, PageSize: 100, ...params },
      skipGlobalErrorHandler: true,
    },
  );

export const adminGetManifestationById = (id, memberEmail) =>
  axiosInstance.get(
    `/Admin/FacultyMember/ManifestationsOfScientificAppreciation/${id}`,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminUpdateManifestation = (id, memberEmail, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/ManifestationsOfScientificAppreciation/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteManifestation = (id, memberEmail) =>
  axiosInstance.delete(
    `/Admin/FacultyMember/ManifestationsOfScientificAppreciation/${id}`,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminAddManifestation = (facultyMemberEmail, data) =>
  axiosInstance.post(
    `/Admin/FacultyMember/ManifestationsOfScientificAppreciation`,
    data,
    { params: { facultyMemberEmail }, skipGlobalErrorHandler: true },
  );

export const adminUploadManifestationAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(`/Attachments/${entityId}?context=5`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const adminDeleteManifestationAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(`/Attachments/${entityId}/${attachmentId}?context=5`, {
    skipGlobalErrorHandler: true,
  });

// ─── Prizes & Rewards ─────────────────────────────────────────────────────────

export const adminGetPrizesAndRewards = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/PrizesAndRewards`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminGetPrizeOrRewardById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/PrizesAndRewards/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdatePrizeOrReward = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/PrizesAndRewards/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeletePrizeOrReward = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/PrizesAndRewards/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminAddPrizeOrReward = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/PrizesAndRewards`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetRewardLookups = () =>
  axiosInstance.get(`/LookUpItems/Rewards`, { skipGlobalErrorHandler: true });

export const adminUploadPrizeAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(`/Attachments/${entityId}?context=6`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const adminDeletePrizeAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(`/Attachments/${entityId}/${attachmentId}?context=6`, {
    skipGlobalErrorHandler: true,
  });

// ─── Contributions to Community Service ──────────────────────────────────────

export const adminGetCommunityServiceContributions = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ContributionsToCommunityService`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddCommunityServiceContribution = (
  facultyMemberEmail,
  data,
) =>
  axiosInstance.post(
    `/Admin/FacultyMember/ContributionsToCommunityService`,
    data,
    {
      params: { facultyMemberEmail },
      skipGlobalErrorHandler: true,
    },
  );

export const adminGetCommunityServiceContributionById = (id, memberEmail) =>
  axiosInstance.get(
    `/Admin/FacultyMember/ContributionsToCommunityService/${id}`,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminUpdateCommunityServiceContribution = (
  id,
  memberEmail,
  data,
) =>
  axiosInstance.put(
    `/Admin/FacultyMember/ContributionsToCommunityService/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteCommunityServiceContribution = (id, memberEmail) =>
  axiosInstance.delete(
    `/Admin/FacultyMember/ContributionsToCommunityService/${id}`,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

// ─── Contributions to University ─────────────────────────────────────────────

export const adminGetUniversityContributions = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ContributionsToUniversity`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddUniversityContribution = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ContributionsToUniversity`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetUniversityContributionById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ContributionsToUniversity/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateUniversityContribution = (id, memberEmail, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/ContributionsToUniversity/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteUniversityContribution = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/ContributionsToUniversity/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Participation in Quality Works ──────────────────────────────────────────

export const adminGetParticipationInQualityWorks = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ParticipationInQualityWorks`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddParticipationInQualityWorks = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ParticipationInQualityWorks`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetParticipationInQualityWorksById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ParticipationInQualityWorks/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateParticipationInQualityWorks = (id, memberEmail, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/ParticipationInQualityWorks/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteParticipationInQualityWorks = (id, memberEmail) =>
  axiosInstance.delete(
    `/Admin/FacultyMember/ParticipationInQualityWorks/${id}`,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

// ─── Scientific Missions ──────────────────────────────────────────────────────

export const adminGetScientificMissions = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ScientificMissions`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddScientificMission = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ScientificMissions`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetScientificMissionById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ScientificMissions/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateScientificMission = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/ScientificMissions/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteScientificMission = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/ScientificMissions/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Seminars & Conferences ───────────────────────────────────────────────────

export const adminGetSeminarsAndConferences = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/SeminarsAndConferences`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddSeminarOrConference = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/SeminarsAndConferences`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetSeminarOrConferenceById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/SeminarsAndConferences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateSeminarOrConference = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/SeminarsAndConferences/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteSeminarOrConference = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/SeminarsAndConferences/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUploadSeminarAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(
    `/Attachments/${entityId}?context=ConferenceOrSeminar`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

export const adminDeleteSeminarAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=ConferenceOrSeminar`,
    {
      skipGlobalErrorHandler: true,
    },
  );

// ─── Training Programs ────────────────────────────────────────────────────────

export const adminGetTrainingPrograms = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/TrainingPrograms`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddTrainingProgram = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/TrainingPrograms`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetTrainingProgramById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/TrainingPrograms/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateTrainingProgram = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/TrainingPrograms/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteTrainingProgram = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/TrainingPrograms/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Lookups for contributions & missions ─────────────────────────────────────

export const adminGetContributionTypeLookups = () =>
  axiosInstance.get(`/LookUpItems/ContributionTypes`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetSeminarParticipationTypes = () =>
  axiosInstance.get(`/LookUpItems/SeminarParticipationTypes`, {
    skipGlobalErrorHandler: true,
  });

// ─── Committees & Associations ────────────────────────────────────────────────

export const adminGetCommitteesAndAssociations = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/CommitteesAndAssociations`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddCommitteeOrAssociation = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/CommitteesAndAssociations`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetCommitteeOrAssociationById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/CommitteesAndAssociations/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateCommitteeOrAssociation = (id, memberEmail, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/CommitteesAndAssociations/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteCommitteeOrAssociation = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/CommitteesAndAssociations/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetCommitteeTypeLookups = () =>
  axiosInstance.get(`/LookUpItems/TypesofCommittee`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetCommitteeDegreeLookups = () =>
  axiosInstance.get(`/LookUpItems/CommitteeParticipationDegrees`, {
    skipGlobalErrorHandler: true,
  });

// ─── Participation in Magazines ───────────────────────────────────────────────

export const adminGetParticipationInMagazines = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ParticipationInMagazines`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddParticipationInMagazine = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ParticipationInMagazines`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetParticipationInMagazineById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ParticipationInMagazines/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateParticipationInMagazine = (id, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/ParticipationInMagazines/${id}`,
    data,
    { skipGlobalErrorHandler: true },
  );

export const adminDeleteParticipationInMagazine = (id) =>
  axiosInstance.delete(`/Admin/FacultyMember/ParticipationInMagazines/${id}`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetMagazineParticipationRoles = () =>
  axiosInstance.get(`/LookUpItems/MagazineParticipationRoles`, {
    skipGlobalErrorHandler: true,
  });

// ─── Projects ─────────────────────────────────────────────────────────────────

export const adminGetProjects = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/Projects`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddProject = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/Projects`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetProjectById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/Projects/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateProject = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/Projects/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteProject = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/Projects/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetProjectTypeLookups = () =>
  axiosInstance.get(`/LookUpItems/ProjectTypes`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetProjectRoleLookups = () =>
  axiosInstance.get(`/LookUpItems/ProjectRoles`, {
    skipGlobalErrorHandler: true,
  });

// ─── Reviewing Articles ────────────────────────────────────────────────────────

export const adminGetReviewingArticles = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ReviewingArticles`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddReviewingArticle = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ReviewingArticles`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetReviewingArticleById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ReviewingArticles/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateReviewingArticle = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/ReviewingArticles/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteReviewingArticle = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/ReviewingArticles/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Academic Qualifications ──────────────────────────────────────────────────

export const adminGetAcademicQualifications = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/AcademicQualifications`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddAcademicQualification = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/AcademicQualifications`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetAcademicQualificationById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/AcademicQualifications/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateAcademicQualification = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/AcademicQualifications/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteAcademicQualification = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/AcademicQualifications/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetAcademicQualificationLookups = () =>
  axiosInstance.get(`/LookUpItems/AcademicQualifications`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetDispatchTypeLookups = () =>
  axiosInstance.get(`/LookUpItems/DispatchTypes`, {
    skipGlobalErrorHandler: true,
  });

export const adminGetAcademicGradeLookups = () =>
  axiosInstance.get(`/LookUpItems/AcademicGrades`, {
    skipGlobalErrorHandler: true,
  });

export const adminUploadAcademicQualificationAttachments = (
  entityId,
  files,
) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(
    `/Attachments/${entityId}?context=AcademicQualification`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const adminDeleteAcademicQualificationAttachment = (
  entityId,
  attachmentId,
) =>
  axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=AcademicQualification`,
    { skipGlobalErrorHandler: true },
  );

// ─── Administrative Positions ─────────────────────────────────────────────────

export const adminGetAdministrativePositions = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/AdministrativePositions`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddAdministrativePosition = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/AdministrativePositions`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetAdministrativePositionById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/AdministrativePositions/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateAdministrativePosition = (id, memberEmail, data) =>
  axiosInstance.put(
    `/Admin/FacultyMember/AdministrativePositions/${id}`,
    data,
    { params: { memberEmail }, skipGlobalErrorHandler: true },
  );

export const adminDeleteAdministrativePosition = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/AdministrativePositions/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

// ─── Job Ranks ────────────────────────────────────────────────────────────────

export const adminGetJobRanks = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/JobRanks`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddJobRank = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/JobRanks`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetJobRankById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/JobRanks/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateJobRank = (id, facultyMemberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/JobRanks/${id}`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteJobRank = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/JobRanks/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetJobRankLookups = () =>
  axiosInstance.get(`/LookUpItems/EmploymentDegrees`, {
    skipGlobalErrorHandler: true,
  });

// ─── Patents ──────────────────────────────────────────────────────────────────

export const adminGetPatents = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/Patents`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddPatent = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/Patents`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetPatentById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/Patents/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdatePatent = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/Patents/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeletePatent = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/Patents/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUploadPatentAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(
    `/Attachments/${entityId}?context=Patent`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

export const adminDeletePatentAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=Patent`,
    { skipGlobalErrorHandler: true },
  );

// ─── Scientific Writings ──────────────────────────────────────────────────────

export const adminGetScientificWritings = (email, params = {}) =>
  axiosInstance.get(`/Admin/FacultyMember/ScientificWritings`, {
    params: { FacultyMemberEmail: email, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddScientificWriting = (facultyMemberEmail, data) =>
  axiosInstance.post(`/Admin/FacultyMember/ScientificWritings`, data, {
    params: { facultyMemberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetScientificWritingById = (id, memberEmail) =>
  axiosInstance.get(`/Admin/FacultyMember/ScientificWritings/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateScientificWriting = (id, memberEmail, data) =>
  axiosInstance.put(`/Admin/FacultyMember/ScientificWritings/${id}`, data, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminDeleteScientificWriting = (id, memberEmail) =>
  axiosInstance.delete(`/Admin/FacultyMember/ScientificWritings/${id}`, {
    params: { memberEmail },
    skipGlobalErrorHandler: true,
  });

export const adminGetAuthorRolesLookup = () =>
  axiosInstance.get(`/LookUpItems/AuthorRoles`, {
    skipGlobalErrorHandler: true,
  });

// ─── Researcher Profile ───────────────────────────────────────────────────────

export const adminGetResearcherProfile = (memberId) =>
  axiosInstance.get(
    `/Admin/Admin/FacultyMember/Researches/ResearcherProfile/${memberId}`,
    { params: { memberId }, skipGlobalErrorHandler: true },
  );

// ─── Researches (Admin) ───────────────────────────────────────────────────────

export const adminGetResearches = (facultyMemberId, params = {}) =>
  axiosInstance.get(`/Admin/Admin/FacultyMember/Researches`, {
    params: { FacultyMemberId: facultyMemberId, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddResearch = (facultyMemberId, data) =>
  axiosInstance.post(`/Admin/Admin/FacultyMember/Researches`, data, {
    params: { facultyMemberId },
    skipGlobalErrorHandler: true,
  });

export const adminGetResearchById = (researchId, facultyMemberId) =>
  axiosInstance.get(`/Admin/Admin/FacultyMember/Researches/${researchId}`, {
    params: { facultyMemberId },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateResearch = (researchId, facultyMemberId, data) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/Researches/${researchId}`,
    data,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminDeleteResearch = (researchId, facultyMemberId) =>
  axiosInstance.delete(`/Admin/Admin/FacultyMember/Researches/${researchId}`, {
    params: { facultyMemberId },
    skipGlobalErrorHandler: true,
  });

export const adminGetRecommendedResearches = (
  facultyMemberId,
  pageIndex = 1,
  pageSize = 9,
  searchTerm = "",
) =>
  axiosInstance.get(`/Admin/Admin/FacultyMember/Researches/Recommended`, {
    params: {
      FacultyMemberId: facultyMemberId,
      PageIndex: pageIndex,
      PageSize: pageSize,
      ...(searchTerm ? { Search: searchTerm } : {}),
    },
    skipGlobalErrorHandler: true,
  });

export const adminConfirmResearch = (researchId, facultyMemberId) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/Researches/${researchId}/Confirm`,
    null,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminRejectResearch = (researchId, facultyMemberId) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/Researches/${researchId}/Reject`,
    null,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminUploadResearchAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(
    `/Attachments/${entityId}?context=Research`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

export const adminDeleteResearchAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=Research`,
    { skipGlobalErrorHandler: true },
  );

// ─── Search utilities ─────────────────────────────────────────────────────────

export const adminSearchResearchByDOI = (doi) =>
  axiosInstance.get(`/ResearchesAndTheses/ResearchSearchDOI`, {
    params: { doi },
    skipGlobalErrorHandler: true,
  });

export const adminGetContributorByORCID = (orcid) =>
  axiosInstance.get(`/ResearchesAndTheses/ContributorDataWithORCID`, {
    params: { orcid },
    skipGlobalErrorHandler: true,
  });

export const adminSearchResearchByTitle = (title) =>
  axiosInstance.get(`/ResearchesAndTheses/ResearchFindByTitle`, {
    params: { title },
    skipGlobalErrorHandler: true,
  });

// ─── ThesesSupervisings (Admin) ───────────────────────────────────────────────

export const adminGetThesesSupervisings = (facultyMemberId, params = {}) =>
  axiosInstance.get(
    `/Admin/Admin/FacultyMember/HigherStudies/ThesesSupervisings`,
    {
      params: { FacultyMemberId: facultyMemberId, PageSize: 100, ...params },
      skipGlobalErrorHandler: true,
    },
  );

export const adminAddThesisSupervising = (facultyMemberId, data) =>
  axiosInstance.post(
    `/Admin/Admin/FacultyMember/HigherStudies/ThesesSupervisings`,
    data,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminGetThesesSupervisingById = (id, facultyMemberId) =>
  axiosInstance.get(
    `/Admin/Admin/FacultyMember/HigherStudies/ThesesSupervisings/${id}`,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminUpdateThesisSupervising = (id, facultyMemberId, data) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/HigherStudies/ThesesSupervisings/${id}`,
    data,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminDeleteThesisSupervising = (id, facultyMemberId) =>
  axiosInstance.delete(
    `/Admin/Admin/FacultyMember/HigherStudies/ThesesSupervisings/${id}`,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

// ─── RecommendedThesesSupervisings (Admin) ────────────────────────────────────

export const adminGetRecommendedThesesSupervisings = (
  facultyMemberId,
  params = {},
) =>
  axiosInstance.get(
    `/Admin/Admin/FacultyMember/HigherStudies/RecommendedThesesSupervisings`,
    {
      params: { FacultyMemberId: facultyMemberId, PageSize: 100, ...params },
      skipGlobalErrorHandler: true,
    },
  );

export const adminGetRecommendedThesisSupervising = (id, facultyMemberId) =>
  axiosInstance.get(
    `/Admin/Admin/FacultyMember/HigherStudies/RecommendedThesesSupervisings/${id}`,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminAcceptThesisSupervising = (thesisId, facultyMemberId) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/HigherStudies/RecommendedThesesSupervisings/${thesisId}/Accept`,
    null,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminRejectThesisSupervising = (thesisId, facultyMemberId) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/HigherStudies/RecommendedThesesSupervisings/${thesisId}/Reject`,
    null,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

// ─── Theses (Admin) ───────────────────────────────────────────────────────────

export const adminGetTheses = (facultyMemberId, params = {}) =>
  axiosInstance.get(`/Admin/Admin/FacultyMember/HigherStudies/Theses`, {
    params: { FacultyMemberId: facultyMemberId, PageSize: 100, ...params },
    skipGlobalErrorHandler: true,
  });

export const adminAddThesis = (facultyMemberId, data) =>
  axiosInstance.post(`/Admin/Admin/FacultyMember/HigherStudies/Theses`, data, {
    params: { facultyMemberId },
    skipGlobalErrorHandler: true,
  });

export const adminGetThesisById = (id, facultyMemberId) =>
  axiosInstance.get(`/Admin/Admin/FacultyMember/HigherStudies/Theses/${id}`, {
    params: { facultyMemberId },
    skipGlobalErrorHandler: true,
  });

export const adminUpdateThesis = (id, facultyMemberId, data) =>
  axiosInstance.put(
    `/Admin/Admin/FacultyMember/HigherStudies/Theses/${id}`,
    data,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminDeleteThesis = (id, facultyMemberId) =>
  axiosInstance.delete(
    `/Admin/Admin/FacultyMember/HigherStudies/Theses/${id}`,
    { params: { facultyMemberId }, skipGlobalErrorHandler: true },
  );

export const adminUploadThesisAttachments = (entityId, files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return axiosInstance.post(
    `/Attachments/${entityId}?context=Thesis`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

export const adminDeleteThesisAttachment = (entityId, attachmentId) =>
  axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=Thesis`,
    { skipGlobalErrorHandler: true },
  );

// ─── Lookups for Higher Studies ───────────────────────────────────────────────

export const adminGetUniversitiesLookup = () =>
  axiosInstance.get(`/LookUpItems/Universities`, {
    skipGlobalErrorHandler: true,
  });
