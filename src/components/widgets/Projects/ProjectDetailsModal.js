import { X } from "lucide-react";

export default function ProjectDetailsModal({
  item,
  t,
  isArabic,
  onClose,
}) {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="
        relative
        bg-white
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#b38e19]
        rounded-[clamp(14px,2vw,22px)]
        shadow-2xl
        w-[clamp(320px,35vw,750px)]
        max-w-[92%]
        p-[clamp(1rem,2.5vw,2rem)]
      "
    >
      <button
        onClick={onClose}
        className={`absolute top-4 ${
          isArabic ? "left-4" : "right-4"
        } text-gray-500`}
      >
        <X size={22} />
      </button>

      <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold">
          {item.nameOfProject}
        </h2>
      </div>

      <div className="space-y-3 text-gray-700 text-[clamp(0.85rem,1.5vw,1rem)]">
        <div className="flex justify-between">
          <span className="font-medium">{t("localInternational")}</span>
          <span>{item.localOrInternational}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("fundingAuthority")}</span>
          <span>{item.financingAuthority}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("participationRole")}</span>
          <span>
            {isArabic
              ? item.participationRole?.valueAr
              : item.participationRole?.valueEn}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("projectType")}</span>
          <span>
            {isArabic
              ? item.typeOfProject?.valueAr
              : item.typeOfProject?.valueEn}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("startDate")}</span>
          <span>{item.startDate}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">{t("endDate")}</span>
          <span>{item.endDate}</span>
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
