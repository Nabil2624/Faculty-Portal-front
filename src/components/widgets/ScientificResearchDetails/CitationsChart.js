import { useState, useEffect, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const MAX_VISIBLE_YEARS = 7;

export default function CitationsChart({ data = [], title }) {
  const { t } = useTranslation("CitationsChart");
  const isArabic = useTranslation().i18n.language === "ar";

  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.year - b.year)
      .map((item) => ({
        year: item.year,
        value: item.numberOfCites,
      }));
  }, [data]);

  const [startIndex, setStartIndex] = useState(
    Math.max(sortedData.length - MAX_VISIBLE_YEARS, 0),
  );

  // تقليل الارتفاع الافتراضي للموبايل
  const [maxBarHeight, setMaxBarHeight] = useState(100);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) setMaxBarHeight(80); // ارتفاع أقل للموبايل لضمان عدم التداخل
      else setMaxBarHeight(140);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const visibleData = sortedData.slice(startIndex, startIndex + MAX_VISIBLE_YEARS);
  const maxValue = visibleData.length > 0 ? Math.max(...visibleData.map((d) => d.value)) : 1;
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + MAX_VISIBLE_YEARS < sortedData.length;

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col bg-white" style={{ isolation: 'isolate' }}>
      <div className="flex items-center justify-between mb-4 bg-white py-2">
        <h4 className="text-[#19355A] font-black text-[10px] md:text-sm uppercase tracking-widest shrink-0">
          {title || t("citations")}
        </h4>
        <div className="flex gap-2 ml-2">
          <button 
            onClick={() => canGoPrev && setStartIndex(prev => prev - 1)}
            className={`p-1 rounded-md border ${canGoPrev ? "border-[#B38E19] text-[#B38E19]" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
          >
            {isArabic ? <FiChevronRight size={12}/> : <FiChevronLeft size={12}/>}
          </button>
          <button 
            onClick={() => canGoNext && setStartIndex(prev => prev + 1)}
            className={`p-1 rounded-md border ${canGoNext ? "border-[#B38E19] text-[#B38E19]" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
          >
            {isArabic ? <FiChevronLeft size={12}/> : <FiChevronRight size={12}/>}
          </button>
        </div>
      </div>

      {/* 2. حاوية الرسم البياني: أضفنا overflow-hidden هنا */}
      <div className="relative flex-1 flex items-end justify-between gap-1 md:gap-2 px-1 pb-8 min-h-[120px] overflow-hidden">
        {/* خط القاعدة */}
        <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-gray-100 -z-10" />
        
        {visibleData.map((item, index) => (
          <div key={item.year} className="group flex flex-col items-center flex-1 relative">
            {/* الرقم فوق العمود - جعلناه يختفي لو خرج عن المساحة */}
            <span className="mb-1 text-[9px] font-bold text-[#19355A] opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full">
              {item.value}
            </span>
            
            <div
              className={`w-full max-w-[18px] md:max-w-[25px] rounded-t-sm transition-all duration-500 ${
                index % 2 === 0 ? "bg-[#B38E19]" : "bg-[#19355A]"
              }`}
              style={{ 
                height: `${(item.value / maxValue) * maxBarHeight}px`,
                maxHeight: '100%' // يمنع العمود من تجاوز حاويته
              }}
            />
            
            <span className="absolute -bottom-6 text-[8px] md:text-[9px] font-black text-gray-400">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}