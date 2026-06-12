// ─── ReportMultiSelect ────────────────────────────────────────────────────────
// Multi-select dropdown for report filter bars.
//
// Props:
//   value       – currently selected values (array of primitives)
//   onChange    – callback(values: array)
//   options     – [{ value, label }]
//   placeholder – text shown when nothing is selected
//   isArabic    – boolean
//   minWidth    – optional CSS min-width string (default "160px")
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

export function ReportMultiSelect({
  value = [],
  onChange,
  options,
  placeholder,
  isArabic,
  minWidth = "160px",
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

  const toggle = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const displayLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? String(value[0])
        : isArabic
          ? `${value.length} سنوات`
          : `${value.length} years`;

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
          color: value.length > 0 ? "#374151" : "#9ca3af",
        }}
      >
        <span className="truncate">{displayLabel}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {value.length > 0 && (
            <X
              className="text-gray-400 hover:text-red-400 transition"
              onClick={clearAll}
              style={{
                width: "clamp(0.7rem, 0.9vw, 0.95rem)",
                height: "clamp(0.7rem, 0.9vw, 0.95rem)",
              }}
            />
          )}
          <ChevronDown
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            style={{
              width: "clamp(0.75rem, 1vw, 1rem)",
              height: "clamp(0.75rem, 1vw, 1rem)",
            }}
          />
        </div>
      </button>

      {/* ── Options list ─────────────────────────────────────────────────── */}
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
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <li
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#19355a]/5 transition ${
                  selected
                    ? "bg-[#19355a]/10 text-[#19355a] font-medium"
                    : "text-gray-700"
                }`}
                style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
              >
                <span>{opt.label}</span>
                {selected && (
                  <Check
                    className="text-[#19355a]"
                    style={{ width: "0.85rem", height: "0.85rem" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
