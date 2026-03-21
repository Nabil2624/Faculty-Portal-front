import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Headset,
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
  CheckCircle2,
  MessageSquare,
  Database,
  Briefcase,
  GraduationCap,
  Trophy,
  FolderKanban,
  BookOpen,
  TrendingUp,
  PenLine,
  Users,
  Rocket,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useSupportAdminTickets, {
  SUPPORT_PAGE_SIZE,
} from "../hooks/useSupportAdminTickets";
import { getUserIdentifiers, updateUser } from "../services/users.service";
import SubModuleSelectorModal, {
  MODULE_SUBMODULES,
} from "../components/widgets/AdminFacultyData/SubModuleSelectorModal";
import EditUserModal from "../components/widgets/Users/EditUserModal";
import {
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_SORTS,
} from "../services/ticketing.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const COL_COUNT = 7; // #, title, type, priority, status, sender, actions
const EMPTY_FILTERS = { sort: "", type: "", status: "", priority: "" };

// Metadata for each top-level module (icons + labels reuse Users namespace)
const MODULE_META = {
  UserAccount: {
    Icon: Users,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  FacultyMemberData: {
    Icon: Database,
    color: "#0f766e",
    bg: "#f0fdfa",
  },
  FacultyMemberContributionsData: {
    Icon: Users,
    color: "#0891b2",
    bg: "#ecfeff",
  },
  FacultyMemberExperincesData: {
    Icon: Briefcase,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  FacultyMemberHigherStudiesData: {
    Icon: GraduationCap,
    color: "#059669",
    bg: "#ecfdf5",
  },
  FacultyMemberMissionsData: { Icon: Rocket, color: "#0284c7", bg: "#f0f9ff" },
  FacultyMemberPrizesData: { Icon: Trophy, color: "#d97706", bg: "#fffbeb" },
  FacultyMemberProjectsAndComiteesData: {
    Icon: FolderKanban,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  FacultyMemberResearchesData: {
    Icon: BookOpen,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  FacultyMemberScientificProgressionData: {
    Icon: TrendingUp,
    color: "#059669",
    bg: "#ecfdf5",
  },
  FacultyMemberWritingsData: { Icon: PenLine, color: "#dc2626", bg: "#fef2f2" },
};

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

// ─── Module Selector Modal ────────────────────────────────────────────────────

function ModuleSelectorModal({
  open,
  targetUser,
  isArabic,
  onSelect,
  onClose,
}) {
  const { t: tUsers } = useTranslation("Users");
  if (!open || !targetUser) return null;

  const modules = [
    "UserAccount",
    "FacultyMemberData",
    ...Object.keys(MODULE_SUBMODULES),
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col"
          style={{
            width: "clamp(300px, 50vw, 780px)",
            maxHeight: "85vh",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: "clamp(0.9rem,1.3vw,2rem) clamp(1.1rem,1.8vw,2.5rem)",
              borderBottom: "1px solid #e5e7eb",
              background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(0.9rem,1.2vw,1.7rem)",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {tUsers("editActionSelector.title")}
              </h2>
              <p
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.1rem)",
                  color: "#6b7280",
                  marginTop: "0.2rem",
                }}
              >
                <strong>{targetUser.name}</strong>
                {" — "}
                {tUsers("editActionSelector.subtitle")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-gray-100 transition"
            >
              <X
                style={{
                  width: "clamp(16px,1.3vw,20px)",
                  height: "clamp(16px,1.3vw,20px)",
                  color: "#6b7280",
                }}
              />
            </button>
          </div>

          {/* Modules grid */}
          <div
            style={{
              overflowY: "auto",
              padding: "clamp(0.8rem,1.2vw,1.8rem) clamp(1.2rem,2vw,2.5rem)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(clamp(130px,13vw,220px), 1fr))",
              gap: "clamp(0.5rem,0.8vw,1.2rem)",
            }}
          >
            {modules.map((key) => {
              const meta = MODULE_META[key] || {};
              const Icon = meta.Icon || Database;
              return (
                <button
                  key={key}
                  onClick={() => onSelect(key)}
                  className="text-start rounded-2xl border transition hover:shadow-md hover:border-blue-300"
                  style={{
                    padding: "clamp(0.7rem,1vw,1.4rem)",
                    borderColor: "#e5e7eb",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl mb-2"
                    style={{
                      width: "clamp(30px,2.5vw,48px)",
                      height: "clamp(30px,2.5vw,48px)",
                      backgroundColor: meta.bg || "#f3f4f6",
                    }}
                  >
                    <Icon
                      style={{
                        width: "clamp(14px,1.3vw,22px)",
                        height: "clamp(14px,1.3vw,22px)",
                        color: meta.color || "#374151",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.7rem,0.9vw,1.1rem)",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {tUsers(`sections.${key}.label`, key)}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.58rem,0.75vw,0.95rem)",
                      color: "#6b7280",
                      marginTop: "0.15rem",
                    }}
                  >
                    {tUsers(`sections.${key}.desc`, "")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────

function ExpandedRow({ ticket, colSpan, t, onResolve, onChat, onManageData }) {
  const canResolve =
    ticket.status === "InProgress" || ticket.status === "Opened";
  const canChat = !!ticket.assignedToId;
  const canManage = !!ticket.senderUsername;

  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          padding: "clamp(0.6rem, 1.2vw, 1.2rem) clamp(1rem, 2vw, 2rem)",
          backgroundColor: "#f8fafc",
        }}
      >
        <div className="space-y-4">
          {/* Description */}
          <div
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
                marginBottom: "clamp(0.3rem, 0.5vw, 0.5rem)",
              }}
            >
              {t("expanded.description")}
            </p>
            <p
              className="text-gray-700"
              style={{
                fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.description || (
                <em className="text-gray-400">{t("expanded.noDescription")}</em>
              )}
            </p>
          </div>

          {/* Actions Row */}
          <div className="flex flex-wrap gap-2">
            {canResolve && (
              <button
                onClick={() => onResolve(ticket)}
                className="inline-flex items-center gap-1 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                style={{
                  padding:
                    "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.6rem, 1vw, 1rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                }}
              >
                <CheckCircle2
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                {t("support.resolve")}
              </button>
            )}

            {canChat && (
              <button
                onClick={() => onChat(ticket)}
                className="inline-flex items-center gap-1 rounded-lg font-medium text-white transition"
                style={{
                  background: "#19355a",
                  padding:
                    "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.6rem, 1vw, 1rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                }}
              >
                <MessageSquare
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                {t("support.chat")}
              </button>
            )}

            {canManage && (
              <button
                onClick={() => onManageData(ticket)}
                className="inline-flex items-center gap-1 rounded-lg font-medium text-white transition"
                style={{
                  background: "#b38e19",
                  padding:
                    "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.6rem, 1vw, 1rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                }}
              >
                <Database
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                {t("support.manageData")}
              </button>
            )}
          </div>
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
                className="flex-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
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

function RadioChips({ options, selected, onChange, tKey, t }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(selected === opt ? "" : opt)}
          className="rounded-full font-medium transition"
          style={{
            padding:
              "clamp(0.2rem, 0.4vw, 0.45rem) clamp(0.55rem, 0.9vw, 1rem)",
            fontSize: "clamp(0.6rem, 0.82vw, 0.88rem)",
            backgroundColor: selected === opt ? "#19355a" : "#f3f4f6",
            color: selected === opt ? "#fff" : "#374151",
            border:
              selected === opt ? "1px solid #19355a" : "1px solid #e5e7eb",
          }}
        >
          {t(`${tKey}.${opt}`, { defaultValue: opt })}
        </button>
      ))}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: "clamp(0.8rem, 1.4vw, 1.4rem)" }}>
      <p
        className="font-semibold text-[#19355a]"
        style={{
          fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
          marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function FilterDrawer({ open, onClose, onApply, isArabic, t }) {
  const [local, setLocal] = useState(EMPTY_FILTERS);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}
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
              t={t}
            />
          </Section>
          <Section label={t("filterSections.type")}>
            <RadioChips
              options={TICKET_TYPES}
              selected={local.type}
              onChange={(v) => setLocal((p) => ({ ...p, type: v }))}
              tKey="types"
              t={t}
            />
          </Section>
          <Section label={t("filterSections.status")}>
            <RadioChips
              options={TICKET_STATUSES}
              selected={local.status}
              onChange={(v) => setLocal((p) => ({ ...p, status: v }))}
              tKey="statuses"
              t={t}
            />
          </Section>
          <Section label={t("filterSections.priority")}>
            <RadioChips
              options={TICKET_PRIORITIES}
              selected={local.priority}
              onChange={(v) => setLocal((p) => ({ ...p, priority: v }))}
              tKey="priorities"
              t={t}
            />
          </Section>
        </div>

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

export default function SupportAdminTicketingPage() {
  const { t, i18n } = useTranslation("Ticketing");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const paramsRef = useRef({ ...EMPTY_FILTERS, search: "" });

  // Resolve confirm
  const [resolveTarget, setResolveTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Manage user data
  const [manageTarget, setManageTarget] = useState(null); // ticket
  const [lookingUpUser, setLookingUpUser] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [moduleSelectorOpen, setModuleSelectorOpen] = useState(false);
  const [subSelectorOpen, setSubSelectorOpen] = useState(false);
  const [subSelectorModule, setSubSelectorModule] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  const {
    tickets,
    totalCount,
    loading,
    error: fetchError,
    currentPage,
    fetchTickets,
    doResolve,
  } = useSupportAdminTickets();

  // ── Debounce search ────────────────────────────────────────────────────────
  const isFirstSearch = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }
    const p = { ...appliedFilters, search: debouncedSearch };
    paramsRef.current = p;
    fetchTickets(1, p);
  }, [debouncedSearch]); // eslint-disable-line

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTickets(1, paramsRef.current);
  }, []); // eslint-disable-line

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback(
    (f) => {
      setAppliedFilters(f);
      const p = { ...f, search: debouncedSearch };
      paramsRef.current = p;
      fetchTickets(1, p);
    },
    [fetchTickets, debouncedSearch],
  );

  const handleGoToPage = useCallback(
    (page) => fetchTickets(page, paramsRef.current),
    [fetchTickets],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / SUPPORT_PAGE_SIZE));
  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  // ── Resolve ────────────────────────────────────────────────────────────────
  const handleConfirmResolve = useCallback(async () => {
    if (!resolveTarget) return;
    setActionLoading(true);
    setActionError("");
    try {
      await doResolve(resolveTarget.id);
      setResolveTarget(null);
      fetchTickets(currentPage, paramsRef.current);
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          t("actionError"),
      );
    } finally {
      setActionLoading(false);
    }
  }, [resolveTarget, doResolve, fetchTickets, currentPage, t]);

  // ── Chat ───────────────────────────────────────────────────────────────────
  const handleChat = useCallback(
    (ticket) => {
      navigate("/chat", { state: { ticket } });
    },
    [navigate],
  );

  // ── Manage user data ───────────────────────────────────────────────────────
  const handleManageData = useCallback(
    async (ticket) => {
      setManageTarget(ticket);
      setLookupError("");
      setLookingUpUser(true);

      try {
        const identifiers = await getUserIdentifiers(ticket.senderUsername);
        if (!identifiers?.id || !identifiers?.email) {
          setLookupError(t("support.userNotFound"));
          setLookingUpUser(false);
          return;
        }
        // Build user object matching what AdminFacultyDataPage expects
        setFoundUser({
          id: identifiers.id,
          email: identifiers.email,
          name: ticket.senderUsername,
          username: ticket.senderUsername,
          nationalId: "",
        });
        setModuleSelectorOpen(true);
      } catch {
        setLookupError(t("support.userLookupError"));
      } finally {
        setLookingUpUser(false);
      }
    },
    [t],
  );

  const handleModuleSelect = useCallback(
    (moduleType) => {
      setModuleSelectorOpen(false);

      if (moduleType === "UserAccount") {
        setEditUserOpen(true);
        return;
      }

      if (moduleType === "FacultyMemberData") {
        // Option is selectable now; backend integration comes later.
        navigate("/admin/faculty-data", {
          state: {
            user: foundUser,
            subModule: "facultyMemberData",
            returnTo: "/support-admin",
          },
        });
        return;
      }

      setSubSelectorModule(moduleType);
      setSubSelectorOpen(true);
    },
    [navigate, foundUser],
  );

  const handleSaveUser = useCallback(
    async (payload) => {
      if (!foundUser?.id) return;
      setSavingUser(true);
      setLookupError("");
      try {
        const updated = await updateUser(foundUser.id, payload);
        setFoundUser((prev) => ({
          ...prev,
          email: updated?.email ?? payload.email ?? prev?.email,
          username: updated?.username ?? payload.username ?? prev?.username,
        }));
        setEditUserOpen(false);
      } catch (err) {
        setLookupError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            t("actionError"),
        );
      } finally {
        setSavingUser(false);
      }
    },
    [foundUser?.id, t],
  );

  const handleSubModuleSelect = useCallback(
    (subModule) => {
      setSubSelectorOpen(false);
      navigate("/admin/faculty-data", {
        state: { user: foundUser, subModule, returnTo: "/support-admin" },
      });
    },
    [navigate, foundUser],
  );

  // ─────────────────────────────────────────────────────────────────────────

  const tdStyle = {
    padding: "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1.2rem)",
    fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
    verticalAlign: "middle",
    color: "#374151",
  };

  const thStyle = {
    padding: "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1.2rem)",
    fontSize: "clamp(0.6rem, 0.82vw, 0.88rem)",
    fontWeight: 600,
    color: "#19355a",
    textAlign: isArabic ? "right" : "left",
    whiteSpace: "nowrap",
    backgroundColor: "#eff6ff",
  };

  return (
    <ResponsiveLayoutProvider>
      {/* ── Resolve Confirm Modal ───────────────────────── */}
      <ConfirmModal
        open={!!resolveTarget}
        title={t("support.resolveConfirmTitle")}
        message={t("support.resolveConfirmMessage")}
        onClose={() => {
          setResolveTarget(null);
          setActionError("");
        }}
        onConfirm={handleConfirmResolve}
        loading={actionLoading}
        error={actionError}
        isArabic={isArabic}
        t={t}
      />

      {/* ── Module selector ─────────────────────────────── */}
      <ModuleSelectorModal
        open={moduleSelectorOpen}
        targetUser={foundUser}
        isArabic={isArabic}
        onSelect={handleModuleSelect}
        onClose={() => setModuleSelectorOpen(false)}
      />

      {/* ── Sub-module selector ─────────────────────────── */}
      {subSelectorOpen && foundUser && (
        <SubModuleSelectorModal
          moduleType={subSelectorModule}
          targetUser={foundUser}
          onSelect={handleSubModuleSelect}
          onClose={() => setSubSelectorOpen(false)}
        />
      )}

      {/* ── Edit user account (same backend flow as Users page) ── */}
      {editUserOpen && foundUser && (
        <EditUserModal
          user={foundUser}
          saving={savingUser}
          onSave={handleSaveUser}
          onClose={() => setEditUserOpen(false)}
        />
      )}

      {/* ── Filter Drawer ────────────────────────────────── */}
      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
        isArabic={isArabic}
        t={t}
      />

      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{
          padding: "clamp(1rem, 2vw, 4rem)",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1rem, 1.5vw, 2rem)",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #19355a, #2a4d80)",
                padding: "clamp(0.5rem, 0.8vw, 0.9rem)",
              }}
            >
              <Headset
                className="text-[#b38e19]"
                style={{
                  width: "clamp(1.2rem, 1.8vw, 2rem)",
                  height: "clamp(1.2rem, 1.8vw, 2rem)",
                }}
              />
            </div>
            <div>
              <h1
                className="font-bold text-[#19355a]"
                style={{ fontSize: "clamp(1rem, 1.6vw, 1.8rem)" }}
              >
                {t("support.title")}
              </h1>
              <p
                className="text-gray-500"
                style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
              >
                {t("support.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ─────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl shadow-sm flex flex-wrap items-center gap-3"
          style={{
            padding: "clamp(0.6rem, 1vw, 1.2rem)",
            border: "1px solid rgba(25, 53, 90, 0.08)",
          }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-xl flex-1"
            style={{
              minWidth: "clamp(120px, 18vw, 320px)",
              border: "1px solid #e5e7eb",
              padding:
                "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1rem)",
            }}
          >
            <Search
              className="text-gray-400 shrink-0"
              style={{
                width: "clamp(0.85rem, 1.1vw, 1.2rem)",
                height: "clamp(0.85rem, 1.1vw, 1.2rem)",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="outline-none text-gray-700 bg-transparent w-full"
              style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
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

          {/* Filter btn */}
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 rounded-xl font-medium transition relative"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.8rem, 1.2vw, 1.3rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
              backgroundColor:
                activeFilterCount > 0 ? "#19355a" : "transparent",
              color: activeFilterCount > 0 ? "#fff" : "#374151",
              border: `1px solid ${activeFilterCount > 0 ? "#19355a" : "#e5e7eb"}`,
            }}
          >
            <Filter
              style={{
                width: "clamp(0.8rem, 1vw, 1.1rem)",
                height: "clamp(0.8rem, 1vw, 1.1rem)",
              }}
            />
            {t("filter")}
            {activeFilterCount > 0 && (
              <span className="bg-[#b38e19] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={() => fetchTickets(currentPage, paramsRef.current)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl font-medium transition border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.8rem, 1.2vw, 1.3rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            <RefreshCw
              className={loading ? "animate-spin" : ""}
              style={{
                width: "clamp(0.8rem, 1vw, 1.1rem)",
                height: "clamp(0.8rem, 1vw, 1.1rem)",
              }}
            />
            {t("refresh")}
          </button>

          {/* Count */}
          <span
            className="text-gray-400"
            style={{
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              marginLeft: isArabic ? 0 : "auto",
              marginRight: isArabic ? "auto" : 0,
            }}
          >
            {totalCount} {t("results")}
          </span>
        </div>

        {/* ── Lookup error ─────────────────────────────────── */}
        {lookupError && (
          <div
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200"
            style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
          >
            <AlertCircle className="text-red-500 w-4 h-4 mt-0.5 shrink-0" />
            <p
              className="text-red-600"
              style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
            >
              {lookupError}
            </p>
            <button
              onClick={() => setLookupError("")}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Fetch error ───────────────────────────────────── */}
        {fetchError && !loading && (
          <div
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200"
            style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
          >
            <AlertCircle className="text-red-500 w-4 h-4 mt-0.5 shrink-0" />
            <p
              className="text-red-600"
              style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
            >
              {fetchError}
            </p>
          </div>
        )}

        {/* ── Table ─────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ border: "1px solid rgba(25, 53, 90, 0.08)" }}
        >
          {loading ? (
            <div
              className="flex items-center justify-center gap-2 text-gray-400"
              style={{ padding: "clamp(2rem, 4vw, 5rem)" }}
            >
              <RefreshCw
                className="animate-spin"
                style={{
                  width: "clamp(1rem, 1.5vw, 1.5rem)",
                  height: "clamp(1rem, 1.5vw, 1.5rem)",
                }}
              />
              <span style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}>
                {t("loading")}
              </span>
            </div>
          ) : tickets.length === 0 ? (
            <div
              className="flex flex-col items-center gap-4 text-center"
              style={{ padding: "clamp(2rem, 5vw, 6rem)" }}
            >
              <Headset
                className="text-gray-200"
                style={{
                  width: "clamp(2rem, 4vw, 5rem)",
                  height: "clamp(2rem, 4vw, 5rem)",
                }}
              />
              <div>
                <p
                  className="font-semibold text-gray-500"
                  style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.1rem)" }}
                >
                  {t("noTickets")}
                </p>
                <p
                  className="text-gray-400"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
                >
                  {t("support.noTicketsHint")}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t("table.no")}</th>
                    <th style={thStyle}>{t("table.title")}</th>
                    <th style={thStyle}>{t("table.type")}</th>
                    <th style={thStyle}>{t("table.priority")}</th>
                    <th style={thStyle}>{t("table.status")}</th>
                    <th style={thStyle}>{t("support.table.sender")}</th>
                    <th style={thStyle}>{t("support.table.chat")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => {
                    const globalIdx =
                      (currentPage - 1) * SUPPORT_PAGE_SIZE + idx + 1;
                    const isExpanded = expandedRow === ticket.id;

                    return (
                      <React.Fragment key={ticket.id}>
                        <tr
                          className="cursor-pointer transition-colors"
                          style={{
                            backgroundColor: isExpanded
                              ? "rgba(25, 53, 90, 0.04)"
                              : idx % 2 === 0
                                ? "#fff"
                                : "#fafafa",
                            borderBottom: "1px solid #f3f4f6",
                          }}
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : ticket.id)
                          }
                        >
                          <td style={{ ...tdStyle, color: "#9ca3af" }}>
                            {globalIdx}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              fontWeight: 500,
                              color: "#111827",
                            }}
                          >
                            {ticket.title}
                          </td>
                          <td style={tdStyle}>
                            <TypeBadge type={ticket.type} t={t} />
                          </td>
                          <td style={tdStyle}>
                            <PriorityBadge priority={ticket.priority} t={t} />
                          </td>
                          <td style={tdStyle}>
                            <StatusBadge status={ticket.status} t={t} />
                          </td>
                          <td style={{ ...tdStyle, color: "#6b7280" }}>
                            {ticket.senderUsername || t("admin.noSender")}
                          </td>
                          <td
                            style={tdStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ticket.assignedToId && (
                              <button
                                title={t("support.chat")}
                                onClick={() => handleChat(ticket)}
                                className="inline-flex items-center justify-center rounded-lg transition hover:bg-[#19355a]/10"
                                style={{
                                  padding: "clamp(0.25rem, 0.4vw, 0.4rem)",
                                  color: "#19355a",
                                }}
                              >
                                <MessageSquare
                                  style={{
                                    width: "clamp(0.9rem, 1.2vw, 1.3rem)",
                                    height: "clamp(0.9rem, 1.2vw, 1.3rem)",
                                  }}
                                />
                              </button>
                            )}
                          </td>
                        </tr>

                        {isExpanded && (
                          <ExpandedRow
                            ticket={ticket}
                            colSpan={COL_COUNT}
                            t={t}
                            onResolve={(tk) => {
                              setResolveTarget(tk);
                              setActionError("");
                            }}
                            onChat={handleChat}
                            onManageData={handleManageData}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────── */}
          {totalPages > 1 && (
            <div
              className="flex items-center justify-between border-t border-gray-100"
              style={{
                padding:
                  "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1.2rem)",
              }}
            >
              <button
                onClick={() => handleGoToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-40"
                style={{
                  padding:
                    "clamp(0.3rem, 0.5vw, 0.6rem) clamp(0.6rem, 1vw, 1rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                }}
              >
                {t("pagination.prev")}
              </button>
              <span
                className="text-gray-500"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
              >
                {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
                {totalPages}
              </span>
              <button
                onClick={() => handleGoToPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-40"
                style={{
                  padding:
                    "clamp(0.3rem, 0.5vw, 0.6rem) clamp(0.6rem, 1vw, 1rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                }}
              >
                {t("pagination.next")}
              </button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
