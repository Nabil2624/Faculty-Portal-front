import { X } from "lucide-react";

export default function ScientificResearchSummaryModal({
  research,
  isArabic,
  t,
  onClose,
}) {
  if (!research) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="
  bg-white rounded-2xl shadow-4xl
  w-[470px] max-w-[95%]
  min-h-[560px]
  p-6 sm:p-8
  relative border-2 border-[#b38e19]

"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            isArabic ? "left-4" : "right-4"
          } text-gray-500`}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-3xl font-semibold text-black">
            {t("summary")}
          </h2>

          {/* Gold line */}
          <span className="block w-[300px] h-[5px] bg-[#b38e19] mx-auto mt-5 rounded-[5px]" />
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-800 mt-11">
          {/* Related Research */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-xl">
              {t("researchRelated")}
            </h3>
            <p className="bg-[#EDEDED] p-2 min-h-[80px] rounded-lg text-sm leading-relaxed border border-[#19355A] shadow-xl w-[90%] mr-[12px]">
              {research.relatedResearch ?? "-"}
            </p>
          </div>

          {/* Abstract */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-xl">
              {t("abstract")}
            </h3>

            <p className="bg-[#EDEDED] p-2 min-h-[160px] rounded-lg text-sm leading-relaxed border border-[#19355A] shadow-xl w-[90%] mr-[12px]">
              {research.abstract ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
