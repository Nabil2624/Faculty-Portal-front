// SkillsWidget.js
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SkillsModal from "./SkillsModal";

export default function SkillsWidget({ data = [] }) {
  const { t } = useTranslation("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] rounded-[clamp(14px,1vw,20px)] p-4 h-full w-full overflow-hidden"
      >
        <h3 className="text-[#19355A] font-bold mb-3 text-center">
          {t("skills")}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-start">
          {data.slice(0, 5).map((skill) => (
            <li key={skill.id} className="text-[#b38e19] font-medium">
              {skill.text}
            </li>
          ))}
        </ul>
      </div>

      <SkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}