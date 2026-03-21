import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, X } from "lucide-react";

export default function SkillsModal({ isOpen, onClose, skills, onSave }) {
  const { t, i18n } = useTranslation("dashboard");
  const isArabic = i18n.language === "ar";
  const [localSkills, setLocalSkills] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSkills(skills || []);
    }
  }, [isOpen, skills]);

  const addSkill = () =>
    setLocalSkills([...localSkills, { id: Date.now(), text: "" }]);

  const updateSkill = (id, value) =>
    setLocalSkills(
      localSkills.map((s) => (s.id === id ? { ...s, text: value } : s))
    );

  const deleteSkill = (id) =>
    setLocalSkills(localSkills.filter((s) => s.id !== id));

  const handleSave = () => {
    // تصفية المهارات الفارغة قبل الحفظ
    const filtered = localSkills.filter(s => s.text.trim() !== "");
    onSave(filtered);
    onClose();
  };

  if (!isOpen) return null;

  const customScrollbar = "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#19355A] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#b38e19] p-2 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-[clamp(18px,1.2vw,24px)] font-bold">
              {t("edit_skills")}
            </h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-1">
            <X className="w-6 h-6 opacity-80" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-8 flex-1 overflow-y-auto space-y-4 ${customScrollbar}`}>
          {localSkills.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>{isArabic ? "لم يتم إضافة مهارات بعد" : "No skills added yet"}</p>
            </div>
          ) : (
            localSkills.map((skill, index) => (
              <div 
                key={skill.id} 
                className="flex gap-3 items-center group animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 relative">
                  <input
                    value={skill.text}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    placeholder={t("enter_skill")}
                    className="w-full border border-gray-200 p-3 px-5 rounded-xl outline-none focus:border-[#b38e19] focus:ring-4 focus:ring-[#b38e19]/10 transition-all text-gray-700 bg-gray-50/50"
                  />
                </div>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                  title={t("delete")}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={addSkill}
            className="flex items-center gap-2 text-[#b38e19] font-bold hover:underline px-2"
          >
            <Plus className="w-5 h-5" />
            {t("add")}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-500 font-medium hover:bg-gray-200 rounded-xl transition-all"
            >
              {t("close")}
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-[#19355A] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#1e406d] active:scale-95 transition-all"
            >
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}