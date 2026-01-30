// export default function ScientificResearchDetails() {
//   const { t, i18n } = useTranslation("ScientificResearchDetails");
//   const isArabic = i18n.language === "ar";

//   useEffect(() => {
//     getResearchDetails().then(setResearch);
//   }, []);

//   if (!research) return null;

//   return (
//     <ResponsiveLayoutProvider>
//       <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
//         <PageHeaderAction title={t("title")} actionLabel={t("showFull")} />
//         <ResearchTitle title={research.title} />

//         <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-10">
//           <div className="flex flex-col gap-6">
//             <InfoRow label={t("doi")} value={research.doi} />
//             <InfoRow label={t("publisher")} value={research.publisher} />
//             <ContributorsWidget
//               title={t("contributors")}
//               contributors={research.contributors}
//             />
//           </div>

//           <div className="flex flex-col gap-6">
//             <InfoRow label={t("publishYear")} value={research.publishYear} />
//             <InfoRow label={t("citations")} value={research.citations} />
//             <JournalsWidget
//               title={t("journals")}
//               journals={research.journals}
//             />
//           </div>

//           <div className="flex flex-col gap-6">
//             <InfoRow label={t("pages")} value={research.pages} />
//             <InfoRow label={t("source")} value={research.source} />
//             <CitationsWidget title={t("citations")} />{" "}
//           </div>
//         </div>
//       </div>
//     </ResponsiveLayoutProvider>
//   );
// }
import useBreakpoint from "../hooks/useBreakpoint";
import ScientificResearchDetailsMobile from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsMobile";
import ScientificResearchDetailsTablet from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsTablet";
import ScientificResearchDetailsDesktop from "../components/widgets/ScientificResearchDetails/ScientificResearchDetailsDesktop";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ResearchTitle from "../components/ui/ResearchTitle";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import PageHeaderAction from "../components/ui/PageHeaderAction";

export default function ScientificResearchDetails() {
  const { t, i18n } = useTranslation("ScientificResearchDetails");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [research, setResearch] = useState(null);

  // fetch data
  useEffect(() => {
    import("../services/researchService").then(({ getResearchDetails }) => {
      getResearchDetails().then(setResearch);
    });
  }, []);

  // render nothing until research is loaded
  if (!research) return null;

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
