import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ShieldPlus,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Lock,
} from "lucide-react";

// ─── PermissionBadge ──────────────────────────────────────────────────────────

function PermissionBadge({ permission, removable, onRemove, disabled }) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl"
      style={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        padding: "clamp(0.5rem, 0.8vw, 0.75rem) clamp(0.6rem, 1vw, 0.9rem)",
      }}
    >
      <ShieldCheck
        style={{
          width: "clamp(13px, 1vw, 15px)",
          height: "clamp(13px, 1vw, 15px)",
          color: "#10b981",
          flexShrink: 0,
          marginTop: "0.1rem",
        }}
      />
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {permission.displayName || permission.name || permission.code}
        </div>
        <div
          style={{
            fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
            color: "#6b7280",
            marginTop: "0.1rem",
          }}
        >
          {permission.description}
        </div>
      </div>
    </div>
  );
}

// ─── RolePermissionsSection ───────────────────────────────────────────────────

function RolePermissionsSection({ rolePermissions }) {
  const { t, i18n } = useTranslation("Users");
  const [open, setOpen] = useState(true);
  const isRtl = i18n.dir() === "rtl";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between transition hover:bg-gray-50"
        style={{
          padding: "clamp(0.7rem, 1vw, 1rem) clamp(0.9rem, 1.4vw, 1.3rem)",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <ShieldCheck
            style={{
              width: "clamp(15px, 1.2vw, 18px)",
              height: "clamp(15px, 1.2vw, 18px)",
              color: "#2563eb",
            }}
          />
          <div style={{ textAlign: isRtl ? "right" : "left" }}>
            <div
              style={{
                fontSize: "clamp(0.75rem, 0.95vw, 1rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("permissions.rolePermissions")}
            </div>
            <div
              style={{
                fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
                color: "#6b7280",
              }}
            >
              {t("permissions.rolePermissionsDesc", {
                count: rolePermissions.length,
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#9ca3af",
          }}
        >
          <Lock
            style={{
              width: "clamp(11px, 0.9vw, 13px)",
              height: "clamp(11px, 0.9vw, 13px)",
            }}
          />
          {open ? (
            <ChevronUp
              style={{
                width: "clamp(14px, 1.1vw, 17px)",
                height: "clamp(14px, 1.1vw, 17px)",
              }}
            />
          ) : (
            <ChevronDown
              style={{
                width: "clamp(14px, 1.1vw, 17px)",
                height: "clamp(14px, 1.1vw, 17px)",
              }}
            />
          )}
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: "clamp(0.6rem, 1vw, 1rem) clamp(0.9rem, 1.4vw, 1.3rem)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {rolePermissions.map((perm) => (
            <PermissionBadge
              key={perm.id}
              permission={perm}
              removable={false}
            />
          ))}
          {rolePermissions.length === 0 && (
            <p
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
                color: "#9ca3af",
                textAlign: "center",
                padding: "0.75rem 0",
              }}
            >
              {t("permissions.noRolePermissions")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── IndividualPermissionsSection ─────────────────────────────────────────────

function IndividualPermissionsSection({ user }) {
  const { t, i18n } = useTranslation("Users");
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const isRtl = i18n.dir() === "rtl";
  const permissions = user.permissions || user.extraPermissions || [];

  const userRoles = user.roles?.length
    ? user.roles
    : [user.role?.name].filter(Boolean);
  const isFacultyMemberOnly =
    userRoles.length === 1 && userRoles[0] === "FacultyMember";

  return (
    <div
      className="rounded-2xl"
      style={{ border: "1px solid #e5e7eb", overflow: "visible" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between transition hover:bg-gray-50"
        style={{
          padding: "clamp(0.7rem, 1vw, 1rem) clamp(0.9rem, 1.4vw, 1.3rem)",
          backgroundColor: "#f9fafb",
          borderRadius: open ? "1rem 1rem 0 0" : "1rem",
        }}
      >
        <div
          className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <ShieldPlus
            style={{
              width: "clamp(15px, 1.2vw, 18px)",
              height: "clamp(15px, 1.2vw, 18px)",
              color: "#7c3aed",
            }}
          />
          <div style={{ textAlign: isRtl ? "right" : "left" }}>
            <div
              style={{
                fontSize: "clamp(0.75rem, 0.95vw, 1rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("permissions.individualPermissions")}
            </div>
            <div
              style={{
                fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
                color: "#6b7280",
              }}
            >
              {t("permissions.individualPermissionsDesc", {
                count: permissions.length,
              })}
            </div>
          </div>
        </div>
        {open ? (
          <ChevronUp
            style={{
              width: "clamp(14px, 1.1vw, 17px)",
              height: "clamp(14px, 1.1vw, 17px)",
              color: "#9ca3af",
            }}
          />
        ) : (
          <ChevronDown
            style={{
              width: "clamp(14px, 1.1vw, 17px)",
              height: "clamp(14px, 1.1vw, 17px)",
              color: "#9ca3af",
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            padding: "clamp(0.6rem, 1vw, 1rem) clamp(0.9rem, 1.4vw, 1.3rem)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {permissions.length === 0 && (
            <p
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
                color: "#9ca3af",
                textAlign: "center",
                padding: "0.5rem 0",
              }}
            >
              {t("permissions.noIndividualPermissions")}
            </p>
          )}

          {permissions.map((perm) => (
            <PermissionBadge
              key={perm.id}
              permission={perm}
              removable={false}
              onRemove={null}
              disabled={false}
            />
          ))}

          {/* Edit individual permissions — navigates to dedicated page */}
          <button
            disabled={isFacultyMemberOnly}
            onClick={() =>
              !isFacultyMemberOnly &&
              navigate(`/admin/edit-user-permissions?userId=${user.id}`, {
                state: { user },
              })
            }
            className="flex items-center justify-center gap-1.5 rounded-xl font-medium transition"
            style={{
              marginTop: "0.25rem",
              padding: "clamp(0.4rem, 0.6vw, 0.6rem)",
              border: isFacultyMemberOnly
                ? "1px dashed #d1d5db"
                : "1px dashed #c4b5fd",
              backgroundColor: isFacultyMemberOnly ? "#f9fafb" : "#faf5ff",
              color: isFacultyMemberOnly ? "#9ca3af" : "#7c3aed",
              fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
              width: "100%",
              cursor: isFacultyMemberOnly ? "not-allowed" : "pointer",
              opacity: isFacultyMemberOnly ? 0.6 : 1,
            }}
          >
            <Plus
              style={{
                width: "clamp(12px, 1vw, 14px)",
                height: "clamp(12px, 1vw, 14px)",
              }}
            />
            {t("permissions.addPermission")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── UserPermissionsPanel ─────────────────────────────────────────────────────

export default function UserPermissionsPanel({
  user,
  actionLoading,
  onRemovePermission,
  onClose,
}) {
  const { i18n, t } = useTranslation("Users");
  if (!user) return null;

  const roleLabel = user.roles?.length
    ? user.roles.map((r) => t(`roleBadge.${r}`, r)).join(", ")
    : t(`roleBadge.${user.role?.name}`, user.role?.name || "");

  return (
    <div
      dir={i18n.dir()}
      className="rounded-2xl shadow-lg flex flex-col"
      style={{
        border: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        overflow: "visible",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "clamp(0.8rem, 1.2vw, 1.2rem) clamp(0.9rem, 1.4vw, 1.3rem)",
          background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "clamp(32px, 2.5vw, 42px)",
              height: "clamp(32px, 2.5vw, 42px)",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
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
                fontSize: "clamp(0.8rem, 1vw, 1.05rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
                color: "#6b7280",
              }}
            >
              {roleLabel} · @{user.username}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-white/60 transition"
        >
          <X
            style={{
              width: "clamp(14px, 1.1vw, 17px)",
              height: "clamp(14px, 1.1vw, 17px)",
              color: "#6b7280",
            }}
          />
        </button>
      </div>

      {/* Permissions sections */}
      <div
        style={{
          padding: "clamp(0.8rem, 1.2vw, 1.2rem) clamp(0.9rem, 1.4vw, 1.3rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 1.1vw, 1rem)",
          overflow: "visible",
          flex: 1,
        }}
      >
        <RolePermissionsSection rolePermissions={user.rolePermissions || []} />
        <IndividualPermissionsSection user={user} />
      </div>
    </div>
  );
}
