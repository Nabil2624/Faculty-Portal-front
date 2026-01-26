import { X } from "lucide-react";

export default function JournalDetailsModal({ item, isArabic, t, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose} // <-- اضغط على الخلفية يقفل
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-8 relative border-2 border-[#b38e19]"
        onClick={(e) => e.stopPropagation()} // <-- منع غلق الـ modal لما تدوس جوه
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-500`}
        >
          <X size={22} />
        </button>

        {/* Title */}
        <div className="text-center border-b-2 border-[#b38e19]/40 pb-3 mb-4">
          <h2 className="text-2xl font-bold">{item.nameOfMagazine}</h2>
        </div>

        {/* Details */}
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">{t("type")}</span>
            <span>
              {isArabic
                ? item.typeOfParticipation?.valueAr
                : item.typeOfParticipation?.valueEn}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">{t("website")}</span>
            <a
              href={item.websiteOfMagazine}
              target="_blank"
              rel="noreferrer"
              className="text-[#b38e19] underline"
            >
              {item.websiteOfMagazine}
            </a>
          </div>

          <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 leading-relaxed">{item.notes ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
