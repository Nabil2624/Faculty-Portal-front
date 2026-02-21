import { CircleCheck, XCircle, ArrowRightCircle } from "lucide-react";

export default function RecommendedSupervisionCard({
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
      <div
        className={`absolute top-4 flex gap-3 ${
          isArabic ? "left-4" : "right-4"
        }`}
      >
        <ArrowRightCircle
          className="w-6 h-6 cursor-pointer text-[#B38E19]"
          onClick={() => onView(item)}
        />
        <XCircle
          className="w-6 h-6 cursor-pointer text-red-600"
          onClick={() => onReject(item)}
        />
        <CircleCheck
          className="w-6 h-6 cursor-pointer text-[#19355a]"
          onClick={() => onAccept(item)}
        />
      </div>

      <h3
        className={`text-lg font-semibold mb-2 truncate ${
          isArabic ? "pl-32 text-right" : "pr-28 text-left"
        }`}
        title={item.studentName}
      >
        {item.studentName}
      </h3>

      <p className="text-sm text-gray-700 truncate">
        {item.degreeType || "-"}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {item.registrationYear || "-"}
      </p>
    </div>
  );
}
