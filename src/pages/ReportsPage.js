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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Settings2 } from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useReports from "../hooks/useReports";
import useReportFilters from "../hooks/useReportFilters";

import { ReportCategoryPanel } from "../components/widgets/Reports/ReportCategoryPanel";
import { FilterModal } from "../components/widgets/Reports/FilterModal";
import { ReportTable } from "../components/widgets/Reports/ReportTable";
import { ResearchDetailsModal } from "../components/widgets/Reports/ResearchDetailsModal";
import { ReportFilterBar } from "../components/widgets/Reports/ReportFilterBar";

export default function ReportsPage() {
  const { t, i18n } = useTranslation("Reports");
  const isArabic = i18n.language === "ar";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [detailsMember, setDetailsMember] = useState(null);

  const {
    universitiesTree,
    treeLoading,
    loadUniversitiesTree,
    reportData,
    reportLoading,
    reportError,
    loadReport,
    resetReport,
  } = useReports();

  const filters = useReportFilters(selectedCategory, reportData, isArabic);

  const openFilterModal = () => {
    if (universitiesTree.length === 0) loadUniversitiesTree();
    setShowFilterModal(true);
  };

  const handleCategorySelect = (key) => {
    setSelectedCategory(key);
    resetReport();
    setDetailsMember(null);
    filters.resetFilters();
    openFilterModal();
  };

  const handleFilterConfirm = (departmentIds) => {
    loadReport(selectedCategory, departmentIds);
  };

  const showFilterBar =
    selectedCategory && !reportLoading && !reportError && reportData.length > 0;

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* ── Page title ───────────────────────────────────────────────────── */}
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

        {/* ── Main layout: content area + category panel ────────────────────── */}
        <div
          className="flex gap-5 items-start"
          style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Empty state */}
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

            {/* Active category header */}
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
                <button
                  onClick={openFilterModal}
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

            {/* Filter bar */}
            {showFilterBar && (
              <ReportFilterBar
                selectedCategory={selectedCategory}
                filters={filters}
                isArabic={isArabic}
              />
            )}

            {/* Report table */}
            {selectedCategory && (
              <ReportTable
                reportType={selectedCategory}
                data={filters.filteredData}
                totalCount={filters.filteredData.length}
                loading={reportLoading}
                error={reportError}
                onRetry={openFilterModal}
                onRowClick={(row) => setDetailsMember(row)}
                t={t}
                isArabic={isArabic}
              />
            )}
          </div>

          <ReportCategoryPanel
            selected={selectedCategory}
            onSelect={handleCategorySelect}
            t={t}
            isArabic={isArabic}
          />
        </div>
      </div>

      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onConfirm={handleFilterConfirm}
        universitiesTree={universitiesTree}
        treeLoading={treeLoading}
        t={t}
        isArabic={isArabic}
      />

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
