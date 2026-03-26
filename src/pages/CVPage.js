import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Printer,
  RefreshCw,
  FileText,
  Settings2,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useCV from "../hooks/useCV";
import useCVManage from "../hooks/useCVManage";

// استيراد التمبليتات (تأكد من المسارات عندك)
import CVTemplate1 from "../components/widgets/CV/CVTemplate1";
import CVTemplate2 from "../components/widgets/CV/CVTemplate2";
import CVTemplate3 from "../components/widgets/CV/CVTemplate3";
import CVTemplate4 from "../components/widgets/CV/CVTemplate4";
import CVTemplate5 from "../components/widgets/CV/CVTemplate5";

const TEMPLATES = [
  { id: 1, key: "modern" },
  { id: 2, key: "classic" },
  { id: 3, key: "academic" },
  { id: 4, key: "professional" },
  { id: 5, key: "timeline" },
];

const TEMPLATE_COMPONENTS = {
  1: CVTemplate1,
  2: CVTemplate2,
  3: CVTemplate3,
  4: CVTemplate4,
  5: CVTemplate5,
};

// --- خريطة التحكم الرئيسية (Master Keys) ---
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

// --- مصفوفة السكاشن الكاملة (22 سكشن) ---
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
  { key: "jobRanks", fields: ["showJobRank", "showDateOfJobRank"] },
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

// --- مكونات واجهة المستخدم (Checkbox & Card) ---
function CheckboxItem({ checked, onChange, label, dimmed }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        opacity: dimmed ? 0.45 : 1,
        fontSize: "0.75rem",
        color: "#334155",
        padding: "3px 0",
      }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          if (!dimmed) onChange();
        }}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: 4,
          border: `2px solid ${checked ? "#b38e19" : "#cbd5e1"}`,
          background: checked ? "#b38e19" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "0.15s",
        }}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
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
        borderRadius: "8px",
        border: `1px solid #e2e8f0`,
        overflow: "hidden",
        marginBottom: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          background: sectionEnabled ? "#19355a" : "#94a3b8",
          cursor: "pointer",
        }}
        onClick={() => toggle(sectionKey, masterKey)}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}>
          {t(`manage.sections.${sectionKey}`)}
        </span>
        <div
          style={{
            width: "26px",
            height: "14px",
            borderRadius: 99,
            background: sectionEnabled ? "#b38e19" : "rgba(255,255,255,0.4)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [isArabic ? "right" : "left"]: sectionEnabled ? "14px" : "2px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#fff",
              transition: "0.2s",
            }}
          />
        </div>
      </div>
      {sectionEnabled && (
        <div
          style={{
            padding: "6px 10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {fields.map((field) => (
            <CheckboxItem
              key={field}
              checked={visibility[sectionKey]?.[field] ?? true}
              onChange={() => toggle(sectionKey, field)}
              label={t(`manage.fields.${field}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CVPage() {
  const { t, i18n } = useTranslation("CV");
  const isArabic = i18n.language === "ar";
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const { data, loading, error, reload } = useCV();
  const { visibility, toggle } = useCVManage();

  const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate];

  const handlePrint = () => {
    const area = document.getElementById("cv-print-area");
    if (!area) return;
    const content = area.outerHTML;
    const win = window.open("", "_blank", "width=1000,height=800");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html dir="${isArabic ? "rtl" : "ltr"}">
      <head>
        <meta charset="UTF-8"/>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter:wght@400;700&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:${isArabic ? "'Cairo'" : "'Inter'"}, sans-serif; padding: 20px;}
          @media print { body { padding: 0; } @page { margin: 1cm; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 500);
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "20px", background: "#f8fafc", minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "#19355a",
                p: "8px",
                borderRadius: "8px",
                display: "flex",
              }}
            >
              <FileText color="#fff" size={24} />
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#19355a",
                margin: 0,
              }}
            >
              {t("pageTitle")}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handlePrint}
              disabled={loading || !data}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "#b38e19",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Printer size={18} /> {t("print")}
            </button>
          </div>
        </div>

        {/* Main Flex Container (Aligned Start/Top) */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Main Area (Templates) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Tabs Selector */}
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "12px",
                border: "1px solid #e2e8f0",
                marginBottom: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginInlineEnd: "10px",
                }}
              >
                {t("chooseTemplate")}:
              </span>
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "0.2s",
                    background:
                      selectedTemplate === tpl.id ? "#19355a" : "#fff",
                    color: selectedTemplate === tpl.id ? "#fff" : "#19355a",
                    border: `2px solid ${selectedTemplate === tpl.id ? "#19355a" : "#e2e8f0"}`,
                  }}
                >
                  {tpl.id}. {t(`templates.${tpl.key}`)}
                </button>
              ))}
            </div>

            {/* Template Render */}
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  p: "100px",
                }}
              >
                <RefreshCw className="animate-spin" color="#19355a" size={40} />
              </div>
            ) : (
              data && (
                <div
                  id="cv-print-area"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 25px rgba(0,0,0,0.06)",
                    borderRadius: "10px",
                    border: "1px solid #eee",
                  }}
                >
                  <TemplateComponent
                    data={data}
                    isArabic={isArabic}
                    t={t}
                    visibility={visibility}
                  />
                </div>
              )
            )}
          </div>

          {/* Right Sidebar (Manage Sections) */}
          <div style={{ width: "320px", position: "sticky", top: "20px" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Settings2 size={20} color="#19355a" />
                <h3 style={{ fontWeight: 800, color: "#19355a", margin: 0 }}>
                  {t("manage.pageTitle")}
                </h3>
              </div>

              {/* Scrollable list of 22 sections */}
              <div
                style={{
                  maxHeight: "calc(100vh - 220px)",
                  overflowY: "auto",
                  paddingRight: "6px",
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


            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </ResponsiveLayoutProvider>
  );
}
