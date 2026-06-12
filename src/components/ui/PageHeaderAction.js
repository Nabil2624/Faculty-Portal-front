import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PageHeaderAction({ title, icon: Icon }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  return (
    <>
      <style>{`
        :root {
          --fluid-h2: clamp(1.125rem, 1.2vw + 0.5rem, 3rem);
        }
        /* تأثير اللمعان الاحترافي */
        @keyframes glass-shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          30%, 100% { transform: translateX(250%) skewX(-20deg); }
        }
        .shiny-btn {
          position: relative;
          overflow: hidden;
        }
        .shiny-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            to right, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%) skewX(-20deg);
          animation: glass-shine 4s infinite ease-in-out;
        }
      `}</style>

      <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-[3px] border-[#b38e19] mb-6 gap-4">
        {/* الجزء الأيمن/الأيسر: الأيقونة والعنوان */}
        <div className="flex items-center gap-3 min-w-0">
          {/* حاوية الأيقونة (تظهر فقط لو تم تمريرها) */}
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-[#b38e19]/5 border-2 border-gray-100 flex items-center justify-center text-[#b38e19] shrink-0">
              <Icon size={24} />
            </div>
          )}

          {/* نص العنوان الذكي */}
          <div className="min-w-0">
            <h2
              className="text-black font-semibold leading-tight tracking-tight truncate"
              style={{ fontSize: "var(--fluid-h2)" }}
            >
              {title}
            </h2>
          </div>
        </div>

        
        <button
          onClick={() => navigate(-1)}
          className="group shiny-btn bg-gradient-to-r from-[#b38e19] to-[#d4af37] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-[0_4px_15px_rgba(179,142,25,0.35)] hover:shadow-[0_6px_20px_rgba(25,53,90,0.4)] hover:from-[#19355A] hover:to-[#254d80] transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex items-center gap-2"
        >
         
          {isRtl && (
            <span className="text-base sm:text-xl font-extrabold inline-block transform transition-transform duration-300 group-hover:-translate-x-1.5">
              ←
            </span>
          )}

          <span className="relative z-10 select-none">
            {isRtl ? "عودة" : "Back"}
          </span>

          
          {!isRtl && (
            <span className="text-base sm:text-xl font-extrabold inline-block transform transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          )}
        </button>
      </div>
    </>
  );
}
