import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  RefreshCw,
  FileText,
  Settings2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useCV from "../hooks/useCV";
import useCVManage from "../hooks/useCVManage";
import { downloadCV } from "../services/cv.service";

// استيراد التمبليتات (تأكد من المسارات عندك)
import CVTemplate1 from "../components/widgets/CV/CVTemplate1";
import CVTemplate3 from "../components/widgets/CV/CVTemplate3";
import CVTemplate4 from "../components/widgets/CV/CVTemplate4";

const TEMPLATES = [
  { id: 1, key: "modern" },
  { id: 2, key: "academic" },
  { id: 3, key: "professional" },
];

const TEMPLATE_COMPONENTS = {
  1: CVTemplate1,
  2: CVTemplate3,
  3: CVTemplate4,
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

// --- خريطة التحكم العامة (Public Master Keys) ---
const SECTION_MASTER_PUBLIC = Object.fromEntries(
  Object.entries(SECTION_MASTER).map(([k, v]) => [k, v + "ForPublic"]),
);

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

// --- مكونات واجهة المستخدم ---
function MiniCheckbox({ checked, onChange, dimmed, color }) {
  return (
    <div
      onClick={dimmed ? undefined : onChange}
      style={{
        width: "15px",
        height: "15px",
        borderRadius: 3,
        border: `2px solid ${checked && !dimmed ? color : "#cbd5e1"}`,
        background: checked && !dimmed ? color : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: dimmed ? "default" : "pointer",
        opacity: dimmed ? 0.38 : 1,
        flexShrink: 0,
        transition: "0.15s",
      }}
    >
      {checked && !dimmed && (
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
  );
}

function MiniToggle({ checked, onChange, color }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: "26px",
        height: "14px",
        borderRadius: 99,
        background: checked ? color : "rgba(255,255,255,0.3)",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: checked ? "13px" : "2px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#fff",
          transition: "0.2s",
        }}
      />
    </div>
  );
}

function DualFieldRow({
  fieldKey,
  sectionKey,
  visibility,
  toggle,
  t,
  privDisabled,
  pubDisabled,
}) {
  const privChecked = visibility[sectionKey]?.[fieldKey] ?? true;
  const pubChecked = visibility[sectionKey]?.[fieldKey + "ForPublic"] ?? true;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 0",
      }}
    >
      <span
        style={{
          flex: 1,
          fontSize: "0.72rem",
          color: "#334155",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {t(`manage.fields.${fieldKey}`)}
      </span>
      <MiniCheckbox
        checked={privChecked}
        onChange={() => toggle(sectionKey, fieldKey)}
        dimmed={privDisabled}
        color="#b38e19"
      />
      <MiniCheckbox
        checked={pubChecked}
        onChange={() => toggle(sectionKey, fieldKey + "ForPublic")}
        dimmed={pubDisabled}
        color="#0ea5e9"
      />
    </div>
  );
}

function SectionCard({ sectionKey, fields, visibility, toggle, t, isArabic }) {
  const masterPrivKey = SECTION_MASTER[sectionKey];
  const masterPubKey = SECTION_MASTER_PUBLIC[sectionKey];
  const privEnabled = visibility[sectionKey]?.[masterPrivKey] ?? true;
  const pubEnabled = visibility[sectionKey]?.[masterPubKey] ?? true;
  const eitherEnabled = privEnabled || pubEnabled;
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        marginBottom: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "7px 10px",
          background: eitherEnabled ? "#19355a" : "#94a3b8",
          gap: "8px",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.72rem",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t(`manage.sections.${sectionKey}`)}
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "#f0c040",
              fontSize: "0.55rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {isArabic ? "خاص" : "Priv"}
          </span>
          <MiniToggle
            checked={privEnabled}
            onChange={() => toggle(sectionKey, masterPrivKey)}
            color="#b38e19"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "#7dd3fc",
              fontSize: "0.55rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {isArabic ? "عام" : "Pub"}
          </span>
          <MiniToggle
            checked={pubEnabled}
            onChange={() => toggle(sectionKey, masterPubKey)}
            color="#0ea5e9"
          />
        </div>
      </div>
      {eitherEnabled && (
        <div style={{ padding: "4px 10px 6px 10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "6px",
              marginBottom: "3px",
              paddingBottom: "3px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                color: "#b38e19",
                fontWeight: 700,
                width: "15px",
                textAlign: "center",
              }}
            >
              🔒
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "#0ea5e9",
                fontWeight: 700,
                width: "15px",
                textAlign: "center",
              }}
            >
              🌐
            </span>
          </div>
          {fields.map((field) => (
            <DualFieldRow
              key={field}
              fieldKey={field}
              sectionKey={sectionKey}
              visibility={visibility}
              toggle={toggle}
              t={t}
              privDisabled={!privEnabled}
              pubDisabled={!pubEnabled}
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
  const {
    visibility,
    toggle,
    save,
    loading: saveLoading,
    success,
    setSuccess,
    error: saveError,
  } = useCVManage();
  const [downloading, setDownloading] = useState(false);

  const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate];

  const handleDownload = async () => {
    const templateKey =
      TEMPLATES.find((tpl) => tpl.id === selectedTemplate)?.key ?? "modern";
    setDownloading(true);
    try {
      const response = await downloadCV(templateKey, false);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cv-${templateKey}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "12px", background: "#f8fafc", minHeight: "100vh" }}
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
              onClick={handleDownload}
              disabled={loading || !data || downloading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: downloading ? "#94a3b8" : "#b38e19",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: downloading ? "not-allowed" : "pointer",
              }}
            >
              {downloading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}{" "}
              {t("download", "Download CV")}
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
          <div style={{ width: "360px", position: "sticky", top: "20px" }}>
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
                  marginBottom: "12px",
                }}
              >
                <Settings2 size={20} color="#19355a" />
                <h3
                  style={{
                    fontWeight: 800,
                    color: "#19355a",
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {t("manage.pageTitle")}
                </h3>
              </div>

              {/* Save Button */}
              <button
                onClick={save}
                disabled={saveLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: saveLoading ? "#94a3b8" : "#19355a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: saveLoading ? "not-allowed" : "pointer",
                  fontSize: "0.82rem",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                {saveLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saveLoading ? t("manage.saving") : t("manage.save")}
              </button>
              {success && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#16a34a",
                    fontSize: "0.77rem",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSuccess(false)}
                >
                  <CheckCircle size={14} />
                  {t("manage.saveSuccess")}
                </div>
              )}
              {saveError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#dc2626",
                    fontSize: "0.77rem",
                    marginBottom: "8px",
                  }}
                >
                  <AlertCircle size={14} />
                  {t("manage.saveError")}
                </div>
              )}

              {/* Scrollable list of 22 sections */}
              <div
                style={{
                  maxHeight: "calc(100vh - 320px)",
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
