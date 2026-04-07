import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserCheck, X, RefreshCw, AlertCircle, Mail } from "lucide-react";
import { TICKET_PRIORITIES } from "../../../services/ticketing.service";

const PRIORITY_COLORS = {
  Low: {
    bg: "#d1fae5",
    text: "#065f46",
    border: "#10b981",
    activeBg: "#065f46",
  },
  Medium: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#3b82f6",
    activeBg: "#1d4ed8",
  },
  High: {
    bg: "#fef3c7",
    text: "#b45309",
    border: "#f59e0b",
    activeBg: "#b45309",
  },
  Critical: {
    bg: "#fee2e2",
    text: "#b91c1c",
    border: "#ef4444",
    activeBg: "#b91c1c",
  },
};

export default function AssignTicketModal({
  open,
  ticket,
  onClose,
  onConfirm, // async ({ priority, assignedToId, assigneeUsername }) => void
  fetchSuitableAdmins,
  isArabic,
}) {
  const { t } = useTranslation("Ticketing");
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("Unspecified");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open || !ticket) return;
    setSelectedAdmin(null);
    setSelectedPriority(
      ticket.priority && ticket.priority !== "Unspecified"
        ? ticket.priority
        : "Low",
    );
    setSubmitError("");
    setLoadError("");
    setAdmins([]);
    setLoadingAdmins(true);
    fetchSuitableAdmins(ticket)
      .then((data) => setAdmins(data || []))
      .catch((err) =>
        setLoadError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            t("actionError"),
        ),
      )
      .finally(() => setLoadingAdmins(false));
  }, [open, ticket]);

  const handleConfirm = async () => {
    if (!selectedAdmin) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onConfirm({
        priority: selectedPriority,
        assignedToId: selectedAdmin.id,
        assigneeUsername: selectedAdmin.userName,
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          t("actionError"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={!submitting ? onClose : undefined}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden pointer-events-auto flex flex-col"
          style={{ maxWidth: "clamp(300px, 42vw, 600px)", maxHeight: "85vh" }}
        >
          {/* Header */}
          <div
            className="bg-[#19355a] flex items-center justify-between shrink-0"
            style={{ padding: "clamp(0.8rem, 1.4vw, 1.4rem)" }}
          >
            <div className="flex items-center gap-2">
              <UserCheck
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
                {t("admin.assignModalTitle")}
              </h3>
            </div>
            <button
              onClick={!submitting ? onClose : undefined}
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

          {/* Ticket info strip */}
          {ticket && (
            <div
              style={{
                padding: "clamp(0.6rem, 1vw, 1rem)",
                backgroundColor: "rgba(25, 53, 90, 0.04)",
                borderBottom: "1px solid rgba(25, 53, 90, 0.12)",
              }}
            >
              <p
                className="font-semibold text-[#19355a] truncate"
                style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
              >
                {ticket.title}
              </p>
              <p
                className="text-gray-400 mt-0.5"
                style={{ fontSize: "clamp(0.6rem, 0.82vw, 0.85rem)" }}
              >
                #{ticket.id}
              </p>
            </div>
          )}

          {/* Body */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ padding: "clamp(0.8rem, 1.5vw, 1.5rem)" }}
          >
            {/* Priority selector */}
            <div style={{ marginBottom: "clamp(0.8rem, 1.4vw, 1.4rem)" }}>
              <p
                className="font-semibold text-[#19355a]"
                style={{
                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                  marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)",
                }}
              >
                {t("filterSections.priority")}
              </p>
              <div className="flex flex-wrap gap-2">
                {TICKET_PRIORITIES.filter((p) => p !== "Unspecified").map(
                  (p) => {
                    const active = selectedPriority === p;
                    const clr = PRIORITY_COLORS[p] || {
                      bg: "#f3f4f6",
                      text: "#374151",
                      border: "#9ca3af",
                      activeBg: "#374151",
                    };
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPriority(p)}
                        className="rounded-full border transition-all"
                        style={{
                          padding:
                            "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.9vw, 1rem)",
                          fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                          backgroundColor: active ? clr.activeBg : clr.bg,
                          color: active ? "white" : clr.text,
                          borderColor: clr.border,
                          fontWeight: active ? 600 : 400,
                          boxShadow: active
                            ? `0 0 0 2px ${clr.border}`
                            : "none",
                        }}
                      >
                        {t(`priorities.${p}`, { defaultValue: p })}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Admin list */}
            {loadingAdmins ? (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
                <RefreshCw
                  className="animate-spin"
                  style={{
                    width: "clamp(1rem, 1.4vw, 1.5rem)",
                    height: "clamp(1rem, 1.4vw, 1.5rem)",
                  }}
                />
                <span style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}>
                  {t("admin.loadingAdmins")}
                </span>
              </div>
            ) : loadError ? (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-4">
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  style={{ width: "1.1rem", height: "1.1rem" }}
                />
                <p
                  className="text-red-600"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
                >
                  {loadError}
                </p>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <UserCheck
                  className="mx-auto mb-3 opacity-30"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <p style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}>
                  {t("admin.noAdmins")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p
                  className="text-gray-500 mb-1"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.9rem)" }}
                >
                  {t("admin.selectAdmin")}
                </p>
                {admins.map((admin) => {
                  const isSelected = selectedAdmin?.id === admin.id;
                  return (
                    <button
                      key={admin.id}
                      onClick={() => setSelectedAdmin(admin)}
                      className="w-full rounded-xl border transition-all text-start"
                      style={{
                        padding: "clamp(0.6rem, 1vw, 1rem)",
                        borderColor: isSelected ? "#19355a" : "#e5e7eb",
                        backgroundColor: isSelected
                          ? "rgba(25, 53, 90, 0.06)"
                          : "white",
                        boxShadow: isSelected
                          ? "0 0 0 2px rgba(25, 53, 90, 0.25)"
                          : "none",
                      }}
                    >
                      <p
                        className="font-semibold text-[#19355a]"
                        style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
                      >
                        {admin.name || admin.userName}
                      </p>
                      {admin.email && (
                        <p
                          className="text-gray-500 flex items-center gap-1 mt-0.5"
                          style={{
                            fontSize: "clamp(0.6rem, 0.82vw, 0.85rem)",
                          }}
                        >
                          <Mail
                            style={{ width: "0.75rem", height: "0.75rem" }}
                          />
                          {admin.email}
                        </p>
                      )}
                      {admin.roles && admin.roles.length > 0 && (
                        <p
                          className="text-gray-400 mt-0.5"
                          style={{ fontSize: "clamp(0.55rem, 0.78vw, 0.8rem)" }}
                        >
                          {admin.roles.join(", ")}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {submitError && (
              <div
                className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200"
                style={{ padding: "clamp(0.5rem, 0.9vw, 0.9rem)" }}
              >
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  style={{ width: "1rem", height: "1rem" }}
                />
                <p
                  className="text-red-600"
                  style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
                >
                  {submitError}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="border-t border-gray-200 flex gap-3 shrink-0"
            style={{ padding: "clamp(0.7rem, 1.2vw, 1.2rem)" }}
          >
            <button
              onClick={!submitting ? onClose : undefined}
              disabled={submitting}
              className="flex-1 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
              style={{
                padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
                fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
              }}
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAdmin || submitting}
              className="flex-1 bg-[#19355a] text-white rounded-lg font-semibold hover:bg-[#19355a]/90 transition disabled:opacity-40 flex items-center justify-center gap-2"
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
              {t("admin.assign")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
