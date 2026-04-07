import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Search,
  Filter,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  Circle,
  RotateCcw,
  XCircle,
  AlertCircle,
  UserCheck,
  Trash2,
  Lock,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useAdminTickets, { ADMIN_PAGE_SIZE } from "../hooks/useAdminTickets";
import AssignTicketModal from "../components/widgets/AdminTicketing/AssignTicketModal";
import {
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_SORTS,
} from "../services/ticketing.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const COL_COUNT = 8; // #, title, type, priority, status, sender, assignee, actions
const EMPTY_FILTERS = { sort: "", type: "", status: "", priority: "" };

const STATUS_CONFIG = {
  Opened: { bg: "#dbeafe", text: "#1d4ed8", border: "#3b82f6", icon: Circle },
  InProgress: {
    bg: "#fef3c7",
    text: "#b45309",
    border: "#f59e0b",
    icon: Clock,
  },
  Resolved: {
    bg: "#d1fae5",
    text: "#065f46",
    border: "#10b981",
    icon: CheckCircle,
  },
  Reopened: {
    bg: "#fed7aa",
    text: "#c2410c",
    border: "#f97316",
    icon: RotateCcw,
  },
  Closed: {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#9ca3af",
    icon: XCircle,
  },
  WithdrawByUser: {
    bg: "#ede9fe",
    text: "#6d28d9",
    border: "#8b5cf6",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG = {
  Unspecified: { bg: "#f3f4f6", text: "#6b7280", border: "#9ca3af" },
  Low: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
  Medium: { bg: "#dbeafe", text: "#1d4ed8", border: "#3b82f6" },
  High: { bg: "#fef3c7", text: "#b45309", border: "#f59e0b" },
  Critical: { bg: "#fee2e2", text: "#b91c1c", border: "#ef4444" },
};

// ─── Badges ───────────────────────────────────────────────────────────────────

function StatusBadge({ status, t }) {
  const cfg = STATUS_CONFIG[status] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border || "transparent"}`,
        padding:
          "clamp(0.18rem, 0.35vw, 0.35rem) clamp(0.45rem, 0.7vw, 0.75rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
      }}
    >
      {t(`statuses.${status}`, { defaultValue: status })}
    </span>
  );
}

function PriorityBadge({ priority, t }) {
  const cfg = PRIORITY_CONFIG[priority] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        padding:
          "clamp(0.18rem, 0.35vw, 0.35rem) clamp(0.45rem, 0.7vw, 0.75rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
      }}
    >
      {t(`priorities.${priority}`, { defaultValue: priority })}
    </span>
  );
}

function TypeBadge({ type, t }) {
  return (
    <span
      className="inline-flex items-center rounded-lg font-medium"
      style={{
        backgroundColor: "rgba(25, 53, 90, 0.07)",
        color: "#19355a",
        border: "1px solid rgba(25, 53, 90, 0.18)",
        padding: "clamp(0.15rem, 0.3vw, 0.3rem) clamp(0.4rem, 0.6vw, 0.65rem)",
        fontSize: "clamp(0.55rem, 0.78vw, 0.82rem)",
        maxWidth: "clamp(7rem, 12vw, 16rem)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {t(`types.${type}`, { defaultValue: type })}
    </span>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────

function AdminExpandedRow({ ticket, colSpan, t }) {
  const cells = [
    {
      label: t("expanded.description"),
      value: ticket.description,
      fallback: t("expanded.noDescription"),
    },
    ticket.senderUsername
      ? {
          label: t("admin.table.sender"),
          value: ticket.senderUsername,
          fallback: null,
        }
      : null,
    {
      label: t("expanded.assignee"),
      value: ticket.assigneeUsername,
      fallback: t("expanded.noAssignee"),
    },
    ticket.assignedByUsername
      ? {
          label: t("admin.table.assignedBy"),
          value: ticket.assignedByUsername,
          fallback: null,
        }
      : null,
  ].filter(Boolean);

  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          padding: "clamp(0.6rem, 1.2vw, 1.2rem) clamp(1rem, 2vw, 2rem)",
          backgroundColor: "#f8fafc",
        }}
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(cells.length, 2)}, 1fr)`,
          }}
        >
          {cells.map((cell) => (
            <div
              key={cell.label}
              className="rounded-xl"
              style={{
                border: "1px solid rgba(25, 53, 90, 0.15)",
                backgroundColor: "rgba(25, 53, 90, 0.04)",
                padding: "clamp(0.6rem, 1vw, 1rem)",
              }}
            >
              <p
                className="font-semibold text-[#19355a]"
                style={{
                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                  marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)",
                }}
              >
                {cell.label}
              </p>
              {cell.value ? (
                <p
                  className="text-gray-700"
                  style={{
                    fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {cell.value}
                </p>
              ) : (
                cell.fallback && (
                  <p
                    className="text-gray-400 italic"
                    style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
                  >
                    {cell.fallback}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  loading,
  error,
  isArabic,
  t,
  danger = true,
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={!loading ? onClose : undefined}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden pointer-events-auto"
          style={{ maxWidth: "clamp(280px, 32vw, 480px)" }}
        >
          <div
            className="bg-[#19355a]"
            style={{ padding: "clamp(0.8rem, 1.4vw, 1.4rem)" }}
          >
            <h3
              className="font-bold text-white"
              style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.3rem)" }}
            >
              {title}
            </h3>
          </div>
          <div style={{ padding: "clamp(1rem, 2vw, 2rem)" }}>
            <p
              className="text-gray-700"
              style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)", lineHeight: 1.6 }}
            >
              {message}
            </p>
            {error && (
              <div
                className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200"
                style={{ padding: "clamp(0.5rem, 0.9vw, 0.9rem)" }}
              >
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                <p
                  className="text-red-600"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
                >
                  {error}
                </p>
              </div>
            )}
            <div
              className="flex gap-3"
              style={{ marginTop: "clamp(1rem, 1.8vw, 1.8rem)" }}
            >
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                style={{
                  padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 text-white rounded-lg font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 ${
                  danger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
                style={{
                  padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                }}
              >
                {loading && (
                  <RefreshCw
                    className="animate-spin"
                    style={{
                      width: "clamp(0.7rem, 0.9vw, 1rem)",
                      height: "clamp(0.7rem, 0.9vw, 1rem)",
                    }}
                  />
                )}
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────

function FilterDrawer({ open, onClose, onApply, isArabic, t }) {
  const [local, setLocal] = useState(EMPTY_FILTERS);
  const drawerRef = useRef(null);

  const Section = ({ label, children }) => (
    <div style={{ marginBottom: "clamp(1rem, 1.8vw, 1.8rem)" }}>
      <p
        className="font-semibold text-[#19355a]"
        style={{
          fontSize: "clamp(0.7rem, 1vw, 1rem)",
          marginBottom: "clamp(0.5rem, 0.8vw, 0.8rem)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );

  const RadioChips = ({ options, selected, onChange, tKey }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((val) => {
        const active = selected === val;
        return (
          <button
            key={val}
            onClick={() => onChange(active ? "" : val)}
            className="rounded-full border transition-all"
            style={{
              padding:
                "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.9vw, 1rem)",
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              backgroundColor: active ? "#19355a" : "transparent",
              color: active ? "white" : "#19355a",
              borderColor: "#19355a",
              fontWeight: active ? 600 : 400,
            }}
          >
            {t(`${tKey}.${val}`, { defaultValue: val })}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        dir={isArabic ? "rtl" : "ltr"}
        className="fixed top-0 h-full bg-white z-50 shadow-2xl flex flex-col"
        style={{
          [isArabic ? "left" : "right"]: 0,
          width: "clamp(280px, 32vw, 480px)",
          transform: open
            ? "translateX(0)"
            : isArabic
              ? "translateX(-100%)"
              : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Drawer Header */}
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

        {/* Scrollable Body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "clamp(0.8rem, 1.5vw, 1.5rem)" }}
        >
          <Section label={t("filterSections.sort")}>
            <RadioChips
              options={TICKET_SORTS}
              selected={local.sort}
              onChange={(v) => setLocal((p) => ({ ...p, sort: v }))}
              tKey="sorts"
            />
          </Section>
          <Section label={t("filterSections.type")}>
            <RadioChips
              options={TICKET_TYPES}
              selected={local.type}
              onChange={(v) => setLocal((p) => ({ ...p, type: v }))}
              tKey="types"
            />
          </Section>
          <Section label={t("filterSections.status")}>
            <RadioChips
              options={TICKET_STATUSES}
              selected={local.status}
              onChange={(v) => setLocal((p) => ({ ...p, status: v }))}
              tKey="statuses"
            />
          </Section>
          <Section label={t("filterSections.priority")}>
            <RadioChips
              options={TICKET_PRIORITIES}
              selected={local.priority}
              onChange={(v) => setLocal((p) => ({ ...p, priority: v }))}
              tKey="priorities"
            />
          </Section>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-200 flex gap-3"
          style={{ padding: "clamp(0.7rem, 1.2vw, 1.2rem)" }}
        >
          <button
            onClick={() => {
              setLocal(EMPTY_FILTERS);
              onApply(EMPTY_FILTERS);
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminTicketingPage() {
  const { t, i18n } = useTranslation("Ticketing");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // ── Filter / search state (page-managed) ──────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // Keep latest params in a ref so callbacks always see current values
  const paramsRef = useRef({ ...EMPTY_FILTERS, search: "" });

  // ── Action state ──────────────────────────────────────────────────────────
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'close'|'delete', ticket }
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [assignTarget, setAssignTarget] = useState(null); // ticket to assign

  // ── Hook ──────────────────────────────────────────────────────────────────
  const {
    tickets,
    totalCount,
    loading,
    error: fetchError,
    currentPage,
    fetchTickets,
    fetchSuitableAdmins,
    doAssign,
    doClose,
    doDelete,
  } = useAdminTickets();

  // ── Debounce search ───────────────────────────────────────────────────────
  const isFirstSearchEffect = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Re-fetch on debounced search change (skip on mount) ───────────────────
  useEffect(() => {
    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;
      return;
    }
    const newParams = { ...appliedFilters, search: debouncedSearch };
    paramsRef.current = newParams;
    fetchTickets(1, newParams);
  }, [debouncedSearch]);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTickets(1, paramsRef.current);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback(
    (f) => {
      setAppliedFilters(f);
      const newParams = { ...f, search: debouncedSearch };
      paramsRef.current = newParams;
      fetchTickets(1, newParams);
    },
    [fetchTickets, debouncedSearch],
  );

  const handleGoToPage = useCallback(
    (page) => {
      fetchTickets(page, paramsRef.current);
    },
    [fetchTickets],
  );

  const handleRefresh = useCallback(() => {
    fetchTickets(currentPage, paramsRef.current);
  }, [fetchTickets, currentPage]);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setActionError("");
    try {
      if (confirmAction.type === "close") {
        await doClose(confirmAction.ticket.id);
      } else {
        await doDelete(confirmAction.ticket.id);
      }
      setConfirmAction(null);
      handleRefresh();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          t("actionError"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (body) => {
    await doAssign(assignTarget.id, body);
    handleRefresh();
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(totalCount / ADMIN_PAGE_SIZE);
  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  const TABLE_HEADERS = [
    t("table.no"),
    t("table.title"),
    t("table.type"),
    t("table.priority"),
    t("table.status"),
    t("admin.table.sender"),
    t("table.assignee"),
    t("table.actions"),
  ];

  return (
    <ResponsiveLayoutProvider>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "#f1f5f9" }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #19355a 0%, #1e4a7a 100%)",
            padding: "clamp(1.2rem, 2.5vw, 2.5rem) clamp(1rem, 3vw, 3rem)",
            marginBottom: "clamp(1rem, 2vw, 2rem)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{
                width: "clamp(2.2rem, 3.5vw, 4rem)",
                height: "clamp(2.2rem, 3.5vw, 4rem)",
                backgroundColor: "rgba(179, 142, 25, 0.15)",
                border: "1px solid rgba(179, 142, 25, 0.3)",
              }}
            >
              <Ticket
                className="text-[#b38e19]"
                style={{
                  width: "clamp(1rem, 1.8vw, 2rem)",
                  height: "clamp(1rem, 1.8vw, 2rem)",
                }}
              />
            </div>
            <div>
              <h1
                className="font-bold text-white"
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 2.2rem)",
                  lineHeight: 1.2,
                }}
              >
                {t("admin.title")}
              </h1>
              <p
                className="text-blue-200"
                style={{
                  fontSize: "clamp(0.7rem, 1vw, 1rem)",
                  marginTop: "0.25rem",
                }}
              >
                {t("admin.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "0 clamp(1rem, 3vw, 3rem) clamp(2rem, 4vw, 4rem)",
          }}
        >
          {/* ── Controls Row ─────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)" }}
          >
            {/* Search bar */}
            <div
              className="flex-1"
              style={{ minWidth: "clamp(12rem, 20vw, 24rem)" }}
            >
              <div
                className="flex items-center gap-2 bg-white rounded-xl border transition-all"
                style={{
                  padding:
                    "clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.6rem, 1.2vw, 1.2rem)",
                  borderColor: isFocused ? "#19355a" : "#e5e7eb",
                  boxShadow: isFocused
                    ? "0 0 0 3px rgba(25, 53, 90, 0.1)"
                    : "none",
                }}
              >
                <Search
                  className="text-gray-400 shrink-0"
                  style={{
                    width: "clamp(0.85rem, 1.2vw, 1.3rem)",
                    height: "clamp(0.85rem, 1.2vw, 1.3rem)",
                  }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={t("search")}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X
                      style={{
                        width: "clamp(0.75rem, 1vw, 1.1rem)",
                        height: "clamp(0.75rem, 1vw, 1.1rem)",
                      }}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilter(true)}
              className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition font-medium"
              style={{
                padding:
                  "clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.7rem, 1.2vw, 1.2rem)",
                fontSize: "clamp(0.7rem, 1vw, 1rem)",
              }}
            >
              <Filter
                style={{
                  width: "clamp(0.85rem, 1.2vw, 1.3rem)",
                  height: "clamp(0.85rem, 1.2vw, 1.3rem)",
                }}
              />
              {t("filter")}
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-[#b38e19] text-white rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ width: "1.15rem", height: "1.15rem" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              title={t("refresh")}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
              style={{
                padding:
                  "clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.7rem, 1.2vw, 1.2rem)",
              }}
            >
              <RefreshCw
                className={loading ? "animate-spin" : ""}
                style={{
                  width: "clamp(0.85rem, 1.2vw, 1.3rem)",
                  height: "clamp(0.85rem, 1.2vw, 1.3rem)",
                }}
              />
            </button>
          </div>

          {/* ── Active Filter Chips ───────────────────────────────────────── */}
          {activeFilterCount > 0 && (
            <div
              className="flex flex-wrap items-center gap-2"
              style={{ marginBottom: "clamp(0.6rem, 1vw, 1rem)" }}
            >
              <span
                className="text-gray-500"
                style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)" }}
              >
                {t("activeFilters")}
              </span>
              {Object.entries(appliedFilters).map(([key, val]) =>
                val ? (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 rounded-full bg-[#19355a] text-white font-medium"
                    style={{
                      padding:
                        "clamp(0.15rem, 0.3vw, 0.3rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                      fontSize: "clamp(0.6rem, 0.82vw, 0.85rem)",
                    }}
                  >
                    {t(`${key}s.${val}`, { defaultValue: val })}
                    <button
                      onClick={() => {
                        const nf = { ...appliedFilters, [key]: "" };
                        handleApplyFilters(nf);
                      }}
                      className="hover:text-gray-300 transition"
                      style={{ marginInlineStart: "0.25rem" }}
                    >
                      <X style={{ width: "0.6rem", height: "0.6rem" }} />
                    </button>
                  </span>
                ) : null,
              )}
              <button
                onClick={() => handleApplyFilters(EMPTY_FILTERS)}
                className="text-[#19355a] hover:underline font-medium"
                style={{ fontSize: "clamp(0.6rem, 0.82vw, 0.85rem)" }}
              >
                {t("clearAll")}
              </button>
            </div>
          )}

          {/* ── Results count ─────────────────────────────────────────────── */}
          <p
            className="text-gray-500"
            style={{
              fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)",
              marginBottom: "clamp(0.6rem, 1vw, 1rem)",
            }}
          >
            {loading ? t("loading") : `${totalCount} ${t("results")}`}
          </p>

          {/* ── Table Card ───────────────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            {fetchError && !loading && (
              <div className="flex items-start gap-2 m-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  style={{ width: "1.1rem", height: "1.1rem" }}
                />
                <p
                  className="text-red-600"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
                >
                  {fetchError}
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid rgba(25, 53, 90, 0.1)",
                      backgroundColor: "rgba(25, 53, 90, 0.03)",
                    }}
                  >
                    {TABLE_HEADERS.map((h, i) => (
                      <th
                        key={i}
                        className="font-semibold text-[#19355a] text-start whitespace-nowrap"
                        style={{
                          padding:
                            "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                          fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={COL_COUNT} className="text-center py-16">
                        <RefreshCw
                          className="animate-spin mx-auto text-[#19355a] mb-3"
                          style={{
                            width: "clamp(1.5rem, 2vw, 2.5rem)",
                            height: "clamp(1.5rem, 2vw, 2.5rem)",
                          }}
                        />
                        <p
                          className="text-gray-500"
                          style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
                        >
                          {t("loading")}
                        </p>
                      </td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={COL_COUNT} className="text-center py-16">
                        <Ticket
                          className="mx-auto text-gray-300 mb-3"
                          style={{
                            width: "clamp(2rem, 3vw, 4rem)",
                            height: "clamp(2rem, 3vw, 4rem)",
                          }}
                        />
                        <p
                          className="text-gray-500 font-medium"
                          style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
                        >
                          {t("noTickets")}
                        </p>
                        <p
                          className="text-gray-400"
                          style={{
                            fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)",
                            marginTop: "0.3rem",
                          }}
                        >
                          {t("noTicketsHint")}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket, idx) => {
                      const isExpanded = expandedRow === ticket.id;
                      const rowNum =
                        (currentPage - 1) * ADMIN_PAGE_SIZE + idx + 1;
                      const canAssign =
                        ticket.status === "Opened" ||
                        ticket.status === "Reopened";
                      const canClose = ticket.status === "Resolved";

                      return (
                        <React.Fragment key={ticket.id}>
                          <tr
                            className={`border-b border-gray-100 cursor-pointer transition-colors ${
                              isExpanded ? "bg-[#19355a]/5" : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : ticket.id)
                            }
                          >
                            {/* # */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                color: "#9ca3af",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {rowNum}
                            </td>

                            {/* Title */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                                fontWeight: 500,
                                color: "#111827",
                                maxWidth: "clamp(8rem, 14vw, 20rem)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ticket.title}
                            </td>

                            {/* Type */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <TypeBadge type={ticket.type} t={t} />
                            </td>

                            {/* Priority */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <PriorityBadge priority={ticket.priority} t={t} />
                            </td>

                            {/* Status */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <StatusBadge status={ticket.status} t={t} />
                            </td>

                            {/* Sender */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                                color: "#374151",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ticket.senderUsername ? (
                                ticket.senderUsername
                              ) : (
                                <span className="text-gray-400 italic">
                                  {t("admin.noSender")}
                                </span>
                              )}
                            </td>

                            {/* Assignee */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                                color: "#374151",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ticket.assigneeUsername ? (
                                ticket.assigneeUsername
                              ) : (
                                <span className="text-gray-400 italic">
                                  {t("expanded.noAssignee")}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                whiteSpace: "nowrap",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                {canAssign && (
                                  <button
                                    onClick={() => setAssignTarget(ticket)}
                                    className="flex items-center gap-1 rounded-lg font-medium text-white bg-[#19355a] hover:bg-[#19355a]/85 transition"
                                    style={{
                                      padding:
                                        "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                                      fontSize:
                                        "clamp(0.6rem, 0.82vw, 0.85rem)",
                                    }}
                                  >
                                    <UserCheck
                                      style={{
                                        width: "clamp(0.65rem, 0.9vw, 1rem)",
                                        height: "clamp(0.65rem, 0.9vw, 1rem)",
                                      }}
                                    />
                                    {t("admin.assign")}
                                  </button>
                                )}
                                {canClose && (
                                  <button
                                    onClick={() =>
                                      setConfirmAction({
                                        type: "close",
                                        ticket,
                                      })
                                    }
                                    className="flex items-center gap-1 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                                    style={{
                                      padding:
                                        "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                                      fontSize:
                                        "clamp(0.6rem, 0.82vw, 0.85rem)",
                                    }}
                                  >
                                    <Lock
                                      style={{
                                        width: "clamp(0.65rem, 0.9vw, 1rem)",
                                        height: "clamp(0.65rem, 0.9vw, 1rem)",
                                      }}
                                    />
                                    {t("admin.close")}
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "delete",
                                      ticket,
                                    })
                                  }
                                  className="flex items-center gap-1 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition"
                                  style={{
                                    padding:
                                      "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                                    fontSize: "clamp(0.6rem, 0.82vw, 0.85rem)",
                                  }}
                                >
                                  <Trash2
                                    style={{
                                      width: "clamp(0.65rem, 0.9vw, 1rem)",
                                      height: "clamp(0.65rem, 0.9vw, 1rem)",
                                    }}
                                  />
                                  {t("admin.delete")}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row */}
                          {isExpanded && (
                            <AdminExpandedRow
                              ticket={ticket}
                              colSpan={COL_COUNT}
                              t={t}
                            />
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between border-t border-gray-100"
                style={{
                  padding: "clamp(0.6rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem)",
                }}
              >
                <span
                  className="text-gray-500"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)" }}
                >
                  {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
                  {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGoToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                    style={{
                      padding:
                        "clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.6rem, 1vw, 1rem)",
                      fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)",
                    }}
                  >
                    {t("pagination.prev")}
                  </button>
                  <button
                    onClick={() => handleGoToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                    style={{
                      padding:
                        "clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.6rem, 1vw, 1rem)",
                      fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)",
                    }}
                  >
                    {t("pagination.next")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modals ───────────────────────────────────────────────────────── */}
        <FilterDrawer
          open={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilters}
          isArabic={isArabic}
          t={t}
        />

        <AssignTicketModal
          open={!!assignTarget}
          ticket={assignTarget}
          onClose={() => setAssignTarget(null)}
          onConfirm={handleAssign}
          fetchSuitableAdmins={fetchSuitableAdmins}
          isArabic={isArabic}
        />

        <ConfirmModal
          open={!!confirmAction}
          title={
            confirmAction?.type === "close"
              ? t("admin.closeConfirmTitle")
              : t("admin.deleteConfirmTitle")
          }
          message={
            confirmAction?.type === "close"
              ? t("admin.closeConfirmMessage")
              : t("admin.deleteConfirmMessage")
          }
          onClose={() => {
            setConfirmAction(null);
            setActionError("");
          }}
          onConfirm={handleConfirmAction}
          loading={actionLoading}
          error={actionError}
          isArabic={isArabic}
          t={t}
          danger={confirmAction?.type === "delete"}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
