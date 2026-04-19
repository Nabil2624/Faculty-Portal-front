import { useTranslation } from "react-i18next";
import { GraduationCap, ArrowUpRight, Calendar } from "lucide-react";

export default function QualificationsWidget({ data = [] }) {
  const { t, i18n } = useTranslation("dashboard");
  const isArabic = i18n.language === "ar";

  const hasData = Array.isArray(data) && data.length > 0;
  const maxItems = 4;

  function formatDate(dateString) {
    if (!dateString) return isArabic ? "الآن" : "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
    });
  }

  return (
    <div className="w-full h-full flex flex-col p-[clamp(12px,1vw,20px)] bg-white border border-gray-100 rounded-[clamp(14px,1vw,20px)] shadow-inner">
      {/* Header */}
      <div className="flex justify-between items-center mb-[clamp(8px,1vw,16px)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#fff] p-1.5 rounded-lg shadow-sm">
            <GraduationCap
              className="text-[#19355A]"
              style={{
                width: "clamp(25px,1.2vw,24px)",
                height: "clamp(25px,1.2vw,24px)",
              }}
            />
          </div>
          <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.2vw,22px)]">
            {t("Qualifications")}
          </h3>
        </div>

        <a
          href="/academic-qualifications"
          className="group flex items-center gap-1 text-[#b38e19] hover:underline transition-all text-[clamp(10px,0.8vw,15px)] font-bold"
        >
          {t("ViewMore")}
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-start overflow-hidden pt-1">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <GraduationCap size={32} className="text-gray-300" />
            </div>
            <p className="text-[#19355A] font-bold text-[clamp(13px,1.1vw,18px)] mb-1">
              {t("noQualificationsLine1")}
            </p>
            <p className="text-gray-400 font-medium text-[clamp(11px,0.9vw,14px)]">
              {t("noQualificationsLine2")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[clamp(2px,0.3vw,12px)] overflow-y-auto max-h-full pr-1">
            {data.slice(0, maxItems).map((item, index) => (
              <div
                key={index}
                className={`group relative bg-[#F8F9FA] border border-gray-200 hover:border-[#b38e19] hover:shadow-md transition-all duration-300
                  rounded-[clamp(10px,1vw,15px)]
                  px-[clamp(10px,1vw,16px)]
                  py-[clamp(8px,0.8vw,14px)]
                  ${
                    isArabic
                      ? /* المارجن الكلامب العريض هنا */
                        "border-r-[clamp(8px,1.5vw,20px)] border-r-[#19355A]"
                      : "border-l-[clamp(8px,1.5vw,20px)] border-l-[#19355A]"
                  }
                `}
              >
                {/* Title */}
                <h4 className="text-[#19355A] font-bold text-[clamp(12px,1vw,17px)] mb-1.5 truncate group-hover:text-[#b38e19] transition-colors">
                  {item.title}
                </h4>

                {/* Organization */}
                <p className="text-gray-500 font-medium text-[clamp(11px,0.85vw,14px)] truncate">
                  {item.organization}
                </p>

                {/* Date with Icon */}
                <div className="flex items-center gap-1.5 mt-3 text-gray-400">
                  <Calendar className="w-3 h-3 text-[#b38e19]" />
                  <p className="text-[clamp(10px,0.75vw,13px)] font-semibold">
                    {formatDate(item.startDate)} — {formatDate(item.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
