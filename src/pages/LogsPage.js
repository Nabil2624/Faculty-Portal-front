import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollText, RefreshCw } from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useLogs from "../hooks/useLogs";

import { PAGE_SIZE, EMPTY_FILTERS } from "../components/widgets/Logs/logsConstants";
import { LogsStatsRow } from "../components/widgets/Logs/LogsStatsRow";
import { LogsSearchBar } from "../components/widgets/Logs/LogsSearchBar";
import { LogsTable } from "../components/widgets/Logs/LogsTable";
import { LogsPagination } from "../components/widgets/Logs/LogsPagination";
import { FilterDrawer } from "../components/widgets/Logs/FilterDrawer";

export default function LogsPage() {
  const { t, i18n } = useTranslation("Logs");
  const isArabic = i18n.language === "ar";

  // State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Data
  const {
    logs,
    totalCount,
    levelCounts,
    totalPages,
    categoriesList,
    actionsList,
    loading,
    error,
    loadData,
  } = useLogs({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    levels: appliedFilters.levels,
    categories: appliedFilters.categories,
    categoryActions: appliedFilters.categoryActions,
    codes: appliedFilters.codes,
    dateFrom: appliedFilters.dateFrom,
    dateTo: appliedFilters.dateTo,
  });

  const totalAll = Object.values(levelCounts).reduce((a, b) => a + b, 0);

  const hasActiveFilters =
    appliedFilters.levels.length ||
    appliedFilters.categories.length ||
    appliedFilters.categoryActions.length ||
    appliedFilters.codes.length ||
    appliedFilters.dateFrom ||
    appliedFilters.dateTo;

  const handleApplyFilters = useCallback((newFilters) => {
    setAppliedFilters(newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
    setExpandedRow(null);
  }, []);

  // Timestamp formatter
  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      time: d.toLocaleTimeString(isArabic ? "ar-EG" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    };
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* Page Title */}
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
            <ScrollText
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

        {/* Stats Row */}
        <LogsStatsRow totalAll={totalAll} levelCounts={levelCounts} t={t} />

        {/* Search + Filter Bar */}
        <LogsSearchBar
          search={search}
          setSearch={setSearch}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          isArabic={isArabic}
          t={t}
          loadData={loadData}
          hasActiveFilters={hasActiveFilters}
          appliedFilters={appliedFilters}
          onOpenFilter={() => setShowFilter(true)}
          onClearFilters={handleApplyFilters}
        />

        {/* Results count */}
        <div
          className="flex items-center justify-between text-gray-500"
          style={{
            fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
            marginBottom: "clamp(0.4rem, 0.8vw, 0.8rem)",
          }}
        >
          <span>
            {t("showing")}{" "}
            {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount)}{String.fromCharCode(8211)}
            {Math.min(currentPage * PAGE_SIZE, totalCount)} {t("of")}{" "}
            {totalCount} {t("entries")}
          </span>
          {loading && (
            <span className="flex items-center gap-1 text-[#b38e19]">
              <RefreshCw
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 1vw, 1rem)",
                  height: "clamp(0.7rem, 1vw, 1rem)",
                }}
              />
              {t("loading")}
            </span>
          )}
        </div>

        {/* Table */}
        <LogsTable
          logs={logs}
          loading={loading}
          error={error}
          currentPage={currentPage}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          formatTimestamp={formatTimestamp}
          loadData={loadData}
          t={t}
          isArabic={isArabic}
        />

        {/* Pagination */}
        {!error && totalPages > 1 && (
          <LogsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setExpandedRow={setExpandedRow}
            t={t}
          />
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={handleApplyFilters}
        isArabic={isArabic}
        t={t}
        categoriesList={categoriesList}
        actionsList={actionsList}
      />
    </ResponsiveLayoutProvider>
  );
}
