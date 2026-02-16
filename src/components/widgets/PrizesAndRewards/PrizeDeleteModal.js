import { useTranslation } from "react-i18next";

export default function PrizeDeleteModal({
  item,
  deleteError,
  onConfirm,
  onCancel,
}) {
  const { t, i18n } = useTranslation("prizes-and-rewards");
  const isArabic = i18n.language === "ar";

  if (!item) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="
        relative
        bg-white
        rounded-[12px]
        shadow-xl
        w-[clamp(300px, 35vw, 600px)]
        max-w-[90%]
        p-6
        flex flex-col
        gap-6
      "
    >
      <h3 className="font-semibold text-[clamp(1.1rem,2vw,2.5rem)]">
        {t("areYouSureDelete")}
      </h3>

      {deleteError && (
        <p className="text-red-500 text-[clamp(0.85rem,1.2vw,2rem)]">
          {t("errors.deleteFailed")}
        </p>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {t("cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}
