import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2, Paperclip, Trash2 } from "lucide-react";

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  border: "1px solid #e5e7eb",
  borderRadius: "0.75rem",
  padding: "clamp(0.4rem, 0.65vw, 1rem) clamp(0.6rem, 0.9vw, 1.4rem)",
  fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
  color: "#111827",
  backgroundColor: "#f9fafb",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "clamp(0.62rem, 0.8vw, 1.1rem)",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "0.3rem",
};

const errorStyle = {
  fontSize: "clamp(0.58rem, 0.75vw, 1rem)",
  color: "#dc2626",
  marginTop: "0.2rem",
};

function Field({ label, children, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ─── Initial form builders ────────────────────────────────────────────────────

function buildInitial(subModule, item) {
  if (subModule === "generalExperiences") {
    return {
      experienceTitle: item?.experienceTitle || "",
      authority: item?.authority || "",
      countryOrCity: item?.countryOrCity || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "teachingExperiences") {
    return {
      courseName: item?.courseName || "",
      academicLevel: item?.academicLevel || "",
      universityOrFaculty: item?.universityOrFaculty || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "manifestations") {
    return {
      titleOfAppreciation: item?.titleOfAppreciation || "",
      issuingAuthority: item?.issuingAuthority || "",
      dateOfAppreciation: item?.dateOfAppreciation?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "prizesAndRewards") {
    return {
      prizeId: item?.prize?.id || "",
      awardingAuthority: item?.awardingAuthority || "",
      dateReceived: item?.dateReceived?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  // ─── Contributions ───────────────────────────────────────────────────────
  if (subModule === "communityServiceContributions") {
    return {
      contributionTitle: item?.contributionTitle || "",
      dateOfContribution: item?.dateOfContribution?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "universityContributions") {
    return {
      contributionTitle: item?.contributionTitle || "",
      typeOfContributionId: item?.typeOfContribution?.id || "",
      dateOfContribution: item?.dateOfContribution?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "participationInQualityWorks") {
    return {
      participationTitle: item?.participationTitle || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  // ─── Missions ─────────────────────────────────────────────────────────────
  if (subModule === "scientificMissions") {
    return {
      missionName: item?.missionName || "",
      countryOrCity: item?.countryOrCity || "",
      universityOrFaculty: item?.universityOrFaculty || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      notes: item?.notes || "",
    };
  }
  if (subModule === "seminarsAndConferences") {
    // type: "Conference"=1 | "Seminar"=2
    // localOrInternational: "Local"=1 | "International"=2
    return {
      type: item?.type === "Seminar" ? 2 : 1,
      localOrInternational:
        item?.localOrInternational === "International" ? 2 : 1,
      name: item?.name || "",
      roleOfParticipationId: item?.roleOfParticipation?.id || "",
      organizingAuthority: item?.organizingAuthority || "",
      website: item?.website || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      venue: item?.venue || "",
      notes: item?.notes || "",
    };
  }
  if (subModule === "trainingPrograms") {
    // type: "InTheSpecialty"=1 | "OutTheSpecialty"=2
    // participationType: "listener"=1 | "lecturer"=2
    return {
      type: item?.type === "OutTheSpecialty" ? 2 : 1,
      participationType: item?.participationType === "lecturer" ? 2 : 1,
      trainingProgramName: item?.trainingProgramName || "",
      organizingAuthority: item?.organizingAuthority || "",
      venue: item?.venue || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  // ─── Projects & Committees ───────────────────────────────────────────────
  if (subModule === "committeesAndAssociations") {
    return {
      nameOfCommitteeOrAssociation: item?.nameOfCommitteeOrAssociation || "",
      typeOfCommitteeOrAssociationId:
        item?.typeOfCommitteeOrAssociation?.id || "",
      degreeOfSubscriptionId: item?.degreeOfSubscription?.id || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      notes: item?.notes || "",
    };
  }
  if (subModule === "participationInMagazines") {
    return {
      nameOfMagazine: item?.nameOfMagazine || "",
      websiteOfMagazine: item?.websiteOfMagazine || "",
      typeOfParticipationId: item?.typeOfParticipation?.id || "",
    };
  }
  if (subModule === "projects") {
    return {
      localOrInternational:
        item?.localOrInternational === "International" ? 2 : 1,
      nameOfProject: item?.nameOfProject || "",
      typeOfProjectId: item?.typeOfProject?.id || "",
      participationRoleId: item?.participationRole?.id || "",
      financingAuthority: item?.financingAuthority || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "reviewingArticles") {
    return {
      titleOfArticle: item?.titleOfArticle || "",
      authority: item?.authority || "",
      reviewingDate: item?.reviewingDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  // ─── Scientific Progressions ─────────────────────────────────────────────
  if (subModule === "academicQualifications") {
    return {
      qualificationId: item?.qualification?.id || "",
      specialization: item?.specialization || "",
      gradeId: item?.grade?.id || "",
      dispatchId: item?.dispatchType?.id || "",
      universityOrFaculty: item?.universityOrFaculty || "",
      countryOrCity: item?.countryOrCity || "",
      dateOfObtainingTheQualification:
        item?.dateOfObtainingTheQualification?.slice(0, 10) || "",
    };
  }
  if (subModule === "administrativePositions") {
    return {
      position: item?.position || "",
      startDate: item?.startDate?.slice(0, 10) || "",
      endDate: item?.endDate?.slice(0, 10) || "",
      notes: item?.notes || "",
    };
  }
  if (subModule === "jobRanks") {
    return {
      jobRankId: item?.jobRank?.id || "",
      dateOfJobRank: item?.dateOfJobRank?.slice(0, 10) || "",
      notes: item?.notes || "",
    };
  }
  if (subModule === "patents") {
    return {
      localOrInternational:
        item?.localOrInternational === "International" ? 2 : 1,
      nameOfPatent: item?.nameOfPatent || "",
      accreditingAuthorityOrCountry: item?.accreditingAuthorityOrCountry || "",
      applyingDate: item?.applyingDate?.slice(0, 10) || "",
      accreditationDate: item?.accreditationDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  if (subModule === "scientificWritings") {
    return {
      title: item?.title || "",
      authorRoleId: item?.authorRole?.id || "",
      isbn: item?.isbn || "",
      publishingHouse: item?.publishingHouse || "",
      publishingDate: item?.publishingDate?.slice(0, 10) || "",
      description: item?.description || "",
    };
  }
  // thesisType: "PHD"=1, "Master"=2
  // facultyMemberRole: "Adminstrator"=1, "Reviewer"=2, "AdminstratorAndReviewer"=3
  if (subModule === "thesesSupervisings") {
    return {
      type: item?.type === "Master" ? 2 : 1,
      title: item?.title || "",
      facultyMemberRole:
        item?.facultyMemberRole === "Reviewer"
          ? 2
          : item?.facultyMemberRole === "AdminstratorAndReviewer"
            ? 3
            : 1,
      studentName: item?.studentName || "",
      specialization: item?.specialization || "",
      gradeId: item?.grade?.id || "",
      registrationDate: item?.registrationDate?.slice(0, 10) || "",
      supervisionFormationDate:
        item?.supervisionFormationDate?.slice(0, 10) || "",
      discussionDate: item?.discussionDate?.slice(0, 10) || "",
      grantingDate: item?.grantingDate?.slice(0, 10) || "",
      universityOrFaculty: item?.universityOrFaculty || "",
    };
  }
  return {};
}

// ─── AdminDataFormModal ───────────────────────────────────────────────────────

export default function AdminDataFormModal({
  subModule,
  mode, // "add" | "edit"
  item, // populated in edit mode
  saving,
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
  onSave,
  onClose,
}) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isAr = i18n.language === "ar";
  const dir = i18n.dir();

  const [form, setForm] = useState(() => buildInitial(subModule, item));
  const [errors, setErrors] = useState({});
  const [newFiles, setNewFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState(
    item?.attachments || [],
  );

  // If item changes (switching between records) reset form
  useEffect(() => {
    setForm(buildInitial(subModule, item));
    setNewFiles([]);
    setExistingAttachments(item?.attachments || []);
    setErrors({});
  }, [subModule, item]);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (subModule === "generalExperiences") {
      if (!form.experienceTitle.trim()) e.experienceTitle = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "teachingExperiences") {
      if (!form.courseName.trim()) e.courseName = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "manifestations") {
      if (!form.titleOfAppreciation.trim())
        e.titleOfAppreciation = t("required");
      if (!form.dateOfAppreciation) e.dateOfAppreciation = t("required");
    } else if (subModule === "prizesAndRewards") {
      if (!form.prizeId) e.prizeId = t("required");
      if (!form.dateReceived) e.dateReceived = t("required");
    } else if (subModule === "communityServiceContributions") {
      if (!form.contributionTitle.trim()) e.contributionTitle = t("required");
      if (!form.dateOfContribution) e.dateOfContribution = t("required");
    } else if (subModule === "universityContributions") {
      if (!form.contributionTitle.trim()) e.contributionTitle = t("required");
      if (!form.typeOfContributionId) e.typeOfContributionId = t("required");
      if (!form.dateOfContribution) e.dateOfContribution = t("required");
    } else if (subModule === "participationInQualityWorks") {
      if (!form.participationTitle.trim()) e.participationTitle = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "scientificMissions") {
      if (!form.missionName.trim()) e.missionName = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "seminarsAndConferences") {
      if (!form.name.trim()) e.name = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "trainingPrograms") {
      if (!form.trainingProgramName.trim())
        e.trainingProgramName = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "committeesAndAssociations") {
      if (!form.nameOfCommitteeOrAssociation.trim())
        e.nameOfCommitteeOrAssociation = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "participationInMagazines") {
      if (!form.nameOfMagazine.trim()) e.nameOfMagazine = t("required");
    } else if (subModule === "projects") {
      if (!form.nameOfProject.trim()) e.nameOfProject = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "reviewingArticles") {
      if (!form.titleOfArticle.trim()) e.titleOfArticle = t("required");
      if (!form.reviewingDate) e.reviewingDate = t("required");
    } else if (subModule === "academicQualifications") {
      if (!form.qualificationId) e.qualificationId = t("required");
      if (!form.dateOfObtainingTheQualification)
        e.dateOfObtainingTheQualification = t("required");
    } else if (subModule === "administrativePositions") {
      if (!form.position.trim()) e.position = t("required");
      if (!form.startDate) e.startDate = t("required");
    } else if (subModule === "jobRanks") {
      if (!form.jobRankId) e.jobRankId = t("required");
      if (!form.dateOfJobRank) e.dateOfJobRank = t("required");
    } else if (subModule === "patents") {
      if (!form.nameOfPatent.trim()) e.nameOfPatent = t("required");
      if (!form.applyingDate) e.applyingDate = t("required");
    } else if (subModule === "scientificWritings") {
      if (!form.title.trim()) e.title = t("required");
      if (!form.publishingDate) e.publishingDate = t("required");
    } else if (subModule === "thesesSupervisings") {
      if (!form.title.trim()) e.title = t("required");
      if (!form.studentName.trim()) e.studentName = t("required");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form, newFiles, mode);
  };

  // ─── Render form fields per sub-module ────────────────────────────────────
  const renderFields = () => {
    if (subModule === "generalExperiences") {
      return (
        <>
          <Field
            label={t("fields.experienceTitle")}
            error={errors.experienceTitle}
          >
            <input
              style={inputStyle}
              value={form.experienceTitle}
              onChange={(e) => set("experienceTitle", e.target.value)}
            />
          </Field>
          <Field label={t("fields.authority")}>
            <input
              style={inputStyle}
              value={form.authority}
              onChange={(e) => set("authority", e.target.value)}
            />
          </Field>
          <Field label={t("fields.countryOrCity")}>
            <input
              style={inputStyle}
              value={form.countryOrCity}
              onChange={(e) => set("countryOrCity", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "teachingExperiences") {
      return (
        <>
          <Field label={t("fields.courseName")} error={errors.courseName}>
            <input
              style={inputStyle}
              value={form.courseName}
              onChange={(e) => set("courseName", e.target.value)}
            />
          </Field>
          <Field label={t("fields.academicLevel")}>
            <input
              style={inputStyle}
              value={form.academicLevel}
              onChange={(e) => set("academicLevel", e.target.value)}
            />
          </Field>
          <Field label={t("fields.universityOrFaculty")}>
            <input
              style={inputStyle}
              value={form.universityOrFaculty}
              onChange={(e) => set("universityOrFaculty", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "manifestations") {
      return (
        <>
          <Field
            label={t("fields.titleOfAppreciation")}
            error={errors.titleOfAppreciation}
          >
            <input
              style={inputStyle}
              value={form.titleOfAppreciation}
              onChange={(e) => set("titleOfAppreciation", e.target.value)}
            />
          </Field>
          <Field label={t("fields.issuingAuthority")}>
            <input
              style={inputStyle}
              value={form.issuingAuthority}
              onChange={(e) => set("issuingAuthority", e.target.value)}
            />
          </Field>
          <Field
            label={t("fields.dateOfAppreciation")}
            error={errors.dateOfAppreciation}
          >
            <input
              type="date"
              style={inputStyle}
              value={form.dateOfAppreciation}
              onChange={(e) => set("dateOfAppreciation", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <AttachmentsSection
            existing={existingAttachments}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            t={t}
          />
        </>
      );
    }

    if (subModule === "prizesAndRewards") {
      return (
        <>
          <Field label={t("fields.prize")} error={errors.prizeId}>
            <select
              style={inputStyle}
              value={form.prizeId}
              onChange={(e) => set("prizeId", e.target.value)}
            >
              <option value="">{t("fields.selectPrize")}</option>
              {rewardLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.awardingAuthority")}>
            <input
              style={inputStyle}
              value={form.awardingAuthority}
              onChange={(e) => set("awardingAuthority", e.target.value)}
            />
          </Field>
          <Field label={t("fields.dateReceived")} error={errors.dateReceived}>
            <input
              type="date"
              style={inputStyle}
              value={form.dateReceived}
              onChange={(e) => set("dateReceived", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <AttachmentsSection
            existing={existingAttachments}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            t={t}
          />
        </>
      );
    }

    // ─── Contributions ─────────────────────────────────────────────────────
    if (subModule === "communityServiceContributions") {
      return (
        <>
          <Field
            label={t("fields.contributionTitle")}
            error={errors.contributionTitle}
          >
            <input
              style={inputStyle}
              value={form.contributionTitle}
              onChange={(e) => set("contributionTitle", e.target.value)}
            />
          </Field>
          <Field
            label={t("fields.dateOfContribution")}
            error={errors.dateOfContribution}
          >
            <input
              type="date"
              style={inputStyle}
              value={form.dateOfContribution}
              onChange={(e) => set("dateOfContribution", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "universityContributions") {
      return (
        <>
          <Field
            label={t("fields.contributionTitle")}
            error={errors.contributionTitle}
          >
            <input
              style={inputStyle}
              value={form.contributionTitle}
              onChange={(e) => set("contributionTitle", e.target.value)}
            />
          </Field>
          <Field
            label={t("fields.typeOfContribution")}
            error={errors.typeOfContributionId}
          >
            <select
              style={inputStyle}
              value={form.typeOfContributionId}
              onChange={(e) => set("typeOfContributionId", e.target.value)}
            >
              <option value="">{t("fields.selectType")}</option>
              {contributionTypeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("fields.dateOfContribution")}
            error={errors.dateOfContribution}
          >
            <input
              type="date"
              style={inputStyle}
              value={form.dateOfContribution}
              onChange={(e) => set("dateOfContribution", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "participationInQualityWorks") {
      return (
        <>
          <Field
            label={t("fields.participationTitle")}
            error={errors.participationTitle}
          >
            <input
              style={inputStyle}
              value={form.participationTitle}
              onChange={(e) => set("participationTitle", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    // ─── Missions ──────────────────────────────────────────────────────────
    if (subModule === "scientificMissions") {
      return (
        <>
          <Field label={t("fields.missionName")} error={errors.missionName}>
            <input
              style={inputStyle}
              value={form.missionName}
              onChange={(e) => set("missionName", e.target.value)}
            />
          </Field>
          <Field label={t("fields.countryOrCity")}>
            <input
              style={inputStyle}
              value={form.countryOrCity}
              onChange={(e) => set("countryOrCity", e.target.value)}
            />
          </Field>
          <Field label={t("fields.universityOrFaculty")}>
            <input
              style={inputStyle}
              value={form.universityOrFaculty}
              onChange={(e) => set("universityOrFaculty", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.notes")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "seminarsAndConferences") {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.type")}>
              <select
                style={inputStyle}
                value={form.type}
                onChange={(e) => set("type", Number(e.target.value))}
              >
                <option value={1}>{t("fields.conference")}</option>
                <option value={2}>{t("fields.seminar")}</option>
              </select>
            </Field>
            <Field label={t("fields.localOrInternational")}>
              <select
                style={inputStyle}
                value={form.localOrInternational}
                onChange={(e) =>
                  set("localOrInternational", Number(e.target.value))
                }
              >
                <option value={1}>{t("fields.local")}</option>
                <option value={2}>{t("fields.international")}</option>
              </select>
            </Field>
          </div>
          <Field label={t("fields.name")} error={errors.name}>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label={t("fields.roleOfParticipation")}>
            <select
              style={inputStyle}
              value={form.roleOfParticipationId}
              onChange={(e) => set("roleOfParticipationId", e.target.value)}
            >
              <option value="">{t("fields.selectRole")}</option>
              {seminarParticipationTypes.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("fields.organizingAuthority")}
            error={errors.organizingAuthority}
          >
            <input
              style={inputStyle}
              value={form.organizingAuthority}
              onChange={(e) => set("organizingAuthority", e.target.value)}
            />
          </Field>
          <Field label={t("fields.website")}>
            <input
              style={inputStyle}
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.venue")}>
            <input
              style={inputStyle}
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
            />
          </Field>
          <Field label={t("fields.notes")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
          <AttachmentsSection
            existing={existingAttachments}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            t={t}
          />
        </>
      );
    }

    if (subModule === "trainingPrograms") {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.type")}>
              <select
                style={inputStyle}
                value={form.type}
                onChange={(e) => set("type", Number(e.target.value))}
              >
                <option value={1}>{t("fields.inTheSpecialty")}</option>
                <option value={2}>{t("fields.outTheSpecialty")}</option>
              </select>
            </Field>
            <Field label={t("fields.participationType")}>
              <select
                style={inputStyle}
                value={form.participationType}
                onChange={(e) =>
                  set("participationType", Number(e.target.value))
                }
              >
                <option value={1}>{t("fields.listener")}</option>
                <option value={2}>{t("fields.lecturer")}</option>
              </select>
            </Field>
          </div>
          <Field
            label={t("fields.trainingProgramName")}
            error={errors.trainingProgramName}
          >
            <input
              style={inputStyle}
              value={form.trainingProgramName}
              onChange={(e) => set("trainingProgramName", e.target.value)}
            />
          </Field>
          <Field label={t("fields.organizingAuthority")}>
            <input
              style={inputStyle}
              value={form.organizingAuthority}
              onChange={(e) => set("organizingAuthority", e.target.value)}
            />
          </Field>
          <Field label={t("fields.venue")}>
            <input
              style={inputStyle}
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    // ─── Projects & Committees ─────────────────────────────────────────────
    if (subModule === "committeesAndAssociations") {
      return (
        <>
          <Field
            label={t("fields.nameOfCommitteeOrAssociation")}
            error={errors.nameOfCommitteeOrAssociation}
          >
            <input
              style={inputStyle}
              value={form.nameOfCommitteeOrAssociation}
              onChange={(e) =>
                set("nameOfCommitteeOrAssociation", e.target.value)
              }
            />
          </Field>
          <Field label={t("fields.typeOfCommitteeOrAssociation")}>
            <select
              style={inputStyle}
              value={form.typeOfCommitteeOrAssociationId}
              onChange={(e) =>
                set("typeOfCommitteeOrAssociationId", e.target.value)
              }
            >
              <option value="">{t("fields.selectType")}</option>
              {committeeTypeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.degreeOfSubscription")}>
            <select
              style={inputStyle}
              value={form.degreeOfSubscriptionId}
              onChange={(e) => set("degreeOfSubscriptionId", e.target.value)}
            >
              <option value="">{t("fields.selectDegree")}</option>
              {committeeDegreeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.notes")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "participationInMagazines") {
      return (
        <>
          <Field
            label={t("fields.nameOfMagazine")}
            error={errors.nameOfMagazine}
          >
            <input
              style={inputStyle}
              value={form.nameOfMagazine}
              onChange={(e) => set("nameOfMagazine", e.target.value)}
            />
          </Field>
          <Field label={t("fields.websiteOfMagazine")}>
            <input
              style={inputStyle}
              value={form.websiteOfMagazine}
              onChange={(e) => set("websiteOfMagazine", e.target.value)}
            />
          </Field>
          <Field label={t("fields.typeOfParticipation")}>
            <select
              style={inputStyle}
              value={form.typeOfParticipationId}
              onChange={(e) => set("typeOfParticipationId", e.target.value)}
            >
              <option value="">{t("fields.selectRole")}</option>
              {magazineParticipationRoles.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
        </>
      );
    }

    if (subModule === "projects") {
      return (
        <>
          <Field label={t("fields.localOrInternational")}>
            <select
              style={inputStyle}
              value={form.localOrInternational}
              onChange={(e) =>
                set("localOrInternational", Number(e.target.value))
              }
            >
              <option value={1}>{t("fields.local")}</option>
              <option value={2}>{t("fields.international")}</option>
            </select>
          </Field>
          <Field label={t("fields.nameOfProject")} error={errors.nameOfProject}>
            <input
              style={inputStyle}
              value={form.nameOfProject}
              onChange={(e) => set("nameOfProject", e.target.value)}
            />
          </Field>
          <Field label={t("fields.typeOfProject")}>
            <select
              style={inputStyle}
              value={form.typeOfProjectId}
              onChange={(e) => set("typeOfProjectId", e.target.value)}
            >
              <option value="">{t("fields.selectType")}</option>
              {projectTypeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.participationRole")}>
            <select
              style={inputStyle}
              value={form.participationRoleId}
              onChange={(e) => set("participationRoleId", e.target.value)}
            >
              <option value="">{t("fields.selectRole")}</option>
              {projectRoleLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.financingAuthority")}>
            <input
              style={inputStyle}
              value={form.financingAuthority}
              onChange={(e) => set("financingAuthority", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "reviewingArticles") {
      return (
        <>
          <Field
            label={t("fields.titleOfArticle")}
            error={errors.titleOfArticle}
          >
            <input
              style={inputStyle}
              value={form.titleOfArticle}
              onChange={(e) => set("titleOfArticle", e.target.value)}
            />
          </Field>
          <Field label={t("fields.authority")}>
            <input
              style={inputStyle}
              value={form.authority}
              onChange={(e) => set("authority", e.target.value)}
            />
          </Field>
          <Field label={t("fields.reviewingDate")} error={errors.reviewingDate}>
            <input
              type="date"
              style={inputStyle}
              value={form.reviewingDate}
              onChange={(e) => set("reviewingDate", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    // ─── Scientific Progressions ───────────────────────────────────────────
    if (subModule === "academicQualifications") {
      return (
        <>
          <Field
            label={t("fields.qualification")}
            error={errors.qualificationId}
          >
            <select
              style={inputStyle}
              value={form.qualificationId}
              onChange={(e) => set("qualificationId", e.target.value)}
            >
              <option value="">{t("fields.selectQualification")}</option>
              {academicQualificationLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.specialization")}>
            <input
              style={inputStyle}
              value={form.specialization}
              onChange={(e) => set("specialization", e.target.value)}
            />
          </Field>
          <Field label={t("fields.grade")}>
            <select
              style={inputStyle}
              value={form.gradeId}
              onChange={(e) => set("gradeId", e.target.value)}
            >
              <option value="">{t("fields.selectGrade")}</option>
              {academicGradeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.dispatchType")}>
            <select
              style={inputStyle}
              value={form.dispatchId}
              onChange={(e) => set("dispatchId", e.target.value)}
            >
              <option value="">{t("fields.selectDispatchType")}</option>
              {dispatchTypeLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.universityOrFaculty")}>
            <input
              style={inputStyle}
              value={form.universityOrFaculty}
              onChange={(e) => set("universityOrFaculty", e.target.value)}
            />
          </Field>
          <Field label={t("fields.countryOrCity")}>
            <input
              style={inputStyle}
              value={form.countryOrCity}
              onChange={(e) => set("countryOrCity", e.target.value)}
            />
          </Field>
          <Field
            label={t("fields.dateOfObtainingTheQualification")}
            error={errors.dateOfObtainingTheQualification}
          >
            <input
              type="date"
              style={inputStyle}
              value={form.dateOfObtainingTheQualification}
              onChange={(e) =>
                set("dateOfObtainingTheQualification", e.target.value)
              }
            />
          </Field>
          <AttachmentsSection
            existing={existingAttachments}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            t={t}
          />
        </>
      );
    }

    if (subModule === "administrativePositions") {
      return (
        <>
          <Field label={t("fields.position")} error={errors.position}>
            <input
              style={inputStyle}
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.startDate")} error={errors.startDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.endDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.notes")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "jobRanks") {
      return (
        <>
          <Field label={t("fields.jobRank")} error={errors.jobRankId}>
            <select
              style={inputStyle}
              value={form.jobRankId}
              onChange={(e) => set("jobRankId", e.target.value)}
            >
              <option value="">{t("fields.selectJobRank")}</option>
              {jobRankLookups.map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.dateOfJobRank")} error={errors.dateOfJobRank}>
            <input
              type="date"
              style={inputStyle}
              value={form.dateOfJobRank}
              onChange={(e) => set("dateOfJobRank", e.target.value)}
            />
          </Field>
          <Field label={t("fields.notes")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "patents") {
      return (
        <>
          <Field label={t("fields.localOrInternational")}>
            <select
              style={inputStyle}
              value={form.localOrInternational}
              onChange={(e) =>
                set("localOrInternational", Number(e.target.value))
              }
            >
              <option value={1}>{t("fields.local")}</option>
              <option value={2}>{t("fields.international")}</option>
            </select>
          </Field>
          <Field label={t("fields.nameOfPatent")} error={errors.nameOfPatent}>
            <input
              style={inputStyle}
              value={form.nameOfPatent}
              onChange={(e) => set("nameOfPatent", e.target.value)}
            />
          </Field>
          <Field label={t("fields.accreditingAuthorityOrCountry")}>
            <input
              style={inputStyle}
              value={form.accreditingAuthorityOrCountry}
              onChange={(e) =>
                set("accreditingAuthorityOrCountry", e.target.value)
              }
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.applyingDate")} error={errors.applyingDate}>
              <input
                type="date"
                style={inputStyle}
                value={form.applyingDate}
                onChange={(e) => set("applyingDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.accreditationDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.accreditationDate}
                onChange={(e) => set("accreditationDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <AttachmentsSection
            existing={existingAttachments}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            t={t}
          />
        </>
      );
    }

    if (subModule === "scientificWritings") {
      return (
        <>
          <Field label={t("fields.writingTitle")} error={errors.title}>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label={t("fields.authorRole")}>
            <select
              style={inputStyle}
              value={form.authorRoleId}
              onChange={(e) => set("authorRoleId", e.target.value)}
            >
              <option value="">{t("fields.selectRole")}</option>
              {(authorRoleLookups || []).map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.isbn")}>
            <input
              style={inputStyle}
              value={form.isbn}
              onChange={(e) => set("isbn", e.target.value)}
            />
          </Field>
          <Field label={t("fields.publishingHouse")}>
            <input
              style={inputStyle}
              value={form.publishingHouse}
              onChange={(e) => set("publishingHouse", e.target.value)}
            />
          </Field>
          <Field
            label={t("fields.publishingDate")}
            error={errors.publishingDate}
          >
            <input
              type="date"
              style={inputStyle}
              value={form.publishingDate}
              onChange={(e) => set("publishingDate", e.target.value)}
            />
          </Field>
          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </>
      );
    }

    if (subModule === "thesesSupervisings") {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.thesisType")}>
              <select
                style={inputStyle}
                value={form.type}
                onChange={(e) => set("type", Number(e.target.value))}
              >
                <option value={1}>{t("fields.phd")}</option>
                <option value={2}>{t("fields.master")}</option>
              </select>
            </Field>
            <Field label={t("fields.supervisionRole")}>
              <select
                style={inputStyle}
                value={form.facultyMemberRole}
                onChange={(e) =>
                  set("facultyMemberRole", Number(e.target.value))
                }
              >
                <option value={1}>
                  {t("fields.supervisionAdministrator")}
                </option>
                <option value={2}>{t("fields.supervisionReviewer")}</option>
                <option value={3}>
                  {t("fields.supervisionAdministratorAndReviewer")}
                </option>
              </select>
            </Field>
          </div>
          <Field label={t("fields.thesisTitle")} error={errors.title}>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label={t("fields.studentName")} error={errors.studentName}>
            <input
              style={inputStyle}
              value={form.studentName}
              onChange={(e) => set("studentName", e.target.value)}
            />
          </Field>
          <Field label={t("fields.specialization")}>
            <input
              style={inputStyle}
              value={form.specialization}
              onChange={(e) => set("specialization", e.target.value)}
            />
          </Field>
          <Field label={t("fields.grade")}>
            <select
              style={inputStyle}
              value={form.gradeId}
              onChange={(e) => set("gradeId", e.target.value)}
            >
              <option value="">{t("fields.selectGrade")}</option>
              {(academicGradeLookups || []).map((lk) => (
                <option key={lk.id} value={lk.id}>
                  {isAr ? lk.valueAr || lk.valueEn : lk.valueEn || lk.valueAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.universityOrFaculty")}>
            <input
              style={inputStyle}
              value={form.universityOrFaculty}
              onChange={(e) => set("universityOrFaculty", e.target.value)}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
            }}
          >
            <Field label={t("fields.registrationDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.registrationDate}
                onChange={(e) => set("registrationDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.supervisionFormationDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.supervisionFormationDate}
                onChange={(e) =>
                  set("supervisionFormationDate", e.target.value)
                }
              />
            </Field>
            <Field label={t("fields.discussionDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.discussionDate}
                onChange={(e) => set("discussionDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.grantingDate")}>
              <input
                type="date"
                style={inputStyle}
                value={form.grantingDate}
                onChange={(e) => set("grantingDate", e.target.value)}
              />
            </Field>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        dir={dir}
        style={{
          width: "clamp(320px, 42vw, 760px)",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "clamp(0.9rem, 1.3vw, 2rem) clamp(1.1rem, 1.8vw, 2.5rem)",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(0.9rem, 1.2vw, 1.7rem)",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {mode === "add" ? t("addTitle") : t("editTitle")}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <X
              style={{
                width: "clamp(15px, 1.2vw, 20px)",
                height: "clamp(15px, 1.2vw, 20px)",
                color: "#6b7280",
              }}
            />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            overflowY: "auto",
            padding: "clamp(0.9rem, 1.3vw, 2rem) clamp(1.1rem, 1.8vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.7rem, 1vw, 1.4rem)",
          }}
        >
          {renderFields()}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3"
          style={{
            padding: "clamp(0.7rem, 1vw, 1.5rem) clamp(1.1rem, 1.8vw, 2.5rem)",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-xl font-medium transition hover:bg-gray-100"
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.8rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
              border: "1px solid #e5e7eb",
              color: "#374151",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.8rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving && (
              <Loader2
                style={{
                  width: "clamp(12px, 1vw, 16px)",
                  height: "clamp(12px, 1vw, 16px)",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AttachmentsSection ───────────────────────────────────────────────────────

function AttachmentsSection({ existing, newFiles, setNewFiles, t }) {
  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeNew = (idx) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <label style={labelStyle}>{t("fields.attachments")}</label>

      {/* Existing */}
      {existing.length > 0 && (
        <div
          className="flex flex-col gap-1 mb-2"
          style={{ marginBottom: "0.5rem" }}
        >
          {existing.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2"
              style={{
                fontSize: "clamp(0.6rem, 0.8vw, 1rem)",
                color: "#374151",
              }}
            >
              <Paperclip
                style={{
                  width: "clamp(10px, 0.85vw, 14px)",
                  height: "clamp(10px, 0.85vw, 14px)",
                  color: "#2563eb",
                }}
              />
              <span style={{ flex: 1 }}>{att.fileName}</span>
              <span style={{ color: "#9ca3af" }}>
                ({Math.round(att.size / 1024)} KB)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* New files pending upload */}
      {newFiles.length > 0 && (
        <div className="flex flex-col gap-1 mb-2">
          {newFiles.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
              style={{
                fontSize: "clamp(0.6rem, 0.8vw, 1rem)",
                color: "#374151",
              }}
            >
              <Paperclip
                style={{
                  width: "clamp(10px, 0.85vw, 14px)",
                  height: "clamp(10px, 0.85vw, 14px)",
                  color: "#059669",
                }}
              />
              <span style={{ flex: 1 }}>{f.name}</span>
              <button
                type="button"
                onClick={() => removeNew(idx)}
                style={{ color: "#dc2626" }}
              >
                <Trash2
                  style={{
                    width: "clamp(10px, 0.85vw, 14px)",
                    height: "clamp(10px, 0.85vw, 14px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File picker */}
      <label
        className="flex items-center gap-2 cursor-pointer rounded-xl transition hover:bg-blue-50"
        style={{
          padding:
            "clamp(0.35rem, 0.55vw, 0.8rem) clamp(0.6rem, 0.9vw, 1.3rem)",
          border: "1px dashed #bfdbfe",
          backgroundColor: "#eff6ff",
          fontSize: "clamp(0.62rem, 0.8vw, 1.1rem)",
          color: "#2563eb",
          display: "inline-flex",
        }}
      >
        <Paperclip
          style={{
            width: "clamp(12px, 1vw, 16px)",
            height: "clamp(12px, 1vw, 16px)",
          }}
        />
        {t("fields.addAttachment")}
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
