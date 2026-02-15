import { ChevronDown } from "lucide-react";

export default function SelectWithIcon({
  value,
  onChange,
  children,
  className,
  isArabic,
}) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={onChange}
        className={`${className} appearance-none`}
      >
        {children}
      </select>

      <ChevronDown
        size={26}
        className="absolute text-[#B38E19] pointer-events-none"
        style={isArabic ? { left: "10px" } : { right: "10px" }}
      />
    </div>
  );
}
