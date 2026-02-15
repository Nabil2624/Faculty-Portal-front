export default function DeleteArticleModal({ item, t, onConfirm, onCancel, deleteError }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
        {t("confirmDelete")}
      </h3>
      <p className="text-sm text-gray-600 mb-5">{item.titleOfArticle}</p>
      {deleteError && <p className="text-red-500 mb-3">{deleteError}</p>}
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
        >
          {t("delete")}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400 transition"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
