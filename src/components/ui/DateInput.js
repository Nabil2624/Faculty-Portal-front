import { FiCalendar } from "react-icons/fi";

export default function DateInput({
  label,
  required,
  value,
  placeholder,
  error,
  inputClass,
  isArabic,
  inputRef,
  onOpen,
  onChange,
}) {
  return (
    <div>
      <label className="block mb-4 text-lg">
        {label} {required && <span className="text-[#B38E19]">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder}
          className={inputClass}
          onFocus={onOpen}
        />

        <FiCalendar
          size={18}
          className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
            isArabic ? "left-3" : "right-3"
          }`}
          onClick={onOpen}
        />

        <input
          type="date"
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
