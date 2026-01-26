import { Pencil, Trash2 } from "lucide-react";

export default function JournalCard({
  item,
  isArabic,
  onEdit,
  onDelete,
  onDetails,
}) {
  return (
    <div
      onClick={() => onDetails(item)}
      className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer ${
        isArabic ? "border-r-[19px]" : "border-l-[19px]"
      }`}
    >
      <div
        className={`absolute top-4 ${
          isArabic ? "left-4" : "right-4"
        } flex gap-3`}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="text-[#b38e19] w-5 h-5 hover:scale-110"
          onClick={() => onEdit(item)}
        />
        <Trash2
          className="text-[#E53935] w-5 h-5 hover:scale-110"
          onClick={() => onDelete(item)}
        />
      </div>

      <h3 className="text-xl font-semibold mb-1">
        {item.nameOfMagazine}
      </h3>

      <a
        href={item.websiteOfMagazine}
        target="_blank"
        rel="noreferrer"
        className="text-[#b38e19] underline"
        onClick={(e) => e.stopPropagation()}
      >
        {item.websiteOfMagazine}
      </a>

      <p className="text-sm text-gray-400 mt-2">
        {isArabic
          ? item.typeOfParticipation?.valueAr
          : item.typeOfParticipation?.valueEn}
      </p>
    </div>
  );
}
