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
}) {
  return (
    <div
      className="flex justify-between items-center flex-wrap gap-4"
      style={{ marginBottom: "clamp(0.75rem, 2vw, 4rem)" }}
    >
      {/* Title */}
      <h2
        style={{ fontSize: "clamp(1.25rem, 2.5vw, 5rem)", lineHeight: "1.2" }}
        className="font-semibold text-black-600"
      >
        {title}
        <span
          style={{
            width: "clamp(2.5rem, 7vw, 15rem)",
            height: "clamp(0.2rem, 0.3vw, 0.6rem)",
            marginTop: "clamp(0.25rem, 0.6vw, 0.7rem)",
            borderRadius: "clamp(0.25rem, 1vw, 2rem)",
          }}
          className="block bg-[#b38e19]"
        />
      </h2>

      {/* Right Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* SearchBar Component */}
        <div style={{ flexShrink: 0, width: "clamp(10rem, 25vw, 30rem)" }}>
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            isArabic={isArabic}
          />
        </div>

        {/* Filter */}
        <div
          className="border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer"
          style={{
            flexShrink: 0,
            width: "clamp(2.5rem, 3.5vw, 5rem)",
            height: "clamp(2.5rem, 3.5vw, 5rem)",
          }}
        >
          <Filter
            style={{
              width: "clamp(1.2rem, 2vw, 4rem)",
              height: "clamp(1.2rem, 2vw, 4rem)",
            }}
          />
        </div>

        {/* Add Button */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-[#b38e19] text-white rounded-md font-medium px-4"
            style={{
              flexShrink: 0,
              height: "clamp(2.5rem, 3.5vw, 5rem)",
              fontSize: "clamp(0.9rem, 1.2vw, 2.2rem)",
            }}
          >
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
