import React, { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Award, Star, ChevronDown, Globe } from "lucide-react";
import { useFaculties } from "../../../hooks/useFaculties";
import { useTopResearchers } from "../../../hooks/useTopResearchers";

const TopResearchersCard = ({
  title = "أفضل الباحثين بالكلية",
  footerText,
  noData,
  subTitle
}) => {
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { faculties, loading: facultiesLoading } = useFaculties();
  const {
    data: researchers,
    loading,
    fetchTopResearchers,
  } = useTopResearchers();

  const primary = "#19355A";
  const gold = "#B38E19";

  useEffect(() => {
    if (faculties.length > 0 && !selectedCollegeId) {
      setSelectedCollegeId(faculties[0].id);
    }
  }, [faculties, selectedCollegeId]);

  useEffect(() => {
    if (selectedCollegeId) {
      fetchTopResearchers(selectedCollegeId);
    }
  }, [selectedCollegeId, fetchTopResearchers]);

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
    setSelectedCollegeId(id);
    setOpen(false);
  };

  const getRankStyle = (index) => {
    if (index === 0)
      return {
        borderColor: gold,
        bg: "bg-gradient-to-l from-[#B38E19]/10 to-transparent",
        icon: <Trophy size={18} className="text-[#B38E19] animate-bounce" />,
      };
    if (index === 1)
      return {
        borderColor: "#94a3b8",
        bg: "bg-slate-50",
        icon: <Medal size={18} className="text-slate-400" />,
      };
    if (index === 2)
      return {
        borderColor: "#cd7f32",
        bg: "bg-orange-50/20",
        icon: <Award size={18} className="text-orange-700" />,
      };
    return { borderColor: "transparent", bg: "bg-white", icon: null };
  };

  return (
    <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.15)] rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col transition-all duration-500">
      {/* Header Section */}
      <div
        style={{ backgroundColor: primary }}
        className="relative px-5 py-5 text-center overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <h2 className="text-white text-lg font-black flex justify-center items-center gap-2 relative z-10">
          <Star size={18} fill={gold} color={gold} className="animate-pulse" />
          {title}
        </h2>
        <p className="text-blue-100/60 text-[10px] font-medium relative z-10 uppercase tracking-widest">
          {subTitle}
        </p>
      </div>

      <div className="py-[1.3rem] px-4 bg-gray-50/50 flex-grow">
        {/* Dropdown Section */}
        <div className="relative mb-4" ref={dropdownRef}>
          {facultiesLoading ? (
            <div className="w-full h-[46px] bg-white animate-pulse rounded-xl border border-gray-100"></div>
          ) : (
            <div
              onClick={() => setOpen(!open)}
              className="w-full py-2 px-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:border-[#B38E19]/30 transition-colors"
              style={{ borderRight: `4px solid ${gold}` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-[#19355A]">
                  {faculties.find((c) => c.id === selectedCollegeId)?.name ||
                    "اختر الكلية"}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-[#B38E19] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </div>
          )}

          {open && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
              {faculties.map((col) => (
                <div
                  key={col.id}
                  onClick={() => handleSelect(col.id)}
                  className={`p-3 text-[11px] font-bold cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCollegeId == col.id
                      ? "bg-gray-100 text-[#B38E19]"
                      : "text-[#19355A]"
                  }`}
                >
                  {col.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content (Researchers Podium) */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: gold }}
            ></div>
          </div>
        ) : researchers && researchers.length > 0 ? (
          <div className="space-y-2.5">
            {researchers.map((res, index) => {
              const podium = getRankStyle(index);
              const isTopThree = index < 3;

              return (
                <div
                  key={res.id || index}
                  className={`relative flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 
                    ${isTopThree ? podium?.bg + " scale-[1.02] shadow-md z-10 hover:scale-[1.04]" : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm"}`}
                  style={{ borderColor: podium?.borderColor || "transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] bg-white"
                      style={{
                        color:
                          index === 0
                            ? gold
                            : index === 1
                              ? "#94a3b8"
                              : index === 2
                                ? "#cd7f32"
                                : "#d1d5db",
                      }}
                    >
                      {podium.icon ? podium.icon : index + 1}
                    </div>

                    <div>
                      <h3
                        className={`font-bold leading-tight ${index === 0 ? "text-sm" : "text-xs"}`}
                        style={{ color: primary }}
                      >
                        {res.researcherName || res.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold tracking-tight">
                        {res.departmentName || res.dept || "Faculty Member"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-center px-3 border-l border-gray-100">
                      <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest">
                        Papers
                      </p>
                      <p className="text-xs font-bold text-[#19355A]">
                        {res.totalResearchesNo || 0}
                      </p>
                    </div>
                    <div className="min-w-[55px] py-1.5 px-2 rounded-xl bg-white shadow-inner flex flex-col items-center border border-gray-50">
                      <p className="text-[8px] font-black text-gray-400">
                        SCORE
                      </p>
                      <span
                        className="text-sm font-black"
                        style={{ color: isTopThree ? gold : primary }}
                      >
                        {res.score * 100 || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-14 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
            <Globe size={24} className="text-gray-200 mx-auto mb-3" />
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              {noData}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {footerText + " " + new Date().getFullYear()}
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default TopResearchersCard;
