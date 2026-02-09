// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
// import LoadingSpinner from "../components/LoadingSpinner";
// import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
// import InfoRow from "../components/ui/InfoRow";
// import CitationsWidgetExtended from "../components/widgets/ResearcherProfile/CitationsWidgetExtended";
// import profileImage from "../assets/profileImage.png";
// export default function ResearcherProfile() {
//   const { t, i18n } = useTranslation("ResearcherProfile");
//   const isArabic = i18n.language === "ar";

//   const [researcher, setResearcher] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);

//     setTimeout(() => {
//       setResearcher({
//         name: "Ahmed A. Abdulatty",
//         title: "Professor of Computer Science, Faculty of Computing and AI",
//         avatar: profileImage,
//         orcid: "https://orcid.org/0000-0002-2987",
//         scholar: "https://scholar.google.com/citations?user=0r1HKREAAAAJ&hl=en",
//         emailDomain: "capu.edu.eg",
//         organizationId: "203902439209339",
//         interests: null,
//       });

//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   if (!researcher) return null;

//   return (
//     <ResponsiveLayoutProvider>
//       <div className={`${isArabic ? "rtl" : "ltr"} p-6 max-w-[1600px] mx-auto`}>
//         <PageHeaderNoAction title={t("title")} />

//         {/* ================= PROFILE HEADER ================= */}
//         <div className="flex flex-col sm:flex-row-reverse sm:justify-start items-center sm:items-start gap-8 mb-12">
//           <div className="rounded-full border-[3px] border-[#B38E19] p-1">
//             <img
//               src={researcher.avatar}
//               alt={researcher.name}
//               className="w-32 h-32 rounded-full object-cover"
//             />
//           </div>

//           <div className="text-center sm:text-left ml-0 sm:ml-11">
//             <h1 className="text-5xl font-bold text-[#19355A] mt-5">
//               {researcher.name}
//             </h1>
//             <p className="text-2xl text-gray-700 mt-4 max-w-[650px]">
//               {researcher.title}
//             </p>
//           </div>
//         </div>

//         {/* ================= MAIN CONTENT ================= */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-x-20 lg:gap-y-6 items-start">
//           {/* RIGHT COLUMN */}
//           <div
//             className={`flex flex-col gap-6 mt-6
//   ${isArabic ? "lg:mr-24" : "lg:mr-24"}
// `}
//           >
//             <InfoRow
//               label="ORCID ID"
//               labelWidth="w-44"
//               valueWidth="w-80"
//               value={
//                 <a
//                   href={researcher.orcid}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline text-[#B38E19] font-semibold"
//                 >
//                   {researcher.orcid}
//                 </a>
//               }
//             />

//             <InfoRow
//               label="Google Scholar"
//               labelWidth="w-44"
//               valueWidth="w-80"
//               value={
//                 <a
//                   href={researcher.scholar}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline text-[#B38E19] font-semibold"
//                 >
//                   scholar.google.com
//                 </a>
//               }
//             />

//             <InfoRow
//               label="Organizational Email Domain"
//               value={researcher.emailDomain}
//               labelWidth="w-44"
//               valueWidth="w-80"
//             />

//             <InfoRow
//               label="Organization ID"
//               value={researcher.organizationId}
//               labelWidth="w-44"
//               valueWidth="w-80"
//             />

//             {/* ================= INTERESTS ================= */}
//             <div className="mt-4">
//               <h3 className="text-xl font-bold">{t("interestsTitle")}</h3>
//               <div
//                 className={`bg-[#EDEDED] border border-[#19355A] rounded-xl
//       min-h-[65px]
//       flex items-center justify-center
//       p-4 text-center text-gray-600
//       max-w-[490px] ${isArabic ? "ml-auto" : "mr-auto"}`}
//               >
//                 {researcher.interests || t("notFound")}
//               </div>
//             </div>
//           </div>

//           {/* LEFT COLUMN */}
//           <div
//             className={`mt-8 lg:mt-0 ${isArabic ? "lg:-mr-10" : "lg:-mr-10"}`}
//           >
//             <CitationsWidgetExtended />
//           </div>
//         </div>
//       </div>
//     </ResponsiveLayoutProvider>
//   );
// }

import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import InfoRow from "../components/ui/InfoRow";
import CitationsWidgetExtended from "../components/widgets/ResearcherProfile/CitationsWidgetExtended";

import useResearcherProfile from "../hooks/useResearcherProfile";

export default function ResearcherProfile() {
  const { t, i18n } = useTranslation("ResearcherProfile");
  const isArabic = i18n.language === "ar";

  const { researcher, loading, error } = useResearcherProfile();

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!researcher) return null;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 max-w-[1600px] mx-auto`}>
        <PageHeaderNoAction title={t("title")} />

        {/* ================= PROFILE HEADER ================= */}
        <div className="flex flex-col sm:flex-row-reverse sm:justify-start items-center sm:items-start gap-8 mb-12">
          <div className="rounded-full border-[3px] border-[#B38E19] p-1">
            <img
              src={researcher.scholarProfileImageURL}
              alt={researcher.academicName}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          <div className="text-center sm:text-left ml-0 sm:ml-11">
            <h1 className="text-5xl font-bold text-[#19355A] mt-5">
              {researcher.academicName}
            </h1>
            <p className="text-2xl text-gray-700 mt-4 max-w-[650px]">
              {researcher.jobTitle}
            </p>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-x-20 lg:gap-y-6 items-start">
          {/* RIGHT COLUMN */}
          <div
            className={`flex flex-col gap-6 mt-6 ${isArabic ? "lg:mr-24" : "lg:mr-24"}`}
          >
            <InfoRow
              label="ORCID ID"
              labelWidth="w-44"
              valueWidth="w-80"
              value={
                <a
                  href={researcher.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#B38E19] font-semibold"
                >
                  {researcher.orcid}
                </a>
              }
            />

            <InfoRow
              label="Google Scholar"
              labelWidth="w-44"
              valueWidth="w-80"
              value={
                <a
                  href={researcher.scholarProfileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#B38E19] font-semibold"
                >
                  scholar.google.com
                </a>
              }
            />

            <InfoRow
              label="Organizational Email Domain"
              value={researcher.organisationalDomain}
              labelWidth="w-44"
              valueWidth="w-80"
            />

            <InfoRow
              label="Organization ID"
              value={researcher.organisationId}
              labelWidth="w-44"
              valueWidth="w-80"
            />

            {/* ================= INTERESTS ================= */}
            <div className="mt-4">
              <h3 className="text-xl font-bold">{t("interestsTitle")}</h3>
              <div
                className={`bg-[#EDEDED] border border-[#19355A] rounded-xl
                  min-h-[65px]
                  flex items-center justify-center
                  p-4 text-center text-gray-600
                  max-w-[490px] ${isArabic ? "ml-auto" : "mr-auto"}`}
              >
                {researcher.researcherInterests?.length
                  ? researcher.researcherInterests.map((i) => i.name).join(", ")
                  : t("notFound")}
              </div>
            </div>
          </div>

          {/* LEFT COLUMN */}
          <div
            className={`mt-8 lg:mt-0 ${isArabic ? "lg:-mr-10" : "lg:-mr-10"}`}
          >
            <CitationsWidgetExtended data={researcher.researcherCites} />
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
