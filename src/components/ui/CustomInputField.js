import React from "react";

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  textarea = false,
}) {
  const base =
    "w-full border text-black border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] bg-[#E2E2E2] outline-none transition placeholder-black";

  const responsive = `
    px-[clamp(12px,1.4vw,28px)]
    py-[clamp(10px,0.6vw,28px)]
    text-[clamp(13px,1vw,30px)]
  `;

  const focus =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const shared = `${base} ${responsive} ${focus}`;

  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block font-medium text-[clamp(14px,1.2vw,32px)] bg-opacity-50">
          {label}
          {required && <span className="text-[#b38e19] ml-1">*</span>}
        </label>
      )}

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${shared} resize-none min-h-[clamp(90px,7vw,195px)]`}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={shared}
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
