import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useCreateUser from "../hooks/useCreateUser";
import UserInfoFormWidget from "../components/widgets/CreateUser/UserInfoFormWidget";
import RoleSelectorWidget from "../components/widgets/CreateUser/RoleSelectorWidget";
import PermissionsPickerWidget from "../components/widgets/CreateUser/PermissionsPickerWidget";

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
      <span style={{ flex: 1 }}>{t(`createUser.toasts.${messageKey}`)}</span>
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

// ─── SuccessScreen ────────────────────────────────────────────────────────────
function SuccessScreen({ onCreateAnother, onGoToUsers }) {
  const { t } = useTranslation("Users");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(1rem, 1.5vw, 2.5rem)",
        padding: "clamp(2rem, 4vw, 6rem)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "clamp(3.5rem, 5vw, 8rem)",
          height: "clamp(3.5rem, 5vw, 8rem)",
          borderRadius: "50%",
          background: "#d1fae5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircle2
          style={{
            width: "clamp(1.8rem, 2.5vw, 4rem)",
            height: "clamp(1.8rem, 2.5vw, 4rem)",
            color: "#059669",
          }}
        />
      </div>

      <div>
        <h2
          style={{
            fontSize: "clamp(1.1rem, 1.6vw, 2.8rem)",
            fontWeight: 800,
            color: "#064e3b",
            margin: "0 0 clamp(0.3rem, 0.4vw, 0.7rem)",
          }}
        >
          {t("createUser.success.title")}
        </h2>
        <p
          style={{
            fontSize: "clamp(0.75rem, 1vw, 1.6rem)",
            color: "#374151",
          }}
        >
          {t("createUser.success.subtitle")}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "clamp(0.6rem, 0.9vw, 1.5rem)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={onCreateAnother}
          style={{
            padding: "clamp(0.55rem, 0.8vw, 1.3rem) clamp(1rem, 1.5vw, 2.5rem)",
            fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
            borderRadius: "clamp(8px, 0.8vw, 14px)",
            background: "#fff",
            color: "#2563eb",
            border: "2px solid #2563eb",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.18s",
          }}
        >
          {t("createUser.success.createAnother")}
        </button>

        <button
          type="button"
          onClick={onGoToUsers}
          style={{
            padding: "clamp(0.55rem, 0.8vw, 1.3rem) clamp(1rem, 1.5vw, 2.5rem)",
            fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
            borderRadius: "clamp(8px, 0.8vw, 14px)",
            background: "#2563eb",
            color: "#fff",
            border: "2px solid #2563eb",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.18s",
          }}
        >
          {t("createUser.success.goToUsers")}
        </button>
      </div>
    </div>
  );
}

