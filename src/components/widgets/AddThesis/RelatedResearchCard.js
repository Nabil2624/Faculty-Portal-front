import { X } from "lucide-react";

export default function RelatedResearchCard({
  t,
  researches,
  searchTerm,
  setSearchTerm,
  searchResults,
  addSelectedResearch,
  removeResearch,
  inputClass,
}) {
  const card =
    "border border-[#B38E19] rounded-[5px] p-4 relative bg-white";

  return (
    <div className={`${card} min-h-[170px] relative`}>
      <h4 className="font-semibold text-xl mb-4">
        {t("relatedResearch")}
      </h4>

      {/* SEARCH INPUT */}
      <div className="relative mb-4">
        <input
          className={inputClass}
          placeholder={t("researchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* DROPDOWN RESULTS */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-[200px] overflow-y-auto">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => addSelectedResearch(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED RESEARCHES LIST */}
      {researches.length > 0 && (
        <ol className="space-y-2 list-decimal pl-5">
          {researches.map((research, index) => (
            <li
              key={research.id}
              className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
            >
              <span className="text-sm">{research.title}</span>

              <button
                onClick={() => removeResearch(research.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
