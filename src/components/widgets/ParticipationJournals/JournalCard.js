import { Pencil, Trash2, Eye } from "lucide-react";

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
      dir={isArabic ? "rtl" : "ltr"} // handle direction
      className="
        relative h-full
        min-h-[clamp(160px,9vw,240px)]
        px-[clamp(1.2rem,1vw,1.8rem)]
        py-[clamp(1.2rem,1.2vw,1.8rem)]
        bg-white
        border border-gray-300
        rounded-sm
        transition-colors
        hover:bg-gray-50
        cursor-pointer
      "
    >
      {/* Top strong border */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[#19355a]" />

      {/* Title */}
      <h3
        className="
          font-semibold
          text-gray-800
          text-[clamp(1rem,1.4vw,1.7rem)]
          tracking-wide
          truncate
        "
      >
        {item.nameOfMagazine}
      </h3>

      {/* Website */}
      {item.websiteOfMagazine && websiteUrl && (
        <p
          onClick={handleOpenWebsite}
          className="
            mt-[clamp(0.5rem,0.8vw,0.8rem)]
            text-[clamp(0.85rem,1vw,1.2rem)]
            text-[#0F2D52]
            underline
            truncate
            cursor-pointer
          "
        >
          {item.websiteOfMagazine}
        </p>
      )}

      {/* Participation Type */}
      <p
        className="
          mt-[clamp(0.5rem,0.8vw,0.8rem)]
          text-gray-600
          text-[clamp(0.8rem,0.95vw,1.1rem)]
        "
      >
        {isArabic
          ? item.typeOfParticipation?.valueAr
          : item.typeOfParticipation?.valueEn}
      </p>

      {/* Bottom Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          mt-[clamp(1.2rem,1.6vw,2rem)]
          pt-[clamp(0.8rem,1vw,1.2rem)]
          border-t border-gray-300
        "
      >
        <div
          className="
            grid grid-cols-3 text-center
            divide-x divide-gray-300
            rtl:divide-x-reverse
          "
        >
          {/* View */}
          <div className="flex justify-center">
            <Eye
              className="
                w-[clamp(1.2rem,1.4vw,1.6rem)]
                h-[clamp(1.2rem,1.4vw,1.6rem)]
                text-[#19355a]
                cursor-pointer
                hover:text-blue-500
                transition-colors
              "
              onClick={() => onDetails(item)}
            />
          </div>

          {/* Edit */}
          <div className="flex justify-center">
            <Pencil
              className="
                w-[clamp(1.2rem,1.4vw,1.6rem)]
                h-[clamp(1.2rem,1.4vw,1.6rem)]
                text-[#19355a]
                cursor-pointer
                hover:text-[#b38e19]
                transition-colors
              "
              onClick={() => onEdit(item)}
            />
          </div>

          {/* Delete */}
          <div className="flex justify-center">
            <Trash2
              className="
                w-[clamp(1.2rem,1.4vw,1.6rem)]
                h-[clamp(1.2rem,1.4vw,1.6rem)]
                text-[#19355a]
                cursor-pointer
                hover:text-red-700
                transition-colors
              "
              onClick={() => onDelete(item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}