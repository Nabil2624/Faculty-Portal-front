import { useTranslation } from "react-i18next";

export default function PatentDeleteModal({
  item,
  onConfirm,
  onCancel,
  deleteError,
}) {
  const { t, i18n } = useTranslation("patents");
  const isArabic = i18n.language === "ar";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onCancel}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[clamp(12px,1.5vw,40px)]
          p-[clamp(1rem,2vw,3rem)]
          w-[clamp(280px,30vw,450px)]
          max-w-[95%]
          text-center shadow-xl"
      >
        <h3 className="font-semibold mb-4 text-[clamp(1rem,1.4vw,1.7rem)]">
          {t("areYouSureDelete")}
        </h3>

        <p className="text-gray-600 mb-4 break-words">{item?.nameOfPatent}</p>

        {deleteError && <p className="text-red-600 mb-3">{deleteError}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white rounded px-5 py-2 hover:opacity-90"
          >
            {t("delete")}
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 rounded px-5 py-2 hover:bg-gray-400"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
