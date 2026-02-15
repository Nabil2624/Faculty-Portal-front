import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  error,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find((o) => String(o.id) === String(value)) || null;
  }, [value, options]);

  // إغلاق عند الضغط خارج الدروب داون
  useEffect(() => {
    const handleOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  // تحديث موقع الدروب داون
  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);
  

  // ستايل الريسبونسيف زي CustomDropdown
  const base = "border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] outline-none transition cursor-pointer";
  const responsive = `px-[clamp(12px,1.4vw,28px)] py-[clamp(10px,0.6vw,28px)] text-[clamp(13px,1vw,30px)]`;
  const shared = `${base} ${responsive} flex justify-between items-center ${
    open ? "shadow-[0_0_0_4px_rgba(179,142,25,0.5)]" : ""
  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Select Box */}
      <div onClick={() => !disabled && setOpen((p) => !p)} className={`${shared} bg-white`}>
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="text-[#B38E19] w-[clamp(16px,1.3vw,32px)] h-[clamp(16px,1.3vw,32px)] shrink-0" />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Options */}
      {open && !disabled &&
        createPortal(
          <div
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="absolute z-50 bg-white border border-gray-300 rounded-[clamp(0.2rem,0.4vw,0.7rem)] shadow-lg max-h-[clamp(80px,15vw,120px)] overflow-y-auto"
          >
            {options.length === 0 && (
              <div className="px-[clamp(12px,1.4vw,28px)] py-[clamp(8px,0.6vw,22px)] text-[clamp(12px,1vw,26px)] text-gray-500">
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
                  String(item.id) === String(value) ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
