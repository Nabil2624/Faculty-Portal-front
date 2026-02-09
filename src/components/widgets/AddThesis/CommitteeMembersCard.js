import { FiPlus } from "react-icons/fi";
import { ChevronDown } from "lucide-react";

export default function CommitteeMembersCard({
  t,
  members,
  addMember,
  updateMember,
  isArabic,
}) {
  const card = "border border-[#B38E19] rounded-[5px] p-4 relative bg-white";

  return (
    <div className={`${card} min-h-[auto] md:min-h-[370px] pb-6`}>
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
          className="mb-10 border-b border-dashed pb-6 last:border-b-0"
        >
          {/* ROLE */}
          <div className="flex flex-wrap gap-4 md:gap-16 mb-4 text-[12px] mr-4">
            {["supervision", "review", "both"].map((role) => (
              <label key={role} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`memberRole-${index}`}
                  value={role}
                  checked={member.role === role}
                  onChange={(e) => updateMember(index, "role", e.target.value)}
                />
                {t(role)}
              </label>
            ))}
          </div>

          {/* NAME */}
          <label className="block mb-4 text-lg">{t("memberName")}</label>
          <input
            className="h-[40px] bg-[#E2E2E2] text-[12px] outline-none w-full md:max-w-[490px] rounded-[3px] pr-3"
            placeholder={t("memberNamePlaceholder")}
            value={member.name}
            onChange={(e) => updateMember(index, "name", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* JOB TITLE */}
            <div>
              <label className="block mb-4 text-lg mt-3">{t("jobTitle")}</label>
              <div className="relative w-[219px]">
                <select
                  className="h-[40px] bg-[#E2E2E2] rounded-[3px] px-3 text-[12px] outline-none w-full text-gray-600 appearance-none"
                  value={member.jobTitle}
                  onChange={(e) =>
                    updateMember(index, "jobTitle", e.target.value)
                  }
                >
                  <option value="">{t("selectJobTitle")}</option>
                </select>
                <ChevronDown
                  size={26}
                  className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none"
                  style={isArabic ? { left: "8px" } : { right: "12px" }}
                />
              </div>
            </div>

            {/* ORGANIZATION */}
            <div>
              <label className="block mb-4 text-lg mt-3">
                {t("organization")}
              </label>
              <div className="relative w-[219px]">
                <select
                  className="h-[40px] bg-[#E2E2E2] rounded-[3px] px-3 text-[12px] outline-none w-full text-gray-600 appearance-none"
                  value={member.organization}
                  onChange={(e) =>
                    updateMember(index, "organization", e.target.value)
                  }
                >
                  <option value="">{t("selectOrganization")}</option>
                  <option value="org1">Organization 1</option>
                  <option value="org2">Organization 2</option>
                </select>
                <ChevronDown
                  size={26}
                  className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none"
                  style={isArabic ? { left: "8px" } : { right: "8px" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
