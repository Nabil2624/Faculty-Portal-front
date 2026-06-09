// ─── ReportFilterBar ──────────────────────────────────────────────────────────
// Renders the name-search input, optional year-search input, and optional
// type/scope dropdown for the active report category.
//
// Props:
//   selectedCategory – string key from REPORT_TYPES
//   filters          – return value of useReportFilters()
//   isArabic         – boolean
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { ReportDropdown } from "./ReportDropdown";
import { ReportMultiSelect } from "./ReportMultiSelect";
import {
  getAuthorRoles,
  getMagazineParticipationRoles,
  getProjectTypes,
} from "../../../services/reports.service";

// ─── Dropdown option lists ────────────────────────────────────────────────────

const SEMINAR_TYPE_OPTIONS = [
  { value: "Seminar", label_en: "Seminars", label_ar: "ندوات" },
  { value: "Conference", label_en: "Conferences", label_ar: "مؤتمرات" },
];

const PUBLICATION_TYPE_OPTIONS = [
  { value: "Local", label_en: "Local", label_ar: "محلي" },
  { value: "International", label_en: "International", label_ar: "دولي" },
  { value: "Unspecified", label_en: "Unspecified", label_ar: "غير محدد" },
];

// Fixed year range for BIANNUAL_RESEARCH year filter
const BIANNUAL_YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => new Date().getFullYear() - i,
);

const PATENT_SCOPE_OPTIONS = [
  { value: "Local", label_en: "Local", label_ar: "محلي" },
  { value: "International", label_en: "International", label_ar: "دولي" },
];

