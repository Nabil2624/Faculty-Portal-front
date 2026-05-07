import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  BookOpen,
  Briefcase,
  GraduationCap,
  Plane,
  Trophy,
  FolderKanban,
  FlaskConical,
  TrendingUp,
  PenTool,
  TicketCheck,
} from "lucide-react";
import { USER_SORT_OPTIONS } from "../services/users.service";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useUsers from "../hooks/useUsers";
import UsersTable from "../components/widgets/Users/UsersTable";
import UserPermissionsPanel from "../components/widgets/Users/UserPermissionsPanel";
import EditUserModal from "../components/widgets/Users/EditUserModal";
import UsersSummaryWidgets from "../components/widgets/Users/UsersSummaryWidgets";
import SubModuleSelectorModal, {
  MODULE_SUBMODULES,
} from "../components/widgets/AdminFacultyData/SubModuleSelectorModal";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isSuccess = type === "success";
  const colors = isSuccess
    ? { bg: "#f0fdf4", border: "#86efac", text: "#15803d", Icon: CheckCircle2 }
    : { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c", Icon: AlertCircle };

  const Icon = colors.Icon;

  return (
    <div
      className="fixed z-[60] flex items-center gap-2 rounded-xl border shadow-lg"
      style={{
        top: "clamp(1rem, 2vw, 2.5rem)",
        right: "clamp(4rem, 5vw, 5rem)",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        padding: "clamp(0.6rem, 1vw, 1.6rem) clamp(0.8rem, 1.5vw, 2rem)",
        fontSize: "clamp(0.7rem, 0.95vw, 1.5rem)",
        maxWidth: "clamp(14rem, 28vw, 42rem)",
      }}
    >
      <Icon
        style={{
          width: "clamp(0.9rem, 1.2vw, 1.2rem)",
          height: "clamp(0.9rem, 1.2vw, 1.2rem)",
          flexShrink: 0,
        }}
      />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition"
      >
        <X
          style={{
            width: "clamp(0.75rem, 1vw, 1rem)",
            height: "clamp(0.75rem, 1vw, 1rem)",
          }}
        />
      </button>
    </div>
  );
}

// ─── RoleFilterChip ───────────────────────────────────────────────────────────

function RoleFilterChip({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className="rounded-full font-medium transition"
      style={{
        padding: "clamp(0.25rem, 0.4vw, 0.7rem) clamp(0.7rem, 1vw, 1.6rem)",
        fontSize: "clamp(0.6rem, 0.82vw, 1.3rem)",
        backgroundColor: active ? "#2563eb" : "#f3f4f6",
        color: active ? "#fff" : "#374151",
        border: active ? "1px solid #1d4ed8" : "1px solid #e5e7eb",
      }}
    >
      {label}
    </button>
  );
}

// ─── Permission section metadata ─────────────────────────────────────────────

const SECTION_META = {
  UserAccount: {
    label: "User Account",
    desc: "Name, username and password",
    Icon: Shield,
  },
  FacultyMemberData: {
    label: "Personal Information",
    desc: "Faculty member personal data",
    Icon: BookOpen,
  },
  FacultyMemberContributionsData: {
    label: "Contributions",
    desc: "University and community contributions",
    Icon: Briefcase,
  },
  FacultyMemberExperincesData: {
    label: "Experiences",
    desc: "Teaching and general experience",
    Icon: Briefcase,
  },
  FacultyMemberHigherStudiesData: {
    label: "Higher Studies",
    desc: "Theses and supervision records",
    Icon: GraduationCap,
  },
  FacultyMemberMissionsData: {
    label: "Scientific Missions",
    desc: "Missions, seminars and training",
    Icon: Plane,
  },
  FacultyMemberPrizesData: {
    label: "Prizes & Rewards",
    desc: "Awards and recognitions",
    Icon: Trophy,
  },
  FacultyMemberProjectsAndComiteesData: {
    label: "Projects & Committees",
    desc: "Projects, committees and journals",
    Icon: FolderKanban,
  },
  FacultyMemberResearchesData: {
    label: "Researches",
    desc: "Scientific research and publications",
    Icon: FlaskConical,
  },
  FacultyMemberScientificProgressionData: {
    label: "Scientific Progression",
    desc: "Job grades and admin positions",
    Icon: TrendingUp,
  },
  FacultyMemberWritingsData: {
    label: "Writings",
    desc: "Scientific writings and patents",
    Icon: PenTool,
  },
  Tickets: {
    label: "Tickets",
    desc: "Support tickets and helpdesk",
    Icon: TicketCheck,
  },
};

