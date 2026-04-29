import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFaculties } from "../../../hooks/useFaculties";

const CollegeCard = ({
  title,
  onSelectionChange,
  subData = [], // البيانات المتوقع وصولها بصيغة الباك اند الجديد
  labels = {
    selectLabel: "اختر الكلية",
    totalLabel: "الإجمالي",
    loadingText: "جاري التحميل...",
    unitText: "بحث",
    footerText: "إحصائيات 2026",
  },
}) => {
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { faculties, loading } = useFaculties();

  const colors = {
    primary: "#19355A",
    secondary: "#B38E19",
  };

  useEffect(() => {
    if (faculties.length > 0 && !selectedId) {
      const firstId = faculties[0].id;
      setSelectedId(firstId);
      if (onSelectionChange) onSelectionChange(firstId);
    }
  }, [faculties, selectedId, onSelectionChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    setOpen(false);
    if (onSelectionChange) onSelectionChange(id);
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full h-full overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 select-none"
    >
      {/* Header */}
      <div
        className="px-6 py-4 text-white font-black text-lg shrink-0"
        style={{ backgroundColor: colors.primary }}
      >
        {title}
      </div>

      {/* Body */}
      <div className="p-6 flex-grow">
        <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {labels.selectLabel}
        </label>

        {/* Dropdown */}
        <div className="relative mb-6" ref={dropdownRef}>
          {loading ? (
            <div className="w-full h-[40px] bg-gray-50 animate-pulse rounded-xl"></div>
          ) : (
            <>
              <div
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-xs rounded-xl cursor-pointer font-bold transition-all shadow-sm hover:border-[#B38E19]/30 h-[42px]"
                style={{ borderRight: isArabic ? `4px solid ${colors.secondary}` : "", borderLeft: !isArabic ? `4px solid ${colors.secondary}` : "" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="truncate max-w-[150px]">
                    {faculties.find((c) => c.id == selectedId)?.name || "اختر الكلية"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#B38E19] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </div>

              {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {faculties.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`p-3 text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedId == item.id ? "bg-gray-100 text-[#B38E19]" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Data Section */}
        {selectedId && !loading && (
          <div className="animate-in fade-in duration-500">
            <div
              className="flex items-center justify-between mb-4 p-3 rounded-lg bg-slate-50 border-s-4"
              style={{ borderColor: colors.primary }}
            >
              <span className="font-black text-[11px] truncate" style={{ color: colors.primary }}>
                {faculties.find((c) => c.id == selectedId)?.name}
              </span>

              <span
                className="px-3 py-1 text-[10px] font-black text-white rounded-full whitespace-nowrap"
                style={{ backgroundColor: colors.secondary }}
              >
                {labels.totalLabel}: {subData.length}
              </span>
            </div>

            <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar px-1">
              {subData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                    <Globe size={32} />
                    <p className="text-[10px] font-bold mt-2 uppercase tracking-tighter">لا توجد بيانات متاحة</p>
                </div>
              ) : (
                subData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-600 text-[11px] font-bold group-hover:text-[#19355A] transition-colors">
                      {/* عرض اسم القسم بناءً على اللغة */}
                      {isArabic ? item.departmentNameAR : item.departmentNameEN}
                    </span>

                    <div className="flex items-center gap-1">
                      <span
                        className="font-mono font-black text-sm"
                        style={{ color: colors.primary }}
                      >
                        {item.researchesNo || 0}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold">
                        {labels.unitText}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          {labels.footerText}
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