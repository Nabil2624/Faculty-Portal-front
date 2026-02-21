import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ThesesCard({ item, isArabic, onDelete, onEdit }) {
  const navigate = useNavigate();
  const { t } = useTranslation("Theses");

  const handleCardClick = () => {
    navigate("/theses-details", {
      state: { thesis: item },
    });
  };

  const translatedType =
    item.type === "PHD"
      ? t("phd")
      : item.type === "Master"
        ? t("master")
        : item.type;

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-[#EDEDED] rounded-xl shadow-lg p-4 border-[1.5px] border-[#19355a] cursor-pointer ${
        isArabic ? "border-r-[18px]" : "border-l-[18px]"
      }`}
    >
      {/* Actions */}
      <div
        className={`absolute top-4 flex gap-[14px] ${
          isArabic ? "left-4" : "right-4"
        }`}
        onClick={(e) => e.stopPropagation()}
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

      {/* translation*/}
      <p className="text-sm text-gray-700">{translatedType}</p>

      <p className="text-xs text-gray-500 mt-1">
        {t("registrationDate")} : {item.registrationDate}
      </p>
    </div>
  );
}
