// components/dashboard/StatCard.jsx
import { useTranslation } from "react-i18next";

export default function StatCard({ titleKey, value, icon, onClick }) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className="
        bg-white
        border border-slate-200
        shadow-sm
        rounded-xl
        p-6
        flex flex-col items-center
        justify-center
        gap-2
        hover:shadow-md
        transition
        cursor-pointer
      "
    >
      <div className="text-slate-500 text-sm flex items-center gap-2">
        {icon}
        {t(titleKey)}
      </div>

      <div className="text-3xl font-bold text-slate-800">
        {value}
      </div>

      <span className="text-xs text-slate-400">
        {t("showDetails")}
      </span>
    </div>
  );
}
