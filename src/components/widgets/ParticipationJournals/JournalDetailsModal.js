import { X } from "lucide-react";

/* helper */
function clampIcon(min, mid, max) {
  return `clamp(${min}px, ${mid}px, ${max}px)`;
}

function normalizeUrl(url) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function JournalDetailsModal({ item, isArabic, t, onClose }) {
  if (!item) return null;

  const handleOpenLink = (e) => {
    e.preventDefault(); // يمنع أي navigation افتراضي
    e.stopPropagation(); // يمنع أي parent onClick

    const finalUrl = normalizeUrl(item.websiteOfMagazine);
    if (!finalUrl) return;

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      onClick={(e) => e.stopPropagation()}
      className="
        relative
        bg-white
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#b38e19]
        rounded-[clamp(14px,2vw,22px)]
        shadow-2xl
        w-[clamp(320px,35vw,750px)]
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
          ${
            isArabic
              ? "left-[clamp(0.75rem,1.2vw,1.2rem)]"
              : "right-[clamp(0.75rem,1.2vw,1.2rem)]"
          }
          text-gray-500
          hover:scale-110
          transition
        `}
      >
        <X size={clampIcon(18, 26, 30)} />
      </button>

      {/* Title */}
      <div
        className="
          text-center
          border-b-[clamp(1px,0.25vw,2px)]
          border-[#b38e19]/40
          pb-[clamp(0.5rem,1vw,0.8rem)]
          mb-[clamp(0.75rem,1.5vw,1.2rem)]
        "
      >
        <h2
          className="
            font-semibold
            text-[clamp(1.2rem,2vw,2rem)]
            leading-snug
            break-words
          "
        >
          {item.nameOfMagazine}
        </h2>
      </div>

      {/* Details */}
      <div
        className="
          space-y-[clamp(0.6rem,1.2vw,10rem)]
          text-gray-700
          text-[clamp(0.85rem,1.3vw,4rem)]
        "
      >
        {/* Type */}
        <div className="flex justify-between gap-3">
          <span className="font-medium">{t("type")}</span>
          <span>
            {isArabic
              ? item.typeOfParticipation?.valueAr
              : item.typeOfParticipation?.valueEn}
          </span>
        </div>
        {/* Website */}
        <div className="flex justify-between items-center gap-3">
          <span className="font-medium shrink-0">{t("journalWebsite")}</span>
          <a
            href={normalizeUrl(item.websiteOfMagazine) || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenLink}
            className={`
      text-[#b38e19]
      underline
      inline-block
      whitespace-nowrap
      ${isArabic ? "text-left" : "text-right"}
    `}
          >
            {item.websiteOfMagazine}
          </a>
        </div>

        {/* Notes */}
        <div
          className="
            mt-[clamp(0.8rem,1.5vw,1.2rem)]
            bg-gray-100
            p-[clamp(0.6rem,1.5vw,1rem)]
            rounded-[clamp(10px,1.5vw,14px)]
            border border-gray-200
          "
        >
          <p className="leading-relaxed text-gray-800 break-words">
            {item.notes ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
