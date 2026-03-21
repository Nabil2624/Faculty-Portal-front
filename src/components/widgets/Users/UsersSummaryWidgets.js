import { Users, ShieldCheck, Briefcase, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// ─── UsersSummaryWidgets ──────────────────────────────────────────────────────
// Receives pre-computed counts from the parent (hook).

const WIDGET_CONFIG = [
  {
    key: "total",
    icon: Users,
    bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    iconBg: "#2563eb",
    text: "#1d4ed8",
    border: "#bfdbfe",
  },
  {
    key: "FacultyMember",
    icon: ShieldCheck,
    bg: "linear-gradient(135deg, #eff6ff, #e0e7ff)",
    iconBg: "#4f46e5",
    text: "#4338ca",
    border: "#c7d2fe",
  },
  {
    key: "ManagementAdmin",
    icon: Building2,
    bg: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
    iconBg: "#7c3aed",
    text: "#6d28d9",
    border: "#ddd6fe",
  },
  {
    key: "SupportAdmin",
    icon: Briefcase,
    bg: "linear-gradient(135deg, #f0fdf4, #d1fae5)",
    iconBg: "#059669",
    text: "#065f46",
    border: "#a7f3d0",
  },
];

export default function UsersSummaryWidgets({ counts = {} }) {
  const { t } = useTranslation("Users");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(clamp(140px, 15vw, 380px), 1fr))",
        gap: "clamp(0.6rem, 1vw, 2rem)",
      }}
    >
      {WIDGET_CONFIG.map(({ key, icon: Icon, bg, iconBg, text, border }) => (
        <div
          key={key}
          className="rounded-2xl flex items-center gap-3"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            padding:
              "clamp(0.8rem, 1.2vw, 2.2rem) clamp(0.9rem, 1.5vw, 2.5rem)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: "clamp(36px, 3vw, 80px)",
              height: "clamp(36px, 3vw, 80px)",
              backgroundColor: iconBg,
            }}
          >
            <Icon
              style={{
                width: "clamp(18px, 1.5vw, 42px)",
                height: "clamp(18px, 1.5vw, 42px)",
                color: "#fff",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: "clamp(1.1rem, 1.8vw, 3rem)",
                fontWeight: 800,
                color: text,
                lineHeight: 1.1,
              }}
            >
              {counts[key] ?? 0}
            </div>
            <div
              style={{
                fontSize: "clamp(0.6rem, 0.8vw, 1.3rem)",
                color: text,
                opacity: 0.75,
                marginTop: "0.1rem",
              }}
            >
              {t(`stats.${key}`)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
