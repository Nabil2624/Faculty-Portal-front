import InfoRow from "../../ui/InfoRow";
import SectionCardLongTitle from "../../ui/SectionCardLongTitle";
import AbstractWidget from "../ScientificResearchDetails/AbstractWidget";
import JournalsWidget from "../ScientificResearchDetails/JournalsWidget";
import { useTranslation } from "react-i18next";

export default function ScientificResearchFullDetailsMobile({ research, t }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const safeLink = research.researchLink;

  
      const formatContributorMeta = (c) => {
  // Main / Co
  const role = c.isTheMajorResearcher
    ? t("mainResearcher")
    : t("coResearcher");

  // From University / External
  let source = "";

  if (
    c.contributorType === "FromUniverstity" ||
    c.contributorType === 0
  ) {
    source = isArabic ? "من الجامعة" : "From University";
  } else if (c.contributorType === "ExternalContributor") {
    source = isArabic ? "خارج الجامعة" : "External";
  }

  return `${role} - ${source}`;
};
  const formatValue = (value) => {
    if (!value || typeof value !== "string") return value;

    const lower = value.toLowerCase();

    if (lower.includes("phd") || lower.includes("ph.d")) {
      return isArabic ? "دكتوراه" : "PhD";
    }

    if (
      lower.includes("master") ||
      lower.includes("master’s") ||
      lower.includes("masters")
    ) {
      return isArabic ? "ماجستير" : "Master’s";
    }

        // Other detection
        if (lower.includes("other")) {
  return isArabic ? "أخرى" : "Other";
}

     // Internal / Local detection
    if (lower.includes("internal") || lower.includes("local")) {
      return isArabic ? "محلي" : "Internal";
    }

    if (lower.includes("international")) {
  return isArabic ? "دولي" : "International";
}

    if (lower.includes("magazine")) {
  return isArabic ? "مجلة" : "Magazine";
}

if (lower.includes("conference")) {
  return isArabic ? "مؤتمر" : "Conference";
}
    return value;
  };

  return (
    <div className="flex flex-col gap-6 px-4 max-w-[420px] mx-auto">
      {/* Info */}
      <div className="flex flex-col gap-4">
        <InfoRow label={t("publisher")} value={research.publisher || "-"} />

        <InfoRow
          label={t("journalOrConference")}
          value={research.journalOrConfernce || "-"}
        />

        <InfoRow label={t("issue")} value={research.issue || "-"} />

        <InfoRow label={t("volume")} value={formatValue(research.publisherType) || "-"} />

        <InfoRow label={t("pages")} value={research.noOfPages || "-"} />

        <InfoRow label={t("year")} value={research.pubYear || "-"} />

        <InfoRow
          label={t("publicationType")}
          value={formatValue(research.publicationType) || "-"}
        />

        <InfoRow
          label={t("derivedFrom")}
          value={formatValue(research.researchDerivedFrom) || "-"}
        />

        <InfoRow
          label={t("link")}
          value={
            safeLink ? (
              <a
                href={
                  safeLink.startsWith("http") ? safeLink : `https://${safeLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B38E19] font-semibold underline"
              >
                {safeLink.split("/")[0]}
              </a>
            ) : (
              "-"
            )
          }
        />
      </div>

      {/* Journals */}
      <JournalsWidget
        title={t("journals")}
        journals={
          research.journalOrConfernce ? [research.journalOrConfernce] : []
        }
      />

      {/* Abstract */}
      <AbstractWidget title={t("abstract")} abstract={research.abstract} />

      {/* Internal Contributors */}
      <SectionCardLongTitle title={t("internalContributors")}>
        <ol className="space-y-4 -mt-4">
            {[...(research.contributions || [])].reverse().map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-[#B38E19] w-6">{i + 1}.</span>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-[#B38E19]">
                    {c.memberAcademicName}
                  </p>
              <p className="text-sm text-gray-700">
  {formatContributorMeta(c)}
</p>
    
                </div>
              </li>
            ))}
          </ol>
      </SectionCardLongTitle>

      {/* Attachments */}
      <SectionCardLongTitle title={t("attachments")}>
        <ol className="space-y-2 -mt-4">
          {(research.attachments || []).map((a, i) => (
            <li key={i} className="flex items-center">
              <span className="text-[#B38E19] font-bold w-6">{i + 1}.</span>
              <span className="text-[#B38E19] text-lg">{a.fileName || a}</span>
            </li>
          ))}
        </ol>
      </SectionCardLongTitle>
    </div>
  );
}
