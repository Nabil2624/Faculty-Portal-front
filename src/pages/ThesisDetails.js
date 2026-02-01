import useBreakpoint from "../hooks/useBreakpoint";
import ThesesDetailsMobile from "../components/widgets/ThesesDetails/ThesesDetailsMobile";
import ThesesDetailsTablet from "../components/widgets/ThesesDetails/ThesesDetailsTablet";
import ThesesDetailsDesktop from "../components/widgets/ThesesDetails/ThesesDetailsDesktop";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ResearchTitle from "../components/ui/ResearchTitle";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import LoadingSpinner from "../components/LoadingSpinner";
export default function ThesesDetails() {
  const { t, i18n } = useTranslation("ThesesDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data – replace with API call later
    setThesis({
      title: "AI Models for Predictive Maintenance in Industry 4.0",
      thesisType: "رسالة ماجستير",
      degree: "ماجستير",
      registrationDate: "2021-09-12",
      internalGrantDate: "2023-07-01",
      jointSupervisionGrantDate: "2023-08-15",
      attachments: ["محتوى الرسالة.pdf"],
      derivedResearches: [
        "Optic Disc Detection from Normalized Digital Fundus Images by means of a Vessels' Direction Matched Filter",
      ],
      committeeMembers: [
        {
          name: "أحمد ايمن عبدالعاطي",
          role: "استاذ مساعد - مشرف و محكم",
          college: "كلية الحاسبات و الذكاء الاصطناعي",
          highlight: true,
        },
        {
          name: "خالد عامر المصري",
          role: "استاذ مساعد - مشرف",
          college: "كلية الهندسة",
          highlight: false,
        },
      ],
    });
  }, []);

  if (!thesis) return null;

  if (loading) return <LoadingSpinner />;
  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderAction
          title={t("title")}
          actionLabel={t("edit")}
          onAction={() => console.log("Edit clicked")}
        />

        <ResearchTitle title={thesis.title} />

        {bp === "mobile" && <ThesesDetailsMobile thesis={thesis} t={t} />}
        {bp === "tablet" && <ThesesDetailsTablet thesis={thesis} t={t} />}
        {bp === "desktop" && <ThesesDetailsDesktop thesis={thesis} t={t} />}
      </div>
    </ResponsiveLayoutProvider>
  );
}
