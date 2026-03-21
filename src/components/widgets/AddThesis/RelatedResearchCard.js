import React from "react";
import { X, Search, BookOpen } from "lucide-react";

export default function RelatedResearchCard({
  t,
  researches = [],
  searchTerm,
  setSearchTerm,
  searchResults = [],
  addSelectedResearch,
  removeResearch,
}) {
  return (
    <div className="flex flex-col gap-[clamp(1rem,1.5vw,2rem)] p-[clamp(1rem,1.2vw,2rem)] bg-white border border-gray-100 rounded-[clamp(1rem,1.5vw,2rem)] shadow-sm">
      
      {/* Header مع أيقونة */}
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <BookOpen className="text-[#B38E19]" size={22} />
        <h4 className="font-bold text-gray-800 text-[clamp(1rem,1.2vw,1.4rem)]">
          {t("relatedResearch")}
        </h4>
      </div>

      {/* حقل البحث بتصميم الـ Input الجديد */}
      <div className="relative group">
        
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-[#B38E19] transition-colors" size={18} />
          </div>
          
          <input
            type="text"
            className="w-full h-[clamp(45px,3.5vw,55px)] bg-gray-50 border border-gray-200 rounded-xl ps-11 pe-4 text-sm outline-none focus:border-[#B38E19] focus:bg-white focus:ring-4 focus:ring-[#B38E19]/5 transition-all placeholder:text-gray-400 shadow-sm"
            placeholder={t("researchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* نتائج البحث المنسدلة (Dropdown) */}
        {searchResults.length > 0 && (
          <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-[220px] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="p-3.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 transition-colors flex items-center gap-2"
                onClick={() => addSelectedResearch(item)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]" />
                <span className="truncate">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* قائمة الأبحاث المختارة */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
        {researches.map((research, index) => (
            <div
              key={research.id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl group hover:border-[#B38E19]/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 text-[#B38E19] text-xs font-bold rounded-full shadow-sm">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600 truncate font-medium">
                  {research.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeResearch(research.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}