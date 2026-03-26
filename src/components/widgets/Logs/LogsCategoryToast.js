import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function LogsCategoryToast({
  message,
  type,
  onDismiss,
  isArabic,
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const colors =
    type === "success"
      ? {
          bg: "#f0fdf4",
          border: "#86efac",
          text: "#15803d",
          Icon: CheckCircle2,
        }
      : {
          bg: "#fef2f2",
          border: "#fca5a5",
          text: "#b91c1c",
          Icon: AlertCircle,
        };

  const Icon = colors.Icon;

  return (
    <div
      className="fixed z-[60] flex items-center gap-2 rounded-xl border shadow-lg"
      style={{
        top: "clamp(1rem, 2vw, 1.5rem)",
        ...(isArabic
          ? { right: "clamp(4rem, 5vw, 5rem)" }
          : { left: "clamp(4rem, 5vw, 5rem)" }),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        padding: "clamp(0.6rem, 1vw, 0.9rem) clamp(0.8rem, 1.5vw, 1.2rem)",
        fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
        maxWidth: "clamp(14rem, 28vw, 28rem)",
      }}
    >
      <Icon
        style={{
          width: "clamp(0.9rem, 1.2vw, 1.2rem)",
          height: "clamp(0.9rem, 1.2vw, 1.2rem)",
          flexShrink: 0,
        }}
      />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition"
      >
        <X
          style={{
            width: "clamp(0.75rem, 1vw, 1rem)",
            height: "clamp(0.75rem, 1vw, 1rem)",
          }}
        />
      </button>
    </div>
  );
}
