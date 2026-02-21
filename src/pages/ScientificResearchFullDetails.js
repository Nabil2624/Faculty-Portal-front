import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import ResearchTitle from "../components/ui/ResearchTitle";
import LoadingSpinner from "../components/LoadingSpinner";

import ScientificResearchSummaryModal from "../components/widgets/ScientificResearchFullDetails/ScientificResearchSummaryModal";
import ScientificResearchFullDetailsMobile from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsMobile";
import ScientificResearchFullDetailsTablet from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsTablet";
import ScientificResearchFullDetailsDesktop from "../components/widgets/ScientificResearchFullDetails/ScientificResearchFullDetailsDesktop";

import { getResearchDetails } from "../services/scientificResearchService";

export default function ScientificResearchFullDetails() {
  const { t, i18n } = useTranslation("ScientificResearchFullDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();

  const [showSummary, setShowSummary] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [research, setResearch] = useState(location.state?.research || null);
  useEffect(() => {
    if (!research) {
      navigate(-1);
    }
  }, [research, navigate]);

  if (!research) return null;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction
          title={t("title")}
          actionLabel={t("edit")}
          onClick={() =>
            navigate("/edit-scientific-research", {
              state: { research },
            })
          }
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
