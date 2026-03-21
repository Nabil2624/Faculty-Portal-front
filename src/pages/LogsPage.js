import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollText,
  Info,
  AlertTriangle,
  XCircle,
  Skull,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Calendar,
  Tag,
  Zap,
  BarChart3,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useLogs from "../hooks/useLogs";
import { LOG_LEVELS, LOG_CODES } from "../services/logs.service";

// Display name override: backend uses "Critical", UI shows "Fatal"
const LEVEL_DISPLAY = { Critical: "Fatal" };
const getLevelLabel = (level) => LEVEL_DISPLAY[level] || level;

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

const LEVEL_CONFIG = {
  Information: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#3b82f6",
    statBg: "#eff6ff",
    icon: Info,
  },
  Warning: {
    bg: "#fef3c7",
    text: "#b45309",
    border: "#f59e0b",
    statBg: "#fffbeb",
    icon: AlertTriangle,
  },
  Error: {
    bg: "#fee2e2",
    text: "#b91c1c",
    border: "#ef4444",
    statBg: "#fef2f2",
    icon: XCircle,
  },
  Critical: {
    bg: "#450a0a",
    text: "#fecaca",
    border: "#7f1d1d",
    statBg: "#fff1f2",
    icon: Skull,
  },
};

const CODE_CONFIG = {
  1001: { bg: "#f3e8ff", text: "#7c3aed", border: "#a855f7" },
  2001: { bg: "#e0e7ff", text: "#4338ca", border: "#6366f1" },
  3001: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        padding:
          "clamp(0.18rem, 0.35vw, 0.35rem) clamp(0.45rem, 0.7vw, 0.75rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
      }}
    >
      {getLevelLabel(level)}
    </span>
  );
}

function CodeBadge({ code, t }) {
  const cfg = CODE_CONFIG[code] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex flex-col items-center rounded-lg font-mono font-semibold whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        padding: "clamp(0.15rem, 0.3vw, 0.3rem) clamp(0.4rem, 0.6vw, 0.65rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
        lineHeight: "1.2",
      }}
    >
      <span>{code}</span>
      <span
        style={{ fontSize: "clamp(0.5rem, 0.65vw, 0.7rem)", opacity: 0.75 }}
      >
        {t(`codes.${code}`)}
      </span>
    </span>
  );
}

