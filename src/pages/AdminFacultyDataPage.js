import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useAdminFacultyData from "../hooks/useAdminFacultyData";
import AdminDataTable from "../components/widgets/AdminFacultyData/AdminDataTable";
import AdminDataFormModal from "../components/widgets/AdminFacultyData/AdminDataFormModal";
import DeleteConfirmModal from "../components/widgets/AdminFacultyData/DeleteConfirmModal";
import AdminResearcherProfilePanel from "../components/widgets/AdminFacultyData/AdminResearcherProfilePanel";
import AdminResearchesPanel from "../components/widgets/AdminFacultyData/AdminResearchesPanel";
import AdminThesesPanel from "../components/widgets/AdminFacultyData/AdminThesesPanel";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ messageKey, type, onDismiss }) {
  const { t } = useTranslation("AdminFacultyData");

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = type === "success";
  const colors = isSuccess
    ? { bg: "#f0fdf4", border: "#86efac", text: "#15803d", Icon: CheckCircle2 }
    : { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c", Icon: AlertCircle };

  return (
    <div
      className="fixed z-[70] flex items-center gap-2 rounded-xl border shadow-lg"
      style={{
        top: "clamp(1rem, 2vw, 2.5rem)",
        right: "clamp(1rem, 2vw, 2.5rem)",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        padding: "clamp(0.6rem, 1vw, 1.6rem) clamp(0.8rem, 1.5vw, 2rem)",
        fontSize: "clamp(0.7rem, 0.95vw, 1.5rem)",
        maxWidth: "clamp(14rem, 28vw, 42rem)",
      }}
    >
      <colors.Icon
        style={{
          width: "clamp(0.9rem, 1.2vw, 1.8rem)",
          height: "clamp(0.9rem, 1.2vw, 1.8rem)",
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1 }}>{t(`toasts.${messageKey}`)}</span>
      <button
        onClick={onDismiss}
        style={{
          opacity: 0.6,
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
        }}
      >
        <X
          style={{
            width: "clamp(0.75rem, 1vw, 1.4rem)",
            height: "clamp(0.75rem, 1vw, 1.4rem)",
          }}
        />
      </button>
    </div>
  );
}

// ─── AdminFacultyDataPage ─────────────────────────────────────────────────────

export default function AdminFacultyDataPage() {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  // State is passed via router location from UsersPage
  const { user, subModule, returnTo } = location.state || {};
  const backTo = returnTo || "/admin/users";

  // Redirect back if no context
  useEffect(() => {
    if (!user || !subModule) {
      navigate(backTo, { replace: true });
    }
  }, [user, subModule, navigate, backTo]);

  const {
    items,
    pageIndex,
    pageSize,
    totalCount,
    goToPage,
    loading,
    error,
    reload,
    rewardLookups,
    contributionTypeLookups,
    seminarParticipationTypes,
    committeeTypeLookups,
    committeeDegreeLookups,
    magazineParticipationRoles,
    projectTypeLookups,
    projectRoleLookups,
    academicQualificationLookups,
    dispatchTypeLookups,
    academicGradeLookups,
    jobRankLookups,
    authorRoleLookups,
    // add modal
    addOpen,
    openAdd,
    closeAdd,
    // edit modal
    editOpen,
    editItem,
    openEdit,
    closeEdit,
    // delete
    deleteTarget,
    openDelete,
    closeDelete,
    // actions
    saving,
    deleting,
    save,
    confirmDelete,
    // feedback
    toast,
    acceptRecommended,
    rejectRecommended,
  } = useAdminFacultyData(user?.id, user?.email, subModule);

  if (!user || !subModule) return null;

  // Sub-modules that use dedicated panels instead of the generic table
  const isSpecialPanel = [
    "researcherProfile",
    "researches",
    "recommendedResearches",
    "theses",
  ].includes(subModule);

  // Sub-modules that hide the "Add New" button
  const hideAddButton = [
    "researcherProfile",
    "recommendedResearches",
    "recommendedThesesSupervisings",
  ].includes(subModule);

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <ResponsiveLayoutProvider>
      {/* Toast */}
      {toast && (
        <Toast messageKey={toast.key} type={toast.type} onDismiss={() => {}} />
      )}

      {/* Add modal */}
      {addOpen && (
        <AdminDataFormModal
          subModule={subModule}
          mode="add"
          item={null}
          saving={saving}
          rewardLookups={rewardLookups}
          contributionTypeLookups={contributionTypeLookups}
          seminarParticipationTypes={seminarParticipationTypes}
          committeeTypeLookups={committeeTypeLookups}
          committeeDegreeLookups={committeeDegreeLookups}
          magazineParticipationRoles={magazineParticipationRoles}
          projectTypeLookups={projectTypeLookups}
          projectRoleLookups={projectRoleLookups}
          academicQualificationLookups={academicQualificationLookups}
          dispatchTypeLookups={dispatchTypeLookups}
          academicGradeLookups={academicGradeLookups}
          jobRankLookups={jobRankLookups}
          authorRoleLookups={authorRoleLookups}
          onSave={save}
          onClose={closeAdd}
        />
      )}

      {/* Edit modal */}
      {editOpen && editItem && (
        <AdminDataFormModal
          subModule={subModule}
          mode="edit"
          item={editItem}
          saving={saving}
          rewardLookups={rewardLookups}
          contributionTypeLookups={contributionTypeLookups}
          seminarParticipationTypes={seminarParticipationTypes}
          committeeTypeLookups={committeeTypeLookups}
          committeeDegreeLookups={committeeDegreeLookups}
          magazineParticipationRoles={magazineParticipationRoles}
          projectTypeLookups={projectTypeLookups}
          projectRoleLookups={projectRoleLookups}
          academicQualificationLookups={academicQualificationLookups}
          dispatchTypeLookups={dispatchTypeLookups}
          academicGradeLookups={academicGradeLookups}
          jobRankLookups={jobRankLookups}
          authorRoleLookups={authorRoleLookups}
          onSave={save}
          onClose={closeEdit}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          deleting={deleting}
          onConfirm={confirmDelete}
          onClose={closeDelete}
        />
      )}

      <div
        dir={i18n.dir()}
        style={{
          padding: "clamp(1rem, 2vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1rem, 1.5vw, 2.5rem)",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* ── Page header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center justify-center rounded-xl transition hover:bg-gray-200"
              style={{
                width: "clamp(32px, 2.5vw, 56px)",
                height: "clamp(32px, 2.5vw, 56px)",
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <BackIcon
                style={{
                  width: "clamp(14px, 1.2vw, 22px)",
                  height: "clamp(14px, 1.2vw, 22px)",
                  color: "#374151",
                }}
              />
            </button>
            <div>
              <h1
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 2.6rem)",
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.1,
                }}
              >
                {t(`subModules.${subModule}`)}
              </h1>
              <p
                style={{
                  fontSize: "clamp(0.62rem, 0.85vw, 1.4rem)",
                  color: "#6b7280",
                  marginTop: "0.15rem",
                }}
              >
                {t("pageSubtitle", { name: user.name || user.email })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isSpecialPanel && (
              <button
                onClick={reload}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
                style={{
                  padding:
                    "clamp(0.4rem, 0.7vw, 1.1rem) clamp(0.7rem, 1.1vw, 1.8rem)",
                  fontSize: "clamp(0.62rem, 0.82vw, 1.2rem)",
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                }}
              >
                <RefreshCw
                  style={{
                    width: "clamp(12px, 1vw, 20px)",
                    height: "clamp(12px, 1vw, 20px)",
                    animation: loading ? "spin 1s linear infinite" : "none",
                  }}
                />
                {t("refresh")}
              </button>
            )}

            {!hideAddButton && (
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
                style={{
                  padding:
                    "clamp(0.4rem, 0.7vw, 1.1rem) clamp(0.7rem, 1.1vw, 1.8rem)",
                  fontSize: "clamp(0.62rem, 0.82vw, 1.2rem)",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "#fff",
                  border: "none",
                }}
              >
                <Plus
                  style={{
                    width: "clamp(12px, 1vw, 20px)",
                    height: "clamp(12px, 1vw, 20px)",
                  }}
                />
                {t("addNew")}
              </button>
            )}
          </div>
        </div>

        {/* ── User info card ── */}
        <div
          className="rounded-2xl bg-white shadow-sm flex items-center gap-3 flex-wrap"
          style={{
            padding: "clamp(0.7rem, 1vw, 1.6rem) clamp(0.9rem, 1.4vw, 2.2rem)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "clamp(36px, 3vw, 72px)",
              height: "clamp(36px, 3vw, 72px)",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.8rem, 1.2vw, 2rem)",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {(user.name || user.email || "?")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: "clamp(0.75rem, 1vw, 1.5rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: "clamp(0.6rem, 0.8vw, 1.2rem)",
                color: "#6b7280",
              }}
            >
              {user.email}
            </div>
          </div>
          <div
            className="ms-auto"
            style={{
              fontSize: "clamp(0.6rem, 0.8vw, 1.1rem)",
              color: "#9ca3af",
            }}
          >
            {!isSpecialPanel && t("totalItems", { count: totalCount })}
          </div>
        </div>

        {/* ── Error ── */}
        {!isSpecialPanel && error && (
          <div
            className="flex items-center gap-3 rounded-2xl"
            style={{
              padding: "clamp(0.9rem, 1.4vw, 2.2rem)",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
              fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
            }}
          >
            <AlertCircle
              style={{
                width: "clamp(16px, 1.3vw, 28px)",
                height: "clamp(16px, 1.3vw, 28px)",
                flexShrink: 0,
              }}
            />
            {t("loadError")}
            <button
              onClick={reload}
              className="ms-auto underline font-medium hover:opacity-80"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {!isSpecialPanel && loading && (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl bg-white"
            style={{
              padding: "clamp(2rem, 4vw, 5rem)",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: "clamp(0.75rem, 1vw, 1.5rem)",
            }}
          >
            <Loader2
              style={{
                width: "clamp(18px, 1.5vw, 32px)",
                height: "clamp(18px, 1.5vw, 32px)",
                animation: "spin 1s linear infinite",
              }}
            />
            {t("loading")}
          </div>
        )}

        {/* ── Specialised panels ── */}
        {subModule === "researcherProfile" && (
          <AdminResearcherProfilePanel user={user} />
        )}
        {(subModule === "researches" ||
          subModule === "recommendedResearches") && (
          <AdminResearchesPanel user={user} subModule={subModule} />
        )}
        {subModule === "theses" && <AdminThesesPanel user={user} />}

        {/* ── Generic table ── */}
        {!isSpecialPanel && !loading && !error && (
          <AdminDataTable
            subModule={subModule}
            items={items}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rewardLookups={rewardLookups}
            contributionTypeLookups={contributionTypeLookups}
            seminarParticipationTypes={seminarParticipationTypes}
            committeeTypeLookups={committeeTypeLookups}
            committeeDegreeLookups={committeeDegreeLookups}
            magazineParticipationRoles={magazineParticipationRoles}
            projectTypeLookups={projectTypeLookups}
            projectRoleLookups={projectRoleLookups}
            academicQualificationLookups={academicQualificationLookups}
            dispatchTypeLookups={dispatchTypeLookups}
            academicGradeLookups={academicGradeLookups}
            jobRankLookups={jobRankLookups}
            authorRoleLookups={authorRoleLookups}
            onEdit={openEdit}
            onDelete={openDelete}
            onAccept={
              subModule === "recommendedThesesSupervisings"
                ? acceptRecommended
                : undefined
            }
            onReject={
              subModule === "recommendedThesesSupervisings"
                ? rejectRecommended
                : undefined
            }
            saving={saving}
          />
        )}

        {/* ── Pagination ── */}
        {!isSpecialPanel &&
          !loading &&
          !error &&
          totalCount > pageSize &&
          (() => {
            const totalPages = Math.ceil(totalCount / pageSize);
            const delta = 2;
            const start = Math.max(
              1,
              Math.min(pageIndex - delta, totalPages - delta * 2),
            );
            const end = Math.min(
              totalPages,
              Math.max(pageIndex + delta, delta * 2 + 1),
            );
            const pages = Array.from(
              { length: end - start + 1 },
              (_, i) => start + i,
            );
            const PrevIcon = isAr ? ChevronRight : ChevronLeft;
            const NextIcon = isAr ? ChevronLeft : ChevronRight;
            return (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(pageIndex - 1)}
                  disabled={pageIndex <= 1}
                  className="flex items-center justify-center rounded-xl transition hover:bg-gray-100"
                  style={{
                    padding: "clamp(0.4rem, 0.7vw, 1.1rem)",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    color: pageIndex <= 1 ? "#d1d5db" : "#374151",
                    cursor: pageIndex <= 1 ? "not-allowed" : "pointer",
                    opacity: pageIndex <= 1 ? 0.5 : 1,
                  }}
                >
                  <PrevIcon
                    style={{
                      width: "clamp(14px, 1.2vw, 20px)",
                      height: "clamp(14px, 1.2vw, 20px)",
                    }}
                  />
                </button>
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className="flex items-center justify-center rounded-xl transition"
                    style={{
                      padding:
                        "clamp(0.4rem, 0.7vw, 1.1rem) clamp(0.6rem, 1vw, 1.5rem)",
                      fontSize: "clamp(0.62rem, 0.82vw, 1.2rem)",
                      fontWeight: page === pageIndex ? 700 : 400,
                      minWidth: "clamp(32px, 2.5vw, 48px)",
                      backgroundColor: page === pageIndex ? "#2563eb" : "#fff",
                      color: page === pageIndex ? "#fff" : "#374151",
                      border: `1px solid ${page === pageIndex ? "#2563eb" : "#e5e7eb"}`,
                      cursor: "pointer",
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(pageIndex + 1)}
                  disabled={pageIndex >= totalPages}
                  className="flex items-center justify-center rounded-xl transition hover:bg-gray-100"
                  style={{
                    padding: "clamp(0.4rem, 0.7vw, 1.1rem)",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    color: pageIndex >= totalPages ? "#d1d5db" : "#374151",
                    cursor: pageIndex >= totalPages ? "not-allowed" : "pointer",
                    opacity: pageIndex >= totalPages ? 0.5 : 1,
                  }}
                >
                  <NextIcon
                    style={{
                      width: "clamp(14px, 1.2vw, 20px)",
                      height: "clamp(14px, 1.2vw, 20px)",
                    }}
                  />
                </button>
              </div>
            );
          })()}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ResponsiveLayoutProvider>
  );
}
