import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

/* helpers */
function clampIcon(min, mid, max) {
  return `clamp(${min}px, ${mid}px, ${max}px)`;
}

function formatDate(dateString, i18n, t) {
  if (!dateString) return t("present");

  const date = new Date(dateString);

  return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UniversityContributionDetailsModal({ item, onClose }) {
  const { t, i18n } = useTranslation("teaching-experiences");
  const isArabic = i18n.language === "ar";

  if (!item) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      onClick={(e) => e.stopPropagation()}
      className="
        relative
        bg-white
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#b38e19]
        rounded-[clamp(14px,2vw,22px)]
        shadow-2xl
        w-[clamp(320px,35vw,1000px)]
        max-w-[92%]
        p-[clamp(1rem,2.5vw,2rem)]
      "
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`
          absolute
          top-[clamp(0.75rem,1.2vw,1.2rem)]
          ${
            isArabic
              ? "left-[clamp(0.75rem,1.2vw,1.2rem)]"
              : "right-[clamp(0.75rem,1.2vw,1.2rem)]"
          }
          text-gray-500
          hover:scale-110
          transition
        `}
      >
        <X size={clampIcon(18, 26, 35)} />
      </button>

      {/* Title */}
      <div
        className="
          text-center
          border-b-[clamp(1px,0.25vw,2px)]
          border-[#b38e19]/40
          pb-[clamp(0.5rem,1vw,0.8rem)]
          mb-[clamp(0.75rem,1.5vw,1.2rem)]
        "
      >
        <h2
          className="
            font-semibold
            text-[clamp(1.2rem,2vw,3.2rem)]
            leading-snug
            break-words
          "
        >
          {item.courseName}
        </h2>
      </div>

      {/* Details */}
      <div
        className="
          space-y-[clamp(0.8rem,1.5vw,2rem)]
          text-black
          text-[clamp(0.85rem,1.2vw,2.5rem)]
        "
      >
        {/* Organization */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("AcademicLevel")}</span>
          <span className="text-right break-words">{item.academicLevel}</span>
        </div>

        {/* Location */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("university")}</span>
          <span>{item.universityOrFaculty}</span>
        </div>

        {/* Start Date */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("startDate")}</span>
          <span>{formatDate(item.startDate, i18n, t)}</span>
        </div>

        {/* End Date */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("endDate")}</span>
          <span>{formatDate(item.endDate, i18n, t)}</span>
        </div>
        <div className="mt-5 bg-gray-100 p-4 rounded-lg break-words">
          <p className="text-gray-800 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
