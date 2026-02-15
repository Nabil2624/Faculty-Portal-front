import { FiPlus } from "react-icons/fi";

export default function RelatedResearchCard({
  t,
  researches,
  addResearch,
  updateResearch,
  inputClass,
}) {
  const card = "border border-[#B38E19] rounded-[5px] p-4 relative bg-white";

  return (
    <div className={`${card} min-h-[170px]`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-xl">{t("relatedResearch")}</h4>
        <button
          onClick={addResearch}
          className="w-10 h-10 bg-[#B38E19] text-white rounded-md flex items-center justify-center shadow"
        >
          <FiPlus size={24} />
        </button>
      </div>

      {researches.map((research, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1 text-lg">{t("research")}</label>
          <input
            className={inputClass}
            placeholder={t("researchPlaceholder")}
            value={research}
            onChange={(e) => updateResearch(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
