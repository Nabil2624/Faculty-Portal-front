import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrizesWidget({ count = 0, isArabic }) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-[clamp(12px,1vw,20px)] text-center">
      {/* Title + Icon */}
      <div className="flex items-center gap-[clamp(6px,1vw,12px)] mb-[clamp(4px,0.5vw,10px)]">
        <Award
          className="text-[#b38e19]"
          style={{
            width: "clamp(16px,1.8vw,55px)",
            height: "clamp(16px,1.8vw,55px)",
          }}
        />
        <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.3vw,45px)]">
          {t("Prize")}
        </h3>
      </div>

      {/* Number */}
      <p className="text-[#19355A] font-bold text-[clamp(24px,3vw,60px)] mb-[clamp(6px,1vw,12px)]">
        {count}
      </p>

      {/* Link */}
      <a
        href="/prizes-and-rewards"
        className="text-gray-500 text-[clamp(12px,1vw,35px)] hover:underline"
      >
        {t("View Details")}
      </a>
    </div>
  );
}
