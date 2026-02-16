import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function clampIcon(min, mid, max) {
  return `clamp(${min}px, ${mid}px, ${max}px)`;
}

const sortOptions = [
  { id: 1, label: "newestFirst" },
  { id: 2, label: "oldestFirst" },
];

const filterOptions = [
  { id: 1, label: "internalJournal" },
  { id: 2, label: "externalJournal" },
  { id: 3, label: "sharedGrant" },
  { id: 4, label: "personalGrant" },
];

export default function CustomizeResultsModal({ onClose, onApply }) {
  const { t, i18n } = useTranslation("researches");
  const isArabic = i18n.language === "ar";

  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  const handleApply = () => {
    onApply({
      sortValue: selectedSort,
      filtersList: selectedFilters,
    });
    onClose();
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      onClick={(e) => e.stopPropagation()}
      className="
        relative
        bg-white
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#b38e19]
        rounded-[clamp(14px,2vw,22px)]
        shadow-2xl
        w-[clamp(320px,35vw,900px)]
        max-w-[95%]
        p-[clamp(1rem,2.5vw,2rem)]
      "
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`
          absolute
          top-[clamp(0.75rem,1.2vw,1.2rem)]
          ${
            isArabic
              ? "left-[clamp(0.75rem,1.2vw,1.2rem)]"
              : "right-[clamp(0.75rem,1.2vw,1.2rem)]"
          }
          text-gray-500
          hover:scale-110
          transition
        `}
      >
        <X size={clampIcon(18, 26, 35)} />
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-semibold text-[clamp(1.3rem,2vw,2rem)]">
          {t("customizeResults")}
        </h2>
        <div className="w-24 h-[clamp(2px,0.3vw,4px)] bg-[#b38e19] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Sorting */}
      <div className="mb-10">
        <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.3rem)] mb-4">
          {t("sortOptions")}
        </h3>

        <div className="flex flex-wrap gap-3">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedSort(option.id)}
              className={`
                px-4 py-2 rounded-full border transition text-sm
                ${
                  selectedSort === option.id
                    ? "bg-[#b38e19] text-white border-[#b38e19]"
                    : "bg-[#b38e19]/10 text-[#b38e19] border-[#b38e19] hover:bg-[#b38e19]/20"
                }
              `}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Filtering */}
      <div>
        <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.3rem)] mb-4">
          {t("filterOptions")}
        </h3>

        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleFilter(option.id)}
              className={`
                px-4 py-2 rounded-full border transition text-sm
                ${
                  selectedFilters.includes(option.id)
                    ? "bg-[#b38e19] text-white border-[#b38e19]"
                    : "bg-[#b38e19]/10 text-[#b38e19] border-[#b38e19] hover:bg-[#b38e19]/20"
                }
              `}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-12">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          {t("cancel")}
        </button>

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
