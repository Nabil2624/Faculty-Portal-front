import React from "react";

export default function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>
      {label && (
        <div className="text-[clamp(13px,1.2vw,30px)] font-medium">
          {label}
        </div>
      )}

      <div className="flex gap-4">
        {options.map((opt) => {
          const checked = value === opt.value;

          return (
            <label
              key={opt.value}
              className={`
                flex items-center gap-3 px-3 py-[7px] rounded-lg cursor-pointer
                border transition
                ${
                  checked
                    ? "border-[#B38E19] bg-[#B38E19]/10"
                    : "border-gray-300 hover:border-[#B38E19]"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input
                type="radio"
                value={opt.value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="hidden"
              />

              {/* Custom circle */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    checked
                      ? "border-[#B38E19]"
                      : "border-gray-400"
                  }
                `}
              >
                {checked && (
                  <div className="w-3 h-3 rounded-full bg-[#B38E19]" />
                )}
              </div>

              <span className="text-[clamp(13px,1.2vw,30px)]">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
