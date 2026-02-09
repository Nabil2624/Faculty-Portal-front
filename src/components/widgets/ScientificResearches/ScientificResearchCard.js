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
      // Navigate and pass item as state
      navigate("/scientific-research-details", { state: { research: item } });
    } else if (item.source === "Internal") {
      // handle internal case later
      onEdit && onEdit(item);
    }
  };

  return (
    <div
      onClick={() => navigate(`/scientific-research-details/${item.id}`)}
      // <-- entire card is clickable
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${isArabic ? "left-4" : "right-4"}`}
        onClick={(e) => e.stopPropagation()} // prevent card click when clicking icon
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

      <h3
        className={`text-lg font-semibold mb-2 ${isArabic ? "pl-12" : "pr-12"} truncate`}
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
