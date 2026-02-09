import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";

export default function ScientificResearchDetailsDesktop({ research, t }) {
  // Map backend data to frontend-friendly format
  const mappedContributors = (research.contributions || []).map(
    (c) => c.memberAcademicName,
  );

  const mappedJournals = research.journalOrConfernce
    ? [research.journalOrConfernce]
    : [];

  const mappedCitations = research.noOfCititations;

  const mappedPages = research.noOfPages;

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-10">
      <div className="flex flex-col gap-6">
        <InfoRow label={t("doi")} value={research.doi} />
        <InfoRow label={t("publisher")} value={research.publisher} />
        <ContributorsWidget
          title={t("contributors")}
          contributors={mappedContributors}
        />
      </div>

      <div className="flex flex-col gap-6">
        <InfoRow label={t("publishYear")} value={research.pubYear} />
        <InfoRow label={t("citations")} value={mappedCitations} />
        <JournalsWidget title={t("journals")} journals={mappedJournals} />
      </div>

      <div className="flex flex-col gap-6">
        <InfoRow label={t("pages")} value={mappedPages} />
        <InfoRow label={t("source")} value={research.source} />
        <CitationsWidget title={t("citations")} data={research.cites || []} />
      </div>
    </div>
  );
}
