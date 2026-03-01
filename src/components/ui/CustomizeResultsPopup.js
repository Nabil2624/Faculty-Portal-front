import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function clampIcon(min, mid, max) {
  return `clamp(${min}px, ${mid}px, ${max}px)`;
}

export default function CustomizeResultsModal({
  onClose,
  onApply,
  onReset,
  currentSort = null,
  currentFilters = {},
  filtersConfig = [],
  sortOptions = [],
  translationNamespace = "researches",
}) {
  const { t, i18n } = useTranslation(translationNamespace);
  const isArabic = i18n.language === "ar";

  const hasFilters =
    Array.isArray(filtersConfig) && filtersConfig.length > 0;

  const hasSorting =
    Array.isArray(sortOptions) && sortOptions.length > 0;

  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [selectedFilters, setSelectedFilters] =
    useState(currentFilters);

  useEffect(() => {
    setSelectedSort(currentSort ?? null);
    setSelectedFilters(currentFilters ?? {});
  }, [currentSort, currentFilters]);

  const toggleOption = (groupKey, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[groupKey] || [];

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [groupKey]: currentValues.filter((v) => v !== value),
        };
      }

      return {
        ...prev,
        [groupKey]: [...currentValues, value],
      };
    });
  };

  const handleApply = () => {
    onApply({
      sortValue: selectedSort,
      filters: selectedFilters,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedSort(null);
    setSelectedFilters({});
    onReset?.();
  };

  const hasActiveFilters =
    selectedSort !== null ||
    Object.values(selectedFilters).some((arr) => arr?.length > 0);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      className="
        relative bg-white 
        border-[clamp(1.5px,0.3vw,3px)] border-[#b38e19] 
        rounded-[clamp(14px,2vw,22px)] shadow-2xl 
        w-[clamp(320px,35vw,900px)] max-w-[95%]
        max-h-[85vh] flex flex-col
        p-[clamp(1rem,2.5vw,2rem)]
      "
    >
      {/* Close */}
      <button
        onClick={onClose}
        className={`absolute top-[clamp(0.75rem,1.2vw,1.2rem)] ${
          isArabic
            ? "left-[clamp(0.75rem,1.2vw,1.2rem)]"
            : "right-[clamp(0.75rem,1.2vw,1.2rem)]"
        } text-gray-500 hover:scale-110 transition`}
      >
        <X size={clampIcon(18, 26, 35)} />
      </button>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="font-semibold text-[clamp(1.3rem,2vw,2rem)]">
          {t("customizeResults")}
        </h2>
        <div className="w-24 h-[clamp(2px,0.3vw,4px)] bg-[#b38e19] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* ================= Scrollable Content ================= */}
      <div className="flex-1 overflow-y-auto pr-2">

        {/* ================= Sorting ================= */}
        {hasSorting && (
          <div className={hasFilters ? "mb-8" : "mb-4"}>
            <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.3rem)] mb-4">
              {t("sortOptions")}
              <div className="w-24 h-[clamp(2px,0.3vw,4px)] bg-[#b38e19] mt-3 rounded-full"></div>
            </h3>

            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSort(option.value)}
                  className={`px-4 py-2 rounded-full border transition text-sm ${
                    selectedSort === option.value
                      ? "bg-[#b38e19] text-white border-[#b38e19]"
                      : "bg-[#b38e19]/10 text-[#b38e19] border-[#b38e19] hover:bg-[#b38e19]/20"
                  }`}
                >
                  {t(option.label)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= Filters ================= */}
        {hasFilters && (
          <>
            <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.3rem)] mb-4">
              {t("filterOptions")}
              <div className="w-24 h-[clamp(2px,0.3vw,4px)] bg-[#b38e19] mt-3 rounded-full"></div>
            </h3>

            {filtersConfig.map((group) => (
              <div key={group.key} className="mb-8">
                <h3 className="font-semibold text-[clamp(1rem,1.2vw,1.3rem)] mb-4 text-[#b38e19]">
                  {t(group.title)}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {group.options?.map((option) => {
                    const isSelected =
                      selectedFilters[group.key]?.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          toggleOption(group.key, option.value)
                        }
                        className={`px-4 py-2 rounded-full border transition text-sm ${
                          isSelected
                            ? "bg-[#b38e19] text-white border-[#b38e19]"
                            : "bg-[#b38e19]/10 text-[#b38e19] border-[#b38e19] hover:bg-[#b38e19]/20"
                        }`}
                      >
                        {typeof option.label === "string"
                          ? t(option.label)
                          : option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ================= Buttons (Fixed Bottom) ================= */}
      <div className="pt-6 border-t flex justify-center gap-4 bg-white">
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            {t("reset")}
          </button>
        )}

        <button
          onClick={handleApply}
          className="px-6 py-2 rounded-lg bg-[#b38e19] text-white hover:opacity-90 transition"
        >
          {t("apply")}
        </button>
      </div>
    </div>
  );
}