import { Plus } from "lucide-react";
import { useState } from "react";

export default function ParticipantList({
  label,
  participants,
  setParticipants,
  placeholder,
  handleFetchContributor,
  error,
  setParentError,
  t,
}) {
  const [orcidInput, setOrcidInput] = useState("");
  const [orcidError, setOrcidError] = useState("");
  const handleAddContributor = async () => {
    if (!orcidInput.trim()) {
      const msg = t("orcidRequired");
      setOrcidError(msg);
      setParentError(msg);
      return;
    }

    setOrcidError("");
    setParentError("");

    const contributor = await handleFetchContributor(orcidInput.trim());

    if (contributor) {
      setParticipants((prev) => [...prev, contributor]);
      setParentError("");
    } else {
      const msg = t("contributorNotFound");
      setOrcidError(msg);
      setParentError(msg);
    }

    setOrcidInput("");
  };

  return (
    <div>
      <label className="block mb-3 font-medium text-lg">{label}</label>

      {/* ORCID input */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          className={`w-full sm:flex-1 h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600 mt-2 sm:mt-0 ${
            orcidError ? "border border-red-500" : ""
          }`}
          placeholder={placeholder || "Enter ORCID"}
          value={orcidInput}
          onChange={(e) => setOrcidInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddContributor()}
        />
        <button
          type="button"
          className="w-[36px] h-[36px] bg-[#B38E19] text-white rounded-md flex items-center justify-center mt-2 sm:mt-0 sm:ml-2 "
          onClick={handleAddContributor}
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Show ORCID errors */}
      {orcidError && <p className="text-red-500 text-xs mt-1">{orcidError}</p>}
      {error && !orcidError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Participant list */}
      <div className="mt-4 space-y-2 text-sm">
        {participants.map((p, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 rounded-md mt-4"
          >
            <span className="truncate sm:w-1/3">
              {index + 1}. {p.name}
            </span>
            <label className="flex items-center gap-1 sm:w-[150px]">
              <input
                type="radio"
                name="mainResearcher"
                className="accent-[#B38E19]"
                checked={p.main}
                onChange={() =>
                  setParticipants(
                    participants.map((pp, i) => ({ ...pp, main: i === index })),
                  )
                }
              />
              <span className="text-xs sm:text-sm">Main Researcher</span>
            </label>
            <label className="flex items-center gap-1 sm:w-[200px]">
              <input
                type="checkbox"
                className="accent-[#B38E19]"
                // checked={p.internal}
                onChange={() =>
                  setParticipants(
                    participants.map((pp, i) =>
                      i === index ? { ...pp, internal: !pp.internal } : pp,
                    ),
                  )
                }
              />
              <span className="text-xs sm:text-sm">Internal Member</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
