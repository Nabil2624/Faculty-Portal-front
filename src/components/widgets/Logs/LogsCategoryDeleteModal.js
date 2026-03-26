import { Trash2, Loader2 } from "lucide-react";

export default function LogsCategoryDeleteModal({
  message,
  onConfirm,
  onCancel,
  loading,
  t,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          width: "clamp(280px, 30vw, 440px)",
          padding: "clamp(1.2rem, 2.5vw, 2rem)",
          gap: "clamp(0.9rem, 1.5vw, 1.4rem)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
            style={{
              width: "clamp(2.2rem, 3vw, 3rem)",
              height: "clamp(2.2rem, 3vw, 3rem)",
            }}
          >
            <Trash2
              className="text-red-600"
              style={{
                width: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
              }}
            />
          </div>
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
          >
            {message}
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium flex items-center gap-1"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {loading && (
              <Loader2
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 0.9vw, 1rem)",
                  height: "clamp(0.7rem, 0.9vw, 1rem)",
                }}
              />
            )}
            {loading ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
