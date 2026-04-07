import { useTranslation } from "react-i18next";
import { ShieldCheck, Building2, Briefcase } from "lucide-react";
import { CREATE_USER_ROLES } from "../../../hooks/useCreateUser";

const ROLE_CONFIG = {
  FacultyMember: {
    icon: ShieldCheck,
    bg: "#eff6ff",
    activeBg: "#2563eb",
    border: "#bfdbfe",
    activeBorder: "#1d4ed8",
    text: "#1d4ed8",
    activeText: "#fff",
  },
  ManagementAdmin: {
    icon: Building2,
    bg: "#faf5ff",
    activeBg: "#7c3aed",
    border: "#ddd6fe",
    activeBorder: "#6d28d9",
    text: "#6d28d9",
    activeText: "#fff",
  },
  SupportAdmin: {
    icon: Briefcase,
    bg: "#f0fdf4",
    activeBg: "#059669",
    border: "#a7f3d0",
    activeBorder: "#047857",
    text: "#065f46",
    activeText: "#fff",
  },
};

export default function RoleSelectorWidget({ selectedRoles, onToggle, error }) {
  const { t } = useTranslation("Users");

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "clamp(10px, 1vw, 20px)",
        padding: "clamp(1rem, 1.5vw, 2.5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.75rem, 1vw, 1.5rem)",
      }}
    >
      {/* Card title */}
      <div>
        <h2
          style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1.7rem)",
            fontWeight: 700,
            color: "#1e3a5f",
            paddingBottom: "clamp(0.35rem, 0.45vw, 0.7rem)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {t("createUser.role.title")}
        </h2>
        <p
          style={{
            fontSize: "clamp(0.6rem, 0.78vw, 1.1rem)",
            color: "#6b7280",
            marginTop: "clamp(0.3rem, 0.4vw, 0.6rem)",
          }}
        >
          {t("createUser.role.multiHint")}
        </p>
      </div>

      {/* Role cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(clamp(120px, 10vw, 220px), 1fr))",
          gap: "clamp(0.5rem, 0.75vw, 1.2rem)",
        }}
      >
        {CREATE_USER_ROLES.map(({ value, key }) => {
          const cfg = ROLE_CONFIG[key];
          const Icon = cfg.icon;
          const isActive = selectedRoles.includes(value);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "clamp(0.4rem, 0.5vw, 0.8rem)",
                padding:
                  "clamp(0.75rem, 1vw, 1.6rem) clamp(0.5rem, 0.75vw, 1.2rem)",
                borderRadius: "clamp(8px, 0.8vw, 14px)",
                border: `2px solid ${isActive ? cfg.activeBorder : cfg.border}`,
                background: isActive ? cfg.activeBg : cfg.bg,
                cursor: "pointer",
                transition: "all 0.18s",
                outline: "none",
                position: "relative",
              }}
            >
              {/* Checkmark badge */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: "clamp(4px, 0.4vw, 7px)",
                    right: "clamp(4px, 0.4vw, 7px)",
                    width: "clamp(12px, 1vw, 18px)",
                    height: "clamp(12px, 1vw, 18px)",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(8px, 0.7vw, 12px)",
                    color: "#fff",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
              )}
              <Icon
                style={{
                  width: "clamp(1.1rem, 1.6vw, 2.6rem)",
                  height: "clamp(1.1rem, 1.6vw, 2.6rem)",
                  color: isActive ? cfg.activeText : cfg.text,
                }}
              />
              <span
                style={{
                  fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
                  fontWeight: 600,
                  color: isActive ? cfg.activeText : cfg.text,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {t(`createUser.role.${key}`)}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p
          style={{
            fontSize: "clamp(0.6rem, 0.78vw, 1.1rem)",
            color: "#dc2626",
          }}
        >
          {t(`createUser.validation.${error}`)}
        </p>
      )}
    </div>
  );
}
