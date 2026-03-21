import React, { useRef } from "react";
import { FiCalendar } from "react-icons/fi";

export default function DateField({
  label,
  required,
  value,
  placeholder,
  error,
  isArabic,
  onChange,
}) {
  const dateRef = useRef(null);

  const openDatePicker = () => {
    if (dateRef.current) {
      dateRef.current.showPicker?.();
      dateRef.current.focus();
    }
  };

  // --- نفس كلاسات الـ InputField بالضبط لضمان تطابق المقاسات ---
  const base =
    "w-full border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] bg-white outline-none transition cursor-pointer text-start";

  const responsive = `
    px-[clamp(12px,1.4vw,28px)]
    py-[clamp(8px,0.4vw,28px)]
    text-[clamp(13px,1vw,20px)]
  `;

  const focusEffect = "focus-within:border-gray-300 focus-within:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const shared = `${base} ${responsive} ${focusEffect} flex items-center justify-between relative`;

  return (
    <div className="w-full space-y-4">
      {/* Label - متطابق مع InputField */}
      {label && (
        <label className="block font-medium text-[clamp(14px,1.2vw,25px)]">
          {label}
          {required && <span className="text-[#b38e19] ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className={shared} onClick={openDatePicker}>
        {/* العرض الظاهري للقيمة أو الـ Placeholder */}
        <span className={`truncate ${!value ? "text-gray-400" : "text-black"}`}>
          {value || placeholder}
        </span>

        {/* أيقونة التقويم - حجمها يتناسب مع الـ clamp */}
        <FiCalendar
          className={`text-[#B38E19] w-[clamp(16px,1.3vw,32px)] h-[clamp(16px,1.3vw,32px)] shrink-0`}
        />

        {/* Input المخفي الفعلي */}
        <input
          type="date"
          ref={dateRef}
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {/* Error - متطابق مع InputField */}
      {error && <p className="text-red-500 text-[clamp(12px,0.9vw,24px)]">{error}</p>}
    </div>
  );
}