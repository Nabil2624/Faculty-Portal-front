import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({ code: propCode = null }) {
  const { t, i18n } = useTranslation("error");
  const params = useParams();
  const navigate = useNavigate();

  const code = params?.code ?? propCode ?? "0";
  const isArabic = i18n.language === "ar";

  const message = t(`codes.${code}.message`, t("defaultMessage"));
  const details = t(`codes.${code}.details`, t("defaultDetails"));

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#19355A] via-[#142947] to-[#0e1d34] p-6"
    >
      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#B38E19]/20 max-w-4xl w-full p-10 md:p-16 text-center transition-all duration-300 hover:shadow-[#B38E19]/30">
        {/* Icon & Code */}
        <div className="flex flex-col items-center space-y-6 mb-10">
          <div className="p-6 rounded-full bg-[#B38E19]/10">
            <TriangleAlert className="text-[#B38E19]" size={90} />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#B38E19] tracking-wider">
            {code}
          </h1>
        </div>

        {/* Message */}
        <h2
          className={`text-2xl md:text-3xl font-bold text-[#19355A] mb-4 ${
            isArabic ? "text-right mr-12" : "text-left ml-12"
          }`}
        >
          {message}
        </h2>

        <p
          className={`text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {details}
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center ${
            isArabic ? "sm:flex-row-reverse" : ""
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-[#B38E19] text-white font-semibold hover:bg-[#a07c14] shadow-md hover:shadow-lg transition-all"
          >
            {t("back")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-[#19355A] text-white font-semibold hover:bg-[#142947] shadow-md hover:shadow-lg transition-all"
          >
            {t("home")}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-sm text-gray-500">
          {t("footerNote")}
        </footer>
      </div>
    </main>
  );
}