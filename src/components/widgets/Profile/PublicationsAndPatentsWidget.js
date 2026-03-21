import { BookMarkedIcon, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PublicationsAndPatentsWidget({ count = 6, isArabic }) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-[clamp(12px,1vw,20px)] text-center bg-white border border-gray-100 rounded-[clamp(14px,1vw,20px)] shadow-inner">
      {/* Title + Icon Wrapper */}
      <div className="flex items-center gap-[clamp(6px,1vw,12px)] mb-[clamp(4px,0.5vw,10px)]">
        <div className="bg-[#19355A] p-1.5 rounded-lg shadow-sm">
          <BookMarkedIcon
            className="text-[#b38e19]"
            style={{
              width: "clamp(16px,1.2vw,24px)",
              height: "clamp(16px,1.2vw,24px)",
            }}
          />
        </div>
        <h3 className={`text-[#19355A] font-bold ${isArabic? "text-[clamp(14px,1vw,22px)]" : "text-[clamp(12px,0.98vw,22px)]"} `}>
          {t("PublicationsAndPatentsWidget")}
        </h3>
      </div>

      {/* Number Display */}
      <p className="text-[#19355A] font-black text-[clamp(24px,3vw,60px)] mb-[clamp(6px,1vw,12px)] drop-shadow-sm">
        {count}
      </p>

      {/* Action Link */}
      <a
        href="/scientific-writing"
        className="group flex items-center gap-1 text-[#b38e19] hover:underline transition-all text-[clamp(12px,1vw,16px)] font-bold"
      >
        {t("View Details")}
        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}