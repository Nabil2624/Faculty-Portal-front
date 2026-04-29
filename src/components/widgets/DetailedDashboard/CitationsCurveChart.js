import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const CitationsCurveChart = ({ data = [] }) => {
  const primary = "#19355A";
  const gold = "#B38E19";
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const visibleData = data?.slice(startIndex, startIndex + itemsPerPage) || [];
  const totalCitations = data?.reduce((acc, curr) => acc + (curr.totalCites || 0), 0) || 0;

  const handleNext = () => {
    if (startIndex + itemsPerPage < data.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.15)] rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col transition-all duration-500 focus:outline-none select-none">
      
      {/* تم إضافة ستايل عام هنا لإلغاء الـ outline من أي عنصر داخل الـ SVG */}
      <style>
        {`
          .recharts-curve, .recharts-active-dot, .recharts-surface, .recharts-wrapper {
            outline: none !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent;
          }
          path:focus {
            outline: none !important;
          }
        `}
      </style>

      <div style={{ backgroundColor: primary }} className="px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        <div className={`flex items-center justify-between relative z-10`}>
          <div className={`flex items-center gap-3`}>
            <div className="p-2 bg-white/10 rounded-lg">
              <Quote size={20} className="text-[#B38E19]" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black tracking-wide">
                {isArabic ? "معدل الاقتباسات السنوي" : "Annual Citations Rate"}
              </h2>
              <p className="text-blue-100/50 text-[13px] font-bold uppercase tracking-widest">
                {isArabic ? "الاقتباسات لكل سنة" : "Citations per year"}
              </p>
              <p className="text-[#B38E19] text-[12px] font-black uppercase tracking-widest">
                {isArabic ? `إجمالي عدد الاقتباسات ${totalCitations}` : `Total Citations ${totalCitations}`}
              </p>
            </div>
          </div>

          <div className={`flex gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`p-1.5 rounded-lg bg-white/5 text-white transition-colors border border-white/10 outline-none focus:outline-none ${startIndex === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20"}`}
            >
              {isArabic ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= data.length}
              className={`p-1.5 rounded-lg bg-white/5 text-white transition-colors border border-white/10 outline-none focus:outline-none ${startIndex + itemsPerPage >= data.length ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20"}`}
            >
              {isArabic ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow p-6 bg-gray-50/30">
        <div className="h-full min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visibleData}
              margin={{ top: 10, right: isArabic ? 40 : 10, left: isArabic ? 10 : 40, bottom: 20 }}
              accessibilityLayer={false}
            >
              <defs>
                <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                reversed={isArabic}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickMargin={15} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                orientation={isArabic ? "right" : "left"}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "15px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  direction: isArabic ? "rtl" : "ltr",
                  textAlign: isArabic ? "right" : "left",
                  outline: "none",
                }}
                labelStyle={{ fontWeight: "bold", color: primary }}
                itemStyle={{ color: gold, fontWeight: "bold", outline: 'none' }}
                cursor={{ stroke: '#f0f0f0', strokeWidth: 1 }}
                wrapperStyle={{ outline: 'none' }}
                formatter={(value) => [value, isArabic ? "عدد الاقتباسات" : "Citations"]}
              />
              <Area
                type="monotone"
                dataKey="totalCites"
                stroke={gold}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCitations)"
                animationDuration={1500}
                activeDot={{ 
                  r: 6, 
                  stroke: primary, 
                  strokeWidth: 2, 
                  fill: gold,
                  style: { outline: 'none', boxShadow: 'none' },
                  tabIndex: -1
                }}
                // الحل النهائي: منع الـ focus تماماً على عنصر الـ Area
                style={{ outline: 'none', pointerEvents: 'auto' }}
                isAnimationActive={true}
                tabIndex="-1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {isArabic
              ? `عرض السنوات ${visibleData[0]?.year || ""} - ${visibleData[visibleData.length - 1]?.year || ""}`
              : `Viewing years ${visibleData[0]?.year || ""} - ${visibleData[visibleData.length - 1]?.year || ""}`}
          </span>
        </div>
        <div className="flex gap-1">
          {[...Array(Math.ceil(data.length / itemsPerPage))].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${Math.floor(startIndex / itemsPerPage) === i ? "bg-[#B38E19]" : "bg-gray-200"}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitationsCurveChart;