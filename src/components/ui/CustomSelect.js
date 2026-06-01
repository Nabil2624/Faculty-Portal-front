import React, { useState, useRef, useEffect } from "react";

// استخدم هذا المكون بدل الـ select القديم
export function CustomSelect({ label, options, value, onChange, disabled, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // قفل الليست لو المستخدم ضغط بره
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-[clamp(0.85rem,1vw,1.1rem)] font-semibold text-[#19355a] mb-1.5">
        {label}
      </label>
      
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-11 px-4 flex items-center justify-between rounded-[clamp(6px,0.6vw,10px)] 
          bg-gray-50 border-[clamp(1px,0.15vw,2px)] border-slate-300
          text-[clamp(0.95rem,1vw,1.2rem)] text-black cursor-pointer
          transition-all duration-200 outline-none
          ${disabled ? "bg-gray-200/50 text-gray-400 cursor-not-allowed" : "hover:border-[#b38e19] focus:border-[#b38e19] focus:shadow-[0_0_0_2px_rgba(179,142,25,0.2)]"}`}
      >
        <span className={!selectedOption ? "text-gray-400" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* الـ List الاحترافية */}
      {isOpen && !disabled && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-[8px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange({ target: { name: "acceptanceType", value: opt.value } });
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-50  cursor-pointer transition-colors text-[0.95rem] text-slate-700"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}