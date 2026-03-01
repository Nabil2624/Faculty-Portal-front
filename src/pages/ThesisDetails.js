import { useParams } from "react-router-dom";

import useBreakpoint from "../hooks/useBreakpoint";
import ThesesDetailsMobile from "../components/widgets/ThesesDetails/ThesesDetailsMobile";
import ThesesDetailsTablet from "../components/widgets/ThesesDetails/ThesesDetailsTablet";
import ThesesDetailsDesktop from "../components/widgets/ThesesDetails/ThesesDetailsDesktop";
import { useTranslation } from "react-i18next";
import ResearchTitle from "../components/ui/ResearchTitle";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ThesesDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation("ThesesDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();

  const thesis = location.state?.thesis;

  // 🔥 حماية مهمة جدا
  useEffect(() => {
    if (!thesis) {
      navigate("/theses", { replace: true });
    }
  }, [thesis, navigate]);

  if (!thesis) return null;
  // Transform API data to match your existing design
  const formattedThesis = {
    title: thesis.title,
    thesisType: t(thesis.type?.toLowerCase()),
    degree: isArabic ? thesis.grade?.valueAr : thesis.grade?.valueEn,
    registrationDate: thesis.registrationDate,
    enrollmentDate: thesis.enrollmentDate,
    internalGrantDate: thesis.internalGradeDate,
    jointSupervisionGrantDate: thesis.supervisionConfirmationDate,
    attachments: thesis.attachments?.map((a) => a.fileName) || [],
    derivedResearches: thesis.researches?.map((r) => r.title) || [],
    committeeMembers:
      thesis.comitteeMembers?.map((s) => ({
        name: s.name,
        role: (() => {
          const roleMap = {
            Adminstration: "administration",
            Reviewing: "supervising",
            3: "administrationAndSupervising",
          };

          return t(roleMap[s.role] || s.role);
        })(),

        college: isArabic ? s.jobLevel?.valueAr : s.jobLevel?.valueEn,
        highlight: false,
      })) || [],
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction
          title={t("title")}
          actionLabel={t("edit")}
          onClick={() =>
            navigate("/edit-thesis", {
              state: { thesis },
            })
          }
        />

        <ResearchTitle title={formattedThesis.title} />

        {bp === "mobile" && (
          <ThesesDetailsMobile thesis={formattedThesis} t={t} />
        )}
        {bp === "tablet" && (
          <ThesesDetailsTablet thesis={formattedThesis} t={t} />
        )}
        {bp === "desktop" && (
          <ThesesDetailsDesktop thesis={formattedThesis} t={t} />
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
