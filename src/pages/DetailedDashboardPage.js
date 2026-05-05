import React, { useState } from "react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CollegeCard from "../components/widgets/DetailedDashboard/CollegeCard";
import TopResearchersCard from "../components/widgets/DetailedDashboard/TopResearchersCard";
import TopSubjectsCard from "../components/widgets/DetailedDashboard/TopSubjectsCard";
import UniversityTopResearchers from "../components/widgets/DetailedDashboard/UniversityTopResearchers";
import ResearchSourceChart from "../components/widgets/DetailedDashboard/ResearchSourceChart";
import CitationsCurveChart from "../components/widgets/DetailedDashboard/CitationsCurveChart";
import { useTranslation } from "react-i18next";
import { useDetailedDashboard } from "../hooks/useDetailedDashboard";
import { useCollegeDepartmentsAnalysis } from "../hooks/useCollegeDepartmentsAnalysis";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { GraduationCapIcon, FileText, TrendingUp } from "lucide-react";
const DetailedDashboardPage = () => {
  const { t } = useTranslation("admin-dashboard");

  // ===========================================
  // 1. فصل الـ States لكل كرت عشان يشتغل لوحده
  // ===========================================
  const [researchersCollegeId, setResearchersCollegeId] = useState(null);
  const [researchesCollegeId, setResearchesCollegeId] = useState(null);

  // =========================
  // Global dashboard data
  // =========================
  const { researchesDashboard, loading, error } = useDetailedDashboard();

  // ===========================================
  // 2. استدعاء الهوك مرتين (مرة لكل كرت)
  // ===========================================

  // بيانات الكرت الأول (عدد الباحثين)
  const {
    departmentResearchersData,
    topResearchersData, // لو محتاج تربط التوب ريسيرشرز بكرت معين
    error: err1,
  } = useCollegeDepartmentsAnalysis(researchersCollegeId);

  // بيانات الكرت الثاني (عدد الأبحاث)
  const { departmentResearchesData, error: err2 } =
    useCollegeDepartmentsAnalysis(researchesCollegeId);

  // =========================
  // Loading / Error handling
  // =========================
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || err1 || err2)
    return (
      <div className="p-10 text-center text-red-500">Error loading data</div>
    );

  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen px-4 bg-gray-50">
        <div className="max-w-[2000px] mx-auto">
          <PageHeaderNoAction title={t("statisticsDetails")} icon={TrendingUp} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 3xl:gap-12 items-stretch">
            {/* 1. Top Researchers (مرتبط باختيار الكرت الأول مثلاً) */}
            <div className="w-full h-full flex flex-col">
              <TopResearchersCard
                title={t("title")}
                facultyId={researchersCollegeId}
                data={topResearchersData}
                footerText={t("statisticalInsight")}
                noData={t("noData")}
                subTitle={t("facultyRank")}
              />
            </div>

            {/* 2. University Top Researchers */}
            <div className="w-full h-full flex flex-col">
              <UniversityTopResearchers
                title={t("title")}
                subTitle={t("univesityRank")}
                data={researchesDashboard?.universityTopFiveResearchers}
                footerText={t("statisticalInsight")}
                noData={t("noData")}
              />
            </div>

            {/* 3. Research Source Chart */}
            <div className="w-full h-full flex flex-col">
              <ResearchSourceChart
                international={researchesDashboard?.internationalResearchesNo}
                local={researchesDashboard?.localResearchesNo}
                footerText={t("statisticalInsight")}
              />
            </div>

            {/* 4. College Card (الكرت الأول - باحثين) */}
            <div className="w-full h-full flex flex-col">
              <CollegeCard
                title={t("NumberOfResearchersPerCollege")}
                selectLabel={t("selectCollegeLabel")}
                totalLabel={t("total")}
                loadingText={t("loadingData")}
                unitText={t("researcher")}
                footerText={t("statisticalInsight")}
                emptyText={t("noData")}
                onSelectionChange={(id) => setResearchersCollegeId(id)}
                subData={departmentResearchersData}
                Icon={GraduationCapIcon}
              />
            </div>

            {/* 5. Top Subjects */}
            <div className="w-full h-full flex flex-col lg:col-span-2">
              <TopSubjectsCard
                data={researchesDashboard?.topFiveResearchersInterestsStats}
              />
            </div>

            {/* 6. Second College Card (الكرت الثاني - أبحاث) */}
            <div className="w-full h-full flex flex-col">
              <CollegeCard
                title={t("NumberOfResearchesPerCollege")}
                selectLabel={t("selectCollegeLabel")}
                totalLabel={t("totalResearches")}
                loadingText={t("loadingData")}
                unitText={t("researches")}
                footerText={t("statisticalInsight")}
                emptyText={t("noData")}
                onSelectionChange={(id) => setResearchesCollegeId(id)}
                subData={departmentResearchesData}
                Icon={FileText}
              />
            </div>

            {/* 7. Citations Chart */}
            <div className="w-full h-full flex flex-col lg:col-span-2">
              <CitationsCurveChart
                data={
                  researchesDashboard?.citationsStats?.[0]?.detailedCitesStats
                }
              />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default DetailedDashboardPage;
