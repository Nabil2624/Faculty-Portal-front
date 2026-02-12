import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useBreakpoint from "../hooks/useBreakpoint";

import ScientificResearchDetailsMobile from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsMobile";
import ScientificResearchDetailsTablet from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsTablet";
import ScientificResearchDetailsDesktop from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsDesktop";

import PageHeaderAction from "../components/ui/PageHeaderAction";
import ResearchTitle from "../components/ui/ResearchTitle";

import { getResearchDetails } from "../services/scientificResearchService";

export default function ScientificResearchDetails() {
  const { t, i18n } = useTranslation("ScientificResearchDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const location = useLocation();
  const { id } = useParams();

  // State for research
  const [research, setResearch] = useState(location.state?.research || null);
  const [loading, setLoading] = useState(!research); // only loading if we need to fetch

  useEffect(() => {
    if (id) {
      getResearchDetails(id).then(setResearch);
    }
  }, [id]);
  // Fetch research details if we don't have it already
  useEffect(() => {
    if (!research && id) {
      setLoading(true);
      getResearchDetails(id)
        .then((res) => setResearch(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, research]);

  if (loading || !research) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction
          title={t("title")}
          actionLabel={t("showFull")}
          onClick={() => {
            if (research?.researchLink) {
              window.open(research.researchLink, "_blank"); // open in new tab
            }
          }}
        />

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
