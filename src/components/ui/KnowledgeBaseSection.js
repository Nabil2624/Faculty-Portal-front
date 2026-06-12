import { useTranslation } from "react-i18next";

export function KnowledgeBase({ participationType }) {
  const { t } = useTranslation("ExternalForm");

  // تعريف التعليمات في مصفوفة داينمك
  const instructions = [
    { id: 1, text: t("knowledgeBase.general1") }, // قاعدة عامة للكل
    { id: 2, text: t("knowledgeBase.general2") }, // قاعدة عامة للكل
    { 
      id: 3, 
      text: t("knowledgeBase.presenterOnly"), 
      condition: participationType === "researchPresenter" 
    },
    { 
      id: 4, 
      text: t("knowledgeBase.listenerOnly"), 
      condition: participationType === "listenerOnly" 
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 p-5 rounded-[12px] mb-8">
      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
        💡 {t("knowledgeBase.title")}
      </h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
        {instructions
          .filter(item => !item.condition || item.condition) // بيعرض العام + اللي شرطه متحقق
          .map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
      </ul>
    </div>
  );
}