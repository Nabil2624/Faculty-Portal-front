import researchService from "../../../services/researchService";
import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";
import InfoRow from "../../ui/InfoRow";

export default function ScientificResearchDetailsTablet({ research, t }) {
  return (
    <div className="flex w-full min-h-screen bg-gray-50 py-8 px-4">
      {/* Align everything to the left side */}
      <div className="max-w-[1024px] w-full flex flex-col gap-8 items-start md:items-start">
        {/* Info rows on the left */}
        <div className="space-y-4 w-full">
          <InfoRow label={t("doi")} value={research.doi} />
          <InfoRow label={t("publisher")} value={research.publisher} />
          <InfoRow label={t("publishYear")} value={research.publishYear} />
          <InfoRow label={t("citations")} value={research.citations} />
          <InfoRow label={t("pages")} value={research.pages} />
          <InfoRow label={t("source")} value={research.source} />
        </div>

        {/* Cards section moved to the left */}
        <div className="w-full space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContributorsWidget
              title={t("contributors")}
              contributors={research.contributors || []}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <JournalsWidget
              title={t("journals")}
              journals={research.journals || []}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CitationsWidget title={t("citations")} />
          </div>
        </div>
      </div>
    </div>
  );
}
