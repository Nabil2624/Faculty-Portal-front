import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Globe } from "lucide-react";

const ResearchSourceChart = ({ isArabic = true, local , international , footerText }) => {
  const primary = "#19355A";
  const gold = "#B38E19";
  // const gray = "#94a3b8";

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
    },
    {
      name: isArabic ? "أبحاث محلية" : "Local",
      value: localValue,
      percentage: calculatePercentage(localValue),
      color: gold,
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: isArabic ? "right" : "left",
    direction: isArabic ? "rtl" : "ltr",
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.1)] rounded-[2rem] border border-gray-100 overflow-hidden transition-all hover:shadow-xl flex flex-col focus:outline-none select-none"
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
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              style={{ outline: "none" }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ outline: "none" }} 
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#19355A" }}
              cursor={{ fill: "transparent" }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ outline: "none", paddingBottom: "5px" }}
              formatter={(value) => (
                <span className="text-[11px] font-bold text-gray-600 px-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ top: "-10%" }}
        >
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
            className="bg-gray-50 p-2.5 rounded-2xl flex flex-col items-center border border-gray-100 hover:border-gray-200 transition-all shadow-sm"
          >
            <span
              className="text-[12px] font-black"
              style={{ color: item.color }}
            >
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
          {footerText + " " + new Date().getFullYear()}
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSourceChart;