import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Paperclip, CheckCircle, XCircle } from "lucide-react";

// ─── Column configs per sub-module ────────────────────────────────────────────

export function getColumns(
  subModule,
  t,
  isAr,
  rewardLookups = [],
  contributionTypeLookups = [],
  seminarParticipationTypes = [],
  committeeTypeLookups = [],
  committeeDegreeLookups = [],
  magazineParticipationRoles = [],
  projectTypeLookups = [],
  projectRoleLookups = [],
  academicQualificationLookups = [],
  dispatchTypeLookups = [],
  academicGradeLookups = [],
  jobRankLookups = [],
  authorRoleLookups = [],
) {
  switch (subModule) {
    case "generalExperiences":
      return [
        { key: "experienceTitle", label: t("cols.title") },
        { key: "authority", label: t("cols.authority") },
        { key: "countryOrCity", label: t("cols.countryOrCity") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "teachingExperiences":
      return [
        { key: "courseName", label: t("cols.courseName") },
        { key: "academicLevel", label: t("cols.academicLevel") },
        { key: "universityOrFaculty", label: t("cols.universityOrFaculty") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "manifestations":
      return [
        { key: "titleOfAppreciation", label: t("cols.title") },
        { key: "issuingAuthority", label: t("cols.issuingAuthority") },
        {
          key: "dateOfAppreciation",
          label: t("cols.dateOfAppreciation"),
          isDate: true,
        },
        {
          key: "attachments",
          label: t("cols.attachments"),
          isAttachments: true,
        },
      ];
    case "prizesAndRewards":
      return [
        {
          key: "prize",
          label: t("cols.prize"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "awardingAuthority", label: t("cols.awardingAuthority") },
        { key: "dateReceived", label: t("cols.dateReceived"), isDate: true },
        {
          key: "attachments",
          label: t("cols.attachments"),
          isAttachments: true,
        },
      ];
    // ─── Contributions ──────────────────────────────────────────────────────
    case "communityServiceContributions":
      return [
        { key: "contributionTitle", label: t("cols.title") },
        {
          key: "dateOfContribution",
          label: t("cols.dateOfContribution"),
          isDate: true,
        },
      ];
    case "universityContributions":
      return [
        { key: "contributionTitle", label: t("cols.title") },
        {
          key: "typeOfContribution",
          label: t("cols.typeOfContribution"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "dateOfContribution",
          label: t("cols.dateOfContribution"),
          isDate: true,
        },
      ];
    case "participationInQualityWorks":
      return [
        { key: "participationTitle", label: t("cols.title") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    // ─── Missions ───────────────────────────────────────────────────────────
    case "scientificMissions":
      return [
        { key: "missionName", label: t("cols.missionName") },
        { key: "countryOrCity", label: t("cols.countryOrCity") },
        { key: "universityOrFaculty", label: t("cols.universityOrFaculty") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "seminarsAndConferences":
      return [
        { key: "name", label: t("cols.name") },
        {
          key: "type",
          label: t("cols.type"),
          render: (val) =>
            val === "Conference" ? t("fields.conference") : t("fields.seminar"),
        },
        {
          key: "localOrInternational",
          label: t("cols.localOrInternational"),
          render: (val) =>
            val === "Local" ? t("fields.local") : t("fields.international"),
        },
        { key: "organizingAuthority", label: t("cols.organizingAuthority") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
        {
          key: "attachments",
          label: t("cols.attachments"),
          isAttachments: true,
        },
      ];
    case "trainingPrograms":
      return [
        { key: "trainingProgramName", label: t("cols.trainingProgramName") },
        {
          key: "type",
          label: t("cols.type"),
          render: (val) =>
            val === "InTheSpecialty"
              ? t("fields.inTheSpecialty")
              : t("fields.outTheSpecialty"),
        },
        {
          key: "participationType",
          label: t("cols.participationType"),
          render: (val) =>
            val === "listener" ? t("fields.listener") : t("fields.lecturer"),
        },
        { key: "organizingAuthority", label: t("cols.organizingAuthority") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    // ─── Projects & Committees ──────────────────────────────────────────────
    case "committeesAndAssociations":
      return [
        {
          key: "nameOfCommitteeOrAssociation",
          label: t("cols.nameOfCommitteeOrAssociation"),
        },
        {
          key: "typeOfCommitteeOrAssociation",
          label: t("cols.typeOfCommitteeOrAssociation"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "degreeOfSubscription",
          label: t("cols.degreeOfSubscription"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "participationInMagazines":
      return [
        { key: "nameOfMagazine", label: t("cols.nameOfMagazine") },
        { key: "websiteOfMagazine", label: t("cols.websiteOfMagazine") },
        {
          key: "typeOfParticipation",
          label: t("cols.typeOfParticipation"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
      ];
    case "projects":
      return [
        { key: "nameOfProject", label: t("cols.nameOfProject") },
        {
          key: "localOrInternational",
          label: t("cols.localOrInternational"),
          render: (val) =>
            val === "Local" ? t("fields.local") : t("fields.international"),
        },
        {
          key: "typeOfProject",
          label: t("cols.typeOfProject"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "participationRole",
          label: t("cols.participationRole"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "reviewingArticles":
      return [
        { key: "titleOfArticle", label: t("cols.titleOfArticle") },
        { key: "authority", label: t("cols.authority") },
        { key: "reviewingDate", label: t("cols.reviewingDate"), isDate: true },
      ];
    // ─── Scientific Progressions ────────────────────────────────────────────
    case "academicQualifications":
      return [
        {
          key: "qualification",
          label: t("cols.qualification"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "specialization", label: t("cols.specialization") },
        {
          key: "grade",
          label: t("cols.grade"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "dispatchType",
          label: t("cols.dispatchType"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "dateOfObtainingTheQualification",
          label: t("cols.dateOfObtainingTheQualification"),
          isDate: true,
        },
        {
          key: "attachments",
          label: t("cols.attachments"),
          isAttachments: true,
        },
      ];
    case "administrativePositions":
      return [
        { key: "position", label: t("cols.position") },
        { key: "startDate", label: t("cols.startDate"), isDate: true },
        { key: "endDate", label: t("cols.endDate"), isDate: true },
      ];
    case "jobRanks":
      return [
        {
          key: "jobRank",
          label: t("cols.jobRank"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "dateOfJobRank", label: t("cols.dateOfJobRank"), isDate: true },
      ];
    case "patents":
      return [
        { key: "nameOfPatent", label: t("cols.nameOfPatent") },
        {
          key: "localOrInternational",
          label: t("cols.localOrInternational"),
          render: (val) =>
            val === "Local" ? t("fields.local") : t("fields.international"),
        },
        {
          key: "accreditingAuthorityOrCountry",
          label: t("cols.accreditingAuthorityOrCountry"),
        },
        { key: "applyingDate", label: t("cols.applyingDate"), isDate: true },
        {
          key: "accreditationDate",
          label: t("cols.accreditationDate"),
          isDate: true,
        },
        {
          key: "attachments",
          label: t("cols.attachments"),
          isAttachments: true,
        },
      ];
    case "scientificWritings":
      return [
        { key: "title", label: t("cols.writingTitle") },
        {
          key: "authorRole",
          label: t("cols.authorRole"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        { key: "isbn", label: t("cols.isbn") },
        { key: "publishingHouse", label: t("cols.publishingHouse") },
        {
          key: "publishingDate",
          label: t("cols.publishingDate"),
          isDate: true,
        },
      ];
    case "thesesSupervisings":
    case "recommendedThesesSupervisings":
      return [
        { key: "title", label: t("cols.title") },
        {
          key: "type",
          label: t("cols.thesisType"),
          render: (val) =>
            val === "PHD" ? t("fields.phd") : t("fields.master"),
        },
        {
          key: "facultyMemberRole",
          label: t("cols.supervisionRole"),
          render: (val) => {
            if (val === "Adminstrator")
              return t("fields.supervisionAdministrator");
            if (val === "Reviewer") return t("fields.supervisionReviewer");
            return t("fields.supervisionAdministratorAndReviewer");
          },
        },
        { key: "studentName", label: t("cols.studentName") },
        {
          key: "grade",
          label: t("cols.grade"),
          render: (val) => {
            if (!val) return "—";
            return isAr
              ? val.valueAr || val.valueEn
              : val.valueEn || val.valueAr;
          },
        },
        {
          key: "discussionDate",
          label: t("cols.discussionDate"),
          isDate: true,
        },
      ];
    default:
      return [];
  }
}

const CELL_PAD = "clamp(0.55rem, 0.85vw, 1.4rem) clamp(0.65rem, 1vw, 1.8rem)";
const CELL_FONT = "clamp(0.62rem, 0.82vw, 1.2rem)";

// ─── AdminDataTable ───────────────────────────────────────────────────────────
export default function AdminDataTable({
  subModule,
  items,
  onEdit,
  onDelete,
  onAccept,
  onReject,
  saving,
  pageIndex = 1,
  pageSize = 10,
  rewardLookups,
  contributionTypeLookups = [],
  seminarParticipationTypes = [],
  committeeTypeLookups = [],
  committeeDegreeLookups = [],
  magazineParticipationRoles = [],
  projectTypeLookups = [],
  projectRoleLookups = [],
  academicQualificationLookups = [],
  dispatchTypeLookups = [],
  academicGradeLookups = [],
  jobRankLookups = [],
  authorRoleLookups = [],
}) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isAr = i18n.language === "ar";

  const columns = getColumns(
    subModule,
    t,
    isAr,
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
  );

  const formatDate = (val) => {
    if (!val) return "—";
    try {
      return new Date(val).toLocaleDateString(isAr ? "ar-EG" : "en-GB");
    } catch {
      return val;
    }
  };

  const renderCell = (col, item) => {
    const val = item[col.key];
    if (col.render) return col.render(val);
    if (col.isDate) return formatDate(val);
    if (col.isAttachments) {
      const count = Array.isArray(val) ? val.length : 0;
      return (
        <span
          className="inline-flex items-center gap-1"
          style={{ color: count > 0 ? "#2563eb" : "#9ca3af" }}
        >
          <Paperclip
            style={{
              width: "clamp(10px, 0.85vw, 14px)",
              height: "clamp(10px, 0.85vw, 14px)",
            }}
          />
          {count}
        </span>
      );
    }
    return val || "—";
  };

  return (
    <div
      className="w-full overflow-x-auto rounded-2xl shadow-sm"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <table
        className="w-full border-collapse"
        style={{ minWidth: "520px", tableLayout: "auto" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <th
              style={{
                padding: CELL_PAD,
                fontSize: "clamp(0.65rem, 0.85vw, 1.25rem)",
                fontWeight: 600,
                color: "#374151",
                textAlign: "start",
              }}
            >
              #
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: CELL_PAD,
                  fontSize: "clamp(0.65rem, 0.85vw, 1.25rem)",
                  fontWeight: 600,
                  color: "#374151",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </th>
            ))}
            <th
              style={{
                padding: CELL_PAD,
                fontSize: "clamp(0.65rem, 0.85vw, 1.25rem)",
                fontWeight: 600,
                color: "#374151",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {t("actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 2}
                style={{
                  padding: "clamp(1.5rem, 3vw, 4rem)",
                  textAlign: "center",
                  fontSize: CELL_FONT,
                  color: "#9ca3af",
                }}
              >
                {t("noData")}
              </td>
            </tr>
          )}
          {items.map((item, idx) => (
            <tr
              key={item.id ?? idx}
              style={{
                backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td
                style={{
                  padding: CELL_PAD,
                  fontSize: CELL_FONT,
                  color: "#9ca3af",
                  fontWeight: 500,
                  verticalAlign: "middle",
                }}
              >
                {(pageIndex - 1) * pageSize + idx + 1}
              </td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: CELL_PAD,
                    fontSize: CELL_FONT,
                    color: "#374151",
                    verticalAlign: "middle",
                    maxWidth: "clamp(100px, 18vw, 280px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {renderCell(col, item)}
                </td>
              ))}
              <td
                style={{
                  padding: CELL_PAD,
                  verticalAlign: "middle",
                  textAlign: "center",
                }}
              >
                {subModule === "recommendedThesesSupervisings" ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onAccept && onAccept(item)}
                      disabled={saving}
                      className="flex items-center justify-center rounded-lg transition hover:bg-green-50"
                      style={{
                        padding: "clamp(0.3rem, 0.5vw, 0.7rem)",
                        border: "1px solid #86efac",
                        color: "#16a34a",
                      }}
                      title={t("accept")}
                    >
                      <CheckCircle
                        style={{
                          width: "clamp(12px, 1vw, 16px)",
                          height: "clamp(12px, 1vw, 16px)",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => onReject && onReject(item)}
                      disabled={saving}
                      className="flex items-center justify-center rounded-lg transition hover:bg-red-50"
                      style={{
                        padding: "clamp(0.3rem, 0.5vw, 0.7rem)",
                        border: "1px solid #fca5a5",
                        color: "#dc2626",
                      }}
                      title={t("reject")}
                    >
                      <XCircle
                        style={{
                          width: "clamp(12px, 1vw, 16px)",
                          height: "clamp(12px, 1vw, 16px)",
                        }}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center justify-center rounded-lg transition hover:bg-blue-50"
                      style={{
                        padding: "clamp(0.3rem, 0.5vw, 0.7rem)",
                        border: "1px solid #bfdbfe",
                        color: "#2563eb",
                      }}
                      title={t("edit")}
                    >
                      <Edit2
                        style={{
                          width: "clamp(12px, 1vw, 16px)",
                          height: "clamp(12px, 1vw, 16px)",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="flex items-center justify-center rounded-lg transition hover:bg-red-50"
                      style={{
                        padding: "clamp(0.3rem, 0.5vw, 0.7rem)",
                        border: "1px solid #fca5a5",
                        color: "#dc2626",
                      }}
                      title={t("delete")}
                    >
                      <Trash2
                        style={{
                          width: "clamp(12px, 1vw, 16px)",
                          height: "clamp(12px, 1vw, 16px)",
                        }}
                      />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
