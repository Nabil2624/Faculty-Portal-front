import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "",
  isArabic = false,
  error = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // اقفل الدروب داون لو القيمة اتغيرت من برّه (edit form)
  useEffect(() => {
    setOpen(false);
  }, [value]);

  const base =
    "w-full border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] bg-[#E2E2E2] outline-none transition cursor-pointer";
  const responsive = `px-[clamp(12px,1.4vw,28px)] py-[clamp(10px,0.6vw,28px)] text-[clamp(13px,1vw,30px)]`;
  const shared = `${base} ${responsive} flex items-center justify-between ${
    open ? "shadow-[0_0_0_4px_rgba(179,142,25,0.5)]" : ""
  }`;

  // نفس فكرة <select value="">
  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((opt) => String(opt.id) === String(value))?.label || "";
  }, [value, options]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* INPUT BOX */}
      <div
        onClick={() => !disabled && setOpen((p) => !p)}
        className={shared}
      >
        <span className="truncate">
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="text-[#B38E19] w-[clamp(16px,1.3vw,32px)] h-[clamp(16px,1.3vw,32px)] shrink-0" />
      </div>

      {/* ERROR */}
      {error && <div className="text-red-500 mt-1 text-sm">{error}</div>}

      {/* OPTIONS */}
      {open && !disabled && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-[#E2E2E2] border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] shadow-lg max-h-[clamp(80px,15vw,120px)] overflow-y-auto">
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-[clamp(12px,1vw,26px)]">
              No items
            </div>
          )}

          {options.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
              className={`cursor-pointer hover:bg-gray-100 transition px-[clamp(12px,1.4vw,28px)] py-[clamp(8px,0.6vw,22px)] text-[clamp(12px,1vw,26px)] ${
                String(item.id) === String(value)
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
