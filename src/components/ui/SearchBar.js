import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "", isArabic = false }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="relative flex items-center flex-1"
      style={{
        borderBottom: `2px solid ${isFocused ? "#b38e19" : "#d1d5db"}`,
        paddingBottom: "2px",
        transition: "border-color 0.4s ease",
        paddingLeft: isArabic ? "clamp(0.5rem, 6vw, 15rem)" : 0,
        paddingRight: isArabic ? 0 : "clamp(0.5rem, 6vw, 15rem)",
        minWidth: 0,
      }}
    >
      <Search
        className="shrink-0 text-[#b38e19]"
        style={{
          width: "clamp(14px, 1.6vw, 40px)",
          height: "clamp(14px, 1.6vw, 40px)",
          marginLeft: isArabic ? "clamp(6px,1vw,12px)" : 0,
          marginRight: isArabic ? 0 : "clamp(6px,1vw,12px)",
        }}
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 min-w-0 outline-none bg-transparent text-gray-700 leading-none"
        style={{
          height: "clamp(32px, 3vw, 80px)",
          fontSize: "clamp(12px, 1.2vw, 50px)",
        }}
      />
      <span
        className="absolute bottom-0 h-[2px] bg-[#b38e19]"
        style={{
          transition: "width 0.4s ease",
          width: isFocused ? "100%" : "0%",
          left: isArabic ? undefined : 0,
          right: isArabic ? 0 : undefined,
        }}
      />
    </div>
  );
}
