import React from "react";
import { Filter } from "lucide-react";
import SearchBar from "./SearchBar";

export default function PageHeader({
  title,
  onAdd,
  addLabel,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "",
  isArabic = false,
  onFilterClick,
}) {
  return (
    <div
      className="flex items-center justify-between gap-4"
      style={{
        marginBottom: "clamp(0.75rem, 2vw, 4rem)",
        flexWrap: "nowrap", // 👈 يمنع النزول تحت
      }}
    >
      {/* Title */}
      <h2
        className="font-semibold text-black-600"
        style={{
          fontSize: "clamp(1.25rem, 2.2vw, 5rem)",
          lineHeight: "1.2",
          flexShrink: 1,
          minWidth: 0,
          maxWidth: "58%", // 👈 أهم تعديل
        }}
      >
        {title}
        <span
          style={{
            width: "clamp(2.5rem, 6vw, 15rem)",
            height: "clamp(0.2rem, 0.3vw, 0.6rem)",
            marginTop: "clamp(0.25rem, 0.6vw, 0.7rem)",
            borderRadius: "clamp(0.25rem, 1vw, 2rem)",
          }}
          className="block bg-[#b38e19]"
        />
      </h2>

      {/* Right Controls */}
      <div
        className="flex items-center gap-1 md:gap-3 break-words"
        style={{
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        {/* Search */}
        <div
          style={{
            flex: 1,
            minWidth: "8rem",
            maxWidth: "30rem",
          }}
        >
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            isArabic={isArabic}
          />
        </div>

        {/* Filter */}
        <div
          onClick={onFilterClick}
          className="border-2 border-[#b38e19] hover:bg-[#d0a929] rounded-md flex items-center justify-center cursor-pointer"
          style={{
            flexShrink: 0,
            width: "clamp(2rem, 3vw, 4rem)",
            height: "clamp(2rem, 3vw, 4rem)",
          }}
        >
          <Filter
            style={{
              width: "clamp(1.2rem, 1.3vw, 3rem)",
              height: "clamp(1.2rem, 1.3vw, 3rem)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
