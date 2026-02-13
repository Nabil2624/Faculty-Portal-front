import { useRef } from "react";
import { FiCalendar } from "react-icons/fi";

export default function DateInput({
  label,
  required,
  value,
  placeholder,
  error,
  inputClass,
  isArabic,
  onChange,
}) {
  const dateRef = useRef(null);

  const openDatePicker = () => {
    if (dateRef.current) {
      dateRef.current.showPicker?.(); // modern browsers support showPicker()
      dateRef.current.focus(); // fallback for older browsers
    }
  };

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
          onFocus={openDatePicker}
        />

        <FiCalendar
          size={18}
          className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
            isArabic ? "left-3" : "right-3"
          }`}
          onClick={openDatePicker}
        />

        <input
          type="date"
          ref={dateRef}
          className="absolute opacity-0 w-0 h-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
