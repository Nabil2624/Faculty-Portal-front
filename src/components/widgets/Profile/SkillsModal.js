// SkillsModal.js
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SkillsModal({ isOpen, onClose }) {
  const { t } = useTranslation("dashboard");
  const [originalSkills, setOriginalSkills] = useState([
    { id: 1, text: "Machine Learning" },
    { id: 2, text: "Distributed Systems" },
    { id: 3, text: "Software Architecture" },
  ]);

  const [skills, setSkills] = useState(originalSkills);

  const addSkill = () => setSkills([...skills, { id: Date.now(), text: "" }]);
  const updateSkill = (id, value) =>
    setSkills(skills.map((s) => (s.id === id ? { ...s, text: value } : s)));
  const deleteSkill = (id) => setSkills(skills.filter((s) => s.id !== id));

  const handleSave = () => {
    const modified = skills.filter(
      (s) => !originalSkills.find((o) => o.id === s.id && o.text === s.text)
    );
    console.log("Modified List to send:", modified);
    setOriginalSkills(skills);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#EDEDED] rounded-2xl w-[90%] max-w-lg p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#19355A] text-center">
          {t("edit_skills")}
        </h2>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {skills.map((skill) => (
            <div key={skill.id} className="flex gap-3">
              <input
                value={skill.text}
                onChange={(e) => updateSkill(skill.id, e.target.value)}
                placeholder={t("enter_skill")}
                className="border p-2 flex-1 rounded"
              />
              <button
                onClick={() => deleteSkill(skill.id)}
                className="bg-red-500 text-white px-3 rounded"
              >
                {t("delete")}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={addSkill}
            className="bg-[#b38e19] text-white px-4 py-2 rounded"
          >
            {t("add")}
          </button>
          <button
            onClick={handleSave}
            className="bg-[#19355A] text-white px-4 py-2 rounded"
          >
            {t("save")}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}