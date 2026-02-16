// components/dashboard/SectionCard.jsx
import { useTranslation } from "react-i18next";

export default function SectionCard({ titleKey, children }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-slate-700">
          {t(titleKey)}
        </h3>

        <button className="text-sm text-slate-400 hover:text-slate-600">
          {t("showMore")}
        </button>
      </div>

      {children}
    </div>
  );
}
