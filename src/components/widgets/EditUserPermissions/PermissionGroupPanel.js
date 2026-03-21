import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldOff,
  Loader2,
} from "lucide-react";

// ─── Single permission row ────────────────────────────────────────────────────

function PermissionRow({ permission, isGranted, onToggle, disabled }) {
  const { t, i18n } = useTranslation("Users");
  const isRtl = i18n.dir() === "rtl";

  return (
    <div
      className="flex items-start gap-3 rounded-xl transition-all"
      style={{
        padding: "clamp(0.5rem, 0.7vw, 0.75rem) clamp(0.7rem, 1vw, 1rem)",
        backgroundColor: isGranted ? "#f5f3ff" : "#f9fafb",
        border: `1px solid ${isGranted ? "#c4b5fd" : "#e5e7eb"}`,
        direction: i18n.dir(),
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          marginTop: "0.15rem",
          color: isGranted ? "#7c3aed" : "#9ca3af",
        }}
      >
        <ShieldCheck
          style={{
            width: "clamp(13px, 1vw, 16px)",
            height: "clamp(13px, 1vw, 16px)",
          }}
        />
      </div>

      {/* Text */}
      <div
        className="flex-1 min-w-0"
        style={{ textAlign: isRtl ? "right" : "left" }}
      >
        <div
          style={{
            fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
            fontWeight: 600,
            color: isGranted ? "#4c1d95" : "#111827",
          }}
        >
          {permission.displayName || permission.code}
        </div>
        {permission.description && (
          <div
            style={{
              fontSize: "clamp(0.6rem, 0.76vw, 0.78rem)",
              color: "#6b7280",
              marginTop: "0.1rem",
            }}
          >
            {permission.description}
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => onToggle(permission)}
        disabled={disabled}
        title={
          isGranted ? t("editPermissions.revoke") : t("editPermissions.grant")
        }
        className="rounded-lg transition hover:opacity-80 flex-shrink-0"
        style={{
          padding:
            "clamp(0.25rem, 0.4vw, 0.45rem) clamp(0.5rem, 0.8vw, 0.8rem)",
          fontSize: "clamp(0.6rem, 0.76vw, 0.78rem)",
          fontWeight: 600,
          border: isGranted ? "1px solid #fca5a5" : "1px solid #86efac",
          backgroundColor: isGranted ? "#fef2f2" : "#f0fdf4",
          color: isGranted ? "#b91c1c" : "#15803d",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          whiteSpace: "nowrap",
        }}
      >
        {disabled ? (
          <Loader2
            style={{
              width: "clamp(10px, 0.8vw, 12px)",
              height: "clamp(10px, 0.8vw, 12px)",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : isGranted ? (
          <ShieldOff
            style={{
              width: "clamp(10px, 0.8vw, 12px)",
              height: "clamp(10px, 0.8vw, 12px)",
            }}
          />
        ) : (
          <ShieldCheck
            style={{
              width: "clamp(10px, 0.8vw, 12px)",
              height: "clamp(10px, 0.8vw, 12px)",
            }}
          />
        )}
        {isGranted ? t("editPermissions.revoke") : t("editPermissions.grant")}
      </button>
    </div>
  );
}

// ─── Group panel (collapsible) ────────────────────────────────────────────────

export default function PermissionGroupPanel({
  type,
  permissions,
  grantedIds,
  onToggle,
  onToggleGroup,
  actionLoading,
}) {
  const { t, i18n } = useTranslation("Users");
  const isRtl = i18n.dir() === "rtl";
  const [open, setOpen] = useState(true);

  const grantedCount = permissions.filter((p) => grantedIds.has(p.id)).length;
  const allGranted =
    grantedCount === permissions.length && permissions.length > 0;
  const someGranted = grantedCount > 0 && !allGranted;

  const sectionLabel = t(`sections.${type}.label`, type);
  const sectionDesc = t(`sections.${type}.desc`, "");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #e5e7eb" }}
    >
      {/* Group header */}
      <div
        className="flex items-center"
        style={{
          padding: "clamp(0.6rem, 0.9vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.2rem)",
          backgroundColor: allGranted
            ? "#f5f3ff"
            : someGranted
              ? "#faf5ff"
              : "#f9fafb",
          borderBottom: open ? "1px solid #e5e7eb" : "none",
          direction: i18n.dir(),
          gap: "0.5rem",
        }}
      >
        {/* Expand toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center gap-2 text-left transition hover:opacity-80"
          style={{ direction: i18n.dir() }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(26px, 2vw, 32px)",
              height: "clamp(26px, 2vw, 32px)",
              backgroundColor: allGranted
                ? "#7c3aed"
                : someGranted
                  ? "#c4b5fd"
                  : "#e5e7eb",
              flexShrink: 0,
            }}
          >
            <ShieldCheck
              style={{
                width: "clamp(12px, 1vw, 16px)",
                height: "clamp(12px, 1vw, 16px)",
                color: allGranted || someGranted ? "#fff" : "#9ca3af",
              }}
            />
          </div>
          <div style={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
            <div
              style={{
                fontSize: "clamp(0.7rem, 0.9vw, 0.95rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {sectionLabel}
            </div>
            {sectionDesc && (
              <div
                style={{
                  fontSize: "clamp(0.58rem, 0.74vw, 0.76rem)",
                  color: "#6b7280",
                  marginTop: "0.05rem",
                }}
              >
                {sectionDesc}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: "clamp(0.6rem, 0.76vw, 0.78rem)",
              color: allGranted ? "#7c3aed" : "#9ca3af",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {grantedCount}/{permissions.length}
          </div>
          {open ? (
            <ChevronUp
              style={{
                width: "clamp(13px, 1vw, 16px)",
                height: "clamp(13px, 1vw, 16px)",
                color: "#9ca3af",
                flexShrink: 0,
              }}
            />
          ) : (
            <ChevronDown
              style={{
                width: "clamp(13px, 1vw, 16px)",
                height: "clamp(13px, 1vw, 16px)",
                color: "#9ca3af",
                flexShrink: 0,
              }}
            />
          )}
        </button>

        {/* Grant/revoke all in group */}
        <button
          onClick={() => onToggleGroup(permissions)}
          disabled={actionLoading}
          title={
            allGranted
              ? t("editPermissions.revokeAll")
              : t("editPermissions.grantAll")
          }
          className="rounded-lg transition hover:opacity-80 flex-shrink-0"
          style={{
            padding:
              "clamp(0.2rem, 0.35vw, 0.4rem) clamp(0.5rem, 0.7vw, 0.7rem)",
            fontSize: "clamp(0.58rem, 0.74vw, 0.76rem)",
            fontWeight: 600,
            border: allGranted ? "1px solid #fca5a5" : "1px solid #86efac",
            backgroundColor: allGranted ? "#fef2f2" : "#f0fdf4",
            color: allGranted ? "#b91c1c" : "#15803d",
            cursor: actionLoading ? "not-allowed" : "pointer",
            opacity: actionLoading ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {allGranted
            ? t("editPermissions.revokeAll")
            : t("editPermissions.grantAll")}
        </button>
      </div>

      {/* Permission rows */}
      {open && (
        <div
          style={{
            padding:
              "clamp(0.5rem, 0.8vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.2rem)",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            backgroundColor: "#fff",
          }}
        >
          {permissions.map((perm) => (
            <PermissionRow
              key={perm.id}
              permission={perm}
              isGranted={grantedIds.has(perm.id)}
              onToggle={onToggle}
              disabled={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
