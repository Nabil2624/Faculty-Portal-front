import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
function formatDate(dateString, isArabic) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PatentDetailsModal({ item, onClose }) {
  const { t, i18n } = useTranslation("patents");
  const isArabic = i18n.language === "ar";
  if (!item) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="relative bg-white border-[clamp(1.5px,0.3vw,3px)]
      border-[#b38e19] rounded-[clamp(14px,2vw,22px)]
      shadow-2xl w-[clamp(320px,35vw,1000px)]
      max-w-[92%] p-[clamp(1rem,2.5vw,2rem)]"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className={`absolute top-4 ${
          isArabic ? "left-4" : "right-4"
        } text-gray-500`}
      >
        <X size={24} />
      </button>

      {/* Title */}
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="font-semibold text-[clamp(1.2rem,2vw,3rem)]">
          {item.nameOfPatent}
        </h2>
      </div>

      <div className="space-y-4 text-[clamp(0.85rem,1.2vw,2rem)]">
        <div className="flex justify-between">
          <span>{t("type")}</span>
<span>
  {item.localOrInternational === "Local"
    ? t("local")
    : t("international")}
</span>

        </div>

        <div className="flex justify-between">
         <span>{t("authority")}</span>

          <span>{item.accreditingAuthorityOrCountry}</span>
        </div>

        <div className="flex justify-between">
         <span>{t("applyingDate")}</span>

          <span>{formatDate(item.applyingDate, isArabic)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t("accreditationDate")}</span>

          <span>{formatDate(item.accreditationDate, isArabic)}</span>
        </div>

        <div className="mt-5 bg-gray-100 p-4 rounded-lg break-words">
          {item.description}
        </div>
      </div>
    </div>
  );
}