function StatCard({ label, count, Icon, borderColor, statBg, textColor }) {
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-[14px] shadow-sm"
      style={{
        borderLeft: `clamp(3px, 0.35vw, 5px) solid ${borderColor}`,
        padding: "clamp(0.65rem, 1.2vw, 1.4rem) clamp(0.8rem, 1.5vw, 1.6rem)",
        flex: "1 1 0",
        minWidth: 0,
      }}
    >
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: statBg,
          width: "clamp(2.2rem, 3.5vw, 3.8rem)",
          height: "clamp(2.2rem, 3.5vw, 3.8rem)",
        }}
      >
        <Icon
          style={{
            color: textColor,
            width: "clamp(0.9rem, 1.5vw, 1.8rem)",
            height: "clamp(0.9rem, 1.5vw, 1.8rem)",
          }}
        />
      </div>
      <div className="min-w-0">
        <p
          className="text-gray-500 truncate"
          style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)" }}
        >
          {label}
        </p>
        <p
          className="font-bold text-gray-800"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 2.2rem)", lineHeight: 1.1 }}
        >
          {count.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ChipSelect({ options, selected, onToggle, colorFn }) {
  return (
    <div
      className="flex flex-wrap"
      style={{ gap: "clamp(0.3rem, 0.6vw, 0.6rem)" }}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = selected.includes(val);
        const colors = colorFn ? colorFn(val) : null;
        return (
          <button
            key={val}
            onClick={() => onToggle(val)}
            className="rounded-full border transition-all"
            style={{
              padding:
                "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.9vw, 1rem)",
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              backgroundColor: active
                ? colors?.text || "#b38e19"
                : colors?.bg || "transparent",
              color: active ? "white" : colors?.text || "#b38e19",
              borderColor: colors?.border || "#b38e19",
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────

function FilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  isArabic,
  t,
  categoriesList,
  actionsList,
}) {
  const [local, setLocal] = useState(filters);
  const drawerRef = useRef(null);

  useEffect(() => {
    setLocal(filters);
  }, [filters, open]);

  const toggleArr = (key, val) => {
    setLocal((prev) => {
      const cur = prev[key] || [];
      return {
        ...prev,
        [key]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val],
      };
    });
  };

  // Derive available actions based on selected category names and backend data
  const uniqueActions = (() => {
    if (local.categories.length === 0) return [];
    const selectedIds = local.categories
      .map((name) => categoriesList.find((c) => c.categoryName === name)?.id)
      .filter((id) => id !== undefined);
    return [
      ...new Set(
        actionsList
          .filter((a) => a.categoryIds.some((id) => selectedIds.includes(id)))
          .map((a) => a.actionName),
      ),
    ];
  })();

  const hasActive =
    local.levels.length ||
    local.categories.length ||
    local.categoryActions.length ||
    local.codes.length ||
    local.dateFrom ||
    local.dateTo;

  // Track which accordion sections are open (none open by default)
  const [openSections, setOpenSections] = useState({});
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Helper: count active selections for a given filter key(s)
  const activeCount = (...keys) =>
    keys.reduce((sum, k) => {
      const v = local[k];
      if (Array.isArray(v)) return sum + v.length;
      return sum + (v ? 1 : 0);
    }, 0);

  const Section = ({ sectionKey, label, badgeCount, children }) => {
    const isOpen = !!openSections[sectionKey];
    return (
      <div
        className="border border-gray-200 rounded-xl overflow-hidden"
        style={{ marginBottom: "clamp(0.5rem, 1vw, 0.9rem)" }}
      >
        {/* Accordion header */}
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between text-left transition-colors hover:bg-gray-50"
          style={{
            padding:
              "clamp(0.55rem, 0.9vw, 0.9rem) clamp(0.7rem, 1.1vw, 1.1rem)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-gray-700"
              style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}
            >
              {label}
            </span>
            {badgeCount > 0 && (
              <span
                className="bg-[#b38e19] text-white rounded-full font-bold flex items-center justify-center"
                style={{
                  minWidth: "clamp(1rem, 1.4vw, 1.4rem)",
                  height: "clamp(1rem, 1.4vw, 1.4rem)",
                  fontSize: "clamp(0.5rem, 0.65vw, 0.7rem)",
                  padding: "0 clamp(3px, 0.4vw, 5px)",
                }}
              >
                {badgeCount}
              </span>
            )}
          </div>
          <ChevronDown
            className="text-gray-400 transition-transform flex-shrink-0"
            style={{
              width: "clamp(0.8rem, 1.1vw, 1.2rem)",
              height: "clamp(0.8rem, 1.1vw, 1.2rem)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {/* Collapsible body */}
        <div
          style={{
            maxHeight: isOpen ? "600px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          <div
            className="border-t border-gray-100"
            style={{
              padding:
                "clamp(0.55rem, 0.9vw, 0.9rem) clamp(0.7rem, 1.1vw, 1.1rem)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        dir={isArabic ? "rtl" : "ltr"}
        className="fixed top-0 h-full bg-white z-50 shadow-2xl flex flex-col"
        style={{
          [isArabic ? "left" : "right"]: 0,
          width: "clamp(280px, 32vw, 520px)",
          transform: open
            ? "translateX(0)"
            : isArabic
              ? "translateX(-100%)"
              : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between bg-[#19355a]"
          style={{ padding: "clamp(0.75rem, 1.3vw, 1.3rem)" }}
        >
          <div className="flex items-center gap-2">
            <Filter
              className="text-[#b38e19]"
              style={{
                width: "clamp(0.9rem, 1.3vw, 1.4rem)",
                height: "clamp(0.9rem, 1.3vw, 1.4rem)",
              }}
            />
            <h3
              className="font-semibold text-white"
              style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.3rem)" }}
            >
              {t("filterTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition rounded-full hover:bg-white/10 p-1"
          >
            <X
              style={{
                width: "clamp(1rem, 1.3vw, 1.4rem)",
                height: "clamp(1rem, 1.3vw, 1.4rem)",
              }}
            />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "clamp(0.8rem, 1.5vw, 1.5rem)" }}
        >
          {/* Date Range */}
          <Section
            sectionKey="dateRange"
            label={t("filterSections.dateRange")}
            badgeCount={activeCount("dateFrom", "dateTo")}
          >
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1" style={{ minWidth: "8rem" }}>
                <label
                  className="block text-gray-500"
                  style={{
                    fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("filterSections.dateFrom")}
                </label>
                <input
                  type="date"
                  value={local.dateFrom}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, dateFrom: e.target.value }))
                  }
                  className="w-full rounded-lg bg-[#E2E2E2] outline-none focus:ring-2 focus:ring-[#b38e19]/50 text-gray-700"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                    fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
                  }}
                />
              </div>
              <div className="flex-1" style={{ minWidth: "8rem" }}>
                <label
                  className="block text-gray-500"
                  style={{
                    fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("filterSections.dateTo")}
                </label>
                <input
                  type="date"
                  value={local.dateTo}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, dateTo: e.target.value }))
                  }
                  className="w-full rounded-lg bg-[#E2E2E2] outline-none focus:ring-2 focus:ring-[#b38e19]/50 text-gray-700"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                    fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
                  }}
                />
              </div>
            </div>
          </Section>

          {/* Level */}
          <Section
            sectionKey="level"
            label={t("filterSections.level")}
            badgeCount={activeCount("levels")}
          >
            <ChipSelect
              options={LOG_LEVELS}
              selected={local.levels}
              onToggle={(v) => toggleArr("levels", v)}
              colorFn={(v) => LEVEL_CONFIG[v]}
            />
          </Section>

          {/* Category */}
          <Section
            sectionKey="category"
            label={t("filterSections.category")}
            badgeCount={activeCount("categories")}
          >
            <ChipSelect
              options={categoriesList.map((c) => c.categoryName)}
              selected={local.categories}
              onToggle={(v) => {
                setLocal((prev) => {
                  const newCats = prev.categories.includes(v)
                    ? prev.categories.filter((c) => c !== v)
                    : [...prev.categories, v];
                  const newCatIds = newCats
                    .map(
                      (name) =>
                        categoriesList.find((c) => c.categoryName === name)?.id,
                    )
                    .filter((id) => id !== undefined);
                  const allowedActions = actionsList
                    .filter((a) =>
                      a.categoryIds.some((id) => newCatIds.includes(id)),
                    )
                    .map((a) => a.actionName);
                  return {
                    ...prev,
                    categories: newCats,
                    categoryActions: prev.categoryActions.filter((a) =>
                      allowedActions.includes(a),
                    ),
                  };
                });
              }}
            />
          </Section>

          {/* Category Action — depends on selected categories */}
          <Section
            sectionKey="categoryAction"
            label={t("filterSections.categoryAction")}
            badgeCount={activeCount("categoryActions")}
          >
            {uniqueActions.length === 0 ? (
              <p
                className="text-gray-400 italic"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.85rem)" }}
              >
                {t("filterSections.selectCategoryFirst")}
              </p>
            ) : (
              <ChipSelect
                options={uniqueActions}
                selected={local.categoryActions}
                onToggle={(v) => toggleArr("categoryActions", v)}
              />
            )}
          </Section>

          {/* Code */}
          <Section
            sectionKey="code"
            label={t("filterSections.code")}
            badgeCount={activeCount("codes")}
          >
            <ChipSelect
              options={LOG_CODES}
              selected={local.codes}
              onToggle={(v) => toggleArr("codes", v)}
              colorFn={(v) => CODE_CONFIG[v]}
            />
          </Section>
        </div>

        {/* Drawer footer */}
        <div
          className="border-t border-gray-200 flex gap-2"
          style={{ padding: "clamp(0.6rem, 1.2vw, 1.2rem)" }}
        >
          <button
            onClick={() => {
              const cleared = {
                levels: [],
                categories: [],
                categoryActions: [],
                codes: [],
                dateFrom: "",
                dateTo: "",
              };
              setLocal(cleared);
              onApply(cleared);
            }}
            className="flex-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
            style={{
              padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("reset")}
          </button>
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="flex-1 rounded-lg bg-[#19355a] text-white hover:bg-[#19355a]/90 transition font-medium"
            style={{
              padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("apply")}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Expanded Row Panel ───────────────────────────────────────────────────────

function ExpandedRow({ log, colSpan, t, isArabic }) {
  const hasException =
    log.exception || log.exceptionMessage || log.exceptionDetail;
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-[#f8fafc]"
        style={{
          padding: "clamp(0.6rem, 1.2vw, 1.2rem) clamp(1rem, 2vw, 2rem)",
        }}
      >
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: hasException ? "1fr 1fr" : "1fr" }}
        >
          {/* Exception block */}
          {hasException && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 overflow-hidden"
              style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
            >
              <p
                className="font-semibold text-red-700 flex items-center gap-1"
                style={{
                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                  marginBottom: "clamp(0.4rem, 0.7vw, 0.7rem)",
                }}
              >
                <XCircle
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                {t("expanded.exception")}
              </p>

              {log.exception && (
                <div style={{ marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)" }}>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    Type
                  </span>
                  <code
                    className="text-red-800 font-mono bg-red-100 rounded px-1 break-all block"
                    style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
                  >
                    {log.exception}
                  </code>
                </div>
              )}

              {log.exceptionMessage && (
                <div style={{ marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)" }}>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    {t("expanded.exceptionMessage")}
                  </span>
                  <p
                    className="text-red-700"
                    style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
                  >
                    {log.exceptionMessage}
                  </p>
                </div>
              )}

              {log.exceptionDetail && (
                <div>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    {t("expanded.exceptionDetail")}
                  </span>
                  <pre
                    className="bg-gray-900 text-green-400 rounded-lg overflow-x-auto"
                    style={{
                      fontSize: "clamp(0.5rem, 0.7vw, 0.75rem)",
                      padding: "clamp(0.4rem, 0.7vw, 0.7rem)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                      maxHeight: "clamp(6rem, 10vw, 12rem)",
                    }}
                  >
                    {log.exceptionDetail}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Additional Information block */}
          <div
            className="rounded-xl border border-[#19355a]/20 bg-[#19355a]/5"
            style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
          >
            <p
              className="font-semibold text-[#19355a] flex items-center gap-1"
              style={{
                fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                marginBottom: "clamp(0.4rem, 0.7vw, 0.7rem)",
              }}
            >
              <Info
                style={{
                  width: "clamp(0.75rem, 1vw, 1.1rem)",
                  height: "clamp(0.75rem, 1vw, 1.1rem)",
                }}
              />
              {t("expanded.additionalInfo")}
            </p>
            {log.additionalInformation ? (
              <p
                className="text-gray-700"
                style={{
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                  lineHeight: 1.5,
                }}
              >
                {log.additionalInformation}
              </p>
            ) : (
              <p
                className="text-gray-400 italic"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
              >
                —
              </p>
            )}

            {!hasException && (
              <p
                className="text-gray-400 italic mt-3"
                style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
              >
                {t("expanded.noException")}
              </p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const EMPTY_FILTERS = {
  levels: [],
  categories: [],
  categoryActions: [],
  codes: [],
  dateFrom: "",
  dateTo: "",
};

export default function LogsPage() {
  const { t, i18n } = useTranslation("Logs");
  const isArabic = i18n.language === "ar";

  // ── State ────────────────────────────────────────────────────────────────────
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
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Data ─────────────────────────────────────────────────────────────────────
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

  // ── Timestamp formatter ───────────────────────────────────────────────────────
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

  // ── Table columns ─────────────────────────────────────────────────────────────
  const COL_COUNT = 10; // # + timestamp + level + code + category + action + username + ip + message + expand

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Page Title */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Stats Row */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="flex flex-wrap"
          style={{
            gap: "clamp(0.5rem, 1.2vw, 1.2rem)",
            marginBottom: "clamp(1rem, 2vw, 2rem)",
          }}
        >
          {/* Total */}
          <div
            className="flex items-center gap-3 rounded-[14px] text-white"
            style={{
              background: "linear-gradient(135deg, #19355a 0%, #1e4a82 100%)",
              padding:
                "clamp(0.65rem, 1.2vw, 1.4rem) clamp(0.8rem, 1.5vw, 1.6rem)",
              flex: "1 1 0",
              minWidth: 0,
            }}
          >
            <div
              className="rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
              style={{
                width: "clamp(2.2rem, 3.5vw, 3.8rem)",
                height: "clamp(2.2rem, 3.5vw, 3.8rem)",
              }}
            >
              <BarChart3
                className="text-[#b38e19]"
                style={{
                  width: "clamp(0.9rem, 1.5vw, 1.8rem)",
                  height: "clamp(0.9rem, 1.5vw, 1.8rem)",
                }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-white/70 truncate"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)" }}
              >
                {t("stats.total")}
              </p>
              <p
                className="font-bold"
                style={{
                  fontSize: "clamp(1.1rem, 1.8vw, 2.2rem)",
                  lineHeight: 1.1,
                }}
              >
                {totalAll.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Information */}
          <StatCard
            label={t("stats.information")}
            count={levelCounts.Information}
            Icon={LEVEL_CONFIG.Information.icon}
            borderColor={LEVEL_CONFIG.Information.border}
            statBg={LEVEL_CONFIG.Information.statBg}
            textColor={LEVEL_CONFIG.Information.text}
          />

          {/* Warning */}
          <StatCard
            label={t("stats.warning")}
            count={levelCounts.Warning}
            Icon={LEVEL_CONFIG.Warning.icon}
            borderColor={LEVEL_CONFIG.Warning.border}
            statBg={LEVEL_CONFIG.Warning.statBg}
            textColor={LEVEL_CONFIG.Warning.text}
          />

          {/* Error */}
          <StatCard
            label={t("stats.error")}
            count={levelCounts.Error}
            Icon={LEVEL_CONFIG.Error.icon}
            borderColor={LEVEL_CONFIG.Error.border}
            statBg={LEVEL_CONFIG.Error.statBg}
            textColor={LEVEL_CONFIG.Error.text}
          />

          {/* Critical */}
          <StatCard
            label={t("stats.critical")}
            count={levelCounts.Critical}
            Icon={LEVEL_CONFIG.Critical.icon}
            borderColor={LEVEL_CONFIG.Critical.border}
            statBg={LEVEL_CONFIG.Critical.statBg}
            textColor={LEVEL_CONFIG.Critical.text}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Search + Filter Bar */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)",
            gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
            flexWrap: "nowrap",
          }}
        >
          {/* Title */}
          <h2
            className="font-semibold text-gray-800 shrink-0"
            style={{ fontSize: "clamp(1rem, 1.8vw, 2.2rem)", lineHeight: 1.2 }}
          >
            {t("title")}
            <span
              className="block bg-[#b38e19] rounded-full"
              style={{
                width: "clamp(2.5rem, 6vw, 8rem)",
                height: "clamp(0.2rem, 0.3vw, 0.4rem)",
                marginTop: "clamp(0.2rem, 0.4vw, 0.5rem)",
              }}
            />
          </h2>

          {/* Right controls */}
          <div
            className="flex items-center gap-2"
            style={{ minWidth: 0, flex: "1", justifyContent: "flex-end" }}
          >
            {/* Search */}
            <div
              className="relative flex items-center"
              style={{
                borderBottom: `2px solid ${isFocused ? "#b38e19" : "#d1d5db"}`,
                paddingBottom: "2px",
                transition: "border-color 0.3s ease",
                flex: "1",
                maxWidth: "clamp(12rem, 25vw, 32rem)",
                minWidth: "8rem",
              }}
            >
              <Search
                className="shrink-0 text-[#b38e19]"
                style={{
                  width: "clamp(14px, 1.6vw, 24px)",
                  height: "clamp(14px, 1.6vw, 24px)",
                  marginRight: isArabic ? 0 : "clamp(6px,0.8vw,10px)",
                  marginLeft: isArabic ? "clamp(6px,0.8vw,10px)" : 0,
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t("search")}
                className="outline-none bg-transparent text-gray-700 w-full"
                style={{
                  height: "clamp(28px, 2.8vw, 42px)",
                  fontSize: "clamp(11px, 1vw, 15px)",
                }}
              />
              <span
                className="absolute bottom-0 h-[2px] bg-[#b38e19]"
                style={{
                  transition: "width 0.3s ease",
                  width: isFocused ? "100%" : "0%",
                  [isArabic ? "right" : "left"]: 0,
                }}
              />
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              title="Refresh"
              className="border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              style={{
                flexShrink: 0,
                width: "clamp(2rem, 2.8vw, 3.5rem)",
                height: "clamp(2rem, 2.8vw, 3.5rem)",
              }}
            >
              <RefreshCw
                style={{
                  width: "clamp(0.8rem, 1.2vw, 1.4rem)",
                  height: "clamp(0.8rem, 1.2vw, 1.4rem)",
                }}
              />
            </button>

            {/* Filter button */}
            <button
              onClick={() => setShowFilter(true)}
              className="border-2 rounded-md flex items-center justify-center transition relative"
              style={{
                flexShrink: 0,
                width: "clamp(2rem, 2.8vw, 3.5rem)",
                height: "clamp(2rem, 2.8vw, 3.5rem)",
                borderColor: hasActiveFilters ? "#b38e19" : "#b38e19",
                backgroundColor: hasActiveFilters ? "#b38e19" : "transparent",
              }}
            >
              <Filter
                style={{
                  width: "clamp(0.8rem, 1.2vw, 1.4rem)",
                  height: "clamp(0.8rem, 1.2vw, 1.4rem)",
                  color: hasActiveFilters ? "white" : "#b38e19",
                }}
              />
              {!!hasActiveFilters && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
                  style={{
                    width: "clamp(12px, 1.1vw, 16px)",
                    height: "clamp(12px, 1.1vw, 16px)",
                    fontSize: "clamp(7px, 0.6vw, 9px)",
                  }}
                >
                  {[
                    appliedFilters.levels,
                    appliedFilters.categories,
                    appliedFilters.categoryActions,
                    appliedFilters.codes,
                  ].reduce((s, a) => s + a.length, 0) +
                    (appliedFilters.dateFrom ? 1 : 0) +
                    (appliedFilters.dateTo ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        {!!hasActiveFilters && (
          <div
            className="flex flex-wrap items-center"
            style={{
              gap: "clamp(0.3rem, 0.6vw, 0.6rem)",
              marginBottom: "clamp(0.5rem, 1vw, 1rem)",
            }}
          >
            <span
              className="text-gray-400"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
            >
              Active filters:
            </span>
            {[
              ...appliedFilters.levels,
              ...appliedFilters.categories,
              ...appliedFilters.categoryActions,
              ...appliedFilters.codes,
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
                style={{
                  padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                  fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                }}
              >
                {getLevelLabel(tag)}
              </span>
            ))}
            {appliedFilters.dateFrom && (
              <span
                className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
                style={{
                  padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                  fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                }}
              >
                From: {appliedFilters.dateFrom}
              </span>
            )}
            {appliedFilters.dateTo && (
              <span
                className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
                style={{
                  padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                  fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                }}
              >
                To: {appliedFilters.dateTo}
              </span>
            )}
            <button
              onClick={() => handleApplyFilters(EMPTY_FILTERS)}
              className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
              style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)" }}
            >
              <X
                style={{
                  width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                  height: "clamp(0.6rem, 0.8vw, 0.9rem)",
                }}
              />
              Clear all
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Results count */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between text-gray-500"
          style={{
            fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
            marginBottom: "clamp(0.4rem, 0.8vw, 0.8rem)",
          }}
        >
          <span>
            {t("showing")}{" "}
            {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount)}–
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Table */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-[14px] overflow-hidden border border-[#19355a]/20 shadow-sm"
          style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)" }}
        >
          {/* Error state */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <XCircle
                className="text-red-400 mb-3"
                style={{
                  width: "clamp(2rem, 3vw, 4rem)",
                  height: "clamp(2rem, 3vw, 4rem)",
                }}
              />
              <p
                className="text-gray-600 font-medium"
                style={{ fontSize: "clamp(0.75rem, 1.1vw, 1.2rem)" }}
              >
                {t("error")}
              </p>
              <button
                onClick={loadData}
                className="mt-4 bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/90 transition"
                style={{
                  padding:
                    "clamp(0.4rem, 0.7vw, 0.7rem) clamp(1rem, 1.5vw, 1.5rem)",
                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                }}
              >
                {t("retry")}
              </button>
            </div>
          )}

          {/* Table */}
          {!error && (
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse"
                style={{ minWidth: "clamp(700px, 85vw, 1400px)" }}
              >
                {/* ── thead ── */}
                <thead>
                  <tr className="bg-[#19355a] text-white">
                    {[
                      { key: "no", w: "3rem" },
                      { key: "timestamp", w: "9rem" },
                      { key: "level", w: "7rem" },
                      { key: "code", w: "6.5rem" },
                      { key: "category", w: "10rem" },
                      { key: "categoryAction", w: "9rem" },
                      { key: "userName", w: "10rem" },
                      { key: "userIp", w: "8rem" },
                      { key: "renderedMessage", w: "auto" },
                      { key: "details", w: "4rem" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="text-left font-semibold whitespace-nowrap"
                        style={{
                          padding:
                            "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1rem)",
                          fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)",
                          width:
                            col.w !== "auto"
                              ? `clamp(${col.w}, ${col.w}, 20rem)`
                              : undefined,
                          letterSpacing: "0.02em",
                        }}
                      >
                        <span className="flex items-center gap-1">
                          {t(`table.${col.key}`)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* ── tbody ── */}
                <tbody>
                  {/* Loading skeleton */}
                  {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr
                        key={`sk-${i}`}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {Array.from({ length: COL_COUNT }).map((__, j) => (
                          <td
                            key={j}
                            style={{
                              padding:
                                "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            }}
                          >
                            <div
                              className="rounded animate-pulse bg-gray-200"
                              style={{
                                height: "clamp(10px, 1.2vw, 16px)",
                                width: j === 0 ? "1.5rem" : "70%",
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {/* Empty state */}
                  {!loading && logs.length === 0 && (
                    <tr>
                      <td colSpan={COL_COUNT} className="text-center py-16">
                        <ScrollText
                          className="text-gray-300 mx-auto mb-3"
                          style={{
                            width: "clamp(2rem, 4vw, 5rem)",
                            height: "clamp(2rem, 4vw, 5rem)",
                          }}
                        />
                        <p
                          className="font-medium text-gray-500"
                          style={{ fontSize: "clamp(0.75rem, 1.1vw, 1.2rem)" }}
                        >
                          {t("noLogs")}
                        </p>
                        <p
                          className="text-gray-400 mt-1"
                          style={{ fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}
                        >
                          {t("noLogsHint")}
                        </p>
                      </td>
                    </tr>
                  )}

                  {/* Data rows */}
                  {!loading &&
                    logs.map((log, idx) => {
                      const isExpanded = expandedRow === log.id;
                      const isEven = idx % 2 === 0;
                      const { date, time } = formatTimestamp(log.timestamp);
                      const levelCfg = LEVEL_CONFIG[log.level] || {};

                      return (
                        <>
                          <tr
                            key={log.id}
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : log.id)
                            }
                            className="cursor-pointer transition-colors"
                            style={{
                              backgroundColor: isExpanded
                                ? "#fdf8ec"
                                : isEven
                                  ? "#ffffff"
                                  : "#f9fafb",
                            }}
                            onMouseEnter={(e) => {
                              if (!isExpanded)
                                e.currentTarget.style.backgroundColor =
                                  "rgba(179,142,25,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isExpanded)
                                e.currentTarget.style.backgroundColor = isEven
                                  ? "#ffffff"
                                  : "#f9fafb";
                            }}
                          >
                            {/* # */}
                            <td
                              className="text-gray-400 font-mono border-b border-gray-100"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                              }}
                            >
                              {(currentPage - 1) * PAGE_SIZE + idx + 1}
                            </td>

                            {/* Timestamp */}
                            <td
                              className="border-b border-gray-100"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                              }}
                            >
                              <span
                                className="block text-gray-700 font-medium"
                                style={{
                                  fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                }}
                              >
                                {date}
                              </span>
                              <span
                                className="block text-gray-400 font-mono"
                                style={{
                                  fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                                }}
                              >
                                {time}
                              </span>
                            </td>

                            {/* Level */}
                            <td
                              className="border-b border-gray-100"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                              }}
                            >
                              <LevelBadge level={log.level} />
                            </td>

                            {/* Code */}
                            <td
                              className="border-b border-gray-100"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                              }}
                            >
                              <CodeBadge code={log.code} t={t} />
                            </td>

                            {/* Category */}
                            <td
                              className="border-b border-gray-100 text-gray-700"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <Tag
                                  className="text-[#b38e19] shrink-0"
                                  style={{
                                    width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                    height: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                  }}
                                />
                                {log.category}
                              </span>
                            </td>

                            {/* Category Action */}
                            <td
                              className="border-b border-gray-100 text-gray-600"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <Zap
                                  className="text-gray-400 shrink-0"
                                  style={{
                                    width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                    height: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                  }}
                                />
                                {log.categoryAction}
                              </span>
                            </td>

                            {/* Username */}
                            <td
                              className="border-b border-gray-100 text-gray-600"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                maxWidth: "10rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {log.userName ?? (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>

                            {/* User IP */}
                            <td
                              className="border-b border-gray-100 font-mono text-gray-500"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.55rem, 0.78vw, 0.85rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {log.userIp ?? (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>

                            {/* Rendered Message */}
                            <td
                              className="border-b border-gray-100 text-gray-700"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                maxWidth: "clamp(10rem, 20vw, 26rem)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={log.renderedMessage}
                            >
                              {log.renderedMessage}
                            </td>

                            {/* Expand toggle */}
                            <td
                              className="border-b border-gray-100 text-center"
                              style={{
                                padding:
                                  "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.4rem, 0.7vw, 0.7rem)",
                              }}
                            >
                              <button
                                className="rounded-full transition flex items-center justify-center mx-auto"
                                style={{
                                  width: "clamp(1.4rem, 2vw, 2rem)",
                                  height: "clamp(1.4rem, 2vw, 2rem)",
                                  backgroundColor: isExpanded
                                    ? "#b38e19"
                                    : "transparent",
                                  border: `1.5px solid ${isExpanded ? "#b38e19" : "#d1d5db"}`,
                                }}
                                aria-label={
                                  isExpanded ? t("collapseRow") : t("expandRow")
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown
                                    style={{
                                      width: "clamp(0.65rem, 1vw, 1.1rem)",
                                      height: "clamp(0.65rem, 1vw, 1.1rem)",
                                      color: "white",
                                    }}
                                  />
                                ) : (
                                  <ChevronRight
                                    style={{
                                      width: "clamp(0.65rem, 1vw, 1.1rem)",
                                      height: "clamp(0.65rem, 1vw, 1.1rem)",
                                      color: "#6b7280",
                                    }}
                                  />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded details row */}
                          {isExpanded && (
                            <ExpandedRow
                              key={`exp-${log.id}`}
                              log={log}
                              colSpan={COL_COUNT}
                              t={t}
                              isArabic={isArabic}
                            />
                          )}
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Pagination */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {!error && totalPages > 1 && (
          <div
            className="flex justify-center items-center"
            style={{ gap: "clamp(0.5rem, 1.2vw, 1rem)" }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => p - 1);
                setExpandedRow(null);
              }}
              className="transition rounded-lg border border-gray-300 font-medium"
              style={{
                padding:
                  "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.75rem, 1.3vw, 1.4rem)",
                fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
                color: currentPage === 1 ? "#d1d5db" : "#374151",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              {t("previous")}
            </button>

            {/* Page numbers */}
            <div
              className="flex items-center"
              style={{ gap: "clamp(0.2rem, 0.5vw, 0.5rem)" }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 2,
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="text-gray-400"
                      style={{ fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        setExpandedRow(null);
                      }}
                      className="rounded-lg transition font-medium"
                      style={{
                        minWidth: "clamp(1.6rem, 2.2vw, 2.6rem)",
                        height: "clamp(1.6rem, 2.2vw, 2.6rem)",
                        fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)",
                        backgroundColor:
                          p === currentPage ? "#19355a" : "transparent",
                        color: p === currentPage ? "white" : "#374151",
                        border: `1px solid ${p === currentPage ? "#19355a" : "#d1d5db"}`,
                      }}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => p + 1);
                setExpandedRow(null);
              }}
              className="transition rounded-lg border border-gray-300 font-medium"
              style={{
                padding:
                  "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.75rem, 1.3vw, 1.4rem)",
                fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
                color: currentPage === totalPages ? "#d1d5db" : "#374151",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* Filter Drawer */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
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
