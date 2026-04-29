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

const ResearchSourceChart = ({ isArabic = true }) => {
  const data = [
    {
      name: isArabic ? "أبحاث دولية" : "International",
      value: 450,
      percentage: 45,
    },
    { name: isArabic ? "أبحاث محلية" : "Local", value: 350, percentage: 35 },
    {
      name: isArabic ? "مصادر أخرى" : "Other Sources",
      value: 200,
      percentage: 20,
    },
  ];

  const COLORS = ["#19355A", "#B38E19", "#94a3b8"];
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

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
      className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.1)] rounded-[2rem] border border-gray-100 overflow-hidden transition-all hover:shadow-xl flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b bg-[#19355A] border-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-white font-black text-lg">
            {isArabic
              ? "تصنيف مصادر الأبحاث"
              : "Research Source Classification"}
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Global vs Local Impact
          </p>
        </div>
        <div className="p-2 rounded-xl">
          <Globe size={20} className="text-[#B38E19]" />
        </div>
      </div>

      {/* Chart Section */}
      {/* تم تقليل الارتفاع قليلاً لترك مساحة أكبر بالأسفل */}
      <div className="h-[280px] relative mt-2 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%" /* تم رفع مركز الدائرة قليلاً للأعلى */
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              style={{ outline: "none" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
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

        {/* Total Label in the Middle */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ top: "-15%" }}
        >
          <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
            {isArabic ? "إجمالي الأبحاث" : "TOTAL RESEARCH"}
          </span>
          <span className="text-xl font-black text-[#19355A]">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stats Breakdown - تم النزول بها للأسفل مع إضافة هوامش */}
      <div className="px-6 pb-6 mt-auto grid grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-2.5 rounded-2xl flex flex-col items-center border border-gray-100 hover:border-gray-200 transition-all shadow-sm"
          >
            <span
              className="text-[12px] font-black"
              style={{ color: COLORS[index] }}
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
          Statistical Insight 2026
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSourceChart;
