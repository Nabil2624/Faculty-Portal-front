import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder,
  isArabic,
}) {
  const [open, setOpen] = useState(false);

  const inputClass =
    "w-full bg-[#ffffff] border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-400 transition duration-150 cursor-pointer flex justify-between items-center";

  const focusClass =
    "ring-2 ring-[#B38E19] transition duration-150 shadow "; // simulate focus when open

  return (
    <div className="relative w-full">
      {/* Input Box */}
      <div
        onClick={() => setOpen(!open)}
        className={`${inputClass} ${open ? focusClass : ""}`}
      >
        <span>{value ? options.find((x) => x.id === value)?.label : placeholder}</span>
        <ChevronDown
          size={18}
          className="text-[#B38E19]"
          style={isArabic ? { left: "8px" } : { right: "8px" }}
        />
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-[#E2E2E2] shadow-lg border border-gray-300 rounded-md max-h-40 overflow-y-auto z-[9999]">
          {options.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">No items</div>
          )}

          {options.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
