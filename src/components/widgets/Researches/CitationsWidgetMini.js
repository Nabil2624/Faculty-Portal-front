import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function CitationsWidgetMini({ data = [], stats = {} }) {
  const { t, i18n } = useTranslation("ResearcherProfile");
  const isArabic = i18n.language === "ar";

  const maxVisible = 8;
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  const [startIndex, setStartIndex] = useState(
    Math.max(0, sortedData.length - maxVisible),
  );

  const visibleData = sortedData.slice(startIndex, startIndex + maxVisible);
  const maxValue = Math.max(...visibleData.map((d) => d.noOfCitations || 0), 1);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + maxVisible < sortedData.length;

  const handleMoveRight = () => {
    if (isArabic) {
      if (canGoPrev) setStartIndex((p) => p - 1);
    } else {
      if (canGoNext) setStartIndex((p) => p + 1);
    }
  };

  const handleMoveLeft = () => {
    if (isArabic) {
      if (canGoNext) setStartIndex((p) => p + 1);
    } else {
      if (canGoPrev) setStartIndex((p) => p - 1);
    }
  };

  const iconStyle = {
    width: "clamp(16px, 1.5vw, 24px)",
    height: "clamp(16px, 1.5vw, 24px)",
  };
  const currentYear = new Date().getFullYear();
  const sinceYear = currentYear - 5;
  return (
    <div className="flex flex-col items-end w-full mt-4">
      {/* 1. الجدول فوق الجراف مباشرة بلون أسود وكلامب */}
      <div
        className="w-full mb-6 overflow-hidden"
        style={{ maxWidth: "clamp(280px, 30vw, 450px)" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="text-gray-400 uppercase tracking-widest"
              style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
            >
              <th
                className={`pb-2 font-bold ${isArabic ? "text-right" : "text-left"}`}
              ></th>
              <th className="pb-2 text-center font-black">
                {t("all") || (isArabic ? "الكل" : "All")}
              </th>
              <th className="pb-2 text-center font-black">
                {isArabic ? `منذ ${sinceYear}` : `Since ${sinceYear}`}
              </th>
            </tr>
          </thead>
          <tbody className="text-[#000000]">
            {" "}
            {/* اللون الأسود المطلوب */}
            {[
              {
                label: isArabic ? "اقتباسات" : "Citations",
                val: stats.totalCitations,
                val5y: stats.citations5y,
              },
              { label: "h-index", val: stats.hIndex, val5y: stats.hIndex5y },
              {
                label: "i10-index",
                val: stats.i10Index,
                val5y: stats.i10Index5y,
              },
            ].map((row, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td
                  className={`py-2 font-semibold ${isArabic ? "text-right" : "text-left"}`}
                  style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
                >
                  {row.label}
                </td>
                <td
                  className="py-2 text-center font-bold"
                  style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
                >
                  {row.val || 0}
                </td>
                <td
                  className="py-2 text-center font-bold"
                  style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
                >
                  {row.val5y || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. منطقة الرسم البياني */}
      <div className="flex flex-col items-end w-full">
        <div
          className="flex items-center justify-end w-full"
          style={{ gap: "clamp(0.5rem, 1vw, 1.5rem)" }}
        >
          <button
            onClick={handleMoveLeft}
            className={`p-1.5 transition-all ${(isArabic ? canGoNext : canGoPrev) ? "text-[#19355A]" : "text-gray-300"}`}
          >
            {isArabic ? (
              <FiChevronRight style={iconStyle} />
            ) : (
              <FiChevronLeft style={iconStyle} />
            )}
          </button>

          <div
            className="flex items-end border-b border-gray-200 pb-1"
            style={{
              height: "clamp(100px, 10vw, 150px)",
              gap: "clamp(4px, 0.7vw, 8px)",
              direction: "ltr",
            }}
          >
            {visibleData.map((item, index) => {
              const isGold = index % 2 === 0;
              const barHeight = (item.noOfCitations / maxValue) * 100;

              return (
                <div
                  key={item.year}
                  className="group flex flex-col items-center justify-end h-full"
                >
                  <span
                    className="font-bold text-[#19355A] opacity-0 group-hover:opacity-100 transition-opacity mb-1"
                    style={{ fontSize: "clamp(8px, 0.6vw, 10px)" }}
                  >
                    {item.noOfCitations}
                  </span>
                  <div
                    className={`rounded-t-sm transition-all duration-500 ${isGold ? "bg-[#B38E19]" : "bg-[#19355A]"}`}
                    style={{
                      width: "clamp(12px, 1.5vw, 22px)",
                      height: `${barHeight}%`,
                      minHeight: item.noOfCitations > 0 ? "4px" : "1px",
                    }}
                  />
                  <span
                    className="text-gray-500 font-bold mt-1"
                    style={{ fontSize: "clamp(8px, 0.5vw, 9px)" }}
                  >
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleMoveRight}
            className={`p-1.5 transition-all ${(isArabic ? canGoPrev : canGoNext) ? "text-[#19355A]" : "text-gray-300"}`}
          >
            {isArabic ? (
              <FiChevronLeft style={iconStyle} />
            ) : (
              <FiChevronRight style={iconStyle} />
            )}
          </button>
        </div>

        {/* ليبل الرسم البياني */}
        <div
          className={`flex items-center gap-2 mt-3 ${isArabic ? "ml-6" : "mr-6"}`}
        >
          <span
            className="rounded-full bg-[#B38E19]"
            style={{ width: "6px", height: "6px" }}
          ></span>
          <p
            className="uppercase tracking-widest text-gray-400 font-black"
            style={{ fontSize: "clamp(8px, 0.7vw, 10px)" }}
          >
            {isArabic ? "الاقتباسات لكل سنة" : "Citations per year"}
          </p>
        </div>
      </div>
    </div>
  );
}
