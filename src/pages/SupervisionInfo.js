import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useBreakpoint from "../hooks/useBreakpoint";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import ResearchTitle from "../components/ui/ResearchTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import SupervisionInfoMobile from "../components/widgets/SupervisionInfo/SupervisionInfoMobile";
import SupervisionInfoTablet from "../components/widgets/SupervisionInfo/SupervisionInfoTablet";
import SupervisionInfoDesktop from "../components/widgets/SupervisionInfo/SupervisionInfoDesktop";
import PageHeaderLongAction from "../components/ui/PageHeaderLongAction";
export default function SupervisionInfo() {
  const { t, i18n } = useTranslation("SupervisionInfo");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // mock for now – replace with real service later
    setInfo({
      thesisType: "رسالة ماجستير",
      role: "مشرف",
      studentName: "أحمد محمد علي",
      specialization: "علوم الحاسب",
      degree: "ماجستير",
      registrationDate: "2021-09-12",
      formationDate: "2022-01-20",
      discussionDate: "2023-06-10",
      grantDate: "2023-07-01",
      university: "جامعة القاهرة - كلية الحاسبات",
    });
  }, []);

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
