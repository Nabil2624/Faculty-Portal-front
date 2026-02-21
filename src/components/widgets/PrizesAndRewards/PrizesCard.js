import { Trash2, Pencil } from "lucide-react";

function formatDate(dateString, isArabic) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PrizeCard({
  item,
  isArabic,
  onDelete,
  onDetails,
  onEdit,
}) {
  const prizeName = isArabic ? item.prize?.valueAr : item.prize?.valueEn;

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
        ${isArabic ? "border-r-[clamp(12px,2vw,20px)]" : "border-l-[clamp(12px,2vw,20px)]"}
      `}
    >
      {/* Delete Action */}
      <div
        className={`absolute top-[clamp(0.75rem,1vw,1.25rem)] ${
          isArabic
            ? "left-[clamp(0.75rem,1.2vw,1.25rem)]"
            : "right-[clamp(0.75rem,1.2vw,1.25rem)]"
        } flex gap-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="text-[#B38E19] w-[clamp(1.1rem,1.6vw,3.5rem)] h-[clamp(1.1rem,1.6vw,3.5rem)] hover:scale-110 transition"
          onClick={() => onEdit?.(item)}
        />
        <Trash2
          className="text-[#E53935] w-[clamp(1.1rem,1.6vw,3.5rem)] h-[clamp(1.1rem,1.6vw,3.5rem)] hover:scale-110 transition"
          onClick={() => onDelete?.(item)}
        />
      </div>

      {/* Prize Name */}
      <h3 className="font-semibold text-[clamp(1rem,1.4vw,3rem)] mt-[clamp(0.8rem,1vw,1.5rem)] whitespace-nowrap overflow-hidden text-ellipsis">
        {prizeName}
      </h3>

      {/* Awarding Authority */}
      <p className="text-black text-[clamp(0.8rem,1vw,2rem)] mt-2">
        {item.awardingAuthority}
      </p>

      {/* Date */}
      <p className="text-black text-[clamp(0.8rem,1vw,2rem)] mt-1">
        {formatDate(item.dateReceived, isArabic)}
      </p>
    </div>
  );
}
