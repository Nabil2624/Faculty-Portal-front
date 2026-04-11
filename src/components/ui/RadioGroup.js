import React from "react";

export default function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  error, // ضفت لك الـ error عشان يظهر لو فيه مشكلة
}) {
  return (
    <div className="w-full flex flex-col justify-between">
      {label && (
        <div className="text-[clamp(14px,1.2vw,25px)] mb-2 text-gray-700">
          {label} <span className="text-[#b38e19]">*</span>
        </div>
      )}

      {/* flex-nowrap لضمان بقائهم بجانب بعض، و whitespace-nowrap للنصوص */}
      <div className="flex flex-nowrap items-center gap-[clamp(0.5rem,1vw,1rem)] overflow-x-auto no-scrollbar pb-1">
        {options.map((opt) => {
          const isChecked = String(value) === String(opt.value);

          return (
            <div
              key={opt.value}
              onClick={() => {
                if (!disabled) {
                  onChange(opt.value);
                }
              }}
              className={`
                flex items-center gap-2 px-[clamp(8px,0.8vw,14px)] py-[clamp(6px,0.6vw,10px)] 
                rounded-lg cursor-pointer border transition-all duration-200 select-none 
                flex-1 min-w-fit whitespace-nowrap
                ${
                  isChecked
                    ? "border-[#B38E19] bg-[#B38E19]/5 shadow-sm"
                    : "border-gray-200 hover:border-[#B38E19]/30 bg-white text-gray-600"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
              `}
            >
              {/* الدائرة المخصصة - صغرت حجمها شوية عشان التناسق */}
              <div
                className={`
                  w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                  ${isChecked ? "border-[#B38E19]" : "border-gray-400"}
                `}
              >
                {isChecked && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B38E19]" />
                )}
              </div>

              <span className={`text-[clamp(12px,0.9vw,15px)] ${isChecked ? "font-bold text-[#B38E19]" : "font-medium"}`}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* عرض الخطأ إن وجد */}
      {error && <p className="text-red-500 text-[11px] mt-1 animate-pulse">{error}</p>}
    </div>
  );
}