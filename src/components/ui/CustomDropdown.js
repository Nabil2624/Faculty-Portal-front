import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({
  label,
  required,
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

  useEffect(() => {
    const handleOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [value]);

  // --- نفس كلاسات الـ InputField بالكربون ---
  const base =
    "w-full border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] bg-white outline-none transition cursor-pointer";

  // شيلنا الـ py واستخدمنا h- عشان نضمن انهم نفس الطول بالملي
  const responsive = `
    px-[clamp(12px,1.2vw,25px)]
    py-[clamp(8px,0.6vw,28px)]
    text-[clamp(13px,1vw,20px)]
  `;

  // محاكاة الـ focus اللي في الـ InputField
  const focusStyle = open
    ? "border-gray-300 shadow-[0_0_0_4px_rgba(179,142,25,0.5)]"
    : "border-gray-300";

  const shared = `${base} ${responsive} ${focusStyle} flex items-center justify-between overflow-hidden`;

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((opt) => String(opt.id) === String(value))?.label || "";
  }, [value, options]);

  return (
    <div ref={wrapperRef} className="w-full space-y-4">
      {label && (
        <label className="block font-medium text-[clamp(14px,1.2vw,25px)]">
          {label}
          {required && <span className="text-[#b38e19] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          onClick={() => !disabled && setOpen((p) => !p)}
          className={`${shared} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {/* الـ h-full هنا مع الـ truncate بتضمن ان النص في النص بالظبط */}
          <span className="truncate flex-1 h-full flex items-center">
            {selectedLabel || (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={`text-[#B38E19] w-[clamp(16px,1.3vw,32px)] h-[clamp(16px,1.3vw,32px)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>

        {/* Options Menu */}
        {open && !disabled && (
          <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] shadow-xl max-h-[clamp(120px,15vw,280px)] overflow-y-auto">
            {options.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                className="cursor-pointer hover:bg-white/50 transition px-[clamp(12px,1.4vw,28px)] py-[clamp(8px,0.6vw,20px)] text-[clamp(13px,1vw,30px)] border-b border-gray-100 last:border-0"
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-[clamp(12px,0.9vw,24px)]">{error}</p>
      )}
    </div>
  );
}
