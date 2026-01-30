export default function DeleteSupervisionModal({
  item,
  t,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[380px] text-center">
        <h3 className="text-lg font-semibold mb-3">{t("areYouSureDelete")}</h3>

        <p className="text-sm text-gray-600 mb-5">{item?.title}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-5 py-2 rounded-md"
          >
            {t("delete")}
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-5 py-2 rounded-md"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
