// Shared utilities and section data helpers used by all CV templates

export const getVal = (obj, isArabic) =>
  obj ? (isArabic ? obj.valueAr : obj.valueEn) || "" : "";

export const fmt = (d, isArabic, monthFormat = "long") => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: monthFormat,
      day: "numeric",
    });
  } catch {
    return d;
  }
};

export const fmtShort = (d, isArabic) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return d;
  }
};

export const dateRange = (start, end, isArabic, fmtFn) => {
  const fn = fmtFn || fmt;
  const s = fn(start, isArabic);
  const e = end ? fn(end, isArabic) : "—";
  return s || e ? `${s} – ${e}` : "";
};

export const join = (...parts) => parts.filter(Boolean).join(" · ");

/**
 * Returns an array of section descriptors: { key, titleKey, items, getTitle, getMeta }
 * Each template picks how to render them; this just supplies the data.
 */
export const buildSections = (data, isArabic, t, fmtFn) => {
  const dr = (s, e) => dateRange(s, e, isArabic, fmtFn);
  const f = (d) => (fmtFn || fmt)(d, isArabic);
  const g = (obj) => getVal(obj, isArabic);

  return [
    {
      key: "academicQualifications",
      titleKey: "sections.academicQualifications",
      items: data.academicQualifications,
      getTitle: (aq) =>
        `${g(aq.qualification)}${aq.specialization ? ` — ${aq.specialization}` : ""}`,
      getMeta: (aq) =>
        join(
          g(aq.grade),
          g(aq.dispatchType),
          aq.universityOrFaculty,
          aq.countryOrCity,
          f(aq.dateOfObtainingTheQualification),
        ),
      getDate: (aq) => f(aq.dateOfObtainingTheQualification),
      getTimelineMeta: (aq) =>
        join(g(aq.grade), aq.universityOrFaculty, aq.countryOrCity),
    },
    {
      key: "jobRanks",
      titleKey: "sections.jobRanks",
      items: data.jobRanks,
      getTitle: (jr) => g(jr.jobRank),
      getMeta: (jr) => f(jr.dateOfJobRank),
      getDate: (jr) => f(jr.dateOfJobRank),
      getTimelineMeta: () => "",
    },
    {
      key: "administrativePositions",
      titleKey: "sections.administrativePositions",
      items: data.administrativePositions,
      getTitle: (ap) => ap.position,
      getMeta: (ap) => dr(ap.startDate, ap.endDate),
      getDate: (ap) => dr(ap.startDate, ap.endDate),
      getTimelineMeta: () => "",
    },
    {
      key: "generalExperiences",
      titleKey: "sections.generalExperiences",
      items: data.generalExperiences,
      getTitle: (ge) => ge.experienceTitle,
      getMeta: (ge) =>
        join(ge.authority, ge.countryOrCity, dr(ge.startDate, ge.endDate)),
      getDate: (ge) => dr(ge.startDate, ge.endDate),
      getTimelineMeta: (ge) => join(ge.authority, ge.countryOrCity),
    },
    {
      key: "teachingExperiences",
      titleKey: "sections.teachingExperiences",
      items: data.teachingExperiences,
      getTitle: (te) => te.courseName,
      getMeta: (te) =>
        join(
          te.academicLevel,
          te.universityOrFaculty,
          dr(te.startDate, te.endDate),
        ),
      getDate: (te) => dr(te.startDate, te.endDate),
      getTimelineMeta: (te) => join(te.academicLevel, te.universityOrFaculty),
    },
    {
      key: "scientificMissions",
      titleKey: "sections.scientificMissions",
      items: data.scientificMissions,
      getTitle: (sm) => sm.missionName,
      getMeta: (sm) =>
        join(
          sm.universityOrFaculty,
          sm.countryOrCity,
          dr(sm.startDate, sm.endDate),
        ),
      getDate: (sm) => dr(sm.startDate, sm.endDate),
      getTimelineMeta: (sm) => join(sm.universityOrFaculty, sm.countryOrCity),
    },
    {
      key: "conferencesAndSeminars",
      titleKey: "sections.conferencesAndSeminars",
      items: data.conferencesAndSeminars,
      getTitle: (cs) => cs.name,
      getMeta: (cs) =>
        join(
          g(cs.roleOfParticipation),
          cs.organizingAuthority,
          cs.venue,
          dr(cs.startDate, cs.endDate),
        ),
      getDate: (cs) => dr(cs.startDate, cs.endDate),
      getTimelineMeta: (cs) =>
        join(g(cs.roleOfParticipation), cs.organizingAuthority, cs.venue),
    },
    {
      key: "trainingPrograms",
      titleKey: "sections.trainingPrograms",
      items: data.trainingPrograms,
      getTitle: (tp) => tp.trainingProgramName,
      getMeta: (tp) => join(tp.venue, dr(tp.startDate, tp.endDate)),
      getDate: (tp) => dr(tp.startDate, tp.endDate),
      getTimelineMeta: (tp) => tp.venue || "",
    },
    {
      key: "projects",
      titleKey: "sections.projects",
      items: data.projects,
      getTitle: (p) => p.nameOfProject,
      getMeta: (p) =>
        join(
          g(p.typeOfProject),
          g(p.participationRole),
          p.financingAuthority,
          dr(p.startDate, p.endDate),
        ),
      getDate: (p) => dr(p.startDate, p.endDate),
      getTimelineMeta: (p) => join(g(p.typeOfProject), p.financingAuthority),
    },
    {
      key: "scientificWritings",
      titleKey: "sections.scientificWritings",
      items: data.scientificWritings,
      getTitle: (sw) => sw.title,
      getMeta: (sw) =>
        join(
          g(sw.authorRole),
          sw.publishingHouse,
          sw.isbn,
          f(sw.publishingDate),
        ),
      getDate: (sw) => f(sw.publishingDate),
      getTimelineMeta: (sw) =>
        join(g(sw.authorRole), sw.publishingHouse, sw.isbn),
    },
    {
      key: "patents",
      titleKey: "sections.patents",
      items: data.patents,
      getTitle: (p) => p.nameOfPatent,
      getMeta: (p) =>
        join(p.accreditingAuthorityOrCountry, f(p.accreditationDate)),
      getDate: (p) => f(p.accreditationDate),
      getTimelineMeta: (p) => p.accreditingAuthorityOrCountry || "",
    },
    {
      key: "committeesAndAssociations",
      titleKey: "sections.committeesAndAssociations",
      items: data.committeesAndAssociations,
      getTitle: (ca) => ca.nameOfCommitteeOrAssociation,
      getMeta: (ca) =>
        join(
          g(ca.typeOfCommitteeOrAssociation),
          g(ca.degreeOfSubscription),
          dr(ca.startDate, ca.endDate),
        ),
      getDate: (ca) => dr(ca.startDate, ca.endDate),
      getTimelineMeta: (ca) =>
        join(g(ca.typeOfCommitteeOrAssociation), g(ca.degreeOfSubscription)),
    },
    {
      key: "participationInMagazines",
      titleKey: "sections.participationInMagazines",
      items: data.participationInMagazines,
      getTitle: (pm) => pm.nameOfMagazine,
      getMeta: (pm) => g(pm.typeOfParticipation),
      getDate: () => "",
      getTimelineMeta: (pm) => g(pm.typeOfParticipation),
    },
    {
      key: "reviewingArticles",
      titleKey: "sections.reviewingArticles",
      items: data.reviewingArticles,
      getTitle: (ra) => ra.titleOfArticle,
      getMeta: (ra) => join(ra.authority, f(ra.reviewingDate)),
      getDate: (ra) => f(ra.reviewingDate),
      getTimelineMeta: (ra) => ra.authority || "",
    },
    {
      key: "prizesAndRewards",
      titleKey: "sections.prizesAndRewards",
      items: data.prizesAndRewards,
      getTitle: (pr) => g(pr.prize),
      getMeta: (pr) => join(pr.awardingAuthority, f(pr.dateReceived)),
      getDate: (pr) => f(pr.dateReceived),
      getTimelineMeta: (pr) => pr.awardingAuthority || "",
    },
    {
      key: "manifestationsOfScientificAppreciation",
      titleKey: "sections.manifestationsOfScientificAppreciation",
      items: data.manifestationsOfScientificAppreciation,
      getTitle: (m) => m.titleOfAppreciation,
      getMeta: (m) => join(m.issuingAuthority, f(m.dateOfAppreciation)),
      getDate: (m) => f(m.dateOfAppreciation),
      getTimelineMeta: (m) => m.issuingAuthority || "",
    },
    {
      key: "contributionsToCommunityService",
      titleKey: "sections.contributionsToCommunityService",
      items: data.contributionsToCommunityService,
      getTitle: (c) => c.contributionTitle,
      getMeta: (c) => f(c.dateOfContribution),
      getDate: (c) => f(c.dateOfContribution),
      getTimelineMeta: () => "",
    },
    {
      key: "contributionsToUniversity",
      titleKey: "sections.contributionsToUniversity",
      items: data.contributionsToUniversity,
      getTitle: (c) => c.contributionTitle,
      getMeta: (c) => join(g(c.typeOfContribution), f(c.dateOfContribution)),
      getDate: (c) => f(c.dateOfContribution),
      getTimelineMeta: (c) => g(c.typeOfContribution),
    },
    {
      key: "participationInQualityWork",
      titleKey: "sections.participationInQualityWork",
      items: data.participationInQualityWork,
      getTitle: (pq) => pq.participationTitle,
      getMeta: (pq) => dr(pq.startDate, pq.endDate),
      getDate: (pq) => dr(pq.startDate, pq.endDate),
      getTimelineMeta: () => "",
    },
  ].filter((s) => s.items?.length > 0);
};

