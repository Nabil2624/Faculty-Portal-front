import { useState } from "react";
import HalfSectionCard from "../../ui/HalfSectionCard";

// Helper function to check if text is mostly Arabic
const isMostlyArabic = (text) => {
  if (!text) return false;
  const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
  return arabicChars.length / text.length > 0.3; // >30% Arabic characters
};

export default function AbstractWidget({ abstract, title, isArabic }) {
  const [hovered, setHovered] = useState(false);

  // Remove trailing ellipsis for hover tooltip only
  const tooltipText =
    abstract && (abstract.endsWith("...") || abstract.endsWith("…"))
      ? abstract.slice(0, -2)
      : abstract || "-"; // fallback for undefined

  const tooltipDirection = isMostlyArabic(abstract)
    ? "text-right"
    : "text-left";

  return (
    <HalfSectionCard title={title}>
      <div className="relative inline-block">
        {/* Abstract text */}
        <p
          dir={isArabic ? "rtl" : "ltr"}
          className={`
            text-sm 
            leading-relaxed 
            text-[#19355a] 
            line-clamp-2 
            overflow-hidden
            ${isArabic ? "text-right pl-1" : "text-left pr-6"}
            cursor-pointer
          `}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {abstract}
        </p>

        {/* Modern tooltip */}
        {hovered && (
          <div
            className={`
              fixed z-10 max-w-[90vw] w-[500px] bg-white/90 backdrop-blur-md
              text-[#19355a] p-4 rounded-2xl shadow-2xl border border-gray-100
              top-[42%] left-[51%] transform -translate-x-1/2
              pointer-events-none
              transition-all duration-300 ease-out
              scale-95 animate-fadeIn
              hover:scale-100
              ring-1 ring-[#B38E19]
              before:content-[''] before:absolute before:-bottom-3 before:left-1/2
              before:-translate-x-1/2 before:border-[10px] before:border-t-white
              before:border-l-transparent before:border-r-transparent before:border-b-transparent
              ${tooltipDirection}
            `}
          >
            {tooltipText}
          </div>
        )}
      </div>
    </HalfSectionCard>
  );
}
