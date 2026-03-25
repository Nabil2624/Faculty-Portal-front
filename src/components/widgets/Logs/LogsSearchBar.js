import { Search, RefreshCw, Filter, X } from "lucide-react";
import { getLevelLabel } from "./logsConstants";
import { EMPTY_FILTERS } from "./logsConstants";

export function LogsSearchBar({
  search,
  setSearch,
  isFocused,
  setIsFocused,
  isArabic,
  t,
  loadData,
  hasActiveFilters,
  appliedFilters,
  onOpenFilter,
  onClearFilters,
}) {
  return (
    <>
      {/* Title + controls row */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)",
          gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
          flexWrap: "nowrap",
        }}
      >
        <h2
          className="font-semibold text-gray-800 shrink-0"
          style={{ fontSize: "clamp(1rem, 1.8vw, 2.2rem)", lineHeight: 1.2 }}
        >
          {t("title")}
          <span
            className="block bg-[#b38e19] rounded-full"
            style={{
              width: "clamp(2.5rem, 6vw, 8rem)",
              height: "clamp(0.2rem, 0.3vw, 0.4rem)",
              marginTop: "clamp(0.2rem, 0.4vw, 0.5rem)",
            }}
          />
        </h2>

        <div
          className="flex items-center gap-2"
          style={{ minWidth: 0, flex: "1", justifyContent: "flex-end" }}
        >
          {/* Search input */}
          <div
            className="relative flex items-center"
            style={{
              borderBottom: `2px solid ${isFocused ? "#b38e19" : "#d1d5db"}`,
              paddingBottom: "2px",
              transition: "border-color 0.3s ease",
              flex: "1",
              maxWidth: "clamp(12rem, 25vw, 32rem)",
              minWidth: "8rem",
            }}
          >
            <Search
              className="shrink-0 text-[#b38e19]"
              style={{
                width: "clamp(14px, 1.6vw, 24px)",
                height: "clamp(14px, 1.6vw, 24px)",
                marginRight: isArabic ? 0 : "clamp(6px,0.8vw,10px)",
                marginLeft: isArabic ? "clamp(6px,0.8vw,10px)" : 0,
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t("search")}
              className="outline-none bg-transparent text-gray-700 w-full"
              style={{
                height: "clamp(28px, 2.8vw, 42px)",
                fontSize: "clamp(11px, 1vw, 15px)",
              }}
            />
            <span
              className="absolute bottom-0 h-[2px] bg-[#b38e19]"
              style={{
                transition: "width 0.3s ease",
                width: isFocused ? "100%" : "0%",
                [isArabic ? "right" : "left"]: 0,
              }}
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={loadData}
            title="Refresh"
            className="border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
            style={{
              flexShrink: 0,
              width: "clamp(2rem, 2.8vw, 3.5rem)",
              height: "clamp(2rem, 2.8vw, 3.5rem)",
            }}
          >
            <RefreshCw
              style={{
                width: "clamp(0.8rem, 1.2vw, 1.4rem)",
                height: "clamp(0.8rem, 1.2vw, 1.4rem)",
              }}
            />
          </button>

          {/* Filter button */}
          <button
            onClick={onOpenFilter}
            className="border-2 rounded-md flex items-center justify-center transition relative"
            style={{
              flexShrink: 0,
              width: "clamp(2rem, 2.8vw, 3.5rem)",
              height: "clamp(2rem, 2.8vw, 3.5rem)",
              borderColor: "#b38e19",
              backgroundColor: hasActiveFilters ? "#b38e19" : "transparent",
            }}
          >
            <Filter
              style={{
                width: "clamp(0.8rem, 1.2vw, 1.4rem)",
                height: "clamp(0.8rem, 1.2vw, 1.4rem)",
                color: hasActiveFilters ? "white" : "#b38e19",
              }}
            />
            {!!hasActiveFilters && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
                style={{
                  width: "clamp(12px, 1.1vw, 16px)",
                  height: "clamp(12px, 1.1vw, 16px)",
                  fontSize: "clamp(7px, 0.6vw, 9px)",
                }}
              >
                {[
                  appliedFilters.levels,
                  appliedFilters.categories,
                  appliedFilters.categoryActions,
                  appliedFilters.codes,
                ].reduce((s, a) => s + a.length, 0) +
                  (appliedFilters.dateFrom ? 1 : 0) +
                  (appliedFilters.dateTo ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter tags */}
      {!!hasActiveFilters && (
        <div
          className="flex flex-wrap items-center"
          style={{
            gap: "clamp(0.3rem, 0.6vw, 0.6rem)",
            marginBottom: "clamp(0.5rem, 1vw, 1rem)",
          }}
        >
          <span
            className="text-gray-400"
            style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
          >
            Active filters:
          </span>
          {[
            ...appliedFilters.levels,
            ...appliedFilters.categories,
            ...appliedFilters.categoryActions,
            ...appliedFilters.codes,
          ].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
              style={{
                padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
              }}
            >
              {getLevelLabel(tag)}
            </span>
          ))}
          {appliedFilters.dateFrom && (
            <span
              className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
              style={{
                padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
              }}
            >
              From: {appliedFilters.dateFrom}
            </span>
          )}
          {appliedFilters.dateTo && (
            <span
              className="inline-flex items-center gap-1 bg-[#b38e19]/10 text-[#b38e19] border border-[#b38e19]/30 rounded-full"
              style={{
                padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
              }}
            >
              To: {appliedFilters.dateTo}
            </span>
          )}
          <button
            onClick={() => onClearFilters(EMPTY_FILTERS)}
            className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
            style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)" }}
          >
            <X
              style={{
                width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                height: "clamp(0.6rem, 0.8vw, 0.9rem)",
              }}
            />
            Clear all
          </button>
        </div>
      )}
    </>
  );
}
