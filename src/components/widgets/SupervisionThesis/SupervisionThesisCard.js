import { Trash2, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SupervisionThesisCard({
  item,
  isArabic,
  onDelete,
  onEdit,
  onClick,
}) {
  const { t } = useTranslation("SupervisionThesis");

  // Translate type
  const typeTranslated = t(item.type);

  // Translate faculty member role
  const roleTranslated = t(item.facultyMemberRole);

  return (
    <div
      onClick={() => onClick(item)}
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer hover:shadow-xl transition ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-3 ${isArabic ? "left-4" : "right-4"}`}
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

      {/* Title */}
      <h3
        className={`text-lg font-semibold mb-2 ${isArabic ? "pl-12" : "pr-12"}`}
      >
        {item.title}
      </h3>

      {/* Type + Faculty Member Role */}
      <p className="text-sm text-gray-700">
        {typeTranslated} - {roleTranslated}
      </p>

      {/* Student */}
      <p className="text-xs text-gray-500 mt-1">
        {t("Student")}: {item.studentName}
      </p>
    </div>
  );
}
