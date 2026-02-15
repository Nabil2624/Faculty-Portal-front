export default function DeleteCommitteeModal({
  item,
  t,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[360px] text-center">
        <h3 className="text-lg font-semibold mb-3">
          {t("areYouSureDelete")}
        </h3>

        <p className="text-gray-600 mb-5">
          {item.nameOfCommitteeOrAssociation ?? item.committeeName}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#E53935] text-white px-5 py-2 rounded-md"
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
