export default function DeleteResearchModal({ item, t, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className="
        bg-white 
        rounded-[clamp(8px,1vw,16px)]
        p-[clamp(1rem,2vw,1.75rem)]
        w-[clamp(280px,90vw,420px)]
        text-center
        "
      >
        <h3 className="text-[clamp(1rem,2vw,1.25rem)] font-semibold mb-[clamp(0.5rem,1vw,1rem)]">
          {t("areYouSureDelete")}
        </h3>

        <p className="text-[clamp(0.85rem,1.5vw,1rem)] text-gray-600 mb-[clamp(1rem,2vw,1.5rem)] break-words">
          {item?.researchTitle}
        </p>

        <div className="flex justify-center gap-[clamp(0.75rem,2vw,1.5rem)]">
          <button
            onClick={onConfirm}
            className="
            bg-red-600 
            text-white 
            px-[clamp(1rem,2vw,1.5rem)] 
            py-[clamp(0.4rem,1vw,0.6rem)] 
            rounded-[clamp(6px,1vw,10px)]
            text-[clamp(0.85rem,1.5vw,1rem)]
            "
          >
            {t("delete")}
          </button>

          <button
            onClick={onCancel}
            className="
            bg-gray-300 
            px-[clamp(1rem,2vw,1.5rem)] 
            py-[clamp(0.4rem,1vw,0.6rem)] 
            rounded-[clamp(6px,1vw,10px)]
            text-[clamp(0.85rem,1.5vw,1rem)]
            "
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}