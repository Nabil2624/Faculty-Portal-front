import { FiPlus, FiX } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
export default function CommitteeMembersCard({
  t,
  members,
  addMember,
  updateMember,
  isArabic,
  jobLevelOptions = [],
  universityOptions = [],
}) {
  const card = "border border-[#B38E19] rounded-[5px] p-4 relative bg-white";
  const roles = [
    { label: "supervision", value: 1 },
    { label: "review", value: 2 },
    { label: "both", value: 3 },
  ];

  const removeMember = (index) => {
    if (members.length === 1) return;
    const copy = [...members];
    copy.splice(index, 1);
    updateMember(-1, "replace", copy);
  };
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={`${card} min-h-[auto] md:min-h-[370px] pb-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-start font-semibold text-lg pr-4">
          {t("addCommitteeMember")}
        </h4>
        <button
          onClick={addMember}
          className="w-10 h-10 bg-[#B38E19] text-white rounded-md flex items-center justify-center shadow"
        >
          <FiPlus size={24} />
        </button>
      </div>

      {members.map((member, index) => (
        <div
          key={index}
          className="mb-10 border-b border-dashed pb-6 last:border-b-0 relative"
        >
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeMember(index)}
            className="w-10 h-10 bg-red-700 text-white rounded-md flex items-center justify-center shadow absolute top-0"
            style={isArabic ? { left: "1px" } : { right: "1px" }}
          >
            <FiX size={24} />
          </button>

          {/* Role */}
          <div className="flex flex-wrap gap-4 md:gap-16 mb-4 text-[12px] mr-4">
            {roles.map((role) => (
              <label
                key={role.value}
                className="flex items-center gap-1 accent-[#B38E19]"
              >
                <input
                  type="radio"
                  name={`memberRole-${index}`}
                  value={role.value}
                  checked={member.role === role.value}
                  onChange={() => updateMember(index, "role", role.value)}
                />
                {t(role.label)}
              </label>
            ))}
          </div>

          {/* Name */}
          <label className="block mb-4 text-lg">{t("memberName")}</label>
          <input
            className="h-[40px] bg-[#E2E2E2] text-[12px] outline-none w-full md:max-w-[510px] rounded-[3px] pr-3"
            placeholder={t("memberNamePlaceholder")}
            value={member.name}
            onChange={(e) => updateMember(index, "name", e.target.value)}
          />

          {/* Job Title & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Job Title */}
            <div>
              <label className="block mb-2 text-lg mt-3">{t("jobTitle")}</label>
              <div className="relative">
                <div
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="h-[40px] bg-[#E2E2E2] rounded-[3px] px-3 text-[12px] flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {jobLevelOptions.find((j) => j.id === member.jobTitle)?.[
                      isArabic ? "valueAr" : "valueEn"
                    ] || t("selectJobTitle")}
                  </span>
                  <ChevronDown size={18} className="text-[#B38E19]" />
                </div>

                {openIndex === index && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#B38E19] rounded shadow-md max-h-40 overflow-y-auto z-50">
                    {jobLevelOptions.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          updateMember(index, "jobTitle", j.id);
                          setOpenIndex(null);
                        }}
                        className="px-3 py-2 hover:bg-[#F3E7C3] cursor-pointer text-[12px]"
                      >
                        {isArabic ? j.valueAr : j.valueEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block mb-2 text-lg mt-3">
                {t("organization")}
              </label>

              <div className="relative">
                <div
                  onClick={() =>
                    setOpenIndex(
                      openIndex === `org-${index}` ? null : `org-${index}`,
                    )
                  }
                  className="h-[40px] bg-[#E2E2E2] rounded-[3px] px-3 text-[12px] flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {universityOptions.find(
                      (u) => u.id === member.organization,
                    )?.[isArabic ? "valueAr" : "valueEn"] ||
                      t("selectOrganization")}
                  </span>

                  <ChevronDown size={18} className="text-[#B38E19]" />
                </div>

                {openIndex === `org-${index}` && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#B38E19] rounded shadow-md max-h-40 overflow-y-auto z-50">
                    {universityOptions.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          updateMember(index, "organization", u.id);
                          setOpenIndex(null);
                        }}
                        className="px-3 py-2 hover:bg-[#F3E7C3] cursor-pointer text-[12px]"
                      >
                        {isArabic ? u.valueAr : u.valueEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
