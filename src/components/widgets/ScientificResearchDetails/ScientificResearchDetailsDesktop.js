import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";
import AbstractWidget from "./AbstractWidget";
export default function ScientificResearchDetailsDesktop({ research, t }) {
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

  //  AUTO PREFIX LOGIC
  const getFullRelatedLink = (link) => {
    if (!link) return null;

    if (link.startsWith("http")) return link;

    if (link.startsWith("/")) {
      return `https://scholar.google.com${link}`;
    }

    return link;
  };

  const fullRelatedLink = getFullRelatedLink(research.relatedResearchLink);

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-10 h-20">
      {/* COLUMN 1 */}
      <div className="flex flex-col gap-6">
        <InfoRow label={t("doi")} value={research.doi} />
        <InfoRow label={t("publisher")} value={research.publisher} />
        <InfoRow label={t("issue")} value={mappedIssue} />

        <ContributorsWidget
          title={t("contributors")}
          contributors={mappedContributors}
        />
      </div>

      {/* COLUMN 2 */}
      <div className="flex flex-col gap-6">
        <InfoRow label={t("publishYear")} value={research.pubYear} />
        <InfoRow label={t("citations")} value={mappedCitations} />

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

        <div className="flex flex-col">
          <JournalsWidget title={t("journals")} journals={mappedJournals} />

          <AbstractWidget title={t("abstract")} abstract={research.abstract} />
        </div>
      </div>

      {/* COLUMN 3 */}
      <div className="flex flex-col gap-6">
        <InfoRow label={t("pages")} value={mappedPages} />
        <InfoRow label={t("source")} value={displaySource} />
        <InfoRow label={t("volume")} value={mappedVolume} />

        <CitationsWidget title={t("citations")} data={research.cites || []} />
      </div>
    </div>
  );
}
