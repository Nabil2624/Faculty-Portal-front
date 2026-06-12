import React from 'react';

const InfoSection = ({ title, data = [], showCitations = false, buttonText = "عرض المزيد" }) => {
  return (
    <div className="w-full py-6 flex justify-center px-4">
      {/* Main Container - Matches the width of the ID Card */}
      <div className="w-full max-w-[1150px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Section Header: Styled as a Tab/File Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-6 bg-slate-50/50 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-1.5 h-8 bg-[#B38E19] rounded-full"></div>
            <div>
              <h2 className="text-[#19355A] text-xl font-black tracking-tight leading-none uppercase">
                {title}
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Official Records</span>
            </div>
          </div>
          
          {buttonText && (
            <button className="flex items-center gap-2 px-5 py-2 border border-[#B38E19] text-[#B38E19] text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-[#B38E19] hover:text-white transition-all duration-300 shadow-sm active:scale-95">
              {buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Content Table Area */}
        <div className="p-2 sm:p-6">
          {/* Table Head - Desktop Only */}
          <div className="hidden md:flex items-center px-6 py-3 bg-[#19355A] rounded-t-lg text-white text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex-grow text-start">Description & Details</div>
            <div className="w-32 text-center border-r border-white/10">Date / Year</div>
            {showCitations && <div className="w-32 text-center border-r border-white/10">Citations</div>}
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {data.map((item, index) => (
              <div 
                key={index} 
                className="group flex flex-col md:flex-row items-start md:items-center py-5 px-6 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-all duration-200"
              >
                {/* 1. Title & Subtitle with Badge effect */}
                <div className="flex-grow flex gap-4 items-start">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 group-hover:bg-[#B38E19] transition-colors shrink-0"></span>
                  <div className="text-start">
                    <h3 className="text-[#19355A] font-bold text-base group-hover:text-[#B38E19] transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="inline-flex items-center mt-1 px-2 py-0.5 bg-gray-100 rounded text-[11px] text-gray-500 font-medium">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Data Cells */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-4 md:mt-0">
                  
                  {/* Date Column */}
                  <div className="md:w-32 flex flex-col md:items-center">
                     <span className="md:hidden text-[9px] text-gray-400 font-black uppercase">Date</span>
                     <span className="text-[#19355A] font-mono font-bold text-sm bg-gray-50 md:bg-transparent px-2 py-1 md:p-0 rounded">
                       {item.date || item.year}
                     </span>
                  </div>

                  {/* Citations Column (Optional) */}
                  {showCitations && (
                    <div className="md:w-32 flex flex-col md:items-center md:border-r border-gray-100">
                       <span className="md:hidden text-[9px] text-gray-400 font-black uppercase">Citations</span>
                       <div className="flex items-baseline gap-0.5">
                          <span className="text-[#B38E19] font-black text-xl">{item.citations}</span>
                          <span className="text-[8px] text-gray-400 font-bold uppercase">Ref</span>
                       </div>
                    </div>
                  )}
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

export default InfoSection;