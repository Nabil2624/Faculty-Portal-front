import { useTranslation } from "react-i18next";

export default function BiographySection({ bio }) {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className="
        bg-white rounded-xl border border-slate-200 shadow-sm p-6
        w-[clamp(120px,100vw,70rem)]
        h-[clamp(150px,10vw,500px)]
        ms-auto
      "
    >

      {bio ? (
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {bio}
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <span className="text-4xl text-yellow-500 mb-2">+</span>
          <p className="text-sm">{t("bio.placeholder")}</p>
        </div>
      )}
    </div>
  );
}