// ─── EditActionSelectorModal ──────────────────────────────────────────────────

function EditActionSelectorModal({
  targetUser,
  adminPermissions,
  onSelectAction,
  onClose,
}) {
  const { t, i18n } = useTranslation("Users");
  const isArabic = i18n.language === "ar";

  // Group admin permissions by type → determine read / update capability per type
  const typeMap = {};
  (adminPermissions || []).forEach((p) => {
    const parts = p.code?.split(".");
    if (!parts || parts.length < 2) return;
    const type = parts[0];
    const action = parts[1];
    if (!typeMap[type]) typeMap[type] = { canRead: false, canUpdate: false };
    if (action === "Read") typeMap[type].canRead = true;
    if (action === "Update") typeMap[type].canUpdate = true;
  });

  const sections = Object.entries(typeMap)
    .filter(
      ([type, caps]) => type !== "Tickets" && (caps.canRead || caps.canUpdate),
    )
    .map(([type, caps]) => ({ type, ...caps }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        dir={isArabic ? "rtl" : "ltr"}
        style={{
          width: "clamp(340px, 40vw, 800px)",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "clamp(1rem, 1.5vw, 2rem) clamp(1.2rem, 2vw, 2.5rem)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.8rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("editActionSelector.title")}
            </h2>
            <p
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 1.1rem)",
                color: "#6b7280",
                marginTop: "0.2rem",
              }}
            >
              <strong>{targetUser.name}</strong> —{" "}
              {t("editActionSelector.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <X
              style={{
                width: "clamp(16px, 1.3vw, 20px)",
                height: "clamp(16px, 1.3vw, 20px)",
                color: "#6b7280",
              }}
            />
          </button>
        </div>

        {/* Sections grid */}
        <div
          style={{
            overflowY: "auto",
            padding: "clamp(0.8rem, 1.2vw, 1.8rem) clamp(1.2rem, 2vw, 2.5rem)",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(140px, 14vw, 260px), 1fr))",
            gap: "clamp(0.5rem, 0.8vw, 1.2rem)",
          }}
        >
          {sections.length === 0 && (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "clamp(0.75rem, 0.95vw, 1.2rem)",
              }}
            >
              {t("editActionSelector.noPermissions")}
            </p>
          )}
          {sections.map(({ type, canUpdate }) => {
            const meta = SECTION_META[type] || { Icon: Shield };
            const Icon = meta.Icon;
            return (
              <button
                key={type}
                onClick={() => onSelectAction({ type, canUpdate })}
                className="text-start rounded-2xl border transition hover:shadow-md hover:border-blue-300"
                style={{
                  padding: "clamp(0.7rem, 1vw, 1.4rem)",
                  borderColor: "#e5e7eb",
                  backgroundColor: "#fafafa",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-2"
                  style={{
                    width: "clamp(30px, 2.5vw, 48px)",
                    height: "clamp(30px, 2.5vw, 48px)",
                    backgroundColor: canUpdate ? "#eff6ff" : "#f0fdf4",
                  }}
                >
                  <Icon
                    style={{
                      width: "clamp(14px, 1.3vw, 22px)",
                      height: "clamp(14px, 1.3vw, 22px)",
                      color: canUpdate ? "#2563eb" : "#059669",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.7rem, 0.9vw, 1.1rem)",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {t(`sections.${type}.label`, meta.label || type)}
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.58rem, 0.75vw, 0.95rem)",
                    color: "#6b7280",
                    marginTop: "0.15rem",
                  }}
                >
                  {t(`sections.${type}.desc`, meta.desc || "")}
                </div>
                <div
                  style={{
                    marginTop: "0.4rem",
                    fontSize: "clamp(0.55rem, 0.7vw, 0.85rem)",
                    fontWeight: 600,
                    color: canUpdate ? "#2563eb" : "#059669",
                  }}
                >
                  {canUpdate
                    ? t("editActionSelector.viewEdit")
                    : t("editActionSelector.viewOnly")}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 0}
        className="rounded-lg p-1.5 border transition hover:bg-gray-100 disabled:opacity-40"
        style={{ borderColor: "#e5e7eb" }}
      >
        <ChevronRight
          style={{
            width: "clamp(14px, 1.2vw, 20px)",
            height: "clamp(14px, 1.2vw, 20px)",
          }}
        />
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPage(i)}
          className="rounded-lg font-medium transition"
          style={{
            minWidth: "clamp(28px, 2vw, 40px)",
            padding: "clamp(0.25rem, 0.4vw, 0.6rem)",
            fontSize: "clamp(0.65rem, 0.85vw, 1.1rem)",
            backgroundColor: i === page ? "#2563eb" : "#fff",
            color: i === page ? "#fff" : "#374151",
            border: i === page ? "1px solid #1d4ed8" : "1px solid #e5e7eb",
          }}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages - 1}
        className="rounded-lg p-1.5 border transition hover:bg-gray-100 disabled:opacity-40"
        style={{ borderColor: "#e5e7eb" }}
      >
        <ChevronLeft
          style={{
            width: "clamp(14px, 1.2vw, 20px)",
            height: "clamp(14px, 1.2vw, 20px)",
          }}
        />
      </button>
    </div>
  );
}

