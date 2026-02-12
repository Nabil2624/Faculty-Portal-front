import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ScientificResearchCard({
  item,
  isArabic,
  onDelete,
  onEdit,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.source === "External") {
      navigate("/scientific-research-details", { state: { research: item } });
    } else if (item.source === "Internal") {
      onEdit && onEdit(item);
    }
  };

  return (
    <div
      onClick={() => navigate(`/scientific-research-details/${item.id}`)}
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${isArabic ? "left-4" : "right-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {item.source === "Internal" && (
          <Pencil
            className="w-5 h-5 cursor-pointer"
            style={{ color: "#B38E19" }}
            onClick={() => onEdit(item)}
          />
        )}

        {item.source === "External" && (
          <Trash2
            className="w-5 h-5 cursor-pointer text-red-500"
            onClick={() => onDelete(item)}
          />
        )}
      </div>

      {/* Title with proper RTL ellipsis */}
      <h3
        dir={isArabic ? "ltr" : "rtl"} // add this
        className={`text-lg font-semibold mb-2 truncate overflow-hidden whitespace-nowrap ${
          isArabic ? "pl-12 text-right" : "pr-12 text-left"
        }`}
        title={item.title || item.researchTitle}
      >
        {item.title || item.researchTitle}
      </h3>

      <p className="text-sm text-gray-700">
        {item.journalOrConfernce || item.journalName}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {item.pubYear || item.publishYear}
      </p>
    </div>
  );
}
