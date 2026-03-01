import { Pencil, Trash2 } from "lucide-react";

export default function ArticleCard({
  item,
  isArabic,
  onEdit,
  onDelete,
  onDetails,
}) {
  return (
    <div
      onClick={() => onDetails(item)}
      className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 sm:p-4 md:p-5 border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition-transform ${
        isArabic ? "border-r-[19px]" : "border-l-[19px]"
      }`}
    >
      <div
        className={`absolute top-3 sm:top-4 ${isArabic ? "left-3 sm:left-4" : "right-3 sm:right-4"} flex gap-2 sm:gap-3`}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="text-[#b38e19] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-[#d1a82c] hover:scale-110 transition"
          onClick={() => onEdit(item)}
        />
        <Trash2
          className="text-[#E53935] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-[#e45552] hover:scale-110 transition"
          onClick={() => onDelete(item)}
        />
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#1A1A1A] mb-1 break-words">
        {item.titleOfArticle}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-700">
        {item.reviewingDate}
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-400">
        {item.authority}
      </p>
    </div>
  );
}