// ─── CreateUserPage ───────────────────────────────────────────────────────────
export default function CreateUserPage() {
  const { t, i18n } = useTranslation("Users");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const {
    form,
    setField,
    formErrors,
    allPermissions,
    permissionsLoading,
    permissionsError,
    retryPermissions,
    selectedPermissionIds,
    togglePermission,
    toggleTypeGroup,
    permSearch,
    setPermSearch,
    permTypeFilter,
    setPermTypeFilter,
    groupedPermissions,
    totalSelected,
    submitting,
    submit,
    reset,
    toast,
    success,
  } = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
          padding: "clamp(1rem, 2vw, 3rem)",
        }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Toast */}
        {toast && (
          <Toast
            messageKey={toast.messageKey}
            type={toast.type}
            onDismiss={() => {}}
          />
        )}

        {/* ─── Page header ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(0.75rem, 1vw, 1.6rem)",
            marginBottom: "clamp(1rem, 1.5vw, 2.5rem)",
          }}
        >
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.3rem, 0.4vw, 0.6rem)",
              padding:
                "clamp(0.4rem, 0.55vw, 0.9rem) clamp(0.7rem, 1vw, 1.6rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
              borderRadius: "clamp(6px, 0.7vw, 12px)",
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              cursor: "pointer",
              fontWeight: 600,
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            <BackIcon
              style={{
                width: "clamp(0.8rem, 1vw, 1.5rem)",
                height: "clamp(0.8rem, 1vw, 1.5rem)",
              }}
            />
            {t("createUser.back")}
          </button>

          {/* Title block */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(0.4rem, 0.6vw, 1rem)",
              }}
            >
              <div
                style={{
                  width: "clamp(1.6rem, 2.2vw, 3.5rem)",
                  height: "clamp(1.6rem, 2.2vw, 3.5rem)",
                  borderRadius: "clamp(6px, 0.7vw, 12px)",
                  background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <UserPlus
                  style={{
                    width: "clamp(0.9rem, 1.2vw, 1.8rem)",
                    height: "clamp(0.9rem, 1.2vw, 1.8rem)",
                    color: "#fff",
                  }}
                />
              </div>
              <h1
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 2.6rem)",
                  fontWeight: 800,
                  color: "#1e3a5f",
                  margin: 0,
                }}
              >
                {t("createUser.title")}
              </h1>
            </div>
            <p
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
                color: "#6b7280",
                margin: "clamp(0.2rem, 0.3vw, 0.5rem) 0 0",
              }}
            >
              {t("createUser.subtitle")}
            </p>
          </div>
        </div>

        {/* ─── Content ─────────────────────────────────────────────────────── */}
        {success ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "clamp(10px, 1vw, 20px)",
            }}
          >
            <SuccessScreen
              onCreateAnother={reset}
              onGoToUsers={() => navigate("/admin/users")}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) minmax(0, clamp(320px, 45vw, 800px))",
                gap: "clamp(0.8rem, 1.2vw, 2rem)",
                alignItems: "start",
              }}
            >
              {/* ─── Left column: user info + role ─────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(0.8rem, 1.2vw, 2rem)",
                }}
              >
                <UserInfoFormWidget
                  form={form}
                  setField={setField}
                  formErrors={formErrors}
                />
                <RoleSelectorWidget
                  selectedRole={form.role}
                  onSelect={(role) => setField("role", role)}
                  error={formErrors.role}
                />
              </div>

              {/* ─── Right column: permissions picker ──────────────────────── */}
              <div
                style={{ position: "sticky", top: "clamp(1rem, 1.5vw, 2rem)" }}
              >
                <PermissionsPickerWidget
                  groupedPermissions={groupedPermissions}
                  allPermissions={allPermissions}
                  selectedPermissionIds={selectedPermissionIds}
                  togglePermission={togglePermission}
                  toggleTypeGroup={toggleTypeGroup}
                  permSearch={permSearch}
                  setPermSearch={setPermSearch}
                  permTypeFilter={permTypeFilter}
                  setPermTypeFilter={setPermTypeFilter}
                  permissionsLoading={permissionsLoading}
                  permissionsError={permissionsError}
                  retryPermissions={retryPermissions}
                  totalSelected={totalSelected}
                  locked={form.role === "Faculty Member"}
                />
              </div>
            </div>

            {/* ─── Actions bar ───────────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "clamp(0.5rem, 0.75vw, 1.2rem)",
                marginTop: "clamp(1rem, 1.5vw, 2.5rem)",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding:
                    "clamp(0.55rem, 0.8vw, 1.3rem) clamp(1.2rem, 1.8vw, 3rem)",
                  fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
                  borderRadius: "clamp(8px, 0.8vw, 14px)",
                  background: "#fff",
                  color: "#374151",
                  border: "1.5px solid #d1d5db",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.18s",
                }}
              >
                {t("editModal.cancel")}
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.35rem, 0.5vw, 0.8rem)",
                  padding:
                    "clamp(0.55rem, 0.8vw, 1.3rem) clamp(1.2rem, 1.8vw, 3rem)",
                  fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
                  borderRadius: "clamp(8px, 0.8vw, 14px)",
                  background: submitting ? "#93c5fd" : "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  transition: "background 0.18s",
                }}
              >
                {submitting && (
                  <Loader2
                    style={{
                      width: "clamp(0.8rem, 1vw, 1.5rem)",
                      height: "clamp(0.8rem, 1vw, 1.5rem)",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                {submitting
                  ? t("createUser.submitting")
                  : t("createUser.submit")}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ResponsiveLayoutProvider>
  );
}
