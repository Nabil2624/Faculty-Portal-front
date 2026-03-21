import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
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
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Lock,
  X,
  CheckSquare,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { PERMISSION_TYPES } from "../../../services/users.service";

// ─── Icon & colour mapping per permission type ────────────────────────────────
const TYPE_META = {
  UserAccount: {
    Icon: Shield,
    color: "#2563eb",
    gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
  },
  FacultyMemberData: {
    Icon: BookOpen,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#7c3aed,#c084fc)",
  },
  FacultyMemberContributionsData: {
    Icon: Briefcase,
    color: "#0891b2",
    gradient: "linear-gradient(135deg,#0891b2,#38bdf8)",
  },
  FacultyMemberExperincesData: {
    Icon: Briefcase,
    color: "#0369a1",
    gradient: "linear-gradient(135deg,#0369a1,#38bdf8)",
  },
  FacultyMemberHigherStudiesData: {
    Icon: GraduationCap,
    color: "#4f46e5",
    gradient: "linear-gradient(135deg,#4f46e5,#818cf8)",
  },
  FacultyMemberMissionsData: {
    Icon: Plane,
    color: "#0284c7",
    gradient: "linear-gradient(135deg,#0284c7,#7dd3fc)",
  },
  FacultyMemberPrizesData: {
    Icon: Trophy,
    color: "#b45309",
    gradient: "linear-gradient(135deg,#b45309,#fbbf24)",
  },
  FacultyMemberProjectsAndComiteesData: {
    Icon: FolderKanban,
    color: "#059669",
    gradient: "linear-gradient(135deg,#059669,#34d399)",
  },
  FacultyMemberResearchesData: {
    Icon: FlaskConical,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
  },
  FacultyMemberScientificProgressionData: {
    Icon: TrendingUp,
    color: "#1d4ed8",
    gradient: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
  },
  FacultyMemberWritingsData: {
    Icon: PenTool,
    color: "#dc2626",
    gradient: "linear-gradient(135deg,#dc2626,#f87171)",
  },
  Tickets: {
    Icon: TicketCheck,
    color: "#d97706",
    gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
  },
};

// ─── TypeGroupAccordion ───────────────────────────────────────────────────────
function TypeGroupAccordion({
  type,
  perms,
  selectedIds,
  onToggle,
  onToggleAll,
}) {
  const { t } = useTranslation("Users");
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const meta = TYPE_META[type] || {
    Icon: Shield,
    color: "#6b7280",
    gradient: "linear-gradient(135deg,#6b7280,#9ca3af)",
  };
  const { Icon, color, gradient } = meta;

  const SelectedCount = perms.filter((p) => selectedIds.has(p.id)).length;
  const allSelected = perms.length > 0 && SelectedCount === perms.length;
  const someSelected = SelectedCount > 0 && !allSelected;
  const pct =
    perms.length > 0 ? Math.round((SelectedCount / perms.length) * 100) : 0;

  return (
    <div
      style={{
        border: `1.5px solid ${open || SelectedCount > 0 ? color + "55" : "#e5e7eb"}`,
        borderRadius: "clamp(10px, 1vw, 16px)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: open ? `0 4px 20px ${color}18` : "0 1px 4px #0000000a",
      }}
    >
      {/* Colored top accent bar */}
      <div
        style={{
          height: "3px",
          background: SelectedCount > 0 ? gradient : "#e5e7eb",
          transition: "background 0.3s",
        }}
      />

      {/* Group header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 0.6vw, 1rem)",
          padding: "clamp(0.6rem, 0.85vw, 1.3rem) clamp(0.75rem, 1vw, 1.6rem)",
          background: open ? `${color}08` : "#f9fafb",
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.18s",
        }}
        onClick={() => setOpen((p) => !p)}
      >
        {/* Select-all checkbox */}
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={(e) => {
            e.stopPropagation();
            onToggleAll(perms);
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "clamp(13px, 1vw, 17px)",
            height: "clamp(13px, 1vw, 17px)",
            cursor: "pointer",
            flexShrink: 0,
            accentColor: color,
          }}
        />

        {/* Gradient icon pill */}
        <div
          style={{
            width: "clamp(1.6rem, 2vw, 2.8rem)",
            height: "clamp(1.6rem, 2vw, 2.8rem)",
            borderRadius: "clamp(6px, 0.6vw, 10px)",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 2px 8px ${color}44`,
          }}
        >
          <Icon
            style={{
              width: "clamp(0.75rem, 0.95vw, 1.4rem)",
              height: "clamp(0.75rem, 0.95vw, 1.4rem)",
              color: "#fff",
            }}
          />
        </div>

        {/* Type label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: "clamp(0.72rem, 0.92vw, 1.35rem)",
              fontWeight: 700,
              color: "#1f2937",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t(`sections.${type}.label`, type)}
          </span>
          {/* Mini progress bar */}
          <div
            style={{
              marginTop: "clamp(2px, 0.2vw, 4px)",
              height: "3px",
              borderRadius: "999px",
              background: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: gradient,
                borderRadius: "999px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Count badge */}
        {SelectedCount > 0 ? (
          <span
            style={{
              fontSize: "clamp(0.58rem, 0.75vw, 1.05rem)",
              fontWeight: 700,
              background: gradient,
              color: "#fff",
              borderRadius: "999px",
              padding: "0.15em clamp(0.45rem, 0.55vw, 0.85rem)",
              flexShrink: 0,
              boxShadow: `0 1px 6px ${color}44`,
            }}
          >
            {SelectedCount}/{perms.length}
          </span>
        ) : (
          <span
            style={{
              fontSize: "clamp(0.58rem, 0.75vw, 1.05rem)",
              fontWeight: 500,
              color: "#9ca3af",
              flexShrink: 0,
            }}
          >
            {perms.length}
          </span>
        )}

        {/* Collapse chevron */}
        <div
          style={{
            width: "clamp(1.3rem, 1.6vw, 2.2rem)",
            height: "clamp(1.3rem, 1.6vw, 2.2rem)",
            borderRadius: "50%",
            background: open ? `${color}18` : "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.18s",
          }}
        >
          {open ? (
            <ChevronUp
              style={{
                width: "clamp(0.75rem, 0.9vw, 1.3rem)",
                height: "clamp(0.75rem, 0.9vw, 1.3rem)",
                color,
              }}
            />
          ) : (
            <ChevronDown
              style={{
                width: "clamp(0.75rem, 0.9vw, 1.3rem)",
                height: "clamp(0.75rem, 0.9vw, 1.3rem)",
                color: "#6b7280",
              }}
            />
          )}
        </div>
      </div>

      {/* Permission rows */}
      {open && (
        <div style={{ borderTop: `1px solid ${color}22` }}>
          {perms.map((perm) => {
            const checked = selectedIds.has(perm.id);
            const isHov = hovered === perm.id;
            return (
              <div
                key={perm.id}
                onClick={() => onToggle(perm.id)}
                onMouseEnter={() => setHovered(perm.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.6rem, 0.75vw, 1.2rem)",
                  padding:
                    "clamp(0.5rem, 0.7vw, 1.1rem) clamp(0.75rem, 1vw, 1.6rem)",
                  cursor: "pointer",
                  background: checked
                    ? `${color}12`
                    : isHov
                      ? "#f8faff"
                      : "#fff",
                  borderBottom: "1px solid #f3f4f6",
                  transition: "background 0.12s",
                  position: "relative",
                }}
              >
                {/* Checked left accent */}
                {checked && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background: gradient,
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                )}

                {/* Custom-styled checkbox */}
                <div
                  style={{
                    width: "clamp(14px, 1.05vw, 18px)",
                    height: "clamp(14px, 1.05vw, 18px)",
                    borderRadius: "clamp(3px, 0.3vw, 5px)",
                    border: checked ? "none" : "2px solid #d1d5db",
                    background: checked ? gradient : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    boxShadow: checked ? `0 1px 4px ${color}44` : "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(perm.id);
                  }}
                >
                  {checked && (
                    <svg
                      viewBox="0 0 10 8"
                      style={{ width: "60%", height: "60%" }}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1,4 4,7 9,1" />
                    </svg>
                  )}
                </div>

                {/* Text content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(0.68rem, 0.86vw, 1.3rem)",
                      fontWeight: checked ? 700 : 500,
                      color: checked ? color : "#374151",
                      transition: "color 0.15s, font-weight 0.15s",
                    }}
                  >
                    {perm.displayName || perm.code}
                  </p>
                  {perm.description && (
                    <p
                      style={{
                        margin: "clamp(1px, 0.1vw, 3px) 0 0",
                        fontSize: "clamp(0.6rem, 0.76vw, 1.1rem)",
                        color: "#9ca3af",
                      }}
                    >
                      {perm.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PermissionsPickerWidget ──────────────────────────────────────────────────
export default function PermissionsPickerWidget({
  groupedPermissions,
  allPermissions,
  selectedPermissionIds,
  togglePermission,
  toggleTypeGroup,
  permSearch,
  setPermSearch,
  permTypeFilter,
  setPermTypeFilter,
  permissionsLoading,
  permissionsError,
  retryPermissions,
  totalSelected,
  locked,
}) {
  const { t, i18n } = useTranslation("Users");
  const isArabic = i18n.language === "ar";

  const typeKeys = Object.keys(groupedPermissions);
  const totalPerms = allPermissions?.length || 0;
  const pct =
    totalPerms > 0 ? Math.round((totalSelected / totalPerms) * 100) : 0;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "clamp(12px, 1.2vw, 22px)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 24px #00000010",
      }}
    >
      {/* ── Gradient card header ──────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          padding: "clamp(0.85rem, 1.2vw, 2rem) clamp(1rem, 1.5vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.6rem, 0.8vw, 1.2rem)",
          flexWrap: "wrap",
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            width: "clamp(1.8rem, 2.4vw, 3.6rem)",
            height: "clamp(1.8rem, 2.4vw, 3.6rem)",
            borderRadius: "clamp(8px, 0.8vw, 14px)",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal
            style={{
              width: "clamp(1rem, 1.3vw, 2rem)",
              height: "clamp(1rem, 1.3vw, 2rem)",
              color: "#fff",
            }}
          />
        </div>

        {/* Title + subtitle */}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(0.88rem, 1.15vw, 1.8rem)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {t("createUser.permissions.title")}
          </h2>
          {!locked && (
            <p
              style={{
                margin: "clamp(1px, 0.1vw, 3px) 0 0",
                fontSize: "clamp(0.6rem, 0.78vw, 1.15rem)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {totalSelected > 0
                ? t("createUser.permissions.selected", { count: totalSelected })
                : t(
                    "createUser.permissions.noSelected",
                    "Select permissions below",
                  )}
            </p>
          )}
        </div>

        {/* Circular-ish progress badge */}
        {!locked && totalPerms > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(2px, 0.2vw, 4px)",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "clamp(8px, 0.8vw, 14px)",
              padding:
                "clamp(0.35rem, 0.5vw, 0.8rem) clamp(0.6rem, 0.8vw, 1.2rem)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.9rem, 1.2vw, 1.9rem)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {pct}%
            </span>
            <span
              style={{
                fontSize: "clamp(0.54rem, 0.68vw, 1rem)",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
              }}
            >
              {totalSelected}/{totalPerms}
            </span>
          </div>
        )}
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      {!locked && (
        <div style={{ height: "4px", background: "#e5e7eb" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "clamp(0.85rem, 1.2vw, 2rem) clamp(1rem, 1.5vw, 2.5rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 1vw, 1.5rem)",
        }}
      >
        {/* ── Locked notice ──────────────────────────────────────────────── */}
        {locked ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.85rem, 1.1vw, 1.8rem)",
              padding: "clamp(2.5rem, 4vw, 6rem) clamp(1rem, 1.5vw, 2rem)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "clamp(4rem, 5.5vw, 8.5rem)",
                height: "clamp(4rem, 5.5vw, 8.5rem)",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px #00000014",
              }}
            >
              <Lock
                style={{
                  width: "clamp(1.6rem, 2.2vw, 3.4rem)",
                  height: "clamp(1.6rem, 2.2vw, 3.4rem)",
                  color: "#64748b",
                }}
              />
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 clamp(0.3rem, 0.4vw, 0.6rem)",
                  fontSize: "clamp(0.85rem, 1.1vw, 1.7rem)",
                  fontWeight: 800,
                  color: "#1e3a5f",
                }}
              >
                {t(
                  "createUser.permissions.lockedTitle",
                  "Permissions Not Applicable",
                )}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(0.66rem, 0.85vw, 1.3rem)",
                  color: "#6b7280",
                  maxWidth: "clamp(16rem, 24vw, 38rem)",
                  lineHeight: 1.6,
                }}
              >
                {t(
                  "createUser.permissions.lockedDescription",
                  "Faculty Members receive permissions automatically based on their role. Individual permission assignment is not available.",
                )}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Search bar ─────────────────────────────────────────────── */}
            <div style={{ position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  [isArabic ? "right" : "left"]:
                    "clamp(0.65rem, 0.85vw, 1.3rem)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  width: "clamp(0.8rem, 1vw, 1.55rem)",
                  height: "clamp(0.8rem, 1vw, 1.55rem)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                placeholder={t("createUser.permissions.search")}
                style={{
                  width: "100%",
                  padding: `clamp(0.5rem, 0.7vw, 1.1rem) clamp(0.65rem, 0.9vw, 1.4rem)`,
                  [isArabic ? "paddingRight" : "paddingLeft"]:
                    "clamp(2.2rem, 2.8vw, 3.8rem)",
                  [isArabic ? "paddingLeft" : "paddingRight"]: permSearch
                    ? "clamp(2.2rem, 2.8vw, 3.8rem)"
                    : undefined,
                  fontSize: "clamp(0.68rem, 0.88vw, 1.35rem)",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "clamp(8px, 0.8vw, 14px)",
                  outline: "none",
                  background: "#f8faff",
                  color: "#111827",
                  boxSizing: "border-box",
                  transition: "border-color 0.18s, box-shadow 0.18s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.boxShadow = "0 0 0 3px #2563eb22";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
                dir={isArabic ? "rtl" : "ltr"}
              />
              {permSearch && (
                <button
                  type="button"
                  onClick={() => setPermSearch("")}
                  style={{
                    position: "absolute",
                    [isArabic ? "left" : "right"]:
                      "clamp(0.65rem, 0.85vw, 1.3rem)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#e5e7eb",
                    border: "none",
                    borderRadius: "50%",
                    width: "clamp(1rem, 1.3vw, 1.8rem)",
                    height: "clamp(1rem, 1.3vw, 1.8rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <X
                    style={{ width: "60%", height: "60%", color: "#6b7280" }}
                  />
                </button>
              )}
            </div>

            {/* ── Type filter chips ──────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                gap: "clamp(0.3rem, 0.45vw, 0.7rem)",
                flexWrap: "wrap",
              }}
            >
              {/* All chip */}
              <button
                type="button"
                onClick={() => setPermTypeFilter("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.2rem, 0.3vw, 0.45rem)",
                  padding:
                    "clamp(0.22rem, 0.35vw, 0.55rem) clamp(0.6rem, 0.85vw, 1.3rem)",
                  fontSize: "clamp(0.6rem, 0.77vw, 1.15rem)",
                  borderRadius: "999px",
                  border: `1.5px solid ${!permTypeFilter ? "#1d4ed8" : "#e5e7eb"}`,
                  background: !permTypeFilter
                    ? "linear-gradient(135deg,#1e3a5f,#2563eb)"
                    : "#f3f4f6",
                  color: !permTypeFilter ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontWeight: 700,
                  transition: "all 0.15s",
                }}
              >
                <ShieldCheck
                  style={{
                    width: "clamp(0.7rem, 0.85vw, 1.2rem)",
                    height: "clamp(0.7rem, 0.85vw, 1.2rem)",
                  }}
                />
                {t("createUser.permissions.allTypes")}
              </button>

              {PERMISSION_TYPES.filter((type) => type !== "Tickets").map(
                (type) => {
                  const active = permTypeFilter === type;
                  const meta = TYPE_META[type];
                  const color = meta?.color || "#6b7280";
                  const gradient =
                    meta?.gradient ||
                    `linear-gradient(135deg,${color},${color})`;
                  const Icon = meta?.Icon || Shield;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPermTypeFilter(active ? "" : type)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.2rem, 0.3vw, 0.45rem)",
                        padding:
                          "clamp(0.22rem, 0.35vw, 0.55rem) clamp(0.6rem, 0.85vw, 1.3rem)",
                        fontSize: "clamp(0.58rem, 0.74vw, 1.1rem)",
                        borderRadius: "999px",
                        border: `1.5px solid ${active ? color : "#e5e7eb"}`,
                        background: active ? gradient : "#f3f4f6",
                        color: active ? "#fff" : "#374151",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.15s",
                        boxShadow: active ? `0 2px 8px ${color}44` : "none",
                      }}
                    >
                      <Icon
                        style={{
                          width: "clamp(0.65rem, 0.8vw, 1.15rem)",
                          height: "clamp(0.65rem, 0.8vw, 1.15rem)",
                        }}
                      />
                      {t(`sections.${type}.label`, type)}
                    </button>
                  );
                },
              )}
            </div>

            {/* ── Accordion list ─────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(0.45rem, 0.6vw, 0.95rem)",
              }}
            >
              {permissionsLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(0.5rem, 0.7vw, 1.1rem)",
                    padding: "clamp(2.5rem, 4vw, 6rem)",
                    color: "#6b7280",
                    fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
                  }}
                >
                  <Loader2
                    style={{
                      width: "clamp(1.5rem, 2vw, 3rem)",
                      height: "clamp(1.5rem, 2vw, 3rem)",
                      color: "#2563eb",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  {t("loading")}
                </div>
              ) : permissionsError ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "clamp(2rem, 3vw, 5rem)",
                    background: "#fef2f2",
                    border: "1.5px solid #fecaca",
                    borderRadius: "clamp(10px, 1vw, 16px)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
                      color: "#b91c1c",
                      marginBottom: "clamp(0.6rem, 0.85vw, 1.4rem)",
                      fontWeight: 600,
                    }}
                  >
                    {permissionsError}
                  </p>
                  <button
                    type="button"
                    onClick={retryPermissions}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "clamp(0.3rem, 0.4vw, 0.6rem)",
                      padding:
                        "clamp(0.45rem, 0.6vw, 0.95rem) clamp(0.9rem, 1.2vw, 1.9rem)",
                      fontSize: "clamp(0.65rem, 0.85vw, 1.3rem)",
                      background: "linear-gradient(135deg,#dc2626,#ef4444)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "clamp(7px, 0.7vw, 12px)",
                      cursor: "pointer",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px #dc262644",
                    }}
                  >
                    <RefreshCw
                      style={{
                        width: "clamp(0.75rem, 1vw, 1.5rem)",
                        height: "clamp(0.75rem, 1vw, 1.5rem)",
                      }}
                    />
                    {t("retry")}
                  </button>
                </div>
              ) : typeKeys.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "clamp(2rem, 3.5vw, 5.5rem)",
                    background: "#f9fafb",
                    borderRadius: "clamp(10px, 1vw, 16px)",
                    border: "1.5px dashed #d1d5db",
                  }}
                >
                  <Search
                    style={{
                      width: "clamp(1.5rem, 2vw, 3rem)",
                      height: "clamp(1.5rem, 2vw, 3rem)",
                      color: "#d1d5db",
                      margin: "0 auto clamp(0.5rem, 0.7vw, 1rem)",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {t("createUser.permissions.noPermissions")}
                  </p>
                </div>
              ) : (
                typeKeys.map((type) => (
                  <TypeGroupAccordion
                    key={type}
                    type={type}
                    perms={groupedPermissions[type]}
                    selectedIds={selectedPermissionIds}
                    onToggle={togglePermission}
                    onToggleAll={toggleTypeGroup}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
