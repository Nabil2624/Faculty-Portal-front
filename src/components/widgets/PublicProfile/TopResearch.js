import React from 'react';

const TopResearch = () => {
  const researchData = [
    { id: 1, title: "تطوير أنظمة إدارة التعلم الذكية باستخدام تقنيات الذكاء الاصطناعي", year: "2025", citations: 45 },
    { id: 2, title: "أمان البيانات في السحب الحوسبية الأكاديمية: دراسة حالة على الجامعات المصرية", year: "2024", citations: 120 },
    { id: 3, title: "تحسين تجربة المستخدم في البوابات الحكومية ثنائية اللغة", year: "2024", citations: 88 }
  ];

  return (
    <div className="w-full py-6 flex justify-center px-4">
      {/* Main Container - Matched to the previous sections */}
      <div className="w-full max-w-[1150px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Section Header: Consistent Style */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-6 bg-slate-50/50 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-1.5 h-8 bg-[#B38E19] rounded-full"></div>
            <div>
              <h2 className="text-[#19355A] text-xl font-black tracking-tight leading-none uppercase">
                أفضل الأبحاث العلمية
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Top Impact Research</span>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2 border border-[#B38E19] text-[#B38E19] text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-[#B38E19] hover:text-white transition-all duration-300 shadow-sm active:scale-95">
            عرض المزيد
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Content Table Area */}
        <div className="p-2 sm:p-6">
          {/* Table Head - Desktop Only (Matched to InfoSection) */}
          <div className="hidden md:flex items-center px-6 py-3 bg-[#19355A] rounded-t-lg text-white text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex-grow text-start">عنوان البحث</div>
            <div className="w-32 text-center border-r border-white/10">السنة</div>
            <div className="w-32 text-center border-r border-white/10">الاقتباسات</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {researchData.map((item, index) => (
              <div 
                key={item.id} 
                className="group flex flex-col md:flex-row items-start md:items-center py-5 px-6 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-all duration-200"
              >
                {/* 1. Research Title with Dot Indicator */}
                <div className="flex-grow flex gap-4 items-start ml-4">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 group-hover:bg-[#B38E19] transition-colors shrink-0"></span>
                  <div className="text-start">
                    <h3 className="text-[#19355A] font-bold text-base group-hover:text-[#B38E19] transition-colors leading-relaxed">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* 2. Data Cells (Aligned to previous InfoSection) */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-4 md:mt-0 gap-0">
                  
                  {/* Year Column */}
                  <div className="md:w-32 flex flex-col md:items-center">
                     <span className="md:hidden text-[9px] text-gray-400 font-black uppercase">السنة</span>
                     <span className="text-[#19355A] font-mono font-bold text-sm bg-gray-50 md:bg-transparent px-2 py-1 md:p-0 rounded">
                       {item.year}
                     </span>
                  </div>

                  {/* Citations Column */}
                  <div className="md:w-32 flex flex-col md:items-center md:border-r border-gray-100">
                     <span className="md:hidden text-[9px] text-gray-400 font-black uppercase">الاقتباسات</span>
                     <div className="flex items-baseline gap-0.5">
                        <span className="text-[#B38E19] font-black text-xl">{item.citations}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">Ref</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-1 w-full bg-gradient-to-l from-transparent via-[#B38E19]/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default TopResearch;