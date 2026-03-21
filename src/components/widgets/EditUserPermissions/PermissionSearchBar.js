import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PERMISSION_TYPES } from "../../../services/users.service";

export default function PermissionSearchBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  hiddenTypes = [],
}) {
  const { t, i18n } = useTranslation("Users");
  const isRtl = i18n.dir() === "rtl";

  return (
    <div
      className="flex flex-col gap-3"
      style={{ marginBottom: "clamp(0.6rem, 1vw, 1rem)" }}
    >
      {/* Search input */}
      <div className="relative flex items-center">
        <Search
          style={{
            position: "absolute",
            [isRtl ? "right" : "left"]: "clamp(0.6rem, 0.8vw, 0.9rem)",
            width: "clamp(13px, 1vw, 16px)",
            height: "clamp(13px, 1vw, 16px)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("editPermissions.search")}
          dir={i18n.dir()}
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            backgroundColor: "#f9fafb",
            fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
            color: "#111827",
            outline: "none",
            paddingTop: "clamp(0.45rem, 0.7vw, 0.7rem)",
            paddingBottom: "clamp(0.45rem, 0.7vw, 0.7rem)",
            paddingInlineStart: "clamp(2rem, 2.4vw, 2.6rem)",
            paddingInlineEnd: search
              ? "clamp(2rem, 2.4vw, 2.6rem)"
              : "clamp(0.6rem, 0.8vw, 0.9rem)",
          }}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{
              position: "absolute",
              [isRtl ? "left" : "right"]: "clamp(0.6rem, 0.8vw, 0.9rem)",
            }}
          >
            <X
              style={{
                width: "clamp(12px, 0.9vw, 14px)",
                height: "clamp(12px, 0.9vw, 14px)",
                color: "#9ca3af",
              }}
            />
          </button>
        )}
      </div>

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-1.5" style={{ direction: i18n.dir() }}>
        <TypeChip
          label={t("editPermissions.allTypes")}
          active={!typeFilter}
          onClick={() => onTypeChange("")}
        />
        {PERMISSION_TYPES.filter((tp) => !hiddenTypes.includes(tp)).map(
          (type) => (
            <TypeChip
              key={type}
              label={t(`sections.${type}.label`, type)}
              active={typeFilter === type}
              onClick={() => onTypeChange(typeFilter === type ? "" : type)}
            />
          ),
        )}
      </div>
    </div>
  );
}

function TypeChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: "clamp(0.6rem, 0.78vw, 0.8rem)",
        fontWeight: active ? 600 : 400,
        padding:
          "clamp(0.2rem, 0.35vw, 0.35rem) clamp(0.5rem, 0.75vw, 0.75rem)",
        borderRadius: "999px",
        border: active ? "1px solid #7c3aed" : "1px solid #e5e7eb",
        backgroundColor: active ? "#7c3aed" : "#f9fafb",
        color: active ? "#fff" : "#6b7280",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
