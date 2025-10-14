import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Construction } from "lucide-react";

export default function UnderDevelopment() {
  const { t, i18n } = useTranslation("underdevelopment");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  React.useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#F9FAFB] text-center px-6">
      {/* Icon */}
      <div className="bg-[#19355A] text-white p-5 rounded-full mb-6 shadow-lg">
        <Construction size={60} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold text-[#19355A] mb-4">
        {t("title")}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg mb-10 max-w-lg">
        {t("message")}
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-2 rounded-md text-white font-semibold transition-all duration-200 bg-[#B38E19] hover:bg-[#9b7a16]"
      >
        {isArabic ? (
          <>
            <ArrowRight size={20} />
            {t("back")}
          </>
        ) : (
          <>
            <ArrowLeft size={20} />
            {t("back")}
          </>
        )}
      </button>
    </div>
  );
}
