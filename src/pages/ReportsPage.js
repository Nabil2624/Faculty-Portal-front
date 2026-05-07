// ─── ReportsPage ──────────────────────────────────────────────────────────────
// Management Admin page for viewing and printing system reports.
//
// Layout:
//   [ Main content area ] [ ReportCategoryPanel (right/left based on lang) ]
//
// Flow:
//   1. Admin selects a report category from the right panel.
//   2. A filter modal opens to pick universities → faculties → departments.
//   3. On confirm, the report table is rendered with the filtered data.
//   4. Clicking a row (if the report type supports it) opens a details modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Settings2, Search } from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useReports from "../hooks/useReports";

import { ReportCategoryPanel } from "../components/widgets/Reports/ReportCategoryPanel";
import { FilterModal } from "../components/widgets/Reports/FilterModal";
import { ReportTable } from "../components/widgets/Reports/ReportTable";
import { ResearchDetailsModal } from "../components/widgets/Reports/ResearchDetailsModal";

export default function ReportsPage() {
  const { t, i18n } = useTranslation("Reports");
  const isArabic = i18n.language === "ar";

  // ── Active report category ────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ── Filter modal visibility ───────────────────────────────────────────────
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ── Row-details modal ─────────────────────────────────────────────────────
  const [detailsMember, setDetailsMember] = useState(null);

  // ── Search / filter state ─────────────────────────────────────────────────
  const [searchName, setSearchName] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [projectType, setProjectType] = useState("");

  // ── Hook ──────────────────────────────────────────────────────────────────
  const {
    universitiesTree,
    treeLoading,
    treeError,
    loadUniversitiesTree,
    reportData,
    totalCount,
    reportLoading,
    reportError,
    loadReport,
    resetReport,
  } = useReports();

  // ── When a category is selected: reset table and open filter modal ────────
  const handleCategorySelect = (key) => {
    setSelectedCategory(key);
    resetReport();
    setDetailsMember(null);
    setSearchName("");
    setSearchYear("");
    setProjectType("");
    // Load the university tree the first time the modal needs it
    if (universitiesTree.length === 0) loadUniversitiesTree();
    setShowFilterModal(true);
  };

  // ── On filter confirm: fetch the report ─────────────────────────────────
  const handleFilterConfirm = (departmentIds) => {
    loadReport(selectedCategory, departmentIds);
  };

  // ── Client-side filtered data ───────────────────────────────────────────
  const PROJECT_TYPE_OPTIONS = [
    { value: "Research", label_en: "Research", label_ar: "بحثي" },
    { value: "Development", label_en: "Development", label_ar: "تطويري" },
    { value: "Community", label_en: "Community", label_ar: "مجتمعي" },
    { value: "Technical", label_en: "Technical", label_ar: "تقني" },
  ];

  const filteredData = reportData.filter((row) => {
    if (searchName.trim()) {
      const haystack = isArabic
        ? (row.name_ar || row.faculty_ar || "").toLowerCase()
        : (row.name_en || row.faculty_en || "").toLowerCase();
      if (!haystack.includes(searchName.trim().toLowerCase())) return false;
    }
    if (selectedCategory === "RESEARCH_STATS" && searchYear.trim()) {
      if (String(row.year) !== searchYear.trim()) return false;
    }
    if (selectedCategory === "PROJECTS_STATS" && projectType) {
      if (row.projectType_en !== projectType) return false;
    }
    return true;
  });

  // ── Retry on error ────────────────────────────────────────────────────────
  const handleRetry = () => {
    // Re-open the filter modal so the user can confirm again
    if (universitiesTree.length === 0) loadUniversitiesTree();
    setShowFilterModal(true);
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* ── Page Title ───────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-3"
          style={{ marginBottom: "clamp(1.2rem, 2.5vw, 2.5rem)" }}
        >
          <div
            className="rounded-xl bg-[#19355a] flex items-center justify-center flex-shrink-0"
            style={{
              width: "clamp(2.4rem, 4vw, 4.5rem)",
              height: "clamp(2.4rem, 4vw, 4.5rem)",
            }}
          >
            <BarChart3
              className="text-[#b38e19]"
              style={{
                width: "clamp(1.1rem, 1.9vw, 2.2rem)",
                height: "clamp(1.1rem, 1.9vw, 2.2rem)",
              }}
            />
          </div>
          <div>
            <h1
              className="font-bold text-gray-800"
              style={{
                fontSize: "clamp(1.2rem, 2.2vw, 2.8rem)",
                lineHeight: 1.1,
              }}
            >
              {t("title")}
            </h1>
            <p
              className="text-gray-500"
              style={{
                fontSize: "clamp(0.65rem, 0.95vw, 1.05rem)",
                marginTop: "2px",
              }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* ── Main layout: Table area + Category panel ──────────────────────── */}
        <div
          className="flex gap-5 items-start"
          style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
        >
          {/* ── Left / center: report content ─────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Placeholder when nothing is selected yet */}
            {!selectedCategory && (
              <div
                className="rounded-2xl border-2 border-dashed border-[#19355a]/20 flex flex-col items-center justify-center text-center"
                style={{
                  minHeight: "clamp(250px, 40vh, 500px)",
                  padding: "clamp(1.5rem, 3vw, 4rem)",
                }}
              >
                <Settings2
                  className="text-[#19355a]/25"
                  style={{
                    width: "clamp(3rem, 5vw, 6rem)",
                    height: "clamp(3rem, 5vw, 6rem)",
                  }}
                />
                <p
                  className="mt-4 font-semibold text-gray-400"
                  style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.2rem)" }}
                >
                  {t("placeholder.title")}
                </p>
                <p
                  className="text-gray-300 mt-1"
                  style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
                >
                  {t("placeholder.hint")}
                </p>
              </div>
            )}

            {/* Active report header */}
            {selectedCategory && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2
                    className="font-bold text-[#19355a]"
                    style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.5rem)" }}
                  >
                    {t(`categories.${selectedCategory}`)}
                  </h2>
                  <p
                    className="text-gray-400"
                    style={{
                      fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)",
                      marginTop: "2px",
                    }}
                  >
                    {t("reportSubtitle")}
                  </p>
                </div>
                {/* Change filter button */}
                <button
                  onClick={() => {
                    if (universitiesTree.length === 0) loadUniversitiesTree();
                    setShowFilterModal(true);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#19355a] text-[#19355a] hover:bg-[#19355a] hover:text-white transition"
                  style={{
                    padding:
                      "clamp(0.35rem, 0.55vw, 0.6rem) clamp(0.7rem, 1vw, 1.1rem)",
                    fontSize: "clamp(0.62rem, 0.85vw, 0.92rem)",
                  }}
                >
                  <Settings2
                    style={{
                      width: "clamp(0.75rem, 1vw, 1.1rem)",
                      height: "clamp(0.75rem, 1vw, 1.1rem)",
                    }}
                  />
                  {t("changeFilter")}
                </button>
              </div>
            )}

            {/* Search / filter bar */}
            {selectedCategory &&
              !reportLoading &&
              !reportError &&
              reportData.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {/* Name search – always shown */}
                  <div
                    className="relative flex-1"
                    style={{ minWidth: "180px" }}
                  >
                    <Search
                      className="absolute text-gray-400 pointer-events-none"
                      style={{
                        width: "clamp(0.8rem, 1vw, 1rem)",
                        height: "clamp(0.8rem, 1vw, 1rem)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        [isArabic ? "right" : "left"]:
                          "clamp(0.6rem, 0.9vw, 1rem)",
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

                  {/* Year search – RESEARCH_STATS only */}
                  {selectedCategory === "RESEARCH_STATS" && (
                    <div
                      className="relative flex-1"
                      style={{ minWidth: "150px" }}
                    >
                      <Search
                        className="absolute text-gray-400 pointer-events-none"
                        style={{
                          width: "clamp(0.8rem, 1vw, 1rem)",
                          height: "clamp(0.8rem, 1vw, 1rem)",
                          top: "50%",
                          transform: "translateY(-50%)",
                          [isArabic ? "right" : "left"]:
                            "clamp(0.6rem, 0.9vw, 1rem)",
                        }}
                      />
                      <input
                        type="text"
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                        placeholder={
                          isArabic ? "البحث بالسنة" : "Search by year"
                        }
                        className="w-full rounded-lg border border-[#19355a]/20 bg-white text-gray-700 focus:outline-none focus:border-[#19355a]/50 transition"
                        style={{
                          padding: `clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1.1rem)`,
                          paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
                          fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
                          direction: isArabic ? "rtl" : "ltr",
                        }}
                      />
                    </div>
                  )}

                  {/* Project type dropdown – PROJECTS_STATS only */}
                  {selectedCategory === "PROJECTS_STATS" && (
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="flex-1 rounded-lg border border-[#19355a]/20 bg-white text-gray-700 focus:outline-none focus:border-[#19355a]/50 transition cursor-pointer"
                      style={{
                        minWidth: "150px",
                        padding: `clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1.1rem)`,
                        fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
                        direction: isArabic ? "rtl" : "ltr",
                      }}
                    >
                      <option value="">
                        {isArabic ? "كل الأنواع" : "All types"}
                      </option>
                      {PROJECT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {isArabic ? opt.label_ar : opt.label_en}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

            {/* Report table */}
            {selectedCategory && (
              <ReportTable
                reportType={selectedCategory}
                data={filteredData}
                totalCount={filteredData.length}
                loading={reportLoading}
                error={reportError}
                onRetry={handleRetry}
                onRowClick={(row) => setDetailsMember(row)}
                t={t}
                isArabic={isArabic}
              />
            )}
          </div>

          {/* ── Right / side: category panel ────────────────────────────────── */}
          <ReportCategoryPanel
            selected={selectedCategory}
            onSelect={handleCategorySelect}
            t={t}
            isArabic={isArabic}
          />
        </div>
      </div>

      {/* ── Filter modal ───────────────────────────────────────────────────── */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onConfirm={handleFilterConfirm}
        universitiesTree={universitiesTree}
        treeLoading={treeLoading}
        t={t}
        isArabic={isArabic}
      />

      {/* ── Research details modal ─────────────────────────────────────────── */}
      <ResearchDetailsModal
        open={!!detailsMember}
        onClose={() => setDetailsMember(null)}
        member={detailsMember}
        t={t}
        isArabic={isArabic}
      />
    </ResponsiveLayoutProvider>
  );
}
