import { Pencil, Trash2 } from "lucide-react";

/* helper */
function normalizeUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function JournalCard({
  item,
  isArabic,
  onEdit,
  onDelete,
  onDetails,
}) {
  const websiteUrl = normalizeUrl(item.websiteOfMagazine);

  const handleOpenWebsite = (e) => {
    e.stopPropagation();
    if (!websiteUrl) return;
    window.open(websiteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={() => onDetails(item)}
      className={`relative h-full
        min-h-[clamp(140px,9vw,260px)]
        px-[clamp(0.75rem,0.5vw,1.25rem)]
        rounded-[clamp(12px,1.4vw,18px)]
        shadow-md
        bg-gray-100
        border-[clamp(2px,0.35vw,4px)]
        border-[#19355a]
        cursor-pointer
        ${
          isArabic
            ? "border-r-[clamp(12px,2vw,20px)]"
            : "border-l-[clamp(12px,2vw,20px)]"
        }
      `}
    >
      {/* Actions */}
      <div
        className={`absolute top-[clamp(0.75rem,1vw,1.25rem)]
          ${
            isArabic
              ? "left-[clamp(0.75rem,1.2vw,1.25rem)]"
              : "right-[clamp(0.75rem,1.2vw,1.25rem)]"
          }
          flex gap-[clamp(0.5rem,1vw,0.9rem)]
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="text-[#b38e19] w-[clamp(1.1rem,1.6vw,2.3rem)] h-[clamp(1.1rem,1.6vw,2.3rem)] hover:scale-110 transition"
          onClick={() => onEdit(item)}
        />
        <Trash2
          className="text-[#E53935] w-[clamp(1.1rem,1.6vw,2.3rem)] h-[clamp(1.1rem,1.6vw,2.3rem)] hover:scale-110 transition"
          onClick={() => onDelete(item)}
        />
      </div>

      {/* Title */}
      <div
        className="relative mt-[clamp(0.5rem,1vw,0.75rem)]"
        style={{ maxWidth: "clamp(12rem, 22vw, 48rem)" }}
      >
        <h3
          className="font-semibold
            text-[clamp(1rem,1.6vw,2.2rem)]
            whitespace-nowrap
            overflow-hidden
            text-ellipsis
            pointer-events-none"
        >
          {item.nameOfMagazine}
        </h3>
      </div>

      {/* Website – FIXED */}
      {item.websiteOfMagazine && websiteUrl && (
        <span
          onClick={handleOpenWebsite}
          title={item.websiteOfMagazine}
          className="
  inline-flex
  w-fit
  max-w-[100%]
  mt-[clamp(0.4rem,0.8vw,0.6rem)]
  text-[#b38e19]
  underline
  text-[clamp(0.8rem,1.1vw,1.6rem)]
  cursor-pointer
  overflow-hidden
  whitespace-nowrap
  text-ellipsis
"
        >
          {item.websiteOfMagazine}
        </span>
      )}

      {/* Participation Type */}
      <p
        className="text-gray-400
          mt-[clamp(0.4rem,0.8vw,0.6rem)]
          text-[clamp(0.75rem,1vw,1.4rem)]
        "
      >
        {isArabic
          ? item.typeOfParticipation?.valueAr
          : item.typeOfParticipation?.valueEn}
      </p>
    </div>
  );
}
