import { FolderKanban, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProjectsWidget({ count = 8, isArabic }) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-[clamp(12px,1vw,20px)] text-center bg-white border border-gray-100 rounded-[clamp(14px,1vw,20px)] shadow-inner">
      {/* Title + Icon */}
      <div className="flex items-center gap-[clamp(6px,1vw,12px)] mb-[clamp(4px,0.5vw,10px)]">
        <div className="bg-[#fff] p-1.5 rounded-lg shadow-sm ">
          <FolderKanban
            className="text-[#19355A]"
            style={{
              width: "clamp(25px,1.2vw,24px)", // تم ضبط المقاس ليتناسب مع Qualifications
              height: "clamp(25px,1.2vw,24px)",
            }}
          />
        </div>
        <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.3vw,22px)]">
          {t("Projects")}
        </h3>
      </div>

      {/* Number */}
      <p className="text-[#19355A] font-black text-[clamp(24px,3vw,60px)] mb-[clamp(6px,1vw,12px)] drop-shadow-sm">
        {count}
      </p>

      {/* Link - Updated to match Qualifications style */}
      <a
        href="/projects"
        className="group flex items-center gap-1 text-[#b38e19] hover:underline transition-all text-[clamp(12px,1vw,16px)] font-bold"
      >
        {t("View Details")}
        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}
