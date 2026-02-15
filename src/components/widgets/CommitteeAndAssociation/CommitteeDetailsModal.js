import { X } from "lucide-react";

export default function CommitteeDetailsModal({
  item,
  t,
  isArabic,
  onClose,
}) {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white rounded-2xl shadow-2xl border-2 border-[#b38e19]
                 w-full max-w-[520px] max-h-[90vh] overflow-auto
                 p-6 sm:p-8 relative flex flex-col"
    >
      <button
        onClick={onClose}
        className={`absolute top-4 ${
          isArabic ? "left-4" : "right-4"
        } text-gray-500`}
      >
        <X size={22} />
      </button>

      <div className="text-center border-b-2 border-[#b38e19]/40 pb-3 mb-4">
        <h2 className="font-bold text-[clamp(1.2rem,2vw,2rem)]">
          {item.nameOfCommitteeOrAssociation ?? item.committeeName}
        </h2>
      </div>

      <div className="space-y-3 text-gray-700 text-[clamp(0.85rem,1.5vw,1rem)]">
        <div className="flex justify-between">
          <span className="font-medium">{t("type")}</span>
          <span>
            {isArabic
              ? item.typeOfCommitteeOrAssociation?.valueAr
              : item.typeOfCommitteeOrAssociation?.valueEn}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("participationLevel")}</span>
          <span>
            {isArabic
              ? item.degreeOfSubscription?.valueAr
              : item.degreeOfSubscription?.valueEn}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("startDate")}</span>
          <span>{item.startDate ?? "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("endDate")}</span>
          <span>{item.endDate ?? "-"}</span>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg break-words">
          {item.notes ?? "-"}
        </div>
      </div>
    </div>
  );
}
