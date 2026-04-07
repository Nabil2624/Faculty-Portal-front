import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Search,
  Filter,
  RefreshCw,
  X,
  Plus,
  ChevronDown,
  CheckCircle,
  Clock,
  Circle,
  RotateCcw,
  XCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useTickets from "../hooks/useTickets";
import {
  createTicket,
  revokeTicket,
  reopenTicket,
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_SORTS,
} from "../services/ticketing.service";
import {
  getTicketConversation,
  initConversation,
} from "../services/messaging.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  Opened: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#3b82f6",
    icon: Circle,
  },
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

// ─── Status Badge ─────────────────────────────────────────────────────────────

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

// ─── Priority Badge ───────────────────────────────────────────────────────────

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

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type, t }) {
  return (
    <span
      className="inline-flex items-center rounded-lg font-medium whitespace-nowrap"
      style={{
        backgroundColor: "rgba(25, 53, 90, 0.07)",
        color: "#19355a",
        border: "1px solid rgba(25, 53, 90, 0.18)",
        padding: "clamp(0.15rem, 0.3vw, 0.3rem) clamp(0.4rem, 0.6vw, 0.65rem)",
        fontSize: "clamp(0.55rem, 0.78vw, 0.82rem)",
        maxWidth: "clamp(7rem, 12vw, 16rem)",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {t(`types.${type}`, { defaultValue: type })}
    </span>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────

function ExpandedRow({ ticket, colSpan, t }) {
  const hasAssignee = !!ticket.assigneeUsername;
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
            gridTemplateColumns: hasAssignee ? "1fr 1fr" : "1fr",
          }}
        >
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
                marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)",
              }}
            >
              {t("expanded.description")}
            </p>
            {ticket.description ? (
              <p
                className="text-gray-700"
                style={{
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {ticket.description}
              </p>
            ) : (
              <p
                className="text-gray-400 italic"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
              >
                {t("expanded.noDescription")}
              </p>
            )}
          </div>

          {/* Assignee */}
          {hasAssignee && (
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
                  marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)",
                }}
              >
                {t("expanded.assignee")}
              </p>
              <p
                className="text-gray-700"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
              >
                {ticket.assigneeUsername}
              </p>
            </div>
          )}
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
                className="flex-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
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

// ─── Type Dropdown (portal-based, always opens downward) ─────────────────────

