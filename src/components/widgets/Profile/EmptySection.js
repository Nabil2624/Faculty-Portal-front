// components/dashboard/EmptySection.jsx
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmptySection({ messageKey, actionKey }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm p-10 text-center border">
      <Plus className="mx-auto mb-4 text-yellow-500" size={40} />

      <p className="text-slate-600 mb-2">
        {t(messageKey)}
      </p>

      <button className="text-yellow-600 font-medium hover:underline">
        {t(actionKey)}
      </button>
    </div>
  );
}
