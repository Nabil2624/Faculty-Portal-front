import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShieldPlus,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X,
  User,
} from "lucide-react";

import useEditUserPermissions from "../hooks/useEditUserPermissions";
import PermissionSearchBar from "../components/widgets/EditUserPermissions/PermissionSearchBar";
import PermissionGroupPanel from "../components/widgets/EditUserPermissions/PermissionGroupPanel";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ messageKey, type, onDismiss }) {
  const { t } = useTranslation("Users");

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
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
        right: "clamp(1rem, 2vw, 2.5rem)",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        padding: "clamp(0.6rem, 1vw, 1.6rem) clamp(0.8rem, 1.5vw, 2rem)",
        fontSize: "clamp(0.7rem, 0.9vw, 0.95rem)",
        fontWeight: 500,
        maxWidth: "clamp(220px, 30vw, 400px)",
      }}
    >
      <Icon
        style={{
          width: "clamp(14px, 1.1vw, 18px)",
          height: "clamp(14px, 1.1vw, 18px)",
          flexShrink: 0,
        }}
      />
      <span>{t(`editPermissions.toasts.${messageKey}`)}</span>
      <button
        onClick={onDismiss}
        className="ml-2 hover:opacity-60 transition"
        style={{ flexShrink: 0 }}
      >
        <X
          style={{
            width: "clamp(12px, 1vw, 14px)",
            height: "clamp(12px, 1vw, 14px)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditUserPermissionsPage() {
  const { t, i18n } = useTranslation("Users");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const userId = searchParams.get("userId");

  // User info passed via navigation state (from UserPermissionsPanel)
  const userState = location.state?.user || null;
  const userName = userState?.name || userState?.username || `#${userId}`;
  const userPermissions = userState?.permissions || [];

  // Management admins cannot grant ticket permissions (assigned automatically by backend)
  const currentUserRole = localStorage.getItem("userRole");
  const hideTickets = currentUserRole === "ManagementAdmin";

  const {
    loadingPerms,
    permsError,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    groupedPermissions,
    grantedIds,
    actionLoading,
    toast,
    dismissToast,
    togglePermission,
    toggleGroup,
    reload,
  } = useEditUserPermissions({ userId, userPermissions, hideTickets });

  const isRtl = i18n.dir() === "rtl";
  const groupEntries = Object.entries(groupedPermissions);

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={i18n.dir()}
        className="min-h-screen"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* Toast */}
        {toast && (
          <Toast
            messageKey={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        )}

        {/* Header bar */}
        <div
          className="sticky top-0 z-30 flex items-center gap-3"
          style={{
            padding: "clamp(0.8rem, 1.1vw, 1.2rem) clamp(1rem, 2vw, 2rem)",
            background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
            borderBottom: "1px solid #e5e7eb",
            direction: i18n.dir(),
          }}
        >
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 rounded-xl transition hover:bg-white/60"
            style={{
              padding:
                "clamp(0.3rem, 0.5vw, 0.55rem) clamp(0.6rem, 0.9vw, 0.9rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
              color: "#4b5563",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            <ArrowLeft
              style={{
                width: "clamp(13px, 1vw, 16px)",
                height: "clamp(13px, 1vw, 16px)",
                transform: isRtl ? "scaleX(-1)" : "none",
              }}
            />
            {t("editPermissions.back")}
          </button>

          {/* Title */}
          <div className="flex-1 flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "clamp(32px, 2.5vw, 40px)",
                height: "clamp(32px, 2.5vw, 40px)",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                flexShrink: 0,
              }}
            >
              <ShieldPlus
                style={{
                  width: "clamp(16px, 1.3vw, 20px)",
                  height: "clamp(16px, 1.3vw, 20px)",
                  color: "#fff",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "clamp(0.8rem, 1.1vw, 1.15rem)",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {t("editPermissions.title")}
              </div>
              <div
                className="flex items-center gap-1"
                style={{
                  fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
                  color: "#6b7280",
                }}
              >
                <User
                  style={{
                    width: "clamp(10px, 0.8vw, 12px)",
                    height: "clamp(10px, 0.8vw, 12px)",
                  }}
                />
                {userName}
              </div>
            </div>
          </div>

          {/* Reload */}
          <button
            onClick={reload}
            disabled={loadingPerms}
            className="flex items-center gap-1.5 rounded-xl transition hover:opacity-80"
            style={{
              padding:
                "clamp(0.3rem, 0.5vw, 0.55rem) clamp(0.6rem, 0.9vw, 0.9rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              cursor: loadingPerms ? "not-allowed" : "pointer",
              opacity: loadingPerms ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            <RefreshCw
              style={{
                width: "clamp(12px, 0.9vw, 15px)",
                height: "clamp(12px, 0.9vw, 15px)",
                animation: loadingPerms ? "spin 1s linear infinite" : "none",
              }}
            />
            {t("editPermissions.refresh")}
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "clamp(1rem, 2vw, 2.5rem) clamp(1rem, 3vw, 3rem)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Search & filter */}
          <PermissionSearchBar
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            hiddenTypes={hideTickets ? ["Tickets"] : []}
          />

          {/* Loading */}
          {loadingPerms && (
            <div
              className="flex items-center justify-center"
              style={{ padding: "clamp(2rem, 5vw, 5rem)" }}
            >
              <Loader2
                style={{
                  width: "clamp(24px, 2vw, 32px)",
                  height: "clamp(24px, 2vw, 32px)",
                  color: "#7c3aed",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          )}

          {/* Error */}
          {!loadingPerms && permsError && (
            <div
              className="flex flex-col items-center gap-3"
              style={{
                padding: "clamp(2rem, 4vw, 4rem)",
                backgroundColor: "#fef2f2",
                borderRadius: "1rem",
                border: "1px solid #fca5a5",
                textAlign: "center",
              }}
            >
              <AlertCircle
                style={{
                  width: "clamp(28px, 2.5vw, 40px)",
                  height: "clamp(28px, 2.5vw, 40px)",
                  color: "#ef4444",
                }}
              />
              <p
                style={{
                  fontSize: "clamp(0.75rem, 0.95vw, 1rem)",
                  color: "#b91c1c",
                  fontWeight: 600,
                }}
              >
                {t("editPermissions.loadError")}
              </p>
              <button
                onClick={reload}
                className="rounded-xl transition hover:opacity-80"
                style={{
                  padding:
                    "clamp(0.4rem, 0.6vw, 0.6rem) clamp(1rem, 1.5vw, 1.5rem)",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
                }}
              >
                {t("editPermissions.retry")}
              </button>
            </div>
          )}

          {/* Permission groups */}
          {!loadingPerms && !permsError && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(0.6rem, 1vw, 1rem)",
              }}
            >
              {groupEntries.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: "clamp(0.7rem, 0.9vw, 0.95rem)",
                    padding: "clamp(2rem, 4vw, 4rem) 0",
                  }}
                >
                  {t("editPermissions.noResults")}
                </p>
              ) : (
                groupEntries.map(([type, perms]) => (
                  <PermissionGroupPanel
                    key={type}
                    type={type}
                    permissions={perms}
                    grantedIds={grantedIds}
                    onToggle={togglePermission}
                    onToggleGroup={toggleGroup}
                    actionLoading={actionLoading}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
