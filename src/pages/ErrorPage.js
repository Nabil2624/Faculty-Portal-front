import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({ code: propCode = null }) {
  const { t, i18n } = useTranslation("error");
  const params = useParams();
  const navigate = useNavigate();


  const isArabic = i18n.language?.startsWith("ar");
  const code = params?.code ?? propCode ?? "404";
console.log(isArabic);
  const message = t(`codes.${code}.message`, t("defaultMessage", "عذراً، حدث خطأ ما"));
  const details = t(`codes.${code}.details`, t("defaultDetails", "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."));

  useEffect(() => {
    document.body.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#19355A] via-[#142947] to-[#0e1d34] p-6 font-sans"
      style={{ fontFamily: isArabic ? "'Cairo', sans-serif" : "'Roboto', sans-serif" }}
    >
      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#B38E19]/20 max-w-4xl w-full p-10 md:p-16 text-center transition-all duration-300 hover:shadow-[#B38E19]/30">
        
        <div className="flex flex-col items-center space-y-6 mb-10">
          <div className="p-6 rounded-full bg-[#B38E19]/10">
            <TriangleAlert className="text-[#B38E19]" size={90} />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#B38E19] tracking-wider">
            {code}
          </h1>
        </div>

        <h2
          className={`text-2xl md:text-3xl font-bold text-[#19355A] mb-4 ${
            isArabic ? "text-right md:text-center" : "text-left md:text-center"
          }`}
        >
          {message}
        </h2>

        <p
          className={`text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8 ${
            isArabic ? "text-right md:text-center" : "text-left md:text-center"
          }`}
        >
          {details}
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
            isArabic ? "flex-row-reverse" : ""
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#B38E19] text-white font-bold hover:bg-[#a07c14] shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {t("back", "العودة للخلف")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#19355A] text-white font-bold hover:bg-[#142947] shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {t("home", "الرئيسية")}
          </button>
        </div>

        <footer className="mt-10 text-sm text-gray-400 border-t border-gray-100 pt-6">
          {t("footerNote", "إذا كنت تعتقد أن هذا الخطأ من جانبنا، يرجى التواصل مع الدعم الفني.")}
        </footer>
      </div>
    </main>
  );
}