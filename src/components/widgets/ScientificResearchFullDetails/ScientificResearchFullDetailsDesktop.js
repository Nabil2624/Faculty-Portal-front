import InfoRow from "../../ui/InfoRow";
import SectionCardLongTitle from "../../ui/SectionCardLongTitle";

export default function ScientificResearchFullDetailsDesktop({ research, t }) {
  return (
    <div className="flex flex-col gap-4 max-w-[1400px] mx-auto">
      {/* InfoRows */}
      <div className="grid grid-cols-3 gap-x-16 gap-y-6">
        <InfoRow label={t("publisher")} value={research.publisher} />
        <InfoRow label={t("publishingBody")} value={research.publishingBody} />
        <InfoRow label={t("issueNumber")} value={research.issueNumber} />

        <InfoRow
          label={t("journalOrConference")}
          value={research.journalOrConference}
        />
        <InfoRow
          label={t("link")}
          value={
            <a
              href={`https://${research.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B38E19] font-semibold underline"
            >
              {research.link.split("/")[0]}
            </a>
          }
        />
        <InfoRow label={t("pages")} value={research.pages} />

        <InfoRow
          label={t("publicationType")}
          value={research.publicationType}
        />
        <InfoRow label={t("year")} value={research.year} />
        <InfoRow label={t("derivedFrom")} value={research.derivedFrom} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-x-16">
        <SectionCardLongTitle title={t("internalContributors")}>
          <ol className="space-y-4 -mt-4">
            {research.internalContributors.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-[#B38E19] w-6">{i + 1}.</span>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-[#B38E19]">
                    {c.name}
                  </p>
                  <p className="text-sm text-gray-700">{c.role}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCardLongTitle>

        <SectionCardLongTitle
          title={t("externalContributors")}
          className="-ml-8 pt-0"
        >
          {research.externalContributors.length === 0 ? (
            <p className="text-gray-950 font-semibold mt-0">{t("none")}</p>
          ) : null}
        </SectionCardLongTitle>

        <SectionCardLongTitle title={t("attachments")}>
          <ol className="space-y-2 -mt-4">
            {research.attachments.map((a, i) => (
              <li key={i} className="flex items-center gap-0">
                <span className="text-[#B38E19] font-bold w-6 list-outside">
                  {i + 1}.
                </span>
                <span className="text-[#B38E19] text-lg">{a}</span>
              </li>
            ))}
          </ol>
        </SectionCardLongTitle>
      </div>
    </div>
  );
}
