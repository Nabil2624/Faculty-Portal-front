import { X } from "lucide-react";

export default function ArticleDetailsModal({ item, t, isArabic, onClose }) {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white rounded-2xl shadow-2xl border-2 border-[#b38e19]
                  overflow-auto w-[420px] max-w-full
                 p-6 relative flex flex-col"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={`absolute top-4 ${
          isArabic ? "left-4" : "right-4"
        } text-gray-500`}
      >
        <X size={22} />
      </button>

      {/* Title */}
      <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold">
          {item.titleOfArticle}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-3 text-gray-700 text-[clamp(0.85rem,1.5vw,1rem)]">
        <div className="flex justify-between">
          <span className="font-medium">{t("organization")}</span>
          <span>{item.authority}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("reviewDate")}</span>
          <span>{item.reviewingDate}</span>
        </div>

        <div className="mt-5 bg-gray-100 p-4 rounded-lg break-words">
          <p className="text-gray-800 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
