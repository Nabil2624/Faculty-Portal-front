// ─── ReportCategoryPanel ──────────────────────────────────────────────────────
// Right-side panel showing all report categories.
// Props:
//   selected   – currently selected report type key (string | null)
//   onSelect   – callback(key: string)
//   t          – i18next translation function (Reports namespace)
//   isArabic   – boolean
// ─────────────────────────────────────────────────────────────────────────────

import { REPORT_CATEGORIES, COLORS } from "./reportsConstants";

export function ReportCategoryPanel({ selected, onSelect, t, isArabic }) {
  return (
    <aside
      className="flex flex-col rounded-2xl border border-[#19355a]/15 bg-white shadow-sm overflow-hidden"
      style={{ minWidth: "clamp(200px, 20vw, 280px)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2 bg-[#19355a] text-white"
        style={{
          padding: "clamp(0.75rem, 1.2vw, 1.2rem) clamp(0.8rem, 1.3vw, 1.3rem)",
        }}
      >
        <span
          className="font-bold"
          style={{ fontSize: "clamp(0.75rem, 1vw, 1.05rem)" }}
        >
          {t("categoryPanel.title")}
        </span>
      </div>

      {/* Category list */}
      <ul
        className="flex flex-col overflow-y-auto"
        style={{ maxHeight: "clamp(400px, 70vh, 900px)" }}
      >
        {REPORT_CATEGORIES.map(({ key, icon: Icon }) => {
          const isActive = selected === key;
          return (
            <li key={key}>
              <button
                onClick={() => onSelect(key)}
                className={`w-full flex items-center gap-3 transition-all duration-150 text-start
                  ${
                    isActive
                      ? "bg-[#19355a] text-white"
                      : "text-gray-700 hover:bg-[#19355a]/8 hover:text-[#19355a]"
                  }`}
                style={{
                  padding:
                    "clamp(0.6rem, 1vw, 1rem) clamp(0.8rem, 1.2vw, 1.2rem)",
                  fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
                  borderBottom: "1px solid rgba(25,53,90,0.07)",
                }}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* Icon */}
                <span
                  className={`flex-shrink-0 rounded-lg flex items-center justify-center
                    ${isActive ? "bg-white/20" : "bg-[#19355a]/10"}`}
                  style={{
                    width: "clamp(1.6rem, 2.2vw, 2.4rem)",
                    height: "clamp(1.6rem, 2.2vw, 2.4rem)",
                  }}
                >
                  <Icon
                    className={isActive ? "text-[#b38e19]" : "text-[#19355a]"}
                    style={{
                      width: "clamp(0.8rem, 1.1vw, 1.2rem)",
                      height: "clamp(0.8rem, 1.1vw, 1.2rem)",
                    }}
                  />
                </span>

                {/* Label */}
                <span className="leading-snug">{t(`categories.${key}`)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
