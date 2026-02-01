import useBreakpoint from "../hooks/useBreakpoint";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderDualAction from "../components/ui/PageHeaderDualAction";
import ResearchTitle from "../components/ui/ResearchTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ScientificResearchSummaryModal from "../components/widgets/ScientificResearchFullDetails/ScientificResearchSummaryModal";
import ScientificResearchFullDetailsMobile from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsMobile";
import ScientificResearchFullDetailsTablet from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsTablet";
import ScientificResearchFullDetailsDesktop from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsDesktop";

export default function ScientificResearchFullDetails() {
  const { t, i18n } = useTranslation("ScientificResearchFullDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();

  const [showSummary, setShowSummary] = useState(false);
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResearch({
      title: "AI in Educational Research",
      publisher: "جامعة الإسكندرية",
      publishingBody: "مجلة",
      issueNumber: "3",
      journalOrConference: "مجلة البحوث التربوية",
      link: "www.ieee-aiconf.org",
      pages: "11",
      publicationType: "محلي",
      year: "2025",
      derivedFrom: "رسالة ماجستير",
      attachments: ["مقال البحث.pdf"],
      internalContributors: [
        {
          name: "احمد ايمن عبدالعاطي",
          role: "باحث رئيسي",
          college: "كلية التربية",
        },
      ],
      externalContributors: [],
      contributors: [
        {
          name: "احمد ايمن عبدالعاطي",
          role: "باحث رئيسي",
          college: "كلية التربية",
        },
      ],
      citations: 12,

      // **Add text here for grey boxes**
      relatedResearch:
        "هذا البحث يستند إلى أبحاث سابقة في مجال الذكاء الاصطناعي في التعليم.",
      abstract:
        "الملخص: يتناول البحث استخدام الذكاء الاصطناعي لتحسين طرق التعلم والتعليم في المدارس والجامعات.",
    });
  }, []);

  if (!research) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderDualAction
          title={t("title")}
          primaryLabel={t("summary")}
          secondaryLabel={t("edit")}
          onPrimary={() => setShowSummary(true)}
          onSecondary={() => console.log("Edit")}
        />

        <ResearchTitle title={research.title} />

        {bp === "mobile" && (
          <ScientificResearchFullDetailsMobile research={research} t={t} />
        )}
        {bp === "tablet" && (
          <ScientificResearchFullDetailsTablet research={research} t={t} />
        )}
        {bp === "desktop" && (
          <ScientificResearchFullDetailsDesktop research={research} t={t} />
        )}
      </div>

      {showSummary && (
        <ScientificResearchSummaryModal
          research={research}
          isArabic={isArabic}
          t={t}
          onClose={() => setShowSummary(false)}
        />
      )}
    </ResponsiveLayoutProvider>
  );
}
