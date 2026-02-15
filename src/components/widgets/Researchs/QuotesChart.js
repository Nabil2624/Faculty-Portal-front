import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const GOLD = "#B38E19";
const BLUE = "#19355A";

const data = [
  { year: 2015, value: 4 },
  { year: 2016, value: 5 },
  { year: 2017, value: 6 },
  { year: 2018, value: 5 },
  { year: 2019, value: 6 },
  { year: 2020, value: 8 },
  { year: 2021, value: 7 },
  { year: 2022, value: 9 },
  { year: 2023, value: 7 },
  { year: 2024, value: 8 },
];

const MAX_VISIBLE_YEARS = 7;

export default function QuotesChart() {
  const { t } = useTranslation("QuotesChart");
  const [startIndex, setStartIndex] = useState(
    data.length - MAX_VISIBLE_YEARS
  );
  const [maxBarHeight, setMaxBarHeight] = useState(220);

  // responsive bar height
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) setMaxBarHeight(140); // mobile
      else if (window.innerWidth < 768) setMaxBarHeight(180); // tablet
      else setMaxBarHeight(220); // desktop
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const visibleData = data.slice(startIndex, startIndex + MAX_VISIBLE_YEARS);
  const maxValue = Math.max(...visibleData.map((d) => d.value));

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + MAX_VISIBLE_YEARS < data.length;

  return (
    <div
      className="
        w-full max-w-[320px] sm:max-w-[340px] md:max-w-[400px]
        rounded-xl border border-slate-300
        bg-[#EDEDED] p-4
      "
    >
      {/* Title */}
      <h3 className="text-center font-bold relative">
        {t("quotes")}
        <span className="block mx-auto mt-2 h-[3px] w-[70px] rounded bg-[#B38E19]" />
      </h3>

      {/* Chart */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {/* Older */}
        <FiChevronRight
          onClick={() => canGoPrev && setStartIndex((prev) => prev - 1)}
          className={`
            transition cursor-pointer
            text-[30px] sm:text-[28px] md:text-[26px]
            ${
              canGoPrev
                ? "text-black hover:text-[#B38E19]"
                : "text-[#D9D9D9] cursor-not-allowed"
            }
          `}
        />

        {/* Bars */}
        <div
          className="
            relative flex items-end gap-1 sm:gap-2
            h-[160px] sm:h-[220px] md:h-[300px]
            pb-1
          "
        >
          {/* Baseline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9D9D9]" />

          {visibleData.map((item, index) => {
            const isGold = index % 2 === 0;

            return (
              <div
                key={item.year}
                className="group flex flex-col items-center justify-end relative z-10"
              >
                {/* Value */}
                <span
                  className="
                    mb-1 min-w-[22px] h-[14px]
                    flex items-center justify-center
                    text-[9px] text-[#19355A]
                    bg-[#D9D9D9] rounded-md
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    pointer-events-none
                  "
                >
                  {item.value}
                </span>

                {/* Bar */}
                <div
                  className={`
                    w-[16px] sm:w-[18px] md:w-[20px]
                    rounded-md
                    ${isGold ? "bg-[#B38E19]" : "bg-[#19355A]"}
                    border-2 border-transparent
                    ${
                      isGold
                        ? "group-hover:border-[#19355A]"
                        : "group-hover:border-[#B38E19]"
                    }
                    transition-all duration-700 ease-in-out
                  `}
                  style={{
                    height: `${(item.value / maxValue) * maxBarHeight}px`,
                  }}
                />

                {/* Year */}
                <span
                  className="
                    mt-1 min-w-[30px] h-[14px]
                    flex items-center justify-center
                    text-[7px] text-[#19355A]
                    bg-[#D9D9D9] rounded-md
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    pointer-events-none
                  "
                >
                  {item.year}
                </span>
              </div>
            );
          })}
        </div>

        {/* Newer */}
        <FiChevronLeft
          onClick={() => canGoNext && setStartIndex((prev) => prev + 1)}
          className={`
            transition cursor-pointer
            text-[30px] sm:text-[28px] md:text-[26px]
            ${
              canGoNext
                ? "text-black hover:text-[#B38E19]"
                : "text-[#D9D9D9] cursor-not-allowed"
            }
          `}
        />
      </div>
    </div>
  );
}
