import ContributorsWidget from "./ContributorsWidget";
import JournalsWidget from "./JournalsWidget";
import CitationsWidget from "./CitationsWidget";

import InfoRow from "../../ui/InfoRow";

export default function ScientificResearchDetailsMobile({ research, t }) {
  return (
    <div className="flex justify-center">
      <div className=" max-w-[600px] flex flex-col gap-4">
        <InfoRow label={t("doi")} value={research.doi} />
        <InfoRow label={t("publisher")} value={research.publisher} />
        <InfoRow label={t("publishYear")} value={research.publishYear} />
        <InfoRow label={t("citations")} value={research.citations} />
        <InfoRow label={t("pages")} value={research.pages} />
        <InfoRow label={t("source")} value={research.source} />

        <ContributorsWidget
          title={t("contributors")}
          contributors={research.contributors || []}
        />
        <JournalsWidget
          title={t("journals")}
          journals={research.journals || []}
        />
        <CitationsWidget title={t("citations")} />
      </div>
    </div>
  );
}
