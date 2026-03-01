import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import SkillsModal from "./SkillsModal";
import { updateSkills } from "../../../services/profile.service";

export default function SkillsWidget({ data = [] }) {
  const { t } = useTranslation("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(data);
  }, [data]);

  const handleSave = async (newSkills) => {
    console.log("Saving skills:", newSkills);

    setSkills(newSkills);

    try {
      await updateSkills(newSkills);
    } catch (err) {
      console.error(err);
    }
  };

  const hasSkills = Array.isArray(skills) && skills.length > 0;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] rounded-[clamp(14px,1vw,20px)] p-[clamp(12px,1vw,20px)] h-full w-full flex flex-col"
      >
        <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.2vw,20px)] mb-[clamp(8px,0.8vw,16px)] text-center">
          {t("skills")}
        </h3>

        {hasSkills ? (
          <ul className="list-disc list-inside space-y-[clamp(4px,0.5vw,10px)] text-start overflow-hidden">
            {skills.slice(0, 5).map((skill) => (
              <li
                key={skill.id}
                className="text-[#b38e19] font-medium text-[clamp(12px,1vw,16px)]"
              >
                {skill.text}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <Plus
              size={48}
              className="text-[#b38e19] mb-[clamp(8px,1vw,16px)]"
            />
            <p className="text-[#19355A] font-medium text-[clamp(12px,1vw,16px)]">
              {t("addSkillsHint")}
            </p>
          </div>
        )}
      </div>

      <SkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skills={skills}
        onSave={handleSave}
      />
    </>
  );
}
