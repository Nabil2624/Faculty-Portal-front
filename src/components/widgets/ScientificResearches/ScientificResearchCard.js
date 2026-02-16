import { Trash2, Pencil } from "lucide-react";

export default function ScientificResearchCard({
  item,
  isArabic,
  onDelete,
  onEdit,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer hover:shadow-xl transition ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${isArabic ? "left-4" : "right-4"}`}
        onClick={(e) => e.stopPropagation()} // VERY IMPORTANT
      >
        {item.source === "Internal" && (
          <Pencil
            className="w-5 h-5 cursor-pointer"
            style={{ color: "#B38E19" }}
            onClick={() => onEdit?.(item)}
          />
        )}

        <Trash2
          className="w-5 h-5 cursor-pointer text-red-500"
          onClick={() => onDelete?.(item)}
        />
      </div>

      <h3
        dir={isArabic ? "ltr" : "rtl"}
        className={`text-lg font-semibold mb-2 truncate overflow-hidden whitespace-nowrap ${
          isArabic ? "pl-12 text-right" : "pr-12 text-left"
        }`}
        title={item.title}
      >
        {item.title}
      </h3>

      <p className="text-sm text-gray-700">{item.journalOrConfernce}</p>

      <p className="text-xs text-gray-500 mt-1">{item.pubYear}</p>
    </div>
  );
}
