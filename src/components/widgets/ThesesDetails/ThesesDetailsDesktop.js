import InfoRow from "../../ui/InfoRow";
import SectionCard from "../../ui/SectionCard";
import SectionCardLongTitle from "../../ui/SectionCardLongTitle";

export default function ThesesDetailsDesktop({ thesis, t }) {
  return (
    <div className="flex flex-col gap-10 max-w-[1400px] mx-auto">
      {/* InfoRows: 3 per row */}
      <div className="grid grid-cols-3 gap-x-16 gap-y-6">
        <InfoRow label={t("thesisType")} value={thesis.thesisType} />
        <InfoRow label={t("degree")} value={thesis.degree} />
        <InfoRow
          label={t("registrationDate")}
          value={thesis.registrationDate}
        />
        <InfoRow label={t("enrollmentDate")} value={thesis.enrollmentDate} />
        <InfoRow
          label={t("internalGrantDate")}
          value={thesis.internalGrantDate}
        />
        <InfoRow
          label={t("jointSupervisionGrantDate")}
          value={thesis.jointSupervisionGrantDate}
        />

        <div></div>
      </div>

      {/* Cards section */}
      <div className="grid grid-cols-3 gap-6">
        <SectionCardLongTitle title={t("committeeMembers")}>
          <ol className="list-decimal space-y-4 -mt-7 marker:text-[#B38E19] marker:font-extrabold">
            {thesis.committeeMembers.map((m, i) => (
              <li key={i}>
                <p
                  className={`text-lg font-semibold -mt-2 mb-2 ${m.highlight ? "text-[#B38E19]" : "text-black"}`}
                >
                  {m.name}
                </p>
                <p className="text-sm text-[#1A1A1ACC] leading-relaxed mb-4">
                  {m.role}
                </p>
                <p className="text-sm text-[#1A1A1ACC] leading-relaxed">
                  {m.college}
                </p>
              </li>
            ))}
          </ol>
        </SectionCardLongTitle>

        <SectionCardLongTitle title={t("derivedResearches")}>
          <div className="flex flex-col space-y-1 -mt-3">
            {thesis.derivedResearches.map((r, i) => (
              <div
                key={i}
                className="flex flex-row items-start"
                dir="ltr" // force LTR inside
              >
                <span className="font-extrabold text-[#B38E19] w-6 flex-shrink-0 text-lg">
                  {i + 1}.
                </span>
                <span className="text-[#B38E19] text-xl leading-none font-bold">
                  {r}
                </span>
              </div>
            ))}
          </div>
        </SectionCardLongTitle>

        <SectionCardLongTitle title={t("attachments")}>
          <div className="flex flex-col space-y-1 -mt-5">
            {thesis.attachments.map((att, i) => (
              <div key={i} className="flex flex-row items-start">
                <span className="font-extrabold text-[#B38E19] w-6 flex-shrink-0 ">
                  {i + 1}.
                </span>
                <span className="text-[#B38E19] text-xl">{att}</span>
              </div>
            ))}
          </div>
        </SectionCardLongTitle>
      </div>
    </div>
  );
}
