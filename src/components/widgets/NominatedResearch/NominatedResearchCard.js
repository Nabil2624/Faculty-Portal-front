import { CircleCheck, XCircle, ArrowRightCircle } from "lucide-react";

export default function NominatedResearchCard({
  item,
  isArabic,
  onAccept,
  onReject,
  onView,
}) {
  return (
    <div
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${
          isArabic ? "left-4" : "right-4"
        }`}
      >
        {/* View / Go */}
        <ArrowRightCircle
          className="w-6 h-6 cursor-pointer text-[#B38E19]"
          onClick={() => onView(item)}
        />

        {/* Reject */}
        <XCircle
          className="w-6 h-6 cursor-pointer text-red-600"
          onClick={() => onReject(item)}
        />

        {/* Accept */}
        <CircleCheck
          className="w-6 h-6 cursor-pointer text-[#19355a]"
          onClick={() => onAccept(item)}
        />
      </div>

      {/* Reserve space for icons */}
      <h3
        className={`text-lg font-semibold mb-2 ${isArabic ? "pl-12" : "pr-12"}`}
      >
        {item.title}
      </h3>

      <p className="text-sm text-gray-700">{item.journal}</p>
      <p className="text-xs text-gray-500 mt-1">{item.year}</p>
    </div>
  );
}
