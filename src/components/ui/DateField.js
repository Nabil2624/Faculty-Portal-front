import React, { useRef } from "react";
import { FiCalendar } from "react-icons/fi";

export default function DateField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  isArabic,
}) {
  const ref = useRef(null);

  const openPicker = () => {
    if (ref.current?.showPicker) ref.current.showPicker();
    else ref.current?.focus();
  };

  const base =
    "w-full border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] bg-[#E2E2E2] outline-none cursor-pointer transition";

  const responsive =
    `
    px-[clamp(12px,1.4vw,28px)]
    py-[clamp(10px,0.6vw,28px)]
    text-[clamp(13px,1vw,30px)]
  `;

  const focus =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block font-medium text-[clamp(14px,1.2vw,32px)]">
          {label}
          {required && <span className="text-[#b38e19] ml-1">*</span>}
        </label>
      )}

      <div className="relative" onClick={openPicker}>
        <input
          type="text"
          readOnly
          value={value}
          placeholder={placeholder}
          className={`${base} ${responsive} ${focus}`}
        />

        <FiCalendar
          className="
            absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none
            w-[clamp(16px,1.7vw,50px)]
            h-[clamp(16px,1.7vw,50px)]
          "
          style={isArabic ? { left: 12 } : { right: 12 }}
        />

        <input
          ref={ref}
          type="date"
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
