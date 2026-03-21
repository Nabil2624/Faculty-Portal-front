import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Settings2,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useCVManage from "../hooks/useCVManage";

// Maps each section key to its "show section" master field name
const SECTION_MASTER = {
  personalData: "showPersonalData",
  contactInfo: "showContactInfo",
  socialMedia: "showSocialMedia",
  academicQualifications: "showAcademicQualifications",
  jobRanks: "showJobRanks",
  administrativePositions: "showAdministrativePositions",
  conferencesAndSeminars: "showConferencesAndSeminars",
  scientificMissions: "showScientificMissions",
  trainingPrograms: "showTrainingPrograms",
  committeesAndAssociations: "showCommitteesAndAssociations",
  participationInMagazines: "showParticipationInMagazines",
  reviewingArticles: "showReviewingArticles",
  projects: "showProjects",
  teachingExperiences: "showTeachingExperiences",
  generalExperiences: "showGeneralExperiences",
  scientificWritings: "showScientificWritings",
  patents: "showPatents",
  prizesAndRewards: "showPrizesAndRewards",
  manifestationsOfScientificAppreciation:
    "showManifestationsOfScientificAppreciation",
  contributionsToCommunityService: "showContributionsToCommunityService",
  contributionsToUniversity: "showContributionsToUniversity",
  participationInQualityWork: "showparticipationsInQualityWork",
};

// ALL section definitions in display order
const SECTIONS = [
  {
    key: "personalData",
    fields: [
      "showUniversity",
      "showAuthority",
      "showDepartment",
      "showBirthDate",
      "showProfilePicture",
      "showSkills",
    ],
  },
  {
    key: "contactInfo",
    fields: ["showMainPhone", "showWorkPhone", "showOfficialEmail", "showFax"],
  },
  {
    key: "socialMedia",
    fields: [
      "showLinkedIn",
      "showInstagram",
      "showPersonalWebsite",
      "showGoogleScholar",
      "showScopus",
      "showFacebook",
      "showX",
      "showYouTube",
    ],
  },
  {
    key: "academicQualifications",
    fields: [
      "showQualification",
      "showSpecialization",
      "showGrade",
      "showDispatchType",
      "showUniversityOrFaculty",
      "showCountryOrCity",
      "showDateOfObtainingTheQualification",
    ],
  },
  {
    key: "jobRanks",
    fields: ["showJobRank", "showDateOfJobRank"],
  },
  {
    key: "administrativePositions",
    fields: ["showPosition", "showPositionStartDate", "showPositionEndDate"],
  },
  {
    key: "conferencesAndSeminars",
    fields: [
      "showConferenceOrSeminarName",
      "showConferenceOrSeminarRoleOfParticipation",
      "showConferenceOrSeminarOrganizingAuthority",
      "showConferenceOrSeminarWebsite",
      "showConferenceOrSeminarStartDate",
      "showConferenceOrSeminarEndDate",
      "showConferenceOrSeminarVenue",
    ],
  },
  {
    key: "scientificMissions",
    fields: [
      "showMissionName",
      "showMissionStartDate",
      "showMissionEndDate",
      "showMissionUniversityOrFaculty",
      "showMissionCountryOrCity",
    ],
  },
  {
    key: "trainingPrograms",
    fields: [
      "showTrainingProgramName",
      "showTrainingProgramVenue",
      "showTrainingProgramStartDate",
      "showTrainingProgramEndDate",
    ],
  },
  {
    key: "committeesAndAssociations",
    fields: [
      "showNameOfCommitteeOrAssociation",
      "showTypeOfCommitteeOrAssociation",
      "showDegreeOfSubscription",
      "showCommitteesAndAssociationsStartDate",
      "showCommitteesAndAssociationsEndDate",
    ],
  },
  {
    key: "participationInMagazines",
    fields: [
      "showNameOfMagazine",
      "showWebsiteOfMagazine",
      "showTypeOfParticipation",
    ],
  },
  {
    key: "reviewingArticles",
    fields: ["showTitleOfArticle", "showAuthority", "showReviewingDate"],
  },
  {
    key: "projects",
    fields: [
      "showNameOfProject",
      "showTypeOfProject",
      "showParticipationRole",
      "showFinancingAuthority",
      "showProjectStartDate",
      "showProjectEndDate",
    ],
  },
  {
    key: "teachingExperiences",
    fields: [
      "showCourseName",
      "showAcademicLevel",
      "showUniversityOrFaculty",
      "showTeachingExperienceStartDate",
      "showTeachingExperienceEndDate",
    ],
  },
  {
    key: "generalExperiences",
    fields: [
      "showExperienceTitle",
      "showAuthority",
      "showCountryOrCity",
      "showStartDate",
      "showEndDate",
    ],
  },
  {
    key: "scientificWritings",
    fields: [
      "showTitle",
      "showAuthorRole",
      "showISBN",
      "showPublishingHouse",
      "showPublishingDate",
    ],
  },
  {
    key: "patents",
    fields: [
      "showNameOfPatent",
      "showAccreditingAuthorityOrCountry",
      "showAccreditationDate",
    ],
  },
  {
    key: "prizesAndRewards",
    fields: ["showPrizeName", "showawardingAuthority", "showDateReceived"],
  },
  {
    key: "manifestationsOfScientificAppreciation",
    fields: [
      "showTitleOfAppreciation",
      "showIssuingAuthority",
      "showDateOfAppreciation",
    ],
  },
  {
    key: "contributionsToCommunityService",
    fields: ["showContributionTitle", "showDateOfContribution"],
  },
  {
    key: "contributionsToUniversity",
    fields: [
      "showContributionTitle",
      "showTypeOfContribution",
      "showDateOfContribution",
    ],
  },
  {
    key: "participationInQualityWork",
    fields: [
      "showparticipationTitle",
      "showParticipationStartDate",
      "showParticipationEndDate",
    ],
  },
];

