import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector
} from "recharts";
import { Globe } from "lucide-react";

const ResearchSourceChart = ({ isArabic = true, local, international, footerText }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const primary = "#19355A";
  const gold = "#B38E19";
  // الألوان عند الـ Hover (درجات أفتح قليلاً)
  const primaryHover = "#254d82";
  const goldHover = "#d4aa24";

  const localValue = local || 0;
  const internationalValue = international || 0;
  const total = localValue + internationalValue;

  const calculatePercentage = (value) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const chartData = [
    {
      name: isArabic ? "أبحاث دولية" : "International",
      value: internationalValue,
      percentage: calculatePercentage(internationalValue),
      color: primary,
      hoverColor: primaryHover,
    },
    {
      name: isArabic ? "أبحاث محلية" : "Local",
      value: localValue,
      percentage: calculatePercentage(localValue),
      color: gold,
      hoverColor: goldHover,
    },
  ];

  // دالة لرسم الجزء النشط بتأثير التكبير
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8} // زيادة القطر الخارجي للتكبير
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.2))" }}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white p-3 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-1 min-w-[120px]"
          style={{ direction: isArabic ? "rtl" : "ltr", zIndex: 9999 }}
        >
          <span className="text-[#19355A] font-bold text-xs">{payload[0].name}</span>
          <span className="text-[#B38E19] font-black text-sm">
            {payload[0].value.toLocaleString()} 
            <span className="text-[10px] text-gray-400 mr-1 ml-1">
              ({payload[0].payload.percentage}%)
            </span>
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.1)] rounded-[2rem] border border-gray-100 overflow-hidden transition-shadow hover:shadow-xl flex flex-col focus:outline-none select-none"
    >
      <div className="px-6 py-5 border-b bg-[#19355A] border-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-white font-black text-lg">
            {isArabic ? "تصنيف مصادر الأبحاث" : "Research Source Classification"}
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Global vs Local Impact
          </p>
        </div>
        <div className="p-2 rounded-xl">
          <Globe size={20} className="text-[#B38E19]" />
        </div>
      </div>

      <div className="h-[280px] relative mt-2 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              style={{ outline: "none", cursor: "pointer" }}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeIndex === index ? entry.hoverColor : entry.color} 
                  style={{ outline: "none", transition: "fill 0.3s ease" }} 
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1000 }} />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-[11px] font-bold text-gray-600 px-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: "-10%" }}>
          <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
            {isArabic ? "إجمالي الأبحاث" : "TOTAL RESEARCH"}
          </span>
          <span className="text-xl font-black text-[#19355A]">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div
            key={index}
            className={`p-2.5 rounded-2xl flex flex-col items-center border transition-all shadow-sm ${
              activeIndex === index ? "bg-white border-[#B38E19] scale-105" : "bg-gray-50 border-gray-100"
            }`}
          >
            <span className="text-[12px] font-black" style={{ color: item.color }}>
              {item.percentage}%
            </span>
            <span className="text-[9px] text-gray-400 font-bold truncate w-full text-center mt-0.5">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {footerText} {new Date().getFullYear()}
        </span>
        <div className="flex gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === 1 ? "bg-[#B38E19]" : "bg-gray-200"}`}></div>
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === 0 ? "bg-[#19355A]" : "bg-gray-200"}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSourceChart;