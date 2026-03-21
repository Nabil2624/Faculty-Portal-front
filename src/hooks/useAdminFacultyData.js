import { useState, useCallback, useEffect } from "react";
import {
  adminGetGeneralExperiences,
  adminUpdateGeneralExperience,
  adminDeleteGeneralExperience,
  adminAddGeneralExperience,
  adminGetTeachingExperiences,
  adminUpdateTeachingExperience,
  adminDeleteTeachingExperience,
  adminAddTeachingExperience,
  adminGetManifestations,
  adminUpdateManifestation,
  adminDeleteManifestation,
  adminAddManifestation,
  adminUploadManifestationAttachments,
  adminDeleteManifestationAttachment,
  adminGetPrizesAndRewards,
  adminUpdatePrizeOrReward,
  adminDeletePrizeOrReward,
  adminAddPrizeOrReward,
  adminGetRewardLookups,
  adminUploadPrizeAttachments,
  adminDeletePrizeAttachment,
  // Contributions
  adminGetCommunityServiceContributions,
  adminAddCommunityServiceContribution,
  adminUpdateCommunityServiceContribution,
  adminDeleteCommunityServiceContribution,
  adminGetUniversityContributions,
  adminAddUniversityContribution,
  adminUpdateUniversityContribution,
  adminDeleteUniversityContribution,
  adminGetParticipationInQualityWorks,
  adminAddParticipationInQualityWorks,
  adminUpdateParticipationInQualityWorks,
  adminDeleteParticipationInQualityWorks,
  adminGetContributionTypeLookups,
  // Missions
  adminGetScientificMissions,
  adminAddScientificMission,
  adminUpdateScientificMission,
  adminDeleteScientificMission,
  adminGetSeminarsAndConferences,
  adminAddSeminarOrConference,
  adminUpdateSeminarOrConference,
  adminDeleteSeminarOrConference,
  adminUploadSeminarAttachments,
  adminDeleteSeminarAttachment,
  adminGetTrainingPrograms,
  adminAddTrainingProgram,
  adminUpdateTrainingProgram,
  adminDeleteTrainingProgram,
  adminGetSeminarParticipationTypes,
  // Projects & Committees
  adminGetCommitteesAndAssociations,
  adminAddCommitteeOrAssociation,
  adminUpdateCommitteeOrAssociation,
  adminDeleteCommitteeOrAssociation,
  adminGetCommitteeTypeLookups,
  adminGetCommitteeDegreeLookups,
  adminGetParticipationInMagazines,
  adminAddParticipationInMagazine,
  adminUpdateParticipationInMagazine,
  adminDeleteParticipationInMagazine,
  adminGetMagazineParticipationRoles,
  adminGetProjects,
  adminAddProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetProjectTypeLookups,
  adminGetProjectRoleLookups,
  adminGetReviewingArticles,
  adminAddReviewingArticle,
  adminUpdateReviewingArticle,
  adminDeleteReviewingArticle,
  // Scientific Progressions
  adminGetAcademicQualifications,
  adminAddAcademicQualification,
  adminUpdateAcademicQualification,
  adminDeleteAcademicQualification,
  adminGetAcademicQualificationLookups,
  adminGetDispatchTypeLookups,
  adminGetAcademicGradeLookups,
  adminUploadAcademicQualificationAttachments,
  adminDeleteAcademicQualificationAttachment,
  adminGetAdministrativePositions,
  adminAddAdministrativePosition,
  adminUpdateAdministrativePosition,
  adminDeleteAdministrativePosition,
  adminGetJobRanks,
  adminAddJobRank,
  adminUpdateJobRank,
  adminDeleteJobRank,
  adminGetJobRankLookups,
  // Patents & Scientific Writings
  adminGetPatents,
  adminAddPatent,
  adminUpdatePatent,
  adminDeletePatent,
  adminUploadPatentAttachments,
  adminDeletePatentAttachment,
  adminGetScientificWritings,
  adminAddScientificWriting,
  adminUpdateScientificWriting,
  adminDeleteScientificWriting,
  adminGetAuthorRolesLookup,
  // Researches & Higher Studies
  adminGetThesesSupervisings,
  adminAddThesisSupervising,
  adminUpdateThesisSupervising,
  adminDeleteThesisSupervising,
  adminGetRecommendedThesesSupervisings,
  adminAcceptThesisSupervising,
  adminRejectThesisSupervising,
} from "../services/adminFacultyData.service";

// ─── Sub-module loaders keyed by subModule string ────────────────────────────
export const PAGE_SIZE = 10;