function CheckboxItem({ checked, onChange, label, dimmed }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(6px,0.6vw,10px)",
        cursor: "pointer",
        opacity: dimmed ? 0.45 : 1,
        fontSize: "clamp(0.62rem,0.78vw,0.86rem)",
        color: "#334155",
        padding: "clamp(3px,0.3vw,5px) 0",
      }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          if (!dimmed) onChange();
        }}
        style={{
          width: "clamp(16px,1.5vw,22px)",
          height: "clamp(16px,1.5vw,22px)",
          borderRadius: 4,
          border: `2px solid ${checked ? "#19355a" : "#cbd5e1"}`,
          background: checked ? "#19355a" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: dimmed ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}

function SectionCard({ sectionKey, fields, visibility, toggle, t, isArabic }) {
  const masterKey = SECTION_MASTER[sectionKey];
  const sectionEnabled = visibility[sectionKey]?.[masterKey] ?? true;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "clamp(6px,0.7vw,12px)",
        border: `1px solid #e2e8f0`,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(25,53,90,0.06)",
      }}
    >
      {/* Card header — master toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(10px,1.1vw,18px)",
          background: sectionEnabled ? "#19355a" : "#64748b",
          transition: "background 0.2s",
          cursor: "pointer",
        }}
        onClick={() => toggle(sectionKey, masterKey)}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "clamp(0.68rem,0.88vw,0.96rem)",
          }}
        >
          {t(`manage.sections.${sectionKey}`)}
        </span>
        <div
          style={{
            width: "clamp(36px,3.5vw,52px)",
            height: "clamp(18px,1.8vw,26px)",
            borderRadius: 99,
            background: sectionEnabled ? "#b38e19" : "rgba(255,255,255,0.25)",
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: sectionEnabled
                ? isArabic
                  ? "clamp(3px,0.3vw,5px)"
                  : "calc(100% - clamp(15px,1.5vw,22px) - clamp(3px,0.3vw,5px))"
                : isArabic
                  ? "calc(100% - clamp(15px,1.5vw,22px) - clamp(3px,0.3vw,5px))"
                  : "clamp(3px,0.3vw,5px)",
              width: "clamp(13px,1.3vw,20px)",
              height: "clamp(13px,1.3vw,20px)",
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
            }}
          />
        </div>
      </div>

      {/* Field checkboxes */}
      <div
        style={{
          padding: "clamp(8px,1vw,16px)",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(140px,16vw,240px), 1fr))",
          gap: "clamp(2px,0.3vw,6px)",
        }}
      >
        {fields.map((field) => (
          <CheckboxItem
            key={field}
            checked={visibility[sectionKey]?.[field] ?? true}
            onChange={() => toggle(sectionKey, field)}
            label={t(`manage.fields.${field}`)}
            dimmed={!sectionEnabled}
          />
        ))}
      </div>
    </div>
  );
}

