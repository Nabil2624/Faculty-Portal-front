import InfoRow from "../../ui/InfoRow";
import SectionCard from "../../ui/SectionCard";
import SectionCardLongTitle from "../../ui/SectionCardLongTitle";
export default function ThesesDetailsMobile({ thesis, t }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[600px] flex flex-col gap-6">
        {/* InfoRows stacked */}
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

        {/* Cards stacked */}

        <SectionCardLongTitle title={t("attachments")}>
          <ul className="list-disc list-inside text-[#B38E19] mt-5">
            {thesis.attachments.map((att, i) => (
              <li key={i}>{att}</li>
            ))}
          </ul>
        </SectionCardLongTitle>

        <SectionCardLongTitle title={t("derivedResearches")}>
          <div className="flex flex-col space-y-1 -mt-3">
            {thesis.derivedResearches.map((r, i) => (
              <div key={i} className="flex flex-row" dir="ltr">
                <span className="font-bold text-[#B38E19] w-6 flex-shrink-0">
                  {i + 1}.
                </span>
                <span className="text-[#B38E19] text-lg leading-none font-bold">
                  {r}
                </span>
              </div>
            ))}
          </div>
        </SectionCardLongTitle>

        <SectionCardLongTitle title={t("committeeMembers")}>
          <ol className="list-decimal space-y-4 -mt-7 marker:text-[#B38E19] marker:font-extrabold">
            {thesis.committeeMembers.map((m, i) => (
              <li key={i} className="flex flex-row" dir="ltr">
                <span className="font-bold w-6 flex-shrink-0">{i + 1}.</span>
                <div className="flex flex-col">
                  <p
                    className={`text-lg font-bold ${m.highlight ? "text-[#B38E19]" : "text-black"}`}
                  >
                    {m.name}
                  </p>
                  <p className="text-sm text-gray-700">{m.role}</p>
                  <p className="text-sm text-gray-700">{m.college}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCardLongTitle>
      </div>
    </div>
  );
}
