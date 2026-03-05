import { Pencil, Trash2, ChevronRight as ChevronRightIcon } from "lucide-react";
const iconStyle = {
  width: "clamp(20px, 1.6vw, 40px)",
  height: "clamp(20px, 1.6vw, 40px)",
};
export default function ActionIcons({ item, onEdit, onDelete }) {
  return (
    <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
      <Pencil
        size={18}
        style={iconStyle}
        className="hover:text-[#b38e19] text-gray-500 hover:scale-110 transition cursor-pointer"
        onClick={() => onEdit(item)}
      />
      <Trash2
        size={18}
        style={iconStyle}
        className="hover:text-red-500 text-gray-500 hover:scale-110 transition cursor-pointer"
        onClick={() => onDelete(item)}
      />
    </div>
  );
}
