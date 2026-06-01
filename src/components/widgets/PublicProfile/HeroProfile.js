import React from 'react';
import profImg from "../../../assets/prof.jpg";

const HeroProfile = () => {
  const interests = [
    "هندسة البرمجيات المتقدمة", "نظم الـ ERP الجامعية", "تصميم Glassmorphism",
    "الربط المباشر (SignalR)", "واجهات UX/UI احترافية", "تطوير الأنظمة ثنائية اللغة"
  ];

  return (
    <div className="w-full py-8 px-6 flex justify-center">
      {/* ID Card Container - Optimized Width */}
      <div className="relative w-full max-w-[1150px] bg-white rounded-2xl shadow-xl overflow-hidden border-t-[10px] border-[#19355A] flex flex-col lg:flex-row min-h-[420px]">
        
        {/* Left Side: Photo Sidebar */}
        <div className="w-full lg:w-[28%] bg-[#fcfcfc] p-6 flex flex-col items-center justify-center border-l border-gray-100 border-dashed">
          <div className="relative w-48 h-56 mb-5">
            {/* ID Frame */}
            <div className="w-full h-full border-[6px] border-white shadow-lg overflow-hidden rounded-md transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img 
                src={profImg}
                alt="Profile" 
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>
            {/* Ghost Signature */}
            <p className="absolute -bottom-3 right-2 font-serif text-sm italic text-gray-400/50 -rotate-12 select-none pointer-events-none">
              Ahmad Ihab
            </p>
          </div>
          
          <div className="text-center space-y-1">
            <span className="text-[10px] text-gray-400 block uppercase tracking-widest font-bold">Registration ID</span>
            <span className="font-mono text-base font-black text-[#19355A]">2026-AI-DEVEL</span>
          </div>

          <button className="mt-6 w-full py-3 bg-[#19355A] text-white text-[11px] font-black rounded-lg hover:bg-[#B38E19] transition-all shadow-md active:scale-95 uppercase tracking-[0.2em]">
            View Credentials
          </button>
        </div>

        {/* Right Side: Main Content */}
        <div className="w-full lg:w-[72%] p-8 lg:p-10 relative flex flex-col justify-between">
          
          {/* Header Section */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-2 h-2 bg-[#B38E19] rounded-full"></div>
                   <h2 className="text-[11px] text-[#B38E19] font-black uppercase tracking-[0.3em]">Academic Researcher</h2>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-[#19355A] tracking-tight">أحمد إيهاب عبدالحميد</h1>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">Security Status</span>
                <span className="px-3 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded border border-green-100">VERIFIED ACCESS</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 block uppercase font-black tracking-widest">Fields of Interest</span>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, index) => (
                    <div 
                      key={index}
                      className="px-4 py-1.5 bg-white border border-gray-200 text-[#19355A] text-xs font-bold rounded shadow-sm hover:border-[#B38E19] transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 block uppercase font-black tracking-widest">Biography</span>
                <p className="text-lg text-[#19355A]/90 leading-relaxed text-justify font-medium italic border-r-4 border-[#B38E19] pr-5 py-1 bg-slate-50/50 rounded-l-lg">
                  خبير متمرس في هندسة البرمجيات والتحول الرقمي، متخصص في صياغة الحلول التقنية للمؤسسات الأكاديمية، مع دمج احترافي لواجهات الـ UI/UX.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 flex flex-wrap justify-between items-end mt-8 pt-6 border-t border-gray-100">
            <div className="flex gap-8">
               <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 block uppercase font-bold">Issue Date</span>
                  <span className="text-xs font-black text-[#19355A]">05/2026</span>
               </div>
               <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 block uppercase font-bold">System</span>
                  <span className="text-xs font-black text-[#19355A]">SignalR / ERP</span>
               </div>
            </div>
            
            {/* Compact Barcode */}
            <div className="flex flex-col items-end gap-1">
                <div className="h-9 w-36 bg-white flex gap-[1.5px] items-end opacity-70">
                    {[...Array(30)].map((_, i) => (
                        <div 
                          key={i} 
                          className="bg-black flex-1" 
                          style={{ height: `${Math.floor(Math.random() * (100 - 40 + 1) + 40)}%` }}
                        ></div>
                    ))}
                </div>
                <span className="text-[8px] font-mono text-gray-400 uppercase">A.Ihab Verified Asset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;