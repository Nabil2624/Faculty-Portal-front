import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import InfoRow from "../components/ui/InfoRow";
import CitationsWidgetExtended from "../components/widgets/ResearcherProfile/CitationsWidgetExtended";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";
import useResearcherProfile from "../hooks/useResearcherProfile";
import axios from "axios";
export default function ResearcherProfile() {
  const { t, i18n } = useTranslation("ResearcherProfile");
  const isArabic = i18n.language === "ar";

  const location = useLocation();
  const nationalNumber = location.state?.nationalNumber;

  const { researcher, loading, error, waiting, missingScholar } =
    useResearcherProfile(nationalNumber);
  if (loading) return <LoadingSpinner />;

  if (waiting) {
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold">
          {isArabic
            ? "برجاء الانتظار يتم جلب الابحاث"
            : "Please wait, working on getting your researches"}
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!researcher && !waiting)
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold">
          {isArabic
            ? "لم يتم العثور على ملف للباحث"
            : "No Researcher Profile Was Found"}
        </div>
      </ResponsiveLayoutProvider>
    );

  if (missingScholar) {
    return (
      <ResponsiveLayoutProvider>
        <div className="p-6">
          <MissingScholarCard
            onSave={async (data) => {
              await axios.post(
                "http://127.0.0.1:8000/api/fetch-research-using-scholar-profile-link/",
                {
                  researcherNationalNumber: nationalNumber,
                  ORCID: data.orcid,
                  scholarProfileLink: data.scholarLink,
                },
              );

              window.location.reload();
            }}
          />
        </div>
      </ResponsiveLayoutProvider>
    );
  }

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
            <p className="text-2xl text-gray-700 mt-4 max-w-[700px]">
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
                researcher.orcid ? (
                  <a
                    href={`https://orcid.org/${researcher.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#B38E19] font-semibold"
                  >
                    {researcher.orcid}
                  </a>
                ) : (
                  <span className="text-gray-500">{t("notFound")}</span>
                )
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