// ─── UsersPage ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const { t } = useTranslation("Users");
  const navigate = useNavigate();

  // ─── sub-module selector state ────────────────────────────────────────────
  // When admin picks a module that has sub-modules (Experiences, Prizes…)
  // we show a second modal to pick which sub-module before navigating.
  const [subSelectorOpen, setSubSelectorOpen] = React.useState(false);
  const [subSelectorModule, setSubSelectorModule] = React.useState(null);

  const {
    users,
    totalCount,
    roleCounts,
    selectedUser,
    loading,
    saving,
    actionLoading,
    error,
    toast,
    dismissToast,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    selectedUserId,
    setSelectedUserId,
    adminPermissions,
    permSelectorOpen,
    permSelectorTarget,
    openEditFlow,
    closePermSelector,
    editModalOpen,
    editTarget,
    openEditModal,
    closeEditModal,
    saveUser,
    removePermission,
    reload,
  } = useUsers();

  const ROLE_CHIPS = [
    { label: t("roles.all"), value: "" },
    { label: t("roles.FacultyMember"), value: "FacultyMember" },
    { label: t("roles.ManagementAdmin"), value: "ManagementAdmin" },
    { label: t("roles.SupportAdmin"), value: "SupportAdmin" },
  ];

  // Keep a local ref to the target even after the hook clears it
  const [cachedTarget, setCachedTarget] = React.useState(null);

  const handleEditAction = ({ type, canUpdate }) => {
    if (type === "UserAccount" && canUpdate) {
      openEditModal(permSelectorTarget);
    } else if (type === "FacultyMemberData") {
      const target = permSelectorTarget;
      closePermSelector();
      navigate("/admin/faculty-data", {
        state: { user: target, subModule: "personalData" },
      });
    } else if (MODULE_SUBMODULES[type]) {
      // Cache the target before closing the permission selector (which clears it in the hook)
      setCachedTarget(permSelectorTarget);
      setSubSelectorModule(type);
      setSubSelectorOpen(true);
      closePermSelector();
    } else {
      closePermSelector();
    }
  };

  const handleSubModuleSelect = (subModule) => {
    setSubSelectorOpen(false);
    navigate("/admin/faculty-data", {
      state: { user: cachedTarget, subModule },
    });
  };

  return (
    <ResponsiveLayoutProvider>
      {/* Toast */}
      {toast && (
        <Toast
          message={t(`toasts.${toast.message}`, toast.message)}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}

      {/* Sub-module selector modal (Experiences, Prizes…) */}
      {subSelectorOpen && subSelectorModule && (
        <SubModuleSelectorModal
          moduleType={subSelectorModule}
          targetUser={permSelectorTarget}
          onSelect={handleSubModuleSelect}
          onClose={() => setSubSelectorOpen(false)}
        />
      )}

      {/* Permission selector modal */}
      {permSelectorOpen && permSelectorTarget && (
        <EditActionSelectorModal
          targetUser={permSelectorTarget}
          adminPermissions={adminPermissions || []}
          onSelectAction={handleEditAction}
          onClose={closePermSelector}
        />
      )}

      {/* Edit modal (account info) */}
      {editModalOpen && editTarget && (
        <EditUserModal
          user={editTarget}
          saving={saving}
          onSave={saveUser}
          onClose={closeEditModal}
        />
      )}

      <div
        style={{
          padding: "clamp(1rem, 2vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1rem, 1.5vw, 2.5rem)",
          minHeight: "90vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: "clamp(40px, 3.5vw, 96px)",
                height: "clamp(40px, 3.5vw, 96px)",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              }}
            >
              <Users
                style={{
                  width: "clamp(20px, 1.8vw, 52px)",
                  height: "clamp(20px, 1.8vw, 52px)",
                  color: "#fff",
                }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "clamp(1.1rem, 1.8vw, 3rem)",
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.1,
                }}
              >
                {t("title")}
              </h1>
              <p
                style={{
                  fontSize: "clamp(0.65rem, 0.9vw, 1.5rem)",
                  color: "#6b7280",
                  marginTop: "0.15rem",
                }}
              >
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Reload */}
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
            style={{
              padding:
                "clamp(0.4rem, 0.7vw, 1.2rem) clamp(0.8rem, 1.2vw, 2rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              color: "#374151",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <RefreshCw
              style={{
                width: "clamp(12px, 1vw, 24px)",
                height: "clamp(12px, 1vw, 24px)",
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            {t("refresh")}
          </button>
        </div>

        {/* ── Search + Role Filter ── */}
        <div
          className="bg-white rounded-2xl shadow-sm flex flex-wrap items-center gap-3"
          style={{
            padding: "clamp(0.75rem, 1.2vw, 2rem) clamp(0.9rem, 1.5vw, 2.5rem)",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Search */}
          <div
            className="relative flex-1"
            style={{ minWidth: "clamp(160px, 20vw, 480px)" }}
          >
            <Search
              style={{
                position: "absolute",
                left: "0.7rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(13px, 1.1vw, 24px)",
                height: "clamp(13px, 1.1vw, 24px)",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "clamp(2rem, 2.5vw, 3.5rem)",
                paddingRight: search ? "clamp(2rem, 2.5vw, 3.5rem)" : "0.75rem",
                paddingTop: "clamp(0.4rem, 0.6vw, 1.1rem)",
                paddingBottom: "clamp(0.4rem, 0.6vw, 1.1rem)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
                color: "#111827",
                outline: "none",
                backgroundColor: "#f9fafb",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute"
                style={{
                  right: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <X
                  style={{
                    width: "clamp(12px, 1vw, 22px)",
                    height: "clamp(12px, 1vw, 22px)",
                    color: "#9ca3af",
                  }}
                />
              </button>
            )}
          </div>

          {/* Role filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter
              style={{
                width: "clamp(12px, 1vw, 22px)",
                height: "clamp(12px, 1vw, 22px)",
                color: "#9ca3af",
                flexShrink: 0,
              }}
            />
            {ROLE_CHIPS.map((chip) => {
              const isAll = chip.value === "";
              const active = isAll
                ? roleFilter.length === 0
                : roleFilter.includes(chip.value);
              return (
                <RoleFilterChip
                  key={chip.value}
                  label={chip.label}
                  value={chip.value}
                  active={active}
                  onClick={(val) => {
                    if (val === "") {
                      setRoleFilter([]);
                    } else {
                      setRoleFilter((prev) =>
                        prev.includes(val)
                          ? prev.filter((r) => r !== val)
                          : [...prev, val],
                      );
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown
              style={{
                width: "clamp(12px, 1vw, 22px)",
                height: "clamp(12px, 1vw, 22px)",
                color: "#9ca3af",
                flexShrink: 0,
              }}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding:
                  "clamp(0.3rem, 0.5vw, 0.9rem) clamp(0.5rem, 0.8vw, 1.2rem)",
                fontSize: "clamp(0.6rem, 0.82vw, 1.2rem)",
                color: "#374151",
                backgroundColor: "#f9fafb",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {USER_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(`sort.${opt.value || "default"}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Error State ── */}
        {error && (
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
                width: "clamp(16px, 1.3vw, 30px)",
                height: "clamp(16px, 1.3vw, 30px)",
                flexShrink: 0,
              }}
            />
            {t("error")}
            <button
              onClick={reload}
              className="ml-auto underline font-medium hover:opacity-80"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
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

        {/* ── Main Content: Table + Details Panel ── */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedUser
                ? "1fr clamp(280px, 32vw, 680px)"
                : "1fr",
              gap: "clamp(0.8rem, 1.2vw, 2rem)",
              alignItems: "start",
            }}
          >
            {/* Table */}
            <UsersTable
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              onEditUser={openEditFlow}
            />

            {/* Details / Permissions panel */}
            {selectedUser && (
              <div style={{ position: "sticky", top: "1rem" }}>
                <UserPermissionsPanel
                  user={selectedUser}
                  actionLoading={actionLoading}
                  onRemovePermission={removePermission}
                  onClose={() => setSelectedUserId(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        )}
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ResponsiveLayoutProvider>
  );
}
