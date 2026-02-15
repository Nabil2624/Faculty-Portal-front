import { useState, useEffect, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const MAX_VISIBLE_YEARS = 7;

export default function CitationsChart({ data = [], title }) {
  const { t } = useTranslation("CitationsChart");

  // Sort by year ASC
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.year - a.year)
      .map((item) => ({
        year: item.year,
        value: item.numberOfCites,
      }));
  }, [data]);

  const [startIndex, setStartIndex] = useState(
    Math.max(sortedData.length - MAX_VISIBLE_YEARS, 0),
  );

  const [maxBarHeight, setMaxBarHeight] = useState(220);

  // Responsive height
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) setMaxBarHeight(180);
      else setMaxBarHeight(220);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Update start index if data changes
  useEffect(() => {
    setStartIndex(Math.max(sortedData.length - MAX_VISIBLE_YEARS, 0));
  }, [sortedData]);

  const visibleData = sortedData.slice(
    startIndex,
    startIndex + MAX_VISIBLE_YEARS,
  );

  const maxValue =
    visibleData.length > 0 ? Math.max(...visibleData.map((d) => d.value)) : 1;

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + MAX_VISIBLE_YEARS < sortedData.length;

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] px-6 pt-6 pb-8 min-h-[360px] max-w-[365px] mt-6">
        <h4 className="text-2xl font-semibold text-center text-[#19355a]">
          {title || t("citations")}
        </h4>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No citation data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-8 min-h-[360px] max-w-[365px] mt-6">
      {/* Title */}
      <h4 className="text-2xl font-semibold text-center text-[#19355a] -translate-y-2">
        {title || t("citations")}
      </h4>
      <span className="block w-[145px] h-[5px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]" />

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center mt-10">
        <div className="flex items-center justify-center gap-2">
          {/* Older */}
          <FiChevronRight
            onClick={() => canGoPrev && setStartIndex((prev) => prev - 1)}
            className={`text-3xl cursor-pointer transition ${
              canGoPrev
                ? "text-black hover:text-[#B38E19]"
                : "text-[#D9D9D9] cursor-not-allowed"
            }`}
          />

          {/* Bars */}
          <div className="relative flex items-end gap-2 h-[220px] pb-1">
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9D9D9]" />

            {visibleData.map((item, index) => {
              const isGold = index % 2 === 0;

              return (
                <div
                  key={item.year}
                  className="group flex flex-col items-center justify-end relative z-10"
                >
                  {/* Value */}
                  <span className="mb-1 min-w-[22px] h-[14px] flex items-center justify-center text-[9px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    {item.value}
                  </span>

                  {/* Bar */}
                  <div
                    className={`w-[18px] rounded-md ${
                      isGold ? "bg-[#B38E19]" : "bg-[#19355A]"
                    } transition-all duration-700 ease-in-out`}
                    style={{
                      height: `${(item.value / maxValue) * maxBarHeight}px`,
                    }}
                  />

                  {/* Year */}
                  <span className="mt-1 min-w-[30px] h-[14px] flex items-center justify-center text-[7px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Newer */}
          <FiChevronLeft
            onClick={() => canGoNext && setStartIndex((prev) => prev + 1)}
            className={`text-3xl cursor-pointer transition ${
              canGoNext
                ? "text-black hover:text-[#B38E19]"
                : "text-[#D9D9D9] cursor-not-allowed"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
