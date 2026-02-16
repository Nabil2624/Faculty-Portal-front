import { useTranslation } from "react-i18next";
import EmptySection from "./EmptySection";

export default function SkillsSection({ skills = [] }) {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className="
        col-span-1
        w-[clamp(200px,90%,400px)]
        h-[clamp(180px,26vw,300px)]
      "
    >
      <EmptySection title={t("empty.addSkills")} />
    </div>
  );
}