const toPage = (r) => ({
  data: Array.isArray(r.data?.data) ? r.data.data : [],
  totalCount: r.data?.totalCount || 0,
});

const LOADERS = {
  generalExperiences: (email, _userId, page, pageSize) =>
    adminGetGeneralExperiences(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  teachingExperiences: (email, _userId, page, pageSize) =>
    adminGetTeachingExperiences(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  manifestations: (email, _userId, page, pageSize) =>
    adminGetManifestations(email, { PageIndex: page, PageSize: pageSize }).then(
      toPage,
    ),
  prizesAndRewards: (email, _userId, page, pageSize) =>
    adminGetPrizesAndRewards(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  // Contributions
  communityServiceContributions: (email, _userId, page, pageSize) =>
    adminGetCommunityServiceContributions(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  universityContributions: (email, _userId, page, pageSize) =>
    adminGetUniversityContributions(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  participationInQualityWorks: (email, _userId, page, pageSize) =>
    adminGetParticipationInQualityWorks(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  // Missions
  scientificMissions: (email, _userId, page, pageSize) =>
    adminGetScientificMissions(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  seminarsAndConferences: (email, _userId, page, pageSize) =>
    adminGetSeminarsAndConferences(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  trainingPrograms: (email, _userId, page, pageSize) =>
    adminGetTrainingPrograms(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  // Projects & Committees
  committeesAndAssociations: (email, _userId, page, pageSize) =>
    adminGetCommitteesAndAssociations(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  participationInMagazines: (email, _userId, page, pageSize) =>
    adminGetParticipationInMagazines(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  projects: (email, _userId, page, pageSize) =>
    adminGetProjects(email, { PageIndex: page, PageSize: pageSize }).then(
      toPage,
    ),
  reviewingArticles: (email, _userId, page, pageSize) =>
    adminGetReviewingArticles(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  // Scientific Progressions
  academicQualifications: (email, _userId, page, pageSize) =>
    adminGetAcademicQualifications(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  administrativePositions: (email, _userId, page, pageSize) =>
    adminGetAdministrativePositions(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  jobRanks: (email, _userId, page, pageSize) =>
    adminGetJobRanks(email, { PageIndex: page, PageSize: pageSize }).then(
      toPage,
    ),
  // Patents & Scientific Writings
  patents: (email, _userId, page, pageSize) =>
    adminGetPatents(email, { PageIndex: page, PageSize: pageSize }).then(
      toPage,
    ),
  scientificWritings: (email, _userId, page, pageSize) =>
    adminGetScientificWritings(email, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  // Researches & Higher Studies (use userId as second arg)
  thesesSupervisings: (_email, userId, page, pageSize) =>
    adminGetThesesSupervisings(userId, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
  recommendedThesesSupervisings: (_email, userId, page, pageSize) =>
    adminGetRecommendedThesesSupervisings(userId, {
      PageIndex: page,
      PageSize: pageSize,
    }).then(toPage),
};

/**
 * useAdminFacultyData
 *
 * @param {string} userId   - the faculty member's user ID
 * @param {string} userEmail - the faculty member's email (needed for add endpoints)
 * @param {string} subModule - one of: generalExperiences | teachingExperiences | manifestations | prizesAndRewards
 */
export default function useAdminFacultyData(userId, userEmail, subModule) {
  const [items, setItems] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Reward lookups (only for prizesAndRewards) ───────────────────────────
  const [rewardLookups, setRewardLookups] = useState([]);
  // ─── Contribution type lookups ────────────────────────────────────────────
  const [contributionTypeLookups, setContributionTypeLookups] = useState([]);
  // ─── Seminar participation type lookups ───────────────────────────────────
  const [seminarParticipationTypes, setSeminarParticipationTypes] = useState(
    [],
  );
  // ─── Committee lookups ────────────────────────────────────────────────────
  const [committeeTypeLookups, setCommitteeTypeLookups] = useState([]);
  const [committeeDegreeLookups, setCommitteeDegreeLookups] = useState([]);
  // ─── Magazine participation role lookups ──────────────────────────────────
  const [magazineParticipationRoles, setMagazineParticipationRoles] = useState(
    [],
  );
  // ─── Project lookups ──────────────────────────────────────────────────────
  const [projectTypeLookups, setProjectTypeLookups] = useState([]);
  const [projectRoleLookups, setProjectRoleLookups] = useState([]);
  // ─── Academic qualification lookups ──────────────────────────────────────
  const [academicQualificationLookups, setAcademicQualificationLookups] =
    useState([]);
  const [dispatchTypeLookups, setDispatchTypeLookups] = useState([]);
  const [academicGradeLookups, setAcademicGradeLookups] = useState([]);
  // ─── Job rank lookups ─────────────────────────────────────────────────────
  const [jobRankLookups, setJobRankLookups] = useState([]);
  // ─── Author role lookups (scientificWritings) ─────────────────────────────
  const [authorRoleLookups, setAuthorRoleLookups] = useState([]);

  // ─── Modal state ──────────────────────────────────────────────────────────
  const [editItem, setEditItem] = useState(null); // item being edited (null = add mode)
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── Submission loading ───────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = useCallback((key, type = "success") => {
    setToast({ key, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Load data ────────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (page) => {
      if (!userEmail || !subModule) return;
      const loader = LOADERS[subModule];
      if (!loader) return;
      setLoading(true);
      setError(null);
      try {
        const { data, totalCount: tc } = await loader(
          userEmail,
          userId,
          page,
          PAGE_SIZE,
        );
        setItems(data);
        setTotalCount(tc);
      } catch (err) {
        setError(err?.response?.data?.ErrorMessage || err?.message || "error");
      } finally {
        setLoading(false);
      }
    },
    [userEmail, userId, subModule],
  );

  // Reset to page 1 whenever the subject or user changes
  useEffect(() => {
    setPageIndex(1);
    setTotalCount(0);
    fetchPage(1);
  }, [fetchPage]);

  // loadData reloads the current page (used by refresh button & post-mutation)
  const loadData = useCallback(
    () => fetchPage(pageIndex),
    [fetchPage, pageIndex],
  );

  const goToPage = useCallback(
    (page) => {
      setPageIndex(page);
      fetchPage(page);
    },
    [fetchPage],
  );

  // Load reward lookups when subModule is prizesAndRewards
  useEffect(() => {
    if (subModule === "prizesAndRewards") {
      adminGetRewardLookups()
        .then((r) => setRewardLookups(Array.isArray(r.data) ? r.data : []))
        .catch(() => setRewardLookups([]));
    }
  }, [subModule]);

  // Load contribution type lookups for universityContributions
  useEffect(() => {
    if (subModule === "universityContributions") {
      adminGetContributionTypeLookups()
        .then((r) =>
          setContributionTypeLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setContributionTypeLookups([]));
    }
  }, [subModule]);

  // Load seminar participation types for seminarsAndConferences
  useEffect(() => {
    if (subModule === "seminarsAndConferences") {
      adminGetSeminarParticipationTypes()
        .then((r) =>
          setSeminarParticipationTypes(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setSeminarParticipationTypes([]));
    }
  }, [subModule]);

  // Load committee lookups for committeesAndAssociations
  useEffect(() => {
    if (subModule === "committeesAndAssociations") {
      adminGetCommitteeTypeLookups()
        .then((r) =>
          setCommitteeTypeLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setCommitteeTypeLookups([]));
      adminGetCommitteeDegreeLookups()
        .then((r) =>
          setCommitteeDegreeLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setCommitteeDegreeLookups([]));
    }
  }, [subModule]);

  // Load magazine participation role lookups
  useEffect(() => {
    if (subModule === "participationInMagazines") {
      adminGetMagazineParticipationRoles()
        .then((r) =>
          setMagazineParticipationRoles(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setMagazineParticipationRoles([]));
    }
  }, [subModule]);

  // Load project lookups for projects
  useEffect(() => {
    if (subModule === "projects") {
      adminGetProjectTypeLookups()
        .then((r) => setProjectTypeLookups(Array.isArray(r.data) ? r.data : []))
        .catch(() => setProjectTypeLookups([]));
      adminGetProjectRoleLookups()
        .then((r) => setProjectRoleLookups(Array.isArray(r.data) ? r.data : []))
        .catch(() => setProjectRoleLookups([]));
    }
  }, [subModule]);

  // Load academic qualification lookups
  useEffect(() => {
    if (
      subModule === "academicQualifications" ||
      subModule === "thesesSupervisings" ||
      subModule === "recommendedThesesSupervisings"
    ) {
      adminGetAcademicQualificationLookups()
        .then((r) =>
          setAcademicQualificationLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setAcademicQualificationLookups([]));
      adminGetDispatchTypeLookups()
        .then((r) =>
          setDispatchTypeLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setDispatchTypeLookups([]));
      adminGetAcademicGradeLookups()
        .then((r) =>
          setAcademicGradeLookups(Array.isArray(r.data) ? r.data : []),
        )
        .catch(() => setAcademicGradeLookups([]));
    }
  }, [subModule]);

  // Load job rank lookups
  useEffect(() => {
    if (subModule === "jobRanks") {
      adminGetJobRankLookups()
        .then((r) => setJobRankLookups(Array.isArray(r.data) ? r.data : []))
        .catch(() => setJobRankLookups([]));
    }
  }, [subModule]);

  // Load author role lookups for scientificWritings
  useEffect(() => {
    if (subModule === "scientificWritings") {
      adminGetAuthorRolesLookup()
        .then((r) => setAuthorRoleLookups(Array.isArray(r.data) ? r.data : []))
        .catch(() => setAuthorRoleLookups([]));
    }
  }, [subModule]);

  // ─── Open add modal ───────────────────────────────────────────────────────
  const openAdd = useCallback(() => {
    setEditItem(null);
    setAddOpen(true);
  }, []);

  const closeAdd = useCallback(() => setAddOpen(false), []);

  // ─── Open edit modal ──────────────────────────────────────────────────────
  const openEdit = useCallback((item) => {
    setEditItem(item);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditItem(null);
  }, []);

  // ─── Open delete confirmation ─────────────────────────────────────────────
  const openDelete = useCallback((item) => setDeleteTarget(item), []);
  const closeDelete = useCallback(() => setDeleteTarget(null), []);

  // ─── Save (add or update) ─────────────────────────────────────────────────
  const save = useCallback(
    async (formData, attachments = [], mode = "add") => {
      setSaving(true);
      try {
        if (mode === "add") {
          let newItem;
          if (subModule === "generalExperiences") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddGeneralExperience(userEmail, payload);
            newItem = r.data;
          } else if (subModule === "teachingExperiences") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddTeachingExperience(userEmail, payload);
            newItem = r.data;
          } else if (subModule === "manifestations") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddManifestation(userEmail, payload);
            newItem = r.data;
            if (attachments.length > 0 && newItem?.id) {
              await adminUploadManifestationAttachments(
                newItem.id,
                attachments,
              );
            }
          } else if (subModule === "prizesAndRewards") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddPrizeOrReward(userEmail, payload);
            newItem = r.data;
            if (attachments.length > 0 && newItem?.id) {
              await adminUploadPrizeAttachments(newItem.id, attachments);
            }
          } else if (subModule === "communityServiceContributions") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddCommunityServiceContribution(userEmail, payload);
          } else if (subModule === "universityContributions") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddUniversityContribution(userEmail, payload);
          } else if (subModule === "participationInQualityWorks") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddParticipationInQualityWorks(userEmail, payload);
          } else if (subModule === "scientificMissions") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddScientificMission(userEmail, payload);
          } else if (subModule === "seminarsAndConferences") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddSeminarOrConference(userEmail, payload);
            newItem = r.data;
            if (attachments.length > 0 && newItem?.id) {
              await adminUploadSeminarAttachments(newItem.id, attachments);
            }
          } else if (subModule === "trainingPrograms") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddTrainingProgram(userEmail, payload);
          } else if (subModule === "committeesAndAssociations") {
            const payload = { ...formData, facultyMemeberId: userId };
            await adminAddCommitteeOrAssociation(userEmail, payload);
          } else if (subModule === "participationInMagazines") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddParticipationInMagazine(userEmail, payload);
          } else if (subModule === "projects") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddProject(userEmail, payload);
          } else if (subModule === "reviewingArticles") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddReviewingArticle(userEmail, payload);
          } else if (subModule === "academicQualifications") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddAcademicQualification(userEmail, payload);
            const newItem = r.data;
            if (attachments.length > 0 && newItem?.id) {
              await adminUploadAcademicQualificationAttachments(
                newItem.id,
                attachments,
              );
            }
          } else if (subModule === "administrativePositions") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddAdministrativePosition(userEmail, payload);
          } else if (subModule === "jobRanks") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddJobRank(userEmail, payload);
          } else if (subModule === "patents") {
            const payload = { ...formData, facultyMemberId: userId };
            const r = await adminAddPatent(userEmail, payload);
            newItem = r.data;
            if (attachments.length > 0 && newItem?.id) {
              await adminUploadPatentAttachments(newItem.id, attachments);
            }
          } else if (subModule === "scientificWritings") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddScientificWriting(userEmail, payload);
          } else if (subModule === "thesesSupervisings") {
            const payload = { ...formData, facultyMemberId: userId };
            await adminAddThesisSupervising(userId, payload);
          }
          showToast("addSuccess");
          setAddOpen(false);
        } else {
          // edit mode
          if (subModule === "generalExperiences") {
            await adminUpdateGeneralExperience(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "teachingExperiences") {
            await adminUpdateTeachingExperience(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "manifestations") {
            await adminUpdateManifestation(editItem.id, userEmail, formData);
            if (attachments.length > 0) {
              await adminUploadManifestationAttachments(
                editItem.id,
                attachments,
              );
            }
          } else if (subModule === "prizesAndRewards") {
            await adminUpdatePrizeOrReward(editItem.id, userEmail, formData);
            if (attachments.length > 0) {
              await adminUploadPrizeAttachments(editItem.id, attachments);
            }
          } else if (subModule === "communityServiceContributions") {
            await adminUpdateCommunityServiceContribution(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "universityContributions") {
            await adminUpdateUniversityContribution(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "participationInQualityWorks") {
            await adminUpdateParticipationInQualityWorks(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "scientificMissions") {
            await adminUpdateScientificMission(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "seminarsAndConferences") {
            await adminUpdateSeminarOrConference(
              editItem.id,
              userEmail,
              formData,
            );
            if (attachments.length > 0) {
              await adminUploadSeminarAttachments(editItem.id, attachments);
            }
          } else if (subModule === "trainingPrograms") {
            await adminUpdateTrainingProgram(editItem.id, userEmail, formData);
          } else if (subModule === "committeesAndAssociations") {
            await adminUpdateCommitteeOrAssociation(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "participationInMagazines") {
            await adminUpdateParticipationInMagazine(editItem.id, formData);
          } else if (subModule === "projects") {
            await adminUpdateProject(editItem.id, userEmail, formData);
          } else if (subModule === "reviewingArticles") {
            await adminUpdateReviewingArticle(editItem.id, userEmail, formData);
          } else if (subModule === "academicQualifications") {
            await adminUpdateAcademicQualification(
              editItem.id,
              userEmail,
              formData,
            );
            if (attachments.length > 0) {
              await adminUploadAcademicQualificationAttachments(
                editItem.id,
                attachments,
              );
            }
          } else if (subModule === "administrativePositions") {
            await adminUpdateAdministrativePosition(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "jobRanks") {
            await adminUpdateJobRank(editItem.id, userEmail, formData);
          } else if (subModule === "patents") {
            await adminUpdatePatent(editItem.id, userEmail, formData);
            if (attachments.length > 0) {
              await adminUploadPatentAttachments(editItem.id, attachments);
            }
          } else if (subModule === "scientificWritings") {
            await adminUpdateScientificWriting(
              editItem.id,
              userEmail,
              formData,
            );
          } else if (subModule === "thesesSupervisings") {
            await adminUpdateThesisSupervising(editItem.id, userId, formData);
          }
          showToast("editSuccess");
          setEditOpen(false);
          setEditItem(null);
        }
        await loadData();
      } catch (err) {
        if (err?.response?.status === 403) {
          showToast("forbidden", "error");
        } else {
          showToast(mode === "add" ? "addError" : "editError", "error");
        }
      } finally {
        setSaving(false);
      }
    },
    [subModule, userId, userEmail, editItem, loadData, showToast],
  );

  // ─── Confirm delete ───────────────────────────────────────────────────────
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (subModule === "generalExperiences")
        await adminDeleteGeneralExperience(deleteTarget.id, userEmail);
      else if (subModule === "teachingExperiences")
        await adminDeleteTeachingExperience(deleteTarget.id, userEmail);
      else if (subModule === "manifestations")
        await adminDeleteManifestation(deleteTarget.id, userEmail);
      else if (subModule === "prizesAndRewards")
        await adminDeletePrizeOrReward(deleteTarget.id, userEmail);
      else if (subModule === "communityServiceContributions")
        await adminDeleteCommunityServiceContribution(
          deleteTarget.id,
          userEmail,
        );
      else if (subModule === "universityContributions")
        await adminDeleteUniversityContribution(deleteTarget.id, userEmail);
      else if (subModule === "participationInQualityWorks")
        await adminDeleteParticipationInQualityWorks(
          deleteTarget.id,
          userEmail,
        );
      else if (subModule === "scientificMissions")
        await adminDeleteScientificMission(deleteTarget.id, userEmail);
      else if (subModule === "seminarsAndConferences")
        await adminDeleteSeminarOrConference(deleteTarget.id, userEmail);
      else if (subModule === "trainingPrograms")
        await adminDeleteTrainingProgram(deleteTarget.id, userEmail);
      else if (subModule === "committeesAndAssociations")
        await adminDeleteCommitteeOrAssociation(deleteTarget.id, userEmail);
      else if (subModule === "participationInMagazines")
        await adminDeleteParticipationInMagazine(deleteTarget.id);
      else if (subModule === "projects")
        await adminDeleteProject(deleteTarget.id, userEmail);
      else if (subModule === "reviewingArticles")
        await adminDeleteReviewingArticle(deleteTarget.id, userEmail);
      else if (subModule === "academicQualifications")
        await adminDeleteAcademicQualification(deleteTarget.id, userEmail);
      else if (subModule === "administrativePositions")
        await adminDeleteAdministrativePosition(deleteTarget.id, userEmail);
      else if (subModule === "jobRanks")
        await adminDeleteJobRank(deleteTarget.id, userEmail);
      else if (subModule === "patents")
        await adminDeletePatent(deleteTarget.id, userEmail);
      else if (subModule === "scientificWritings")
        await adminDeleteScientificWriting(deleteTarget.id, userEmail);
      else if (subModule === "thesesSupervisings")
        await adminDeleteThesisSupervising(deleteTarget.id, userId);
      showToast("deleteSuccess");
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      if (err?.response?.status === 403) {
        showToast("forbidden", "error");
      } else {
        showToast("deleteError", "error");
      }
    } finally {
      setDeleting(false);
    }
  }, [subModule, deleteTarget, loadData, showToast]);

  // ─── Accept / reject recommended items ───────────────────────────────────
  const acceptRecommended = useCallback(
    async (itemId) => {
      setSaving(true);
      try {
        if (subModule === "recommendedThesesSupervisings")
          await adminAcceptThesisSupervising(itemId, userId);
        showToast("editSuccess");
        await loadData();
      } catch (err) {
        if (err?.response?.status === 403) {
          showToast("forbidden", "error");
        } else {
          showToast("editError", "error");
        }
      } finally {
        setSaving(false);
      }
    },
    [subModule, userId, loadData, showToast],
  );

  const rejectRecommended = useCallback(
    async (itemId) => {
      setSaving(true);
      try {
        if (subModule === "recommendedThesesSupervisings")
          await adminRejectThesisSupervising(itemId, userId);
        showToast("deleteSuccess");
        await loadData();
      } catch (err) {
        if (err?.response?.status === 403) {
          showToast("forbidden", "error");
        } else {
          showToast("deleteError", "error");
        }
      } finally {
        setSaving(false);
      }
    },
    [subModule, userId, loadData, showToast],
  );

  // ─── Delete attachment ────────────────────────────────────────────────────
  const deleteAttachment = useCallback(
    async (entityId, attachmentId) => {
      try {
        if (subModule === "manifestations")
          await adminDeleteManifestationAttachment(entityId, attachmentId);
        else if (subModule === "prizesAndRewards")
          await adminDeletePrizeAttachment(entityId, attachmentId);
        else if (subModule === "seminarsAndConferences")
          await adminDeleteSeminarAttachment(entityId, attachmentId);
        else if (subModule === "academicQualifications")
          await adminDeleteAcademicQualificationAttachment(
            entityId,
            attachmentId,
          );
        else if (subModule === "patents")
          await adminDeletePatentAttachment(entityId, attachmentId);
        showToast("deleteSuccess");
        await loadData();
      } catch {
        showToast("deleteError", "error");
      }
    },
    [subModule, loadData, showToast],
  );

  return {
    items,
    pageIndex,
    pageSize: PAGE_SIZE,
    totalCount,
    goToPage,
    loading,
    error,
    reload: loadData,
    rewardLookups,
    contributionTypeLookups,
    seminarParticipationTypes,
    committeeTypeLookups,
    committeeDegreeLookups,
    magazineParticipationRoles,
    projectTypeLookups,
    projectRoleLookups,
    academicQualificationLookups,
    dispatchTypeLookups,
    academicGradeLookups,
    jobRankLookups,
    authorRoleLookups,
    // modals
    addOpen,
    openAdd,
    closeAdd,
    editOpen,
    editItem,
    openEdit,
    closeEdit,
    deleteTarget,
    openDelete,
    closeDelete,
    // actions
    saving,
    deleting,
    save,
    confirmDelete,
    deleteAttachment,
    acceptRecommended,
    rejectRecommended,
    // feedback
    toast,
  };
}
