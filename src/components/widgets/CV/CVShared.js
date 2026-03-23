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
        join(g(aq.grade), g(aq.dispatchType), aq.universityOrFaculty, aq.countryOrCity, f(aq.dateOfObtainingTheQualification)),
      getDate: (aq) => f(aq.dateOfObtainingTheQualification),
      getTimelineMeta: (aq) => join(g(aq.grade), aq.universityOrFaculty, aq.countryOrCity),
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
      getMeta: (ge) => join(ge.authority, ge.countryOrCity, dr(ge.startDate, ge.endDate)),
      getDate: (ge) => dr(ge.startDate, ge.endDate),
      getTimelineMeta: (ge) => join(ge.authority, ge.countryOrCity),
    },
    {
      key: "teachingExperiences",
      titleKey: "sections.teachingExperiences",
      items: data.teachingExperiences,
      getTitle: (te) => te.courseName,
      getMeta: (te) => join(te.academicLevel, te.universityOrFaculty, dr(te.startDate, te.endDate)),
      getDate: (te) => dr(te.startDate, te.endDate),
      getTimelineMeta: (te) => join(te.academicLevel, te.universityOrFaculty),
    },
    {
      key: "scientificMissions",
      titleKey: "sections.scientificMissions",
      items: data.scientificMissions,
      getTitle: (sm) => sm.missionName,
      getMeta: (sm) => join(sm.universityOrFaculty, sm.countryOrCity, dr(sm.startDate, sm.endDate)),
      getDate: (sm) => dr(sm.startDate, sm.endDate),
      getTimelineMeta: (sm) => join(sm.universityOrFaculty, sm.countryOrCity),
    },
    {
      key: "conferencesAndSeminars",
      titleKey: "sections.conferencesAndSeminars",
      items: data.conferencesAndSeminars,
      getTitle: (cs) => cs.name,
      getMeta: (cs) =>
        join(g(cs.roleOfParticipation), cs.organizingAuthority, cs.venue, dr(cs.startDate, cs.endDate)),
      getDate: (cs) => dr(cs.startDate, cs.endDate),
      getTimelineMeta: (cs) => join(g(cs.roleOfParticipation), cs.organizingAuthority, cs.venue),
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
        join(g(p.typeOfProject), g(p.participationRole), p.financingAuthority, dr(p.startDate, p.endDate)),
      getDate: (p) => dr(p.startDate, p.endDate),
      getTimelineMeta: (p) => join(g(p.typeOfProject), p.financingAuthority),
    },
    {
      key: "scientificWritings",
      titleKey: "sections.scientificWritings",
      items: data.scientificWritings,
      getTitle: (sw) => sw.title,
      getMeta: (sw) => join(g(sw.authorRole), sw.publishingHouse, sw.isbn, f(sw.publishingDate)),
      getDate: (sw) => f(sw.publishingDate),
      getTimelineMeta: (sw) => join(g(sw.authorRole), sw.publishingHouse, sw.isbn),
    },
    {
      key: "patents",
      titleKey: "sections.patents",
      items: data.patents,
      getTitle: (p) => p.nameOfPatent,
      getMeta: (p) => join(p.accreditingAuthorityOrCountry, f(p.accreditationDate)),
      getDate: (p) => f(p.accreditationDate),
      getTimelineMeta: (p) => p.accreditingAuthorityOrCountry || "",
    },
    {
      key: "committeesAndAssociations",
      titleKey: "sections.committeesAndAssociations",
      items: data.committeesAndAssociations,
      getTitle: (ca) => ca.nameOfCommitteeOrAssociation,
      getMeta: (ca) =>
        join(g(ca.typeOfCommitteeOrAssociation), g(ca.degreeOfSubscription), dr(ca.startDate, ca.endDate)),
      getDate: (ca) => dr(ca.startDate, ca.endDate),
      getTimelineMeta: (ca) => join(g(ca.typeOfCommitteeOrAssociation), g(ca.degreeOfSubscription)),
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
