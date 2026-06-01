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
import { Search, ChevronDown } from "lucide-react";
import { ReportDropdown } from "./ReportDropdown";

// ─── Dropdown option lists ────────────────────────────────────────────────────
const PROJECT_TYPE_OPTIONS = [
  { value: "Research", label_en: "Research", label_ar: "بحثي" },
  { value: "Engineering", label_en: "Engineering", label_ar: "هندسة" },
  { value: "Quality", label_en: "Quality", label_ar: "جودة" },
  { value: "External", label_en: "External", label_ar: "خارجي" },
];

const SEMINAR_TYPE_OPTIONS = [
  { value: "Seminar", label_en: "Seminars", label_ar: "ندوات" },
  { value: "Conference", label_en: "Conferences", label_ar: "مؤتمرات" },
];

const EXPERIENCE_TYPE_OPTIONS = [
  { value: "General", label_en: "General Experiences", label_ar: "خبرات عامة" },
  {
    value: "Teaching",
    label_en: "Teaching Experiences",
    label_ar: "خبرات تدريسية",
  },
];

const PUBLICATION_ROLE_OPTIONS = [
  { value: "Author", label_en: "Author", label_ar: "مؤلف" },
  { value: "Translator", label_en: "Translator", label_ar: "مترجم" },
  { value: "Reviewer", label_en: "Reviewer", label_ar: "مراجع" },
  {
    value: "Translator/Reviewer",
    label_en: "Translator/Reviewer",
    label_ar: "مترجم/مراجع",
  },
  { value: "Book Editor", label_en: "Book Editor", label_ar: "محرر كتاب" },
  { value: "Chapter Author", label_en: "Chapter Author", label_ar: "مؤلف فصل" },
];

const PARTICIPATION_TYPE_OPTIONS = [
  {
    value: "Editor-in-Chief",
    label_en: "Editor-in-Chief",
    label_ar: "رئيس تحرير",
  },
  {
    value: "Managing Editor",
    label_en: "Managing Editor",
    label_ar: "مدير تحرير",
  },
  { value: "Deputy Editor", label_en: "Deputy Editor", label_ar: "نائب تحرير" },
  { value: "Member", label_en: "Member", label_ar: "عضو" },
  { value: "Editor", label_en: "Editor", label_ar: "محرر" },
  { value: "Reviewer", label_en: "Reviewer", label_ar: "محكم" },
];

const PATENT_SCOPE_OPTIONS = [
  { value: "Local", label_en: "Local", label_ar: "محلي" },
  { value: "International", label_en: "International", label_ar: "دولي" },
];

// ─── Multi-year selector (for RESEARCH_STATS) ────────────────────────────────
function YearMultiSelect({
  selectedYears,
  setSelectedYears,
  availableYears,
  isArabic,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const label =
    selectedYears.length === 0
      ? isArabic
        ? "كل السنوات"
        : "All years"
      : [...selectedYears].sort().join(", ");

  return (
    <div ref={ref} className="relative flex-1" style={{ minWidth: "150px" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-[#19355a]/20 bg-white text-gray-700 focus:outline-none focus:border-[#19355a]/50 transition flex items-center justify-between"
        style={{
          padding: `clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1.1rem)`,
          fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={`flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          style={{
            width: "clamp(0.75rem, 1vw, 1rem)",
            height: "clamp(0.75rem, 1vw, 1rem)",
            marginInlineStart: "0.4rem",
          }}
        />
      </button>
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border border-[#19355a]/20 bg-white shadow-lg overflow-y-auto"
          style={{ maxHeight: "12rem" }}
        >
          {availableYears.length === 0 ? (
            <div
              className="text-gray-400"
              style={{
                padding:
                  "clamp(0.3rem, 0.5vw, 0.55rem) clamp(0.6rem, 1vw, 1.1rem)",
                fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
              }}
            >
              {isArabic ? "لا توجد سنوات" : "No years available"}
            </div>
          ) : (
            availableYears.map((year) => (
              <label
                key={year}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                style={{
                  padding: `clamp(0.3rem, 0.5vw, 0.55rem) clamp(0.6rem, 1vw, 1.1rem)`,
                  fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
                  direction: isArabic ? "rtl" : "ltr",
                }}
              >
                <input
                  type="checkbox"
                  className="accent-[#19355a]"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggle(year)}
                />
                <span>{year}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── ReportFilterBar ──────────────────────────────────────────────────────────
export function ReportFilterBar({ selectedCategory, filters, isArabic }) {
  const {
    searchName,
    setSearchName,
    selectedYears,
    setSelectedYears,
    availableYears,
    projectType,
    setProjectType,
    seminarType,
    setSeminarType,
    experienceType,
    setExperienceType,
    publicationRole,
    setPublicationRole,
    participationType,
    setParticipationType,
    patentScope,
    setPatentScope,
  } = filters;

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
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
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

      {selectedCategory === "RESEARCH_STATS" && (
        <YearMultiSelect
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
          availableYears={availableYears}
          isArabic={isArabic}
        />
      )}

      {selectedCategory === "PROJECTS_STATS" && (
        <ReportDropdown
          value={projectType}
          onChange={setProjectType}
          options={PROJECT_TYPE_OPTIONS}
          placeholder={isArabic ? "كل الأنواع" : "All types"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}

      {selectedCategory === "SEMINARS_STATS" && (
        <ReportDropdown
          value={seminarType}
          onChange={setSeminarType}
          options={SEMINAR_TYPE_OPTIONS}
          placeholder={isArabic ? "الكل" : "All"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}

      {selectedCategory === "EXPERIENCES_STATS" && (
        <ReportDropdown
          value={experienceType}
          onChange={setExperienceType}
          options={EXPERIENCE_TYPE_OPTIONS}
          placeholder={isArabic ? "الكل" : "All"}
          isArabic={isArabic}
          minWidth="180px"
        />
      )}

      {selectedCategory === "PUBLICATIONS_STATS" && (
        <ReportDropdown
          value={publicationRole}
          onChange={setPublicationRole}
          options={PUBLICATION_ROLE_OPTIONS}
          placeholder={isArabic ? "كل الأدوار" : "All roles"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}

      {selectedCategory === "JOURNALS_STATS" && (
        <ReportDropdown
          value={participationType}
          onChange={setParticipationType}
          options={PARTICIPATION_TYPE_OPTIONS}
          placeholder={isArabic ? "كل أنواع المشاركة" : "All types"}
          isArabic={isArabic}
          minWidth="180px"
        />
      )}

      {selectedCategory === "PATENTS_STATS" && (
        <ReportDropdown
          value={patentScope}
          onChange={setPatentScope}
          options={PATENT_SCOPE_OPTIONS}
          placeholder={isArabic ? "الكل" : "All"}
          isArabic={isArabic}
          minWidth="150px"
        />
      )}
    </div>
  );
}
