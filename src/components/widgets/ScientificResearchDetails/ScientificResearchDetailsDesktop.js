import researchService from "../../../services/researchService";
import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";
export default function ScientificResearchDetailsDesktop({ research, t }) {
  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-10">
      <div className="flex flex-col gap-6">
        <InfoRow label={t("doi")} value={research.doi} />
        <InfoRow label={t("publisher")} value={research.publisher} />
        <ContributorsWidget
          title={t("contributors")}
          contributors={research.contributors}
        />
      </div>

      <div className="flex flex-col gap-6">
        <InfoRow label={t("publishYear")} value={research.publishYear} />
        <InfoRow label={t("citations")} value={research.citations} />
        <JournalsWidget title={t("journals")} journals={research.journals} />
      </div>

      <div className="flex flex-col gap-6">
        <InfoRow label={t("pages")} value={research.pages} />
        <InfoRow label={t("source")} value={research.source} />
        <CitationsWidget title={t("citations")} />
      </div>
    </div>
  );
}
