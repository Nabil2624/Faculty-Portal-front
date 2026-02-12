import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";
import AbstractWidget from "./AbstractWidget";

export default function ScientificResearchDetailsTablet({ research, t }) {
  const mappedContributors = (research.contributions || []).map(
    (c) => c.memberAcademicName,
  );

  const mappedJournals = research.journalOrConfernce
    ? [research.journalOrConfernce]
    : [];

  const mappedCitations = research.noOfCititations;
  const mappedPages = research.noOfPages;
  const mappedIssue = research.issue;
  const mappedVolume = research.volume;

  const sourceMap = {
    External: "Google Scholar",
  };
  const displaySource = sourceMap[research.source] || research.source;

  const getFullRelatedLink = (link) => {
    if (!link) return null;
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return `https://scholar.google.com${link}`;
    return link;
  };

  const fullRelatedLink = getFullRelatedLink(research.relatedResearchLink);

  return (
    <div className="flex w-full min-h-screen bg-gray-50 py-6 px-6">
      <div className="max-w-[1024px] w-full flex flex-col gap-6 items-start">
        {/* Info rows */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <InfoRow label={t("doi")} value={research.doi} />
          <InfoRow label={t("publisher")} value={research.publisher} />
          <InfoRow label={t("publishYear")} value={research.pubYear} />
          <InfoRow label={t("citations")} value={mappedCitations} />
          <InfoRow label={t("pages")} value={mappedPages} />
          <InfoRow label={t("source")} value={displaySource} />
          <InfoRow label={t("volume")} value={mappedVolume} />
          <InfoRow
            label={t("relatedResearch")}
            value={
              fullRelatedLink ? (
                <a
                  href={fullRelatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B38E19] underline hover:opacity-80 transition"
                >
                  {t("viewRelated")}
                </a>
              ) : (
                "-"
              )
            }
          />
        </div>

        {/* Widgets */}
        <div className="w-full flex flex-col gap-4 -translate-x-32">
          <AbstractWidget title={t("abstract")} abstract={research.abstract} />

          <ContributorsWidget
            title={t("contributors")}
            contributors={mappedContributors}
          />

          <JournalsWidget title={t("journals")} journals={mappedJournals} />

          <CitationsWidget title={t("citations")} data={research.cites || []} />
        </div>
      </div>
    </div>
  );
}
