import { Pencil, Trash2 } from "lucide-react";

/* helper */
function formatDate(dateString, isArabic) {
  if (!dateString) return isArabic ? "الآن" : "Present";

  const date = new Date(dateString);

  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ParticipationInQualityWorkCard({
  item,
  isArabic,
  onEdit,
  onDelete,
  onDetails,
}) {
  return (
    <div
      onClick={() => onDetails?.(item)}
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
          className="text-[#b38e19] w-[clamp(1.1rem,1.6vw,3.5rem)] h-[clamp(1.1rem,1.6vw,3.5rem)] hover:scale-110 transition"
          onClick={() => onEdit?.(item)}
        />
        <Trash2
          className="text-[#E53935] w-[clamp(1.1rem,1.6vw,3.5rem)] h-[clamp(1.1rem,1.6vw,3.5rem)] hover:scale-110 transition"
          onClick={() => onDelete?.(item)}
        />
      </div>

      {/* Title */}
      <div
        className="relative mt-[clamp(0.5rem,1vw,0.75rem)]"
        style={{ maxWidth: "clamp(12rem, 22vw, 60rem)" }}
      >
        <h3
          className="font-semibold
            text-[clamp(1rem,1.4vw,3rem)]
            mt-[clamp(0.3rem,0.3vw,3rem)]
            whitespace-nowrap
            overflow-hidden
            text-ellipsis
            pointer-events-none"
        >
          {item.participationTitle}
        </h3>
      </div>

      {/* Date Range */}
      <p
        className="text-black
          text-[clamp(0.8rem,1vw,2.1rem)]
          mt-[clamp(0.3rem,0.2vw,3rem)]"
      >
        {formatDate(item.startDate, isArabic)} {isArabic ? "حتى" : "to"}{" "}
        {formatDate(item.endDate, isArabic)}
      </p>
    
    </div>
  );
}