function TypeDropdown({
  value,
  onChange,
  options,
  placeholder,
  t,
  inputBase,
  isArabic,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel = value
    ? t(`types.${value}`, { defaultValue: value })
    : placeholder;

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        style={{
          ...inputBase,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: isArabic ? "right" : "left",
          color: value ? "#111827" : "#9ca3af",
          borderColor: open ? "#b38e19" : "#d1d5db",
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          style={{
            width: "clamp(0.75rem, 1vw, 1.1rem)",
            height: "clamp(0.75rem, 1vw, 1.1rem)",
            marginInlineStart: "0.5rem",
            flexShrink: 0,
            color: "#6b7280",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open &&
        ReactDOM.createPortal(
          <ul
            ref={listRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.13)",
              maxHeight: "220px",
              overflowY: "auto",
              padding: "0.25rem 0",
              margin: 0,
              listStyle: "none",
              fontSize: "clamp(0.75rem, 1vw, 1rem)",
            }}
          >
            {options.map((opt) => (
              <li
                key={opt}
                onMouseDown={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  padding:
                    "clamp(0.4rem, 0.7vw, 0.7rem) clamp(0.6rem, 1vw, 1rem)",
                  cursor: "pointer",
                  backgroundColor:
                    value === opt ? "rgba(25,53,90,0.08)" : "transparent",
                  color: value === opt ? "#19355a" : "#111827",
                  fontWeight: value === opt ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (value !== opt)
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    value === opt ? "rgba(25,53,90,0.08)" : "transparent";
                }}
              >
                {t(`types.${opt}`, { defaultValue: opt })}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}

// ─── Create Ticket Modal ──────────────────────────────────────────────────────

function CreateTicketModal({ open, onClose, onSuccess, isArabic, t }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm({ title: "", description: "", type: "" });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.type) {
      setError(t("createModal.required"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createTicket(form);
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          t("actionError"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputBase = {
    fontSize: "clamp(0.75rem, 1vw, 1rem)",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    outline: "none",
    width: "100%",
    padding: "clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
    background: "white",
    transition: "border-color 0.2s",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden pointer-events-auto"
          style={{ maxWidth: "clamp(300px, 38vw, 560px)" }}
        >
          {/* Header */}
          <div
            className="bg-[#19355a] flex items-center justify-between"
            style={{ padding: "clamp(0.8rem, 1.4vw, 1.4rem)" }}
          >
            <div className="flex items-center gap-2">
              <LifeBuoy
                className="text-[#b38e19]"
                style={{
                  width: "clamp(1rem, 1.4vw, 1.5rem)",
                  height: "clamp(1rem, 1.4vw, 1.5rem)",
                }}
              />
              <h3
                className="font-bold text-white"
                style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.3rem)" }}
              >
                {t("createModal.title")}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition"
            >
              <X
                style={{
                  width: "clamp(0.9rem, 1.2vw, 1.3rem)",
                  height: "clamp(0.9rem, 1.2vw, 1.3rem)",
                }}
              />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ padding: "clamp(1rem, 2vw, 2rem)" }}
          >
            {/* Title */}
            <div style={{ marginBottom: "clamp(0.8rem, 1.4vw, 1.4rem)" }}>
              <label
                className="block font-semibold text-gray-700"
                style={{
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                  marginBottom: "clamp(0.2rem, 0.4vw, 0.4rem)",
                }}
              >
                {t("createModal.titleLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder={t("createModal.titlePlaceholder")}
                style={inputBase}
                onFocus={(e) => (e.target.style.borderColor = "#b38e19")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "clamp(0.8rem, 1.4vw, 1.4rem)" }}>
              <label
                className="block font-semibold text-gray-700"
                style={{
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                  marginBottom: "clamp(0.2rem, 0.4vw, 0.4rem)",
                }}
              >
                {t("createModal.descriptionLabel")}
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder={t("createModal.descriptionPlaceholder")}
                rows={4}
                style={{ ...inputBase, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#b38e19")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: "clamp(0.8rem, 1.4vw, 1.4rem)" }}>
              <label
                className="block font-semibold text-gray-700"
                style={{
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                  marginBottom: "clamp(0.2rem, 0.4vw, 0.4rem)",
                }}
              >
                {t("createModal.typeLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <TypeDropdown
                value={form.type}
                onChange={(val) => setForm((p) => ({ ...p, type: val }))}
                options={TICKET_TYPES}
                placeholder={t("createModal.selectType")}
                t={t}
                inputBase={inputBase}
                isArabic={isArabic}
              />
            </div>

            {error && (
              <div
                className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200"
                style={{
                  padding: "clamp(0.5rem, 0.8vw, 0.8rem)",
                  marginBottom: "clamp(0.6rem, 1vw, 1rem)",
                }}
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

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
                style={{
                  padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                }}
              >
                {t("createModal.cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#19355a] text-white rounded-lg font-semibold hover:bg-[#19355a]/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                }}
              >
                {submitting && (
                  <RefreshCw
                    className="animate-spin"
                    style={{
                      width: "clamp(0.7rem, 0.9vw, 1rem)",
                      height: "clamp(0.7rem, 0.9vw, 1rem)",
                    }}
                  />
                )}
                {t("createModal.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────

function FilterDrawer({ open, onClose, filters, onApply, isArabic, t }) {
  const [local, setLocal] = useState(filters);
  const drawerRef = useRef(null);

  useEffect(() => {
    setLocal(filters);
  }, [filters, open]);

  const [openSections, setOpenSections] = useState({});
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasActive = !!(
    local.type ||
    local.status ||
    local.priority ||
    local.sort
  );

  const Section = ({ sectionKey, label, children }) => {
    const isOpen = !!openSections[sectionKey];
    return (
      <div
        className="border border-gray-200 rounded-xl overflow-hidden"
        style={{ marginBottom: "clamp(0.5rem, 1vw, 0.9rem)" }}
      >
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          style={{
            padding:
              "clamp(0.55rem, 0.9vw, 0.9rem) clamp(0.7rem, 1.1vw, 1.1rem)",
          }}
        >
          <span
            className="font-semibold text-gray-700"
            style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}
          >
            {label}
          </span>
          <ChevronDown
            className="text-gray-400 flex-shrink-0"
            style={{
              width: "clamp(0.8rem, 1.1vw, 1.2rem)",
              height: "clamp(0.8rem, 1.1vw, 1.2rem)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
        <div
          style={{
            maxHeight: isOpen ? "500px" : "0px",
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

  const RadioChips = ({ options, selected, onChange, tKey }) => (
    <div
      className="flex flex-wrap"
      style={{ gap: "clamp(0.3rem, 0.6vw, 0.6rem)" }}
    >
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

  const EMPTY = { type: "", status: "", priority: "", sort: "" };

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
          <Section sectionKey="sort" label={t("filterSections.sort")}>
            <RadioChips
              options={TICKET_SORTS}
              selected={local.sort}
              onChange={(v) => setLocal((p) => ({ ...p, sort: v }))}
              tKey="sorts"
            />
          </Section>

          <Section sectionKey="type" label={t("filterSections.type")}>
            <RadioChips
              options={TICKET_TYPES}
              selected={local.type}
              onChange={(v) => setLocal((p) => ({ ...p, type: v }))}
              tKey="types"
            />
          </Section>

          <Section sectionKey="status" label={t("filterSections.status")}>
            <RadioChips
              options={TICKET_STATUSES}
              selected={local.status}
              onChange={(v) => setLocal((p) => ({ ...p, status: v }))}
              tKey="statuses"
            />
          </Section>

          <Section sectionKey="priority" label={t("filterSections.priority")}>
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
              setLocal(EMPTY);
              onApply(EMPTY);
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

const EMPTY_FILTERS = { type: "", status: "", priority: "", sort: "" };
const COL_COUNT = 7; // #, title, type, priority, status, assignee, actions

export default function TicketingPage() {
  const { t, i18n } = useTranslation("Ticketing");
  const isArabic = i18n.language === "ar";

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  // ── Action State ──────────────────────────────────────────────────────────────
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'revoke'|'reopen', ticket }
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [chatLoadingId, setChatLoadingId] = useState(null);

  // ── Debounce Search ───────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { tickets, totalCount, totalPages, loading, error, refresh } =
    useTickets({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      sort: appliedFilters.sort,
      type: appliedFilters.type,
      status: appliedFilters.status,
      priority: appliedFilters.priority,
    });

  const navigate = useNavigate();

  const hasActiveFilters = !!(
    appliedFilters.type ||
    appliedFilters.status ||
    appliedFilters.priority ||
    appliedFilters.sort
  );

  const activeFilterCount = [
    appliedFilters.type,
    appliedFilters.status,
    appliedFilters.priority,
    appliedFilters.sort,
  ].filter(Boolean).length;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback((newFilters) => {
    setAppliedFilters(newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
    setExpandedRow(null);
  }, []);

  const handleRevoke = (ticket) => {
    setActionError("");
    setConfirmAction({ type: "revoke", ticket });
  };

  const handleReopen = (ticket) => {
    setActionError("");
    setConfirmAction({ type: "reopen", ticket });
  };

  const handleChat = useCallback(
    async (ticket) => {
      setChatLoadingId(ticket.id);
      try {
        await getTicketConversation(ticket.id);
      } catch (err) {
        if (err?.response?.status === 204) {
          try {
            const now = new Date().toISOString();
            await initConversation({
              title: ticket.title ?? "Ticket Conversation",
              ticketId: ticket.id,
              participants: [
                {
                  userId: ticket.senderId,
                  username: ticket.senderUsername ?? "",
                  joinedAt: now,
                },
                {
                  userId: ticket.assignedToId,
                  username: ticket.assigneeUsername ?? "",
                  joinedAt: now,
                },
              ],
            });
          } catch {
            // ignore — ChatPage will handle init on load
          }
        }
      } finally {
        setChatLoadingId(null);
        navigate("/chat", { state: { ticket } });
      }
    },
    [navigate],
  );

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setActionError("");
    try {
      if (confirmAction.type === "revoke") {
        await revokeTicket(confirmAction.ticket.id);
      } else {
        await reopenTicket(confirmAction.ticket.id);
      }
      setConfirmAction(null);
      refresh();
    } catch (err) {
      if (err?.response?.status === 403) {
        setActionError(t("revokeInProgress"));
      } else {
        setActionError(t("actionError"));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ── Pagination helper ─────────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const total = totalPages;
    const current = currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Page Header                                                          */}
        {/* ════════════════════════════════════════════════════════════════════ */}
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
            <LifeBuoy
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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Toolbar                                                              */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)",
            gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
            flexWrap: "wrap",
          }}
        >
          {/* Title + underline */}
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

          {/* Right Controls */}
          <div
            className="flex items-center"
            style={{ gap: "clamp(0.4rem, 0.8vw, 0.8rem)" }}
          >
            {/* Search */}
            <div
              className="relative flex items-center"
              style={{
                borderBottom: `2px solid ${isFocused ? "#b38e19" : "#d1d5db"}`,
                paddingBottom: "2px",
                transition: "border-color 0.3s ease",
                flex: "1",
                maxWidth: "clamp(11rem, 22vw, 30rem)",
                minWidth: "8rem",
              }}
            >
              <Search
                className="shrink-0 text-[#b38e19]"
                style={{
                  width: "clamp(14px, 1.6vw, 22px)",
                  height: "clamp(14px, 1.6vw, 22px)",
                  [isArabic ? "marginLeft" : "marginRight"]:
                    "clamp(4px, 0.6vw, 8px)",
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
                  height: "clamp(28px, 2.8vw, 40px)",
                  fontSize: "clamp(11px, 1vw, 14px)",
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
              onClick={refresh}
              title={t("refresh")}
              className="border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition flex-shrink-0"
              style={{
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

            {/* Filter */}
            <button
              onClick={() => setShowFilter(true)}
              className="border-2 rounded-md flex items-center justify-center transition relative flex-shrink-0"
              style={{
                width: "clamp(2rem, 2.8vw, 3.5rem)",
                height: "clamp(2rem, 2.8vw, 3.5rem)",
                borderColor: "#b38e19",
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
              {hasActiveFilters && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
                  style={{
                    width: "clamp(12px, 1.1vw, 16px)",
                    height: "clamp(12px, 1.1vw, 16px)",
                    fontSize: "clamp(7px, 0.6vw, 9px)",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Create Ticket */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-[#b38e19] text-white rounded-md font-semibold hover:bg-[#b38e19]/90 transition flex-shrink-0"
              style={{
                padding: "0 clamp(0.7rem, 1.2vw, 1.4rem)",
                height: "clamp(2rem, 2.8vw, 3.5rem)",
                fontSize: "clamp(0.65rem, 0.95vw, 1rem)",
              }}
            >
              <Plus
                style={{
                  width: "clamp(0.75rem, 1.1vw, 1.2rem)",
                  height: "clamp(0.75rem, 1.1vw, 1.2rem)",
                }}
              />
              <span className="hidden sm:inline">{t("createTicket")}</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Active Filter Chips                                                  */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {hasActiveFilters && (
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
              {t("activeFilters")}
            </span>
            {[
              appliedFilters.type && {
                key: "type",
                label: t(`types.${appliedFilters.type}`, {
                  defaultValue: appliedFilters.type,
                }),
              },
              appliedFilters.status && {
                key: "status",
                label: t(`statuses.${appliedFilters.status}`, {
                  defaultValue: appliedFilters.status,
                }),
              },
              appliedFilters.priority && {
                key: "priority",
                label: t(`priorities.${appliedFilters.priority}`, {
                  defaultValue: appliedFilters.priority,
                }),
              },
              appliedFilters.sort && {
                key: "sort",
                label: t(`sorts.${appliedFilters.sort}`, {
                  defaultValue: appliedFilters.sort,
                }),
              },
            ]
              .filter(Boolean)
              .map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center rounded-full"
                  style={{
                    backgroundColor: "rgba(179, 142, 25, 0.1)",
                    color: "#b38e19",
                    border: "1px solid rgba(179, 142, 25, 0.3)",
                    padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                    fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                  }}
                >
                  {chip.label}
                </span>
              ))}
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
              {t("clearAll")}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Results Count                                                        */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between text-gray-500"
          style={{
            marginBottom: "clamp(0.5rem, 1vw, 1rem)",
            fontSize: "clamp(0.65rem, 0.85vw, 0.9rem)",
          }}
        >
          <span>
            {totalCount} {t("results")}
          </span>
          <span>
            {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
            {totalPages}
          </span>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Table                                                                */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white"
          style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)" }}
        >
          {loading ? (
            <div
              className="flex items-center justify-center gap-2 text-gray-400"
              style={{ padding: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              <RefreshCw
                className="animate-spin"
                style={{
                  width: "clamp(1rem, 1.5vw, 1.8rem)",
                  height: "clamp(1rem, 1.5vw, 1.8rem)",
                }}
              />
              <span style={{ fontSize: "clamp(0.75rem, 1vw, 1.1rem)" }}>
                {t("loading")}
              </span>
            </div>
          ) : error ? (
            <div
              className="text-center"
              style={{ padding: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              <AlertCircle
                className="mx-auto text-red-400"
                style={{
                  width: "clamp(1.5rem, 2.5vw, 3rem)",
                  height: "clamp(1.5rem, 2.5vw, 3rem)",
                  marginBottom: "clamp(0.5rem, 1vw, 1rem)",
                }}
              />
              <p
                className="text-red-500"
                style={{ fontSize: "clamp(0.75rem, 1vw, 1.1rem)" }}
              >
                {error}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#19355a] text-white">
                    {[
                      "no",
                      "title",
                      "type",
                      "priority",
                      "status",
                      "assignee",
                      "actions",
                    ].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding:
                            "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                          fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                          textAlign:
                            col === "actions"
                              ? "center"
                              : isArabic
                                ? "right"
                                : "left",
                        }}
                      >
                        {t(`table.${col}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={COL_COUNT}
                        className="text-center"
                        style={{ padding: "clamp(3rem, 7vw, 7rem)" }}
                      >
                        <LifeBuoy
                          className="mx-auto text-gray-300"
                          style={{
                            width: "clamp(2rem, 3.5vw, 4rem)",
                            height: "clamp(2rem, 3.5vw, 4rem)",
                            marginBottom: "clamp(0.5rem, 1vw, 1rem)",
                          }}
                        />
                        <p
                          className="text-gray-500 font-medium"
                          style={{
                            fontSize: "clamp(0.8rem, 1.1vw, 1.2rem)",
                          }}
                        >
                          {t("noTickets")}
                        </p>
                        <p
                          className="text-gray-400"
                          style={{
                            fontSize: "clamp(0.65rem, 0.85vw, 0.9rem)",
                            marginTop: "4px",
                          }}
                        >
                          {t("noTicketsHint")}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket, idx) => {
                      const isExpanded = expandedRow === ticket.id;
                      const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1;
                      const canRevoke =
                        ticket.status === "Opened" ||
                        ticket.status === "Reopened";
                      const canReopen = ticket.status === "Resolved";

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
                                maxWidth: "clamp(8rem, 20vw, 28rem)",
                              }}
                            >
                              <p
                                className="font-medium text-gray-800 truncate"
                                style={{
                                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                                }}
                              >
                                {ticket.title}
                              </p>
                            </td>

                            {/* Type */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                              }}
                            >
                              <TypeBadge type={ticket.type} t={t} />
                            </td>

                            {/* Priority */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                              }}
                            >
                              <PriorityBadge priority={ticket.priority} t={t} />
                            </td>

                            {/* Status */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                              }}
                            >
                              <StatusBadge status={ticket.status} t={t} />
                            </td>

                            {/* Assignee */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                                color: ticket.assigneeUsername
                                  ? "#374151"
                                  : "#9ca3af",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ticket.assigneeUsername || "—"}
                            </td>

                            {/* Actions */}
                            <td
                              style={{
                                padding:
                                  "clamp(0.6rem, 1vw, 1rem) clamp(0.6rem, 1.2vw, 1.5rem)",
                                textAlign: "center",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1 flex-wrap">
                                {canRevoke && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRevoke(ticket);
                                    }}
                                    className="rounded-md font-medium transition hover:opacity-80"
                                    style={{
                                      backgroundColor: "#fee2e2",
                                      color: "#b91c1c",
                                      padding:
                                        "clamp(0.15rem, 0.3vw, 0.4rem) clamp(0.4rem, 0.7vw, 0.9rem)",
                                      fontSize:
                                        "clamp(0.55rem, 0.78vw, 0.85rem)",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {t("actions.revoke")}
                                  </button>
                                )}
                                {canReopen && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReopen(ticket);
                                    }}
                                    className="rounded-md font-medium transition hover:opacity-80"
                                    style={{
                                      backgroundColor: "#dbeafe",
                                      color: "#1d4ed8",
                                      padding:
                                        "clamp(0.15rem, 0.3vw, 0.4rem) clamp(0.4rem, 0.7vw, 0.9rem)",
                                      fontSize:
                                        "clamp(0.55rem, 0.78vw, 0.85rem)",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {t("actions.reopen")}
                                  </button>
                                )}
                                {ticket.assignedToId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChat(ticket);
                                    }}
                                    disabled={chatLoadingId === ticket.id}
                                    title={t("actions.chat")}
                                    className="rounded-md transition hover:bg-[#19355a]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                      padding: "clamp(0.15rem, 0.3vw, 0.35rem)",
                                      color: "#19355a",
                                    }}
                                  >
                                    <MessageSquare
                                      style={{
                                        width: "clamp(0.8rem, 1vw, 1.1rem)",
                                        height: "clamp(0.8rem, 1vw, 1.1rem)",
                                      }}
                                    />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedRow(
                                      isExpanded ? null : ticket.id,
                                    );
                                  }}
                                  className="rounded-md transition hover:bg-gray-100"
                                  style={{
                                    padding: "clamp(0.15rem, 0.3vw, 0.35rem)",
                                    color: "#6b7280",
                                  }}
                                  title={t("actions.details")}
                                >
                                  <ChevronDown
                                    style={{
                                      width: "clamp(0.8rem, 1vw, 1.1rem)",
                                      height: "clamp(0.8rem, 1vw, 1.1rem)",
                                      transform: isExpanded
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      transition: "transform 0.2s ease",
                                    }}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <ExpandedRow
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
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Pagination                                                           */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-center"
            style={{ gap: "clamp(0.3rem, 0.6vw, 0.6rem)" }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                padding:
                  "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.7rem, 1.2vw, 1.4rem)",
                fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
              }}
            >
              {t("pagination.prev")}
            </button>

            {getPageNumbers().map((pg, i) =>
              pg === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="text-gray-400 select-none"
                  style={{ fontSize: "clamp(0.7rem, 0.9vw, 1rem)" }}
                >
                  …
                </span>
              ) : (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className="rounded-lg font-medium transition"
                  style={{
                    minWidth: "clamp(1.8rem, 2.5vw, 3rem)",
                    height: "clamp(1.8rem, 2.5vw, 3rem)",
                    fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
                    backgroundColor:
                      pg === currentPage ? "#19355a" : "transparent",
                    color: pg === currentPage ? "white" : "#374151",
                    border: pg === currentPage ? "none" : "1px solid #d1d5db",
                  }}
                >
                  {pg}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                padding:
                  "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.7rem, 1.2vw, 1.4rem)",
                fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
              }}
            >
              {t("pagination.next")}
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Modals & Drawers                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <FilterDrawer
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={handleApplyFilters}
        isArabic={isArabic}
        t={t}
      />

      <CreateTicketModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refresh}
        isArabic={isArabic}
        t={t}
      />

      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction?.type === "revoke"
            ? t("revokeConfirmTitle")
            : t("reopenConfirmTitle")
        }
        message={
          confirmAction?.type === "revoke"
            ? t("revokeConfirmMessage")
            : t("reopenConfirmMessage")
        }
        onClose={() => {
          if (!actionLoading) {
            setConfirmAction(null);
            setActionError("");
          }
        }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        error={actionError}
        isArabic={isArabic}
        t={t}
      />
    </ResponsiveLayoutProvider>
  );
}
