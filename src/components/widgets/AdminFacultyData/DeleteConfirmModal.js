import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteConfirmModal({
  item,
  deleting,
  onConfirm,
  onClose,
}) {
  const { t, i18n } = useTranslation("AdminFacultyData");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && !deleting && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        dir={i18n.dir()}
        style={{
          width: "clamp(300px, 32vw, 560px)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding:
              "clamp(0.9rem, 1.2vw, 1.8rem) clamp(1.1rem, 1.6vw, 2.2rem)",
            borderBottom: "1px solid #fee2e2",
            backgroundColor: "#fef2f2",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              style={{
                width: "clamp(16px, 1.3vw, 22px)",
                height: "clamp(16px, 1.3vw, 22px)",
                color: "#dc2626",
              }}
            />
            <span
              style={{
                fontSize: "clamp(0.85rem, 1.1vw, 1.55rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("deleteConfirm.title")}
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-1.5 hover:bg-red-100 transition"
          >
            <X
              style={{
                width: "clamp(14px, 1.1vw, 18px)",
                height: "clamp(14px, 1.1vw, 18px)",
                color: "#6b7280",
              }}
            />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "clamp(1rem, 1.5vw, 2.2rem) clamp(1.1rem, 1.6vw, 2.2rem)",
            fontSize: "clamp(0.7rem, 0.9vw, 1.3rem)",
            color: "#374151",
          }}
        >
          {t("deleteConfirm.message")}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3"
          style={{
            padding: "clamp(0.7rem, 1vw, 1.4rem) clamp(1.1rem, 1.6vw, 2.2rem)",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl font-medium transition hover:bg-gray-100"
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.8rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
              border: "1px solid #e5e7eb",
              color: "#374151",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.8rem)",
              fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting && (
              <Loader2
                style={{
                  width: "clamp(12px, 1vw, 16px)",
                  height: "clamp(12px, 1vw, 16px)",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
            {deleting ? t("deleting") : t("deleteConfirm.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
