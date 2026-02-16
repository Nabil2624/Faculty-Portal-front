import { useTranslation } from "react-i18next";

export default function CommunityServiceContributionsDeleleModal({
  item,
  onConfirm,
  onCancel,
  deleteError,
}) {
  const { t, i18n } = useTranslation("university-contribution");
  const isArabic = i18n.language === "ar";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onCancel} 
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()} 
        className="
          bg-white
          rounded-[clamp(12px,1.5vw,40px)]
          p-[clamp(1rem,2vw,3rem)]
          w-[clamp(280px,30vw,450px)]
          max-w-[95%]
          text-center
          shadow-xl
        "
      >
        {/* Title */}
        <h3
          className="
            font-semibold
            mb-[clamp(0.5rem,1vw,4rem)]
            text-[clamp(1rem,1.4vw,1.7rem)]
          "
        >
          {t("areYouSureDelete")}
        </h3>

        {/* Item Title */}
        <p
          className="
            text-gray-600
            mb-[clamp(0.75rem,1.5vw,2rem)]
            text-[clamp(0.8rem,1.1vw,1.5rem)]
            break-words
          "
        >
          {item?.contributionTitle}
        </p>

        {/* Error */}
        {deleteError && (
          <p
            className="
              text-red-600
              mb-[clamp(0.75rem,1.5vw,1.4rem)]
              text-[clamp(0.75rem,1vw,1.2rem)]
            "
          >
            {deleteError}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-[clamp(0.75rem,1.5vw,1.5rem)]">
          <button
            onClick={onConfirm}
            className="
              bg-red-600
              text-white
              rounded-[clamp(6px,0.8vw,15px)]
              px-[clamp(1rem,1.8vw,2rem)]
              py-[clamp(0.4rem,0.9vw,1rem)]
              text-[clamp(0.8rem,1vw,1.5rem)]
              hover:opacity-90
              transition
            "
          >
            {t("delete")}
          </button>

          <button
            onClick={onCancel}
            className="
              bg-gray-300
              rounded-[clamp(6px,0.8vw,15px)]
              px-[clamp(1rem,1.8vw,2rem)]
              py-[clamp(0.4rem,0.9vw,1rem)]
              text-[clamp(0.8rem,1vw,1.5rem)]
              hover:bg-gray-400
              transition
            "
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
