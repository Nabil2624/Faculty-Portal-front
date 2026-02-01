import InfoRow from "../../ui/InfoRow";
import SectionCardLongTitle from "../../ui/SectionCardLongTitle";

export default function ScientificResearchFullDetailsMobile({ research, t }) {
  return (
    <div className="flex flex-col gap-6 px-4 max-w-[420px] mx-auto">
      {/* Info */}
      <div className="flex flex-col gap-4">
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
              className="text-[#B38E19] font-semibold hover:underline"
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

      {/* Attachments */}
      <SectionCardLongTitle title={t("attachments")}>
        <ol className="space-y-2 mt-2">
          {research.attachments.map((a, i) => (
            <li key={i} className="flex">
              <span className="font-bold text-[#B38E19] w-6 gap-1">
                {i + 1}.
              </span>
              <span className="text-[#B38E19]">{a}</span>
            </li>
          ))}
        </ol>
      </SectionCardLongTitle>

      {/* External contributors */}
      <SectionCardLongTitle title={t("externalContributors")}>
        {research.externalContributors.length === 0 ? (
          <p className="text-gray-500 mt-2">{t("none")}</p>
        ) : null}
      </SectionCardLongTitle>
      {/* Internal contributors */}
      <SectionCardLongTitle title={t("internalContributors")}>
        <ol className="space-y-4 -mt-4">
          {research.internalContributors.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-bold text-[#B38E19] w-6">{i + 1}.</span>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#B38E19]">{c.name}</p>
                <p className="text-sm text-gray-700">{c.role}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionCardLongTitle>
    </div>
  );
}
