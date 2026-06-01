// ─── ReportDropdown ───────────────────────────────────────────────────────────
// Custom dropdown that always opens downward (never upward).
// Replaces native <select> elements across all report filter bars.
//
// Props:
//   value       – currently selected value (string, "" = none)
//   onChange    – callback(value: string)
//   options     – [{ value, label_en, label_ar }]   (excluding the "All" entry)
//   placeholder – text shown when value === "" (the implicit "All" option)
//   isArabic    – boolean
//   minWidth    – optional CSS min-width string (default "150px")
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export function ReportDropdown({
  value,
  onChange,
  options,
  placeholder,
  isArabic,
  minWidth = "150px",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // ── Close when clicking outside ───────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected
    ? isArabic
      ? selected.label_ar
      : selected.label_en
    : placeholder;

  return (
    <div ref={containerRef} className="relative flex-1" style={{ minWidth }}>
      {/* ── Trigger button ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-[#19355a]/20 bg-white focus:outline-none focus:border-[#19355a]/50 transition cursor-pointer"
        style={{
          padding: `clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.6rem, 1vw, 1.1rem)`,
          fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
          direction: isArabic ? "rtl" : "ltr",
          color: selected ? "#374151" : "#9ca3af",
        }}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{
            width: "clamp(0.75rem, 1vw, 1rem)",
            height: "clamp(0.75rem, 1vw, 1rem)",
          }}
        />
      </button>

      {/* ── Options list – always positioned below the trigger ───────────── */}
      {open && (
        <ul
          className="absolute z-50 w-full bg-white border border-[#19355a]/15 rounded-lg shadow-lg overflow-y-auto"
          style={{
            top: "calc(100% + 4px)",
            left: 0,
            maxHeight: "220px",
            direction: isArabic ? "rtl" : "ltr",
          }}
        >
          {/* Implicit "All" option */}
          <li
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#19355a]/5 transition ${
              value === ""
                ? "bg-[#19355a]/10 text-[#19355a] font-medium"
                : "text-gray-500"
            }`}
            style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
          >
            <span>{placeholder}</span>
            {value === "" && (
              <Check
                className="text-[#19355a]"
                style={{ width: "0.85rem", height: "0.85rem" }}
              />
            )}
          </li>

          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#19355a]/5 transition ${
                value === opt.value
                  ? "bg-[#19355a]/10 text-[#19355a] font-medium"
                  : "text-gray-700"
              }`}
              style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
            >
              <span>{isArabic ? opt.label_ar : opt.label_en}</span>
              {value === opt.value && (
                <Check
                  className="text-[#19355a]"
                  style={{ width: "0.85rem", height: "0.85rem" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
