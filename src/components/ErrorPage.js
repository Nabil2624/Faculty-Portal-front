import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import errorImage from "../images/errorr.png"; // حط صورتك هنا

export default function ErrorPage({
  code: propCode = null,
  message = null,
  details = null,
  showHomeButton = true,
  showBackButton = true,
  homePath = "/",
}) {
  const params = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("error");

  const code = params?.code ?? (propCode ?? "");
  const isArabic = i18n.language === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"} // ده عشان النصوص تكتب RTL/LTR
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#19355A]/5 to-white p-6"
    >
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-8 md:p-12">
        
        {/* الصورة + النص */}
        <div
          className={`flex flex-col md:flex-row items-center gap-8 ${
            isArabic ? "md:flex-row-reverse" : "md:flex-row"
          }`}
          style={{ direction: "ltr" }} // منع RTL يأثر على flex
        >
          {/* الصورة */}
          <div className="flex-shrink-0 flex items-center justify-center w-40 h-40">
            <img
              src={errorImage}
              alt="Error"
              className="w-full h-full object-contain"
            />
          </div>

          {/* النص */}
          <section className="flex-1">
            <h1
              className={`text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {code && (
                <span
                  className={`text-[#B38E19] ${
                    isArabic ? "ml-4" : "mr-4"
                  }`}
                >
                  {code}
                </span>
              )}
              <span className="align-middle">
                {message || t("defaultMessage")}
              </span>
            </h1>

            <p
              className={`mt-4 text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {details || t("defaultDetails")}
            </p>

            {/* الأزرار */}
            <div
              className={`mt-8 flex flex-col sm:flex-row sm:items-center gap-3 ${
                isArabic ? "sm:justify-end" : "sm:justify-start"
              }`}
            >
              {showHomeButton && (
                <button
                  onClick={() => navigate(homePath)}
                  className="inline-flex items-center px-5 py-3 rounded-lg shadow-sm border border-transparent text-sm font-medium transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B38E19]/40 bg-[#19355A] text-white"
                >
                  {t("goHome")}
                </button>
              )}

              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-5 py-3 rounded-lg bg-white border border-gray-200 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19355A]/40 text-[#19355A]"
                >
                  {t("goBack")}
                </button>
              )}

              <a
                href="#report"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `mailto:support@example.com?subject=Error%20Report${
                    code ? `%20${code}` : ""
                  }&body=${encodeURIComponent(
                    `${t("reportBody")} ${code || ""}`
                  )}`;
                }}
                className="mt-2 sm:mt-0 text-sm text-[#19355A] underline"
              >
                {t("reportThis")}
              </a>
            </div>
          </section>
        </div>

        {/* الفوتر */}
        <footer
          className={`mt-8 text-xs text-gray-400 text-center${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {t("footerNote")}
        </footer>
      </div>
    </main>
  );
}
