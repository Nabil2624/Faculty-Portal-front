import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CollegeCard from "../components/widgets/DetailedDashboard/CollegeCard";
import TopResearchersCard from "../components/widgets/DetailedDashboard/TopResearchersCard";
import TopSubjectsCard from "../components/widgets/DetailedDashboard/TopSubjectsCard";
import UniversityTopResearchers from "../components/widgets/DetailedDashboard/UniversityTopResearchers";
import ResearchSourceChart from "../components/widgets/DetailedDashboard/ResearchSourceChart";
import CitationsCurveChart from "../components/widgets/DetailedDashboard/CitationsCurveChart";
import { useTranslation } from "react-i18next";
const DetailedDashboardPage = () => {
  const {t , i18n} = useTranslation("admin-dashboard");
  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen p-4 bg-gray-50">
        {" "}
        {/* أضفنا خلفية بسيطة لتمييز الكروت */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="w-full h-full flex flex-col">
            <TopResearchersCard title="أفضل الباحثين" />
          </div>

          <div className="w-full h-full flex flex-col">
            <UniversityTopResearchers />
          </div>
          <div className="w-full h-full flex flex-col ">
            <ResearchSourceChart />
          </div>
          <div className="w-full h-full flex flex-col">
            <CollegeCard title={t("NumberOfResearchersPerCollege")} t={t} />
          </div>

          <div className="w-full h-full flex flex-col lg:col-span-2">
            <TopSubjectsCard />
          </div>
          <div className="w-full h-full flex flex-col">
            <CollegeCard title={t("NumberOfResearchesPerCollege")}  />
          </div>
          <div className="w-full h-full flex flex-col lg:col-span-2">
            <CitationsCurveChart />
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};
export default DetailedDashboardPage;
