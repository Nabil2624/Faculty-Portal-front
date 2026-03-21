import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Lightbulb } from "lucide-react";
import SkillsModal from "./SkillsModal";
import { updateSkills } from "../../../services/profile.service";

export default function SkillsWidget({ data = [] }) {
  const { t, i18n } = useTranslation("dashboard");
  const isArabic = i18n.language === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(data);
  }, [data]);

  const handleSave = async (newSkills) => {
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
        className="group cursor-pointer bg-white border-[clamp(1.5px,0.3vw,3px)] border-gray-100 rounded-[clamp(14px,1vw,20px)] p-[clamp(12px,1vw,20px)] h-full w-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-[#b38e19]/30"
      >

        {/* Header - Fixed Height Area */}
        <div className="flex items-center justify-between mb-[clamp(8px,0.8vw,16px)]">
          <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.2vw,22px)] flex items-center gap-2">
            <Lightbulb className="w-[1em] h-[1em] text-[#b38e19]" />
            {t("skills")}
          </h3>
          {hasSkills && (
            <Plus className="w-4 h-4 text-[#b38e19] opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-hidden">
          {hasSkills ? (
            <ul className="space-y-[clamp(4px,0.5vw,10px)]">
              {skills.slice(0, 5).map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-3 group/item"
                >
                  {/* الرصاصة التقليدية بشكل دائري ذهبي أنيق */}
                  <span className="w-[clamp(6px,0.4vw,8px)] h-[clamp(6px,0.4vw,8px)] rounded-full bg-[#b38e19] shrink-0" />
                  
                  <span className="font-medium text-[clamp(12px,1vw,18px)] text-gray-700 truncate group-hover/item:text-[#b38e19] transition-colors">
                    {skill.text}
                  </span>
                </li>
              ))}
              {skills.length > 5 && (
                <li className="text-gray-400 text-[clamp(10px,0.7vw,14px)] italic ps-[clamp(16px,1.2vw,24px)] mt-1">
                  + {skills.length - 5} {isArabic ? "أخرى" : "more"}
                </li>
              )}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-2">
              <Plus
                className="text-[#b38e19] mb-2 opacity-40 group-hover:opacity-100 transition-opacity"
                size={40}
              />
              <p className="text-gray-400 font-medium text-[clamp(12px,1vw,16px)]">
                {t("addSkillsHint")}
              </p>
            </div>
          )}
        </div>
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