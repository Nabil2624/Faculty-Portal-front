import React, { useState, useEffect } from 'react';

const AcademicLoader = () => {
  const [show, setShow] = useState(true);

  // إخفاء الـ Loader تلقائياً بعد انتهاء الأنميشن
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a]">
      <div className="relative w-[300px] h-[100px]">
        
        {/* القلم - يستخدم خاصية offset-path لاتباع المسار */}
        <div 
          className="absolute text-3xl z-10"
          style={{
            offsetPath: "path('M 10 80 Q 75 10, 150 80 T 290 80')",
            animation: 'movePen 3s ease-in-out forwards'
          }}
        >
          ✒️
        </div>

        {/* المسار الذي يتم رسمه */}
        <svg className="w-full h-full fill-none overflow-visible">
          <path
            d="M 10 80 Q 75 10, 150 80 T 290 80"
            className="stroke-amber-400 stroke-[2px]"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: 'drawPath 3s ease-in-out forwards',
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))'
            }}
          />
        </svg>

        {/* النص الأكاديمي */}
        <div className="mt-8 text-center">
          <p className="text-amber-100/60 font-serif tracking-widest text-sm animate-pulse">
            جاري تحضير المحتوى العلمي
          </p>
          <div className="mt-2 h-[1px] w-full bg-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-400/50 animate-progress"></div>
          </div>
        </div>
      </div>

      {/* إضافة الأنميشن المخصص في الـ Style لضمان عملها بدون تعديل ملف tailwind.config */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes movePen {
          0% { offset-distance: 0%; transform: rotate(-20deg); }
          100% { offset-distance: 100%; transform: rotate(15deg); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default AcademicLoader;