import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useBreakpoint from "../hooks/useBreakpoint";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import ResearchTitle from "../components/ui/ResearchTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import SupervisionInfoMobile from "../components/widgets/SupervisionInfo/SupervisionInfoMobile";
import SupervisionInfoTablet from "../components/widgets/SupervisionInfo/SupervisionInfoTablet";
import SupervisionInfoDesktop from "../components/widgets/SupervisionInfo/SupervisionInfoDesktop";
import PageHeaderLongAction from "../components/ui/PageHeaderLongAction";
import { useLocation, useNavigate } from "react-router-dom";

export default function SupervisionInfo() {
  const { t, i18n } = useTranslation("SupervisionInfo");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setInfo(location.state);
    } else {
      // If user refreshes page, go back safely
      navigate("/supervision-thesis");
    }
  }, [location.state, navigate]);

  if (!info) return null;

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderLongAction
          title={t("title")}
          actionLabel={t("edit")}
          onAction={() => console.log("Edit clicked")}
        />

        <ResearchTitle title={t("subtitle")} />

        {bp === "mobile" && <SupervisionInfoMobile info={info} t={t} />}
        {bp === "tablet" && <SupervisionInfoTablet info={info} t={t} />}
        {bp === "desktop" && <SupervisionInfoDesktop info={info} t={t} />}
      </div>
    </ResponsiveLayoutProvider>
  );
}
