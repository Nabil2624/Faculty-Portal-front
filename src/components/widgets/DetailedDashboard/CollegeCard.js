import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const CollegeCard = ({ title }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // استدعاء t للترجمة و i18n لمعرفة اللغة الحالية
  const { t, i18n } = useTranslation("admin-dashboard");

  const isRtl = i18n.language === "ar";

  const colors = {
    primary: "#19355A",
    secondary: "#B38E19",
  };

  // محاكاة جلب البيانات (يفضل أن تأتي الأسماء من السيرفر حسب اللغة)
  useEffect(() => {
    setColleges([
      { id: 1, name: isRtl ? "كلية الهندسة" : "Faculty of Engineering" },
      { id: 2, name: isRtl ? "كلية الحاسبات" : "Faculty of Computers" },
      { id: 3, name: isRtl ? "كلية التجارة" : "Faculty of Commerce" },
    ]);
  }, [isRtl]); // تحديث القائمة عند تغيير اللغة

  useEffect(() => {
    if (selectedCollegeId) {
      setLoading(true);
      setTimeout(() => {
        const mockData = [
          { id: 101, name: isRtl ? "قسم البرمجيات" : "Software Dept", count: 120 },
          { id: 102, name: isRtl ? "الذكاء الاصطناعي" : "AI Dept", count: 85 },
          { id: 103, name: isRtl ? "نظم المعلومات" : "IS Dept", count: 200 },
        ];
        setDepartments(mockData);
        setLoading(false);
      }, 500);
    }
  }, [selectedCollegeId, isRtl]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full h-full overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col transition-all duration-300"
    >
      {/* Header */}
      <div
        className="px-6 py-4 text-white font-bold text-lg shrink-0"
        style={{ backgroundColor: colors.primary }}
      >
        {title}
      </div>

      {/* Body */}
      <div className="p-6 flex-grow">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("selectCollegeLabel")}
        </label>

        <div className="relative mb-6 group">
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className={`w-full p-3 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#B38E19] focus:border-[#B38E19] block transition-all appearance-none cursor-pointer outline-none`}
            style={{ 
                borderRight: isRtl ? `4px solid ${colors.secondary}` : '1px solid #d1d5db',
                borderLeft: !isRtl ? `4px solid ${colors.secondary}` : '1px solid #d1d5db' 
            }}
          >
            <option value="">-- {t("selectOption")} --</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>

          <div className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}>
            <ChevronDown size={18} />
          </div>
        </div>

        {selectedCollegeId && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-slate-50">
              <span
                className="font-bold text-lg"
                style={{ color: colors.primary }}
              >
                {colleges.find((c) => c.id == selectedCollegeId)?.name}
              </span>
              <span
                className="px-3 py-1 text-sm font-semibold text-white rounded-full"
                style={{ backgroundColor: colors.secondary }}
              >
                {t("TotalNumber")}: {departments.length}
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-400 py-4 text-sm italic">
                  {t("loadingData")}
                </p>
              ) : (
                departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex justify-between items-center p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">
                      {dept.name}
                    </span>
                    <span
                      className="font-mono font-bold"
                      style={{ color: colors.primary }}
                    >
                      {dept.count} {t("studentUnit")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {t("statisticalInsight")} 2026
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;