// ─── ReportFilterBar ──────────────────────────────────────────────────────────
// Additional props for server-side report types (DETAILED_FACULTY, BIANNUAL_RESEARCH, SEMINARS_STATS):
//   serverParams        – current params object for the active server-side category
//   onServerSearch      – callback(searchString) called after debounce
//   onServerFilterChange– callback(key, value) for immediate filter changes (dropdowns)
export function ReportFilterBar({
  selectedCategory,
  filters,
  isArabic,
  serverParams,
  onServerSearch,
  onServerFilterChange,
}) {
  const { searchName, setSearchName } = filters;

  // ── Author roles lookup (for PUBLICATIONS_STATS) ───────────────────────────
  const [authorRoleOptions, setAuthorRoleOptions] = useState([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState([]);
  const [participationTypeOptions, setParticipationTypeOptions] = useState([]);

  useEffect(() => {
    if (selectedCategory !== "PUBLICATIONS_STATS") return;
    getAuthorRoles()
      .then((roles) =>
        setAuthorRoleOptions(
          roles.map((r) => ({
            value: r.valueEn ?? r.valueAr ?? String(r.id),
            label_en: r.valueEn,
            label_ar: r.valueAr,
          })),
        ),
      )
      .catch(() => setAuthorRoleOptions([]));
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== "PROJECTS_STATS") return;
    getProjectTypes()
      .then((types) =>
        setProjectTypeOptions(
          types.map((type) => ({
            value: type.valueEn,
            label_en: type.valueEn,
            label_ar: type.valueAr,
          })),
        ),
      )
      .catch(() => setProjectTypeOptions([]));
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== "JOURNALS_STATS") return;
    getMagazineParticipationRoles()
      .then((roles) =>
        setParticipationTypeOptions(
          roles.map((role) => ({
            value: role.valueEn,
            label_en: role.valueEn,
            label_ar: role.valueAr,
          })),
        ),
      )
      .catch(() => setParticipationTypeOptions([]));
  }, [selectedCategory]);

  // ── Debounced local input for server-side search ──────────────────────────
  const isServerSearch = !!onServerSearch;
  const [localSearch, setLocalSearch] = useState(serverParams?.search ?? "");
  const debounceRef = useRef(null);

  // Keep local input in sync when parent resets the search (e.g. new filter)
  useEffect(() => {
    setLocalSearch(serverParams?.search ?? "");
  }, [serverParams?.search]);

  const handleSearchChange = (value) => {
    if (isServerSearch) {
      setLocalSearch(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onServerSearch(value), 500);
    } else {
      setSearchName(value);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Name search – always shown */}
      <div className="relative flex-1" style={{ minWidth: "180px" }}>
        <Search
          className="absolute text-gray-400 pointer-events-none"
          style={{
            width: "clamp(0.8rem, 1vw, 1rem)",
            height: "clamp(0.8rem, 1vw, 1rem)",
            top: "50%",
            transform: "translateY(-50%)",
            [isArabic ? "right" : "left"]: "clamp(0.6rem, 0.9vw, 1rem)",
          }}
        />
        <input
          type="text"
          value={isServerSearch ? localSearch : searchName}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={isArabic ? "البحث بالاسم" : "Search by name"}
          className="w-full rounded-lg border border-[#19355a]/20 bg-white text-gray-700 focus:outline-none focus:border-[#19355a]/50 transition"
          style={{
            padding: `clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1.1rem)`,
            paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
            fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
            direction: isArabic ? "rtl" : "ltr",
          }}
        />
      </div>

      {selectedCategory === "PROJECTS_STATS" && (
        <ReportMultiSelect
          value={serverParams?.typesOfProject ?? []}
          onChange={(val) => onServerFilterChange?.("typesOfProject", val)}
          options={projectTypeOptions.map((type) => ({
            value: type.value,
            label: isArabic ? type.label_ar : type.label_en,
          }))}
          placeholder={isArabic ? "كل الأنواع" : "All types"}
          isArabic={isArabic}
          minWidth="180px"
        />
      )}

      {selectedCategory === "SEMINARS_STATS" && (
        <ReportDropdown
          value={serverParams?.type ?? ""}
          onChange={(val) => onServerFilterChange?.("type", val)}
          options={SEMINAR_TYPE_OPTIONS}
          placeholder={isArabic ? "الكل" : "All"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}

      {selectedCategory === "BIANNUAL_RESEARCH" && (
        <>
          <ReportDropdown
            value={serverParams?.publicationType ?? ""}
            onChange={(val) => onServerFilterChange?.("publicationType", val)}
            options={PUBLICATION_TYPE_OPTIONS}
            placeholder={isArabic ? "نوع النشر" : "Publication type"}
            isArabic={isArabic}
            minWidth="180px"
          />
          <ReportMultiSelect
            value={serverParams?.pubYears ?? []}
            onChange={(val) => onServerFilterChange?.("pubYears", val)}
            options={BIANNUAL_YEAR_OPTIONS.map((y) => ({
              value: y,
              label: String(y),
            }))}
            placeholder={isArabic ? "كل السنوات" : "All years"}
            isArabic={isArabic}
            minWidth="160px"
          />
        </>
      )}

      {selectedCategory === "PUBLICATIONS_STATS" && (
        <ReportDropdown
          value={serverParams?.roles?.[0] ?? ""}
          onChange={(val) => onServerFilterChange?.("roles", val ? [val] : [])}
          options={authorRoleOptions}
          placeholder={isArabic ? "كل الأدوار" : "All roles"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}

      {selectedCategory === "JOURNALS_STATS" && (
        <ReportMultiSelect
          value={serverParams?.typesOfParticipation ?? []}
          onChange={(val) =>
            onServerFilterChange?.("typesOfParticipation", val)
          }
          options={participationTypeOptions.map((type) => ({
            value: type.value,
            label: isArabic ? type.label_ar : type.label_en,
          }))}
          placeholder={isArabic ? "كل أنواع المشاركة" : "All types"}
          isArabic={isArabic}
          minWidth="220px"
        />
      )}

      {selectedCategory === "PATENTS_STATS" && (
        <ReportDropdown
          value={serverParams?.localOrInternational ?? ""}
          onChange={(val) =>
            onServerFilterChange?.("localOrInternational", val)
          }
          options={PATENT_SCOPE_OPTIONS}
          placeholder={isArabic ? "الكل" : "All"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}
    </div>
  );
}