/**
 * Returns a shallow copy of `data` with fields/sections hidden
 * based on the `visibility` state from useCVManage.
 * All templates call this before rendering so the CV updates in real-time.
 */
export const applyVisibility = (data, visibility) => {
  if (!data || !visibility) return data;
  const v = visibility;
  const d = { ...data };

  // Helper: apply master toggle + field-level masking to an array section
  const maskItems = (items, secVis, masterKey, fieldMap) => {
    if (!items) return [];
    if (secVis?.[masterKey] === false) return [];
    return items.map((item) => {
      const masked = { ...item };
      for (const [visKey, dataKey] of Object.entries(fieldMap)) {
        if (secVis?.[visKey] === false) {
          masked[dataKey] = Array.isArray(masked[dataKey]) ? [] : null;
        }
      }
      return masked;
    });
  };

  // --- personalData ---
  if (v.personalData?.showPersonalData === false) {
    d.university = null;
    d.authority = null;
    d.department = null;
    d.birthDate = null;
    d.profilePicture = null;
    d.skills = [];
  } else {
    if (v.personalData?.showUniversity === false) d.university = null;
    if (v.personalData?.showAuthority === false) d.authority = null;
    if (v.personalData?.showDepartment === false) d.department = null;
    if (v.personalData?.showBirthDate === false) d.birthDate = null;
    if (v.personalData?.showProfilePicture === false) d.profilePicture = null;
    if (v.personalData?.showSkills === false) d.skills = [];
  }

  // --- contactInfo ---
  if (v.contactInfo?.showContactInfo === false) {
    d.mainPhoneNumber = null;
    d.workPhoneNumber = null;
    d.officialEmail = null;
    d.faxNumber = null;
  } else {
    if (v.contactInfo?.showMainPhone === false) d.mainPhoneNumber = null;
    if (v.contactInfo?.showWorkPhone === false) d.workPhoneNumber = null;
    if (v.contactInfo?.showOfficialEmail === false) d.officialEmail = null;
    if (v.contactInfo?.showFax === false) d.faxNumber = null;
  }

  // --- socialMedia ---
  if (v.socialMedia?.showSocialMedia === false) {
    d.linkedIn = null;
    d.instagram = null;
    d.personalWebsite = null;
    d.googleScholar = null;
    d.scopus = null;
    d.facebook = null;
    d.x = null;
    d.youTube = null;
  } else {
    if (v.socialMedia?.showLinkedIn === false) d.linkedIn = null;
    if (v.socialMedia?.showInstagram === false) d.instagram = null;
    if (v.socialMedia?.showPersonalWebsite === false) d.personalWebsite = null;
    if (v.socialMedia?.showGoogleScholar === false) d.googleScholar = null;
    if (v.socialMedia?.showScopus === false) d.scopus = null;
    if (v.socialMedia?.showFacebook === false) d.facebook = null;
    if (v.socialMedia?.showX === false) d.x = null;
    if (v.socialMedia?.showYouTube === false) d.youTube = null;
  }

  // --- academicQualifications ---
  d.academicQualifications = maskItems(
    d.academicQualifications,
    v.academicQualifications,
    "showAcademicQualifications",
    {
      showQualification: "qualification",
      showSpecialization: "specialization",
      showGrade: "grade",
      showDispatchType: "dispatchType",
      showUniversityOrFaculty: "universityOrFaculty",
      showCountryOrCity: "countryOrCity",
      showDateOfObtainingTheQualification: "dateOfObtainingTheQualification",
    },
  );

  // --- jobRanks ---
  d.jobRanks = maskItems(d.jobRanks, v.jobRanks, "showJobRanks", {
    showJobRank: "jobRank",
    showDateOfJobRank: "dateOfJobRank",
  });

  // --- administrativePositions ---
  d.administrativePositions = maskItems(
    d.administrativePositions,
    v.administrativePositions,
    "showAdministrativePositions",
    {
      showPosition: "position",
      showPositionStartDate: "startDate",
      showPositionEndDate: "endDate",
    },
  );

  // --- conferencesAndSeminars ---
  d.conferencesAndSeminars = maskItems(
    d.conferencesAndSeminars,
    v.conferencesAndSeminars,
    "showConferencesAndSeminars",
    {
      showConferenceOrSeminarName: "name",
      showConferenceOrSeminarRoleOfParticipation: "roleOfParticipation",
      showConferenceOrSeminarOrganizingAuthority: "organizingAuthority",
      showConferenceOrSeminarWebsite: "website",
      showConferenceOrSeminarStartDate: "startDate",
      showConferenceOrSeminarEndDate: "endDate",
      showConferenceOrSeminarVenue: "venue",
    },
  );

  // --- scientificMissions ---
  d.scientificMissions = maskItems(
    d.scientificMissions,
    v.scientificMissions,
    "showScientificMissions",
    {
      showMissionName: "missionName",
      showMissionStartDate: "startDate",
      showMissionEndDate: "endDate",
      showMissionUniversityOrFaculty: "universityOrFaculty",
      showMissionCountryOrCity: "countryOrCity",
    },
  );

  // --- trainingPrograms ---
  d.trainingPrograms = maskItems(
    d.trainingPrograms,
    v.trainingPrograms,
    "showTrainingPrograms",
    {
      showTrainingProgramName: "trainingProgramName",
      showTrainingProgramVenue: "venue",
      showTrainingProgramStartDate: "startDate",
      showTrainingProgramEndDate: "endDate",
    },
  );

  // --- committeesAndAssociations ---
  d.committeesAndAssociations = maskItems(
    d.committeesAndAssociations,
    v.committeesAndAssociations,
    "showCommitteesAndAssociations",
    {
      showNameOfCommitteeOrAssociation: "nameOfCommitteeOrAssociation",
      showTypeOfCommitteeOrAssociation: "typeOfCommitteeOrAssociation",
      showDegreeOfSubscription: "degreeOfSubscription",
      showCommitteesAndAssociationsStartDate: "startDate",
      showCommitteesAndAssociationsEndDate: "endDate",
    },
  );

  // --- participationInMagazines ---
  d.participationInMagazines = maskItems(
    d.participationInMagazines,
    v.participationInMagazines,
    "showParticipationInMagazines",
    {
      showNameOfMagazine: "nameOfMagazine",
      showWebsiteOfMagazine: "websiteOfMagazine",
      showTypeOfParticipation: "typeOfParticipation",
    },
  );

  // --- reviewingArticles ---
  d.reviewingArticles = maskItems(
    d.reviewingArticles,
    v.reviewingArticles,
    "showReviewingArticles",
    {
      showTitleOfArticle: "titleOfArticle",
      showAuthority: "authority",
      showReviewingDate: "reviewingDate",
    },
  );

  // --- projects ---
  d.projects = maskItems(d.projects, v.projects, "showProjects", {
    showNameOfProject: "nameOfProject",
    showTypeOfProject: "typeOfProject",
    showParticipationRole: "participationRole",
    showFinancingAuthority: "financingAuthority",
    showProjectStartDate: "startDate",
    showProjectEndDate: "endDate",
  });

  // --- teachingExperiences ---
  d.teachingExperiences = maskItems(
    d.teachingExperiences,
    v.teachingExperiences,
    "showTeachingExperiences",
    {
      showCourseName: "courseName",
      showAcademicLevel: "academicLevel",
      showUniversityOrFaculty: "universityOrFaculty",
      showTeachingExperienceStartDate: "startDate",
      showTeachingExperienceEndDate: "endDate",
    },
  );

  // --- generalExperiences ---
  d.generalExperiences = maskItems(
    d.generalExperiences,
    v.generalExperiences,
    "showGeneralExperiences",
    {
      showExperienceTitle: "experienceTitle",
      showAuthority: "authority",
      showCountryOrCity: "countryOrCity",
      showStartDate: "startDate",
      showEndDate: "endDate",
    },
  );

  // --- scientificWritings ---
  d.scientificWritings = maskItems(
    d.scientificWritings,
    v.scientificWritings,
    "showScientificWritings",
    {
      showTitle: "title",
      showAuthorRole: "authorRole",
      showISBN: "isbn",
      showPublishingHouse: "publishingHouse",
      showPublishingDate: "publishingDate",
    },
  );

  // --- patents ---
  d.patents = maskItems(d.patents, v.patents, "showPatents", {
    showNameOfPatent: "nameOfPatent",
    showAccreditingAuthorityOrCountry: "accreditingAuthorityOrCountry",
    showAccreditationDate: "accreditationDate",
  });

  // --- prizesAndRewards ---
  d.prizesAndRewards = maskItems(
    d.prizesAndRewards,
    v.prizesAndRewards,
    "showPrizesAndRewards",
    {
      showPrizeName: "prize",
      showawardingAuthority: "awardingAuthority",
      showDateReceived: "dateReceived",
    },
  );

  // --- manifestationsOfScientificAppreciation ---
  d.manifestationsOfScientificAppreciation = maskItems(
    d.manifestationsOfScientificAppreciation,
    v.manifestationsOfScientificAppreciation,
    "showManifestationsOfScientificAppreciation",
    {
      showTitleOfAppreciation: "titleOfAppreciation",
      showIssuingAuthority: "issuingAuthority",
      showDateOfAppreciation: "dateOfAppreciation",
    },
  );

  // --- contributionsToCommunityService ---
  d.contributionsToCommunityService = maskItems(
    d.contributionsToCommunityService,
    v.contributionsToCommunityService,
    "showContributionsToCommunityService",
    {
      showContributionTitle: "contributionTitle",
      showDateOfContribution: "dateOfContribution",
    },
  );

  // --- contributionsToUniversity ---
  d.contributionsToUniversity = maskItems(
    d.contributionsToUniversity,
    v.contributionsToUniversity,
    "showContributionsToUniversity",
    {
      showContributionTitle: "contributionTitle",
      showTypeOfContribution: "typeOfContribution",
      showDateOfContribution: "dateOfContribution",
    },
  );

  // --- participationInQualityWork ---
  d.participationInQualityWork = maskItems(
    d.participationInQualityWork,
    v.participationInQualityWork,
    "showparticipationsInQualityWork",
    {
      showparticipationTitle: "participationTitle",
      showParticipationStartDate: "startDate",
      showParticipationEndDate: "endDate",
    },
  );

  return d;
};
