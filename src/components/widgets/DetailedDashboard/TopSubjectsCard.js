import React from 'react';
import { BookOpen, TrendingUp, Search } from 'lucide-react';

const TopSubjectsCard = ({ title = "أكثر المواضيع بحثاً", data = [] }) => {
  const primary = '#19355A';
  const gold = '#B38E19';

  const totalResearchCount = data?.reduce((acc, curr) => acc + (curr.researchersNumber || 0), 0) || 0;
  const maxCount = data?.length > 0 ? Math.max(...data.map(item => item.researchersNumber)) : 0;

  return (
    <div dir="rtl" className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.1)] rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl focus:outline-none select-none">
      
      <div style={{ backgroundColor: primary }} className="relative px-6 py-6 overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Search size={150} className="absolute -bottom-10 -left-10 text-white" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-lg font-black leading-none">{title}</h2>
                {data?.length > 0 && (
                  <span className="bg-[#B38E19] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {data.length} مجالات
                  </span>
                )}
              </div>
              <p className="text-white/60 text-[10px] mt-1.5 font-medium uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                إجمالي مساهمات الباحثين: {totalResearchCount.toLocaleString()}
              </p>
            </div>
          </div>
          <TrendingUp size={24} className="text-[#B38E19]" />
        </div>
      </div>

      <div className="p-6 space-y-5 flex-grow overflow-y-auto"> 
        {(!data || data.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">لا توجد بيانات متاحة</p>
          </div>
        ) : (
          data.map((item, index) => {
            const percentage = maxCount > 0 ? (item.researchersNumber / maxCount) * 100 : 0;
            
            return (
              <div key={index} className="group cursor-default">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-gray-300 group-hover:text-[#B38E19] transition-colors tracking-tighter">
                       0{index + 1}
                     </span>
                     <h3 className="text-sm font-bold transition-colors" style={{ color: primary }}>
                       {item.interestName}
                     </h3>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[11px] font-black" style={{ color: gold }}>
                      {item.researchersNumber}
                      <span className="text-[9px] text-gray-400 font-medium mr-1 italic">مشاركة</span>
                    </span>
                  </div>
                </div>

                <div className="relative h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className="absolute top-0 right-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: index === 0 ? gold : primary,
                      opacity: 1 - (index * 0.12)
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 w-full h-full"></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">مجالات الاهتمام الأكثر نشاطاً</span>
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default TopSubjectsCard;