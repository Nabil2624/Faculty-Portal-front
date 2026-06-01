import React from 'react';
import { useTranslation } from "react-i18next";

export function FormSection({ title, children }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section 
      className={`bg-gray-100 shadow-md
        p-[clamp(1rem,1.5vw,2rem)]
        rounded-[clamp(12px,1.4vw,18px)]
        border-[clamp(2px,0.35vw,4px)] border-[#19355a]
        space-y-4
        ${isArabic ? "border-r-[clamp(12px,2vw,20px)]" : "border-l-[clamp(12px,2vw,20px)]"}
      `}
    >
      <h2 className="text-[clamp(1.1rem,1.5vw,1.8rem)] font-bold text-[#19355a] border-b border-slate-300 pb-2 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}