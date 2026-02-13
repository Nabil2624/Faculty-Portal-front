import { Trash2, Pencil } from "lucide-react";

export default function SupervisionThesisCard({
  item,
  isArabic,
  onDelete,
  onEdit,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick(item)}
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer hover:shadow-xl transition ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${
          isArabic ? "left-4" : "right-4"
        }`}
      >
        <Pencil
          className="w-5 h-5 cursor-pointer"
          style={{ color: "#B38E19" }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
        />

        <Trash2
          className="text-red-500 w-5 h-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        />
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${isArabic ? "pl-12" : "pr-12"}`}
      >
        {item.title}
      </h3>

      <p className="text-sm text-gray-700">{item.type}</p>

      <p className="text-xs text-gray-500 mt-1">{item.student}</p>
    </div>
  );
}
