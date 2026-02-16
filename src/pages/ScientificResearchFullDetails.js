import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const [showSummary, setShowSummary] = useState(false);
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getResearchDetails(id)
      .then((res) => {
        setResearch(res);
      })
      .catch((err) => {
        console.error(err);
        navigate(-1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!research) return null;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction
          title={t("title")}
          actionLabel={t("edit")}
          onClick={() => navigate(`/edit-scientific-research/${research.id}`)}
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
