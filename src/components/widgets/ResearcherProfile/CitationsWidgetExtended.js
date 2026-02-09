// import { useState, useEffect } from "react";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { useTranslation } from "react-i18next";

// const GOLD = "#B38E19";
// const BLUE = "#19355A";

// // Example data
// const dataExtended = [
//   { year: 2010, value: 2 },
//   { year: 2011, value: 3 },
//   { year: 2012, value: 4 },
//   { year: 2013, value: 5 },
//   { year: 2014, value: 3 },
//   { year: 2015, value: 4 },
//   { year: 2016, value: 5 },
//   { year: 2017, value: 6 },
//   { year: 2018, value: 5 },
//   { year: 2019, value: 6 },
//   { year: 2020, value: 8 },
//   { year: 2021, value: 7 },
//   { year: 2022, value: 9 },
//   { year: 2023, value: 7 },
//   { year: 2024, value: 8 },
//   { year: 2025, value: 8 },
//   { year: 2026, value: 8 },
//   { year: 2027, value: 8 },
// ];

// export default function CitationsWidgetExtended() {
//   const { t } = useTranslation("CitationsChart");

//   const [startIndex, setStartIndex] = useState(0);
//   const [maxBarHeight, setMaxBarHeight] = useState(220);
//   const [maxVisibleYears, setMaxVisibleYears] = useState(15);

//   useEffect(() => {
//     const updateLayout = () => {
//       if (window.innerWidth < 640) {
//         setMaxVisibleYears(6);
//         setMaxBarHeight(180);
//       } else if (window.innerWidth < 1024) {
//         setMaxVisibleYears(10);
//         setMaxBarHeight(200);
//       } else {
//         setMaxVisibleYears(15);
//         setMaxBarHeight(220);
//       }
//     };

//     updateLayout();
//     window.addEventListener("resize", updateLayout);
//     return () => window.removeEventListener("resize", updateLayout);
//   }, []);

//   const visibleData = dataExtended.slice(
//     startIndex,
//     startIndex + maxVisibleYears,
//   );

//   const maxValue = Math.max(...visibleData.map((d) => d.value));

//   const canGoPrev = startIndex > 0;
//   const canGoNext = startIndex + maxVisibleYears < dataExtended.length;

//   return (
//     <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-8 min-h-[360px] max-w-[680px] mt-6">
//       <h4 className="text-2xl font-semibold text-center text-[#19355a] -translate-y-2">
//         {t("citationsperyear")}
//       </h4>
//       <span className="block w-[145px] h-[5px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]" />

//       <div className="flex-1 flex items-center justify-center mt-10" dir="ltr">
//         <div className="flex items-center justify-center gap-2">
//           {/* Left */}
//           <FiChevronLeft
//             onClick={() => canGoPrev && setStartIndex((p) => p - 1)}
//             className={`text-3xl transition ${
//               canGoPrev
//                 ? "cursor-pointer text-black hover:text-[#B38E19]"
//                 : "text-[#D9D9D9] cursor-not-allowed"
//             }`}
//           />

//           {/* Bars */}
//           <div className="relative flex items-end gap-2 h-[220px] pb-1">
//             <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9D9D9]" />

//             {visibleData.map((item, index) => {
//               const isGold = index % 2 === 0;
//               return (
//                 <div
//                   key={item.year}
//                   className="group flex flex-col items-center justify-end relative z-10"
//                 >
//                   <span className="mb-1 min-w-[22px] h-[14px] flex items-center justify-center text-[9px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition">
//                     {item.value}
//                   </span>

//                   <div
//                     className={`w-[18px] rounded-md ${
//                       isGold ? "bg-[#B38E19]" : "bg-[#19355A]"
//                     } transition-all duration-700`}
//                     style={{
//                       height: `${(item.value / maxValue) * maxBarHeight}px`,
//                     }}
//                   />

//                   <span className="mt-1 min-w-[30px] h-[14px] flex items-center justify-center text-[7px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition">
//                     {item.year}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right */}
//           <FiChevronRight
//             onClick={() => canGoNext && setStartIndex((p) => p + 1)}
//             className={`text-3xl transition ${
//               canGoNext
//                 ? "cursor-pointer text-black hover:text-[#B38E19]"
//                 : "text-[#D9D9D9] cursor-not-allowed"
//             }`}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const GOLD = "#B38E19";
const BLUE = "#19355A";

export default function CitationsWidgetExtended({ data = [] }) {
  const { t } = useTranslation("CitationsChart");

  const [startIndex, setStartIndex] = useState(0);
  const [maxBarHeight, setMaxBarHeight] = useState(220);
  const [maxVisibleYears, setMaxVisibleYears] = useState(15);

  // Update layout based on screen width
  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 640) {
        setMaxVisibleYears(6);
        setMaxBarHeight(180);
      } else if (window.innerWidth < 1024) {
        setMaxVisibleYears(10);
        setMaxBarHeight(200);
      } else {
        setMaxVisibleYears(15);
        setMaxBarHeight(220);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Sort data by year ascending
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  const visibleData = sortedData.slice(
    startIndex,
    startIndex + maxVisibleYears,
  );

  const maxValue = Math.max(...visibleData.map((d) => d.noOfCitations || 0));

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + maxVisibleYears < sortedData.length;

  return (
    <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-8 min-h-[360px] max-w-[680px] mt-6">
      <h4 className="text-2xl font-semibold text-center text-[#19355a] -translate-y-2">
        {t("citationsperyear")}
      </h4>
      <span className="block w-[145px] h-[5px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]" />

      <div className="flex-1 flex items-center justify-center mt-10" dir="ltr">
        <div className="flex items-center justify-center gap-2">
          {/* Left Arrow */}
          <FiChevronLeft
            onClick={() => canGoPrev && setStartIndex((p) => p - 1)}
            className={`text-3xl transition ${
              canGoPrev
                ? "cursor-pointer text-black hover:text-[#B38E19]"
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
                  <span className="mb-1 min-w-[22px] h-[14px] flex items-center justify-center text-[9px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition">
                    {item.noOfCitations}
                  </span>

                  <div
                    className={`w-[18px] rounded-md ${
                      isGold ? "bg-[#B38E19]" : "bg-[#19355A]"
                    } transition-all duration-700`}
                    style={{
                      height: maxValue
                        ? `${(item.noOfCitations / maxValue) * maxBarHeight}px`
                        : "0px",
                    }}
                  />

                  <span className="mt-1 min-w-[30px] h-[14px] flex items-center justify-center text-[7px] text-[#19355A] bg-[#D9D9D9] rounded-md opacity-0 group-hover:opacity-100 transition">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <FiChevronRight
            onClick={() => canGoNext && setStartIndex((p) => p + 1)}
            className={`text-3xl transition ${
              canGoNext
                ? "cursor-pointer text-black hover:text-[#B38E19]"
                : "text-[#D9D9D9] cursor-not-allowed"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
