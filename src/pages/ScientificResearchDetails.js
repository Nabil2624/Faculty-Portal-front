import useBreakpoint from "../hooks/useBreakpoint";
import ScientificResearchDetailsMobile from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsMobile";
import ScientificResearchDetailsTablet from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsTablet";
import ScientificResearchDetailsDesktop from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsDesktop";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ResearchTitle from "../components/ui/ResearchTitle";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeaderAction from "../components/ui/PageHeaderAction";

export default function ScientificResearchDetails() {
  const { t, i18n } = useTranslation("ScientificResearchDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch data
  useEffect(() => {
    import("../services/researchService").then(({ getResearchDetails }) => {
      getResearchDetails().then(setResearch);
    });
  }, []);

  // render nothing until research is loaded
  if (!research) return null;

  if (loading) return <LoadingSpinner />;
  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction title={t("title")} actionLabel={t("showFull")} />
        <ResearchTitle title={research.title} />

        {bp === "mobile" && (
          <ScientificResearchDetailsMobile research={research} t={t} />
        )}

        {bp === "tablet" && (
          <ScientificResearchDetailsTablet research={research} t={t} />
        )}

        {bp === "desktop" && (
          <ScientificResearchDetailsDesktop research={research} t={t} />
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