export default function ManageCVPage() {
  const { t, i18n } = useTranslation("CV");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { visibility, toggle, save, loading, error, success, setSuccess } =
    useCVManage();

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(8px,1vw,24px)" }}
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(8px,1vw,16px)",
            marginBottom: "clamp(14px,1.5vw,24px)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(6px,0.6vw,12px)",
                marginBottom: 4,
              }}
            >
              <Settings2
                style={{
                  color: "#19355a",
                  width: "clamp(18px,1.8vw,30px)",
                  height: "clamp(18px,1.8vw,30px)",
                }}
              />
              <h1
                style={{
                  fontSize: "clamp(1rem,1.6vw,1.8rem)",
                  fontWeight: 800,
                  color: "#19355a",
                }}
              >
                {t("manage.pageTitle")}
              </h1>
            </div>
            <p
              style={{
                fontSize: "clamp(0.62rem,0.78vw,0.88rem)",
                color: "#64748b",
                marginInlineStart: "clamp(24px,2.4vw,42px)",
              }}
            >
              {t("manage.subtitle")}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "clamp(6px,0.7vw,12px)",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/cv")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px,0.4vw,8px)",
                padding: "clamp(6px,0.6vw,10px) clamp(12px,1.2vw,20px)",
                fontSize: "clamp(0.62rem,0.78vw,0.88rem)",
                fontWeight: 600,
                background: "#f1f5f9",
                color: "#19355a",
                border: "1px solid #e2e8f0",
                borderRadius: "clamp(4px,0.4vw,8px)",
                cursor: "pointer",
              }}
            >
              <BackArrow
                style={{
                  width: "clamp(14px,1.2vw,18px)",
                  height: "clamp(14px,1.2vw,18px)",
                }}
              />
              {t("manage.backToCV")}
            </button>

            <button
              onClick={save}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px,0.4vw,8px)",
                padding: "clamp(6px,0.6vw,10px) clamp(12px,1.2vw,22px)",
                fontSize: "clamp(0.62rem,0.78vw,0.88rem)",
                fontWeight: 700,
                background: loading ? "#94a3b8" : "#19355a",
                color: "#fff",
                border: "none",
                borderRadius: "clamp(4px,0.4vw,8px)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.18s",
              }}
            >
              <Save
                style={{
                  width: "clamp(14px,1.2vw,18px)",
                  height: "clamp(14px,1.2vw,18px)",
                }}
              />
              {loading ? t("manage.saving") : t("manage.save")}
            </button>
          </div>
        </div>

        {/* Toast messages */}
        {success && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              borderRadius: "clamp(4px,0.5vw,8px)",
              padding: "clamp(8px,0.8vw,14px) clamp(12px,1.2vw,20px)",
              marginBottom: "clamp(10px,1.2vw,20px)",
              fontSize: "clamp(0.65rem,0.82vw,0.9rem)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ✓ {t("manage.saveSuccess")}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "clamp(4px,0.5vw,8px)",
              padding: "clamp(8px,0.8vw,14px) clamp(12px,1.2vw,20px)",
              marginBottom: "clamp(10px,1.2vw,20px)",
              fontSize: "clamp(0.65rem,0.82vw,0.9rem)",
              fontWeight: 600,
            }}
          >
            {t("manage.saveError")}
          </div>
        )}

        {/* Section cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(260px,30vw,420px), 1fr))",
            gap: "clamp(10px,1.2vw,20px)",
          }}
        >
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.key}
              sectionKey={section.key}
              fields={section.fields}
              visibility={visibility}
              toggle={toggle}
              t={t}
              isArabic={isArabic}
            />
          ))}
        </div>

        {/* Floating save button for long pages */}
        <div
          style={{
            position: "fixed",
            bottom: "clamp(16px,2vw,32px)",
            right: isArabic ? "auto" : "clamp(16px,2vw,32px)",
            left: isArabic ? "clamp(16px,2vw,32px)" : "auto",
            zIndex: 50,
          }}
        >
          <button
            onClick={save}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(5px,0.5vw,8px)",
              padding: "clamp(10px,1vw,16px) clamp(16px,1.8vw,28px)",
              fontSize: "clamp(0.7rem,0.88vw,0.98rem)",
              fontWeight: 700,
              background: loading ? "#94a3b8" : "#b38e19",
              color: "#fff",
              border: "none",
              borderRadius: "clamp(6px,0.7vw,12px)",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(179,142,25,0.4)",
              transition: "all 0.18s",
            }}
          >
            <Save
              style={{
                width: "clamp(15px,1.4vw,20px)",
                height: "clamp(15px,1.4vw,20px)",
              }}
            />
            {loading ? t("manage.saving") : t("manage.save")}
          </button>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
