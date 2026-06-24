import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <footer className="w-full py-4 mt-6 border-t border-gray-100 text-center text-sm text-gray-500">
      <p>
        {isArabic 
          ? "جميع حقوق النشر والملكيه الفكريه محفوظة لكلية الحاسبات والذكاء الاصطناعي ومركز الاتصالات وتكنولوجيا المعلومات"
          : "All copyrights, intellectual property rights are reserved by FCAI & CITC."
        }
        {" "}© {new Date().getFullYear()}
      </p>
    </footer>
  );
}