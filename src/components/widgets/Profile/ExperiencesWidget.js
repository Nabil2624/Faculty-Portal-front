import { useTranslation } from "react-i18next";

export default function ExperiencesWidget({ data }) {
  const { t, i18n } = useTranslation("dashboard");
  const isArabic = i18n.language === "ar";

  const hasData = Array.isArray(data) && data.length > 0;

  function formatDate(dateString) {
    if (!dateString) return isArabic ? "الآن" : "Present";

    const date = new Date(dateString);

    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const maxItems = 3;

  return (
    <div className="w-full h-full flex flex-col p-[clamp(12px,1vw,20px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[clamp(8px,1vw,16px)]">
        <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.2vw,24px)]">
          {t("Experiences")}
        </h3>

        <a
          href="/general-experiences"
          className="text-gray-500 text-[clamp(12px,1vw,18px)] hover:underline"
        >
          {t("ViewMore")}
        </a>
      </div>

      {/* Content */}
      {!hasData ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <p
            className="
              text-[#19355A]
              font-bold
              text-[clamp(14px,1.2vw,20px)]
              mb-[clamp(6px,0.6vw,12px)]
            "
          >
            {t("noExperiencesLine1")}
          </p>

          <p
            className="
              text-[#b38e19]
              font-semibold
              text-[clamp(13px,1.1vw,18px)]
            "
          >
            {t("noExperiencesLine2")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[clamp(8px,0.5vw,25px)] overflow-auto">
          {data.slice(0, maxItems).map((item, index) => (
            <div
              key={index}
              className={`relative
                bg-gray-200
                rounded-[clamp(12px,1.4vw,18px)]
                shadow-sm
                px-[clamp(0.75rem,0.5vw,1.25rem)]
                py-[clamp(0.75rem,0.8vw,1.25rem)]
                border-[clamp(2px,0.35vw,4px)]
                border-[#19355A]
                ${
                  isArabic
                    ? "border-r-[clamp(12px,2vw,20px)]"
                    : "border-l-[clamp(12px,2vw,20px)]"
                }
              `}
            >
              <h4
                className="text-[#19355A] font-bold
                  text-[clamp(13px,1.1vw,20px)]
                  mb-[clamp(4px,0.2vw,8px)]
                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis"
              >
                {item.jobDegree}
              </h4>

              <p
                className="text-black
                  text-[clamp(12px,1vw,18px)]
                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis"
              >
                {item.country} / {item.city}
              </p>

              <p
                className="text-gray-500
                  text-[clamp(11px,0.9vw,16px)]
                  mt-[clamp(4px,0.4vw,8px)]"
              >
                {formatDate(item.startDate)} {isArabic ? "حتى" : "to"}{" "}
                {formatDate(item.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
