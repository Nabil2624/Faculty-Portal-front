import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommitteeCard({
  item,
  isArabic,
  onDelete,
  onDetails,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => onDetails(item)}
      className={`relative h-full
        min-h-[clamp(50px,8vw,500px)]
        p-[clamp(0.5rem,0.75vw,1rem)]
        rounded-[clamp(10px,1.2vw,16px)]
        shadow-md
        bg-gray-100
        border-[clamp(3px,0.4vw,5px)]
        border-[#19355a]
        cursor-pointer
        ${
          isArabic
            ? "border-r-[clamp(14px,2vw,22px)] text-right"
            : "border-l-[clamp(14px,2vw,22px)] text-left"
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
          className="text-[#b38e19] w-[clamp(1.1rem,1.6vw,2.5rem)] h-[clamp(1.1rem,1.6vw,2.5rem)] hover:scale-110 transition"
          onClick={() =>
            navigate("/edit-committee-associations", {
              state: { item },
            })
          }
        />
        <Trash2
          className="text-[#E53935] w-[clamp(1.1rem,1.6vw,2.5rem)] h-[clamp(1.1rem,1.6vw,2.5rem)] hover:scale-110 transition"
          onClick={() => onDelete(item)}
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-[clamp(1rem,1.4vw,2.5rem)]">
        {item.nameOfCommitteeOrAssociation ?? item.committeeName}
      </h3>

      {/* Dates */}
      <p className="text-gray-800 text-[clamp(0.85rem,0.9vw,2rem)] mt-[clamp(0.3rem,0.2vw,0.6rem)]">
        {item.startDate ?? "-"}
        {item.endDate ? ` - ${item.endDate}` : ""}
      </p>

      {/* Type */}
      <p className="text-gray-400 text-[clamp(0.75rem,0.9vw,1.5rem)]">
        {isArabic
          ? item.typeOfCommitteeOrAssociation?.valueAr
          : item.typeOfCommitteeOrAssociation?.valueEn}
      </p>

      {/* Participation */}
      <p className="text-gray-400 text-[clamp(0.75rem,0.9vw,1.5rem)]">
        {isArabic
          ? item.degreeOfSubscription?.valueAr
          : item.degreeOfSubscription?.valueEn}
      </p>
    </div>
  );
}
