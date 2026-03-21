import { useTranslation } from "react-i18next";
import {
  Briefcase,
  GraduationCap,
  Trophy,
  Star,
  X,
  Users,
  Building2,
  CheckSquare,
  Rocket,
  Presentation,
  ClipboardList,
  GitCommit,
  BookOpen,
  FolderKanban,
  FileSearch,
  Award,
  BarChart3,
  Layers,
  ScrollText,
  PenLine,
  FlaskConical,
  BookMarked,
  Lightbulb,
  GraduationCap as ThesisIcon,
  ListChecks,
  FileStack,
} from "lucide-react";

// ─── Module → sub-modules map ─────────────────────────────────────────────────

export const MODULE_SUBMODULES = {
  FacultyMemberExperincesData: [
    {
      key: "teachingExperiences",
      icon: GraduationCap,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      key: "generalExperiences",
      icon: Briefcase,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ],
  FacultyMemberPrizesData: [
    {
      key: "prizesAndRewards",
      icon: Trophy,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      key: "manifestations",
      icon: Star,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ],
  FacultyMemberContributionsData: [
    {
      key: "communityServiceContributions",
      icon: Users,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      key: "universityContributions",
      icon: Building2,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      key: "participationInQualityWorks",
      icon: CheckSquare,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ],
  FacultyMemberMissionsData: [
    {
      key: "scientificMissions",
      icon: Rocket,
      color: "#0284c7",
      bg: "#f0f9ff",
    },
    {
      key: "seminarsAndConferences",
      icon: Presentation,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      key: "trainingPrograms",
      icon: ClipboardList,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ],
  FacultyMemberProjectsAndComiteesData: [
    {
      key: "committeesAndAssociations",
      icon: GitCommit,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      key: "participationInMagazines",
      icon: BookOpen,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      key: "projects",
      icon: FolderKanban,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      key: "reviewingArticles",
      icon: FileSearch,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ],
  FacultyMemberScientificProgressionData: [
    {
      key: "academicQualifications",
      icon: GraduationCap,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      key: "administrativePositions",
      icon: Layers,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      key: "jobRanks",
      icon: BarChart3,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ],
  FacultyMemberWritingsData: [
    {
      key: "patents",
      icon: ScrollText,
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      key: "scientificWritings",
      icon: PenLine,
      color: "#d97706",
      bg: "#fffbeb",
    },
  ],
  FacultyMemberResearchesData: [
    {
      key: "researcherProfile",
      icon: FlaskConical,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      key: "researches",
      icon: BookMarked,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      key: "recommendedResearches",
      icon: Lightbulb,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ],
  FacultyMemberHigherStudiesData: [
    {
      key: "thesesSupervisings",
      icon: ThesisIcon,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      key: "recommendedThesesSupervisings",
      icon: ListChecks,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      key: "theses",
      icon: FileStack,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ],
};

export default function SubModuleSelectorModal({
  moduleType,
  targetUser,
  onSelect,
  onClose,
}) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isAr = i18n.language === "ar";

  const subModules = MODULE_SUBMODULES[moduleType] || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        dir={i18n.dir()}
        style={{
          width: "clamp(300px, 36vw, 640px)",
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
          <div>
            <h2
              style={{
                fontSize: "clamp(0.9rem, 1.2vw, 1.7rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("subModuleSelector.title")}
            </h2>
            <p
              style={{
                fontSize: "clamp(0.62rem, 0.8vw, 1.1rem)",
                color: "#6b7280",
                marginTop: "0.15rem",
              }}
            >
              <strong>{targetUser?.name}</strong>
              {" — "}
              {t(`subModuleSelector.moduleLabel.${moduleType}`, moduleType)}
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Sub-module grid */}
        <div
          style={{
            padding: "clamp(0.9rem, 1.3vw, 2rem) clamp(1.1rem, 1.8vw, 2.5rem)",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(130px, 13vw, 240px), 1fr))",
            gap: "clamp(0.6rem, 0.9vw, 1.4rem)",
          }}
        >
          {subModules.map(({ key, icon: Icon, color, bg }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="text-start rounded-2xl border transition hover:shadow-md hover:border-blue-300"
              style={{
                padding: "clamp(0.7rem, 1.1vw, 1.6rem)",
                borderColor: "#e5e7eb",
                backgroundColor: "#fafafa",
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl mb-2"
                style={{
                  width: "clamp(32px, 2.5vw, 48px)",
                  height: "clamp(32px, 2.5vw, 48px)",
                  backgroundColor: bg,
                }}
              >
                <Icon
                  style={{
                    width: "clamp(14px, 1.3vw, 22px)",
                    height: "clamp(14px, 1.3vw, 22px)",
                    color,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "clamp(0.7rem, 0.92vw, 1.2rem)",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {t(`subModules.${key}`)}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.58rem, 0.75vw, 1rem)",
                  color: "#6b7280",
                  marginTop: "0.15rem",
                }}
              >
                {t(`subModulesDesc.${key}`)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
