import { X } from "lucide-react";

function clampIcon(min, mid, max) {
  return `clamp(${min}px, ${mid}px, ${max}px)`;
}

function formatDate(dateString, isArabic, t) {
  if (!dateString) return t("present");

  const date = new Date(dateString);
  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PrizeDetailsModal({ item, onClose, t, isArabic }) {
  // fallback if t/isArabic not passed
  // only if needed: const { t: defaultT, i18n } = useTranslation("prizes-and-rewards");
  // t = t || defaultT;
  // isArabic = isArabic !== undefined ? isArabic : i18n.language === "ar";

  if (!item) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      onClick={(e) => e.stopPropagation()}
      className="
        relative
        bg-white
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#B38E19]
        rounded-[clamp(14px,2vw,22px)]
        shadow-2xl
        w-[clamp(320px,35vw,1000px)]
        max-w-[92%]
        p-[clamp(1rem,2.5vw,2rem)]
      "
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`
          absolute
          top-[clamp(0.75rem,1.2vw,1.2rem)]
          ${isArabic ? "left-[clamp(0.75rem,1.2vw,1.2rem)]" : "right-[clamp(0.75rem,1.2vw,1.2rem)]"}
          text-gray-500
          hover:scale-110
          transition
        `}
      >
        <X size={clampIcon(18, 26, 35)} />
      </button>

      {/* Title (Prize Name) */}
      <div
        className="
          text-center
          border-b-[clamp(1px,0.25vw,2px)]
          border-[#19355a]/40
          pb-[clamp(0.5rem,1vw,0.8rem)]
          mb-[clamp(0.75rem,1.5vw,1.2rem)]
        "
      >
        <h2
          className="
            font-semibold
            text-[clamp(1.2rem,2vw,3.2rem)]
            leading-snug
            break-words
          "
        >
          {isArabic ? item.prize?.valueAr : item.prize?.valueEn}
        </h2>
      </div>

      {/* Details */}
      <div className="space-y-[clamp(0.8rem,1.5vw,2rem)] text-black text-[clamp(0.85rem,1.2vw,2.5rem)]">
        {/* Awarding Authority */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("organization")}</span>
          <span className="break-words">{item.awardingAuthority}</span>
        </div>

        {/* Date Received */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("date")}</span>
          <span>{formatDate(item.dateReceived, isArabic, t)}</span>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mt-5 bg-gray-100 p-4 rounded-lg break-words">
            <p className="text-gray-800 leading-relaxed">{item.description}</p>
          </div>
        )}

        {/* Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="mt-5">
            <h3 className="font-medium mb-3">{t("attachments")}</h3>

            <div className="flex flex-col gap-2">
              {item.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url} // make sure backend returns url
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
            text-blue-600
            underline
            break-words
            hover:text-blue-800
          "
                >
                  {file.fileName || t("attachment")} {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
