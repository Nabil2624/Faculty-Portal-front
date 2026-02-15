import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";
import AbstractWidget from "./AbstractWidget";

export default function ScientificResearchDetailsMobile({ research, t }) {
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

  // Auto prefix related link
  const getFullRelatedLink = (link) => {
    if (!link) return null;
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return `https://scholar.google.com${link}`;
    return link;
  };

  const fullRelatedLink = getFullRelatedLink(research.relatedResearchLink);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* DOI */}
      <InfoRow label={t("doi")} value={research.doi} />
      <InfoRow label={t("publisher")} value={research.publisher} />
      <InfoRow label={t("issue")} value={mappedIssue} />
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
      {/* Pages, Source, Volume */}
      <InfoRow label={t("pages")} value={mappedPages} />
      <InfoRow label={t("source")} value={displaySource} />
      <InfoRow label={t("volume")} value={mappedVolume} />

      {/* Abstract Widget */}
      <AbstractWidget title={t("abstract")} abstract={research.abstract} />

      {/* Journals Widget */}
      <JournalsWidget title={t("journals")} journals={mappedJournals} />

      {/* Contributors Widget */}
      <ContributorsWidget
        title={t("contributors")}
        contributors={mappedContributors}
      />

      {/* Citations Widget */}
      <CitationsWidget title={t("citations")} data={research.cites || []} />
    </div>
  );
}
