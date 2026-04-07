import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ProfileContent from "../components/widgets/Profile/ProfileContent";
import { useTranslation } from "react-i18next";
import Intro from "../components/widgets/Profile/Intro";
import ContributionsWidget from "../components/widgets/Profile/ContributionsWidget";
import ProjectsWidget from "../components/widgets/Profile/ProjectsWidget";
import PublicationsAndPatentsWidget from "../components/widgets/Profile/PublicationsAndPatentsWidget";
import PrizesWidget from "../components/widgets/Profile/PrizesWidget";
import ResearchWidget from "../components/widgets/Profile/ResearchWidget";
import cvImage from "../assets/CV.jpg";
import QualificationsWidget from "../components/widgets/Profile/QualificationsWidget";
import ExperiencesWidget from "../components/widgets/Profile/ExperiencesWidget";
import SkillsWidget from "../components/widgets/Profile/SkillsWidget";
import useProfile from "../hooks/useProfile";
import { updateBioSummary } from "../services/profile.service";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import profileImage from "../assets/prof.jpg";

export default function GridLayoutFullScreen() {
  const { i18n } = useTranslation();
  const { data: rawData, loading } = useProfile();

  const data = rawData ?? {}; 
  const isArabic = i18n.language === "ar";
  const [bio, setBio] = useState("");

  if (loading) return <LoadingSpinner />;

  const safe = (value, fallback = "") => value ?? fallback;

  // ================= DATA MAPPING =================
  const title = isArabic ? safe(data.title?.valueAr) : safe(data.title?.valueEn);
  const name = safe(data.nameEn);
  const fullName = `${title} ${name}`.trim();
  const university = isArabic ? safe(data.university?.valueAr) : safe(data.university?.valueEn);
  const department = isArabic ? safe(data.department?.valueAr) : safe(data.department?.valueEn);

  const socials = [
    { type: "facebook", url: safe(data.facebook) },
    { type: "linkedin", url: safe(data.linkedIn) },
  ].filter((s) => s.url);

  const experiences = data.topExperiences?.map((exp) => ({
    jobDegree: safe(exp?.title),
    city: safe(exp?.organization),
    startDate: safe(exp?.startDate, null),
    endDate: safe(exp?.endDate, null),
  })) ?? [];

  const qualifications = data.topAcademicQualifications?.map((q) => ({
    title: isArabic ? safe(q?.qualification?.valueAr) : safe(q?.qualification?.valueEn),
    organization: safe(q?.universityOrFaculty),
    startDate: safe(q?.dateOfObtainingTheQualification, null),
  })) ?? [];

  const skills = data.skills?.map((skill, index) => ({
    id: index,
    text: safe(skill),
  })) ?? [];

  const handleBioSave = async (newBio) => {
    try {
      await updateBioSummary(newBio);
      setBio(newBio);
    } catch (err) {
      console.error(err);
    }
  };

  const cardBase = "bg-white border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex flex-col overflow-hidden transition-all duration-300";

  return (
    <ResponsiveLayoutProvider>
      <div className="rtl w-full h-auto lg:h-[90vh] p-2 bg-gray-50/50">
        <div className="grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-4 gap-3 lg:gap-[clamp(4px,0.5vw,16px)] w-full lg:h-full">
          
          {/* 1. Profile Card */}
          <div className={`${cardBase} border-[#b38e19] col-span-2 lg:col-span-1 lg:row-span-2 order-1 lg:order-none items-center justify-center p-4`}>
            <ProfileContent
              fullName={fullName}
              college={university}
              jobTitle={department}
              profileImage={profileImage}
              socials={socials}
              isArabic={isArabic}
            />
          </div>

          {/* 2. Intro */}
          <div className={`${cardBase} col-span-2 lg:col-start-2 lg:col-span-5 order-2 lg:order-none justify-center`}>
            <Intro
              content={bio || safe(data.bioSummary)}
              onSave={handleBioSave}
            />
          </div>

          {/* 3. Stats Section */}
          <div className={`${cardBase} col-span-1 lg:col-start-2 lg:row-start-2 order-3 lg:order-none items-center justify-center min-h-[110px]`}>
            <ContributionsWidget count={safe(data.contributionsCount, 0)} isArabic={isArabic} />
          </div>
          <div className={`${cardBase} col-span-1 lg:col-start-3 lg:row-start-2 order-4 lg:order-none items-center justify-center min-h-[110px]`}>
            <ProjectsWidget count={safe(data.projectsCount, 0)} isArabic={isArabic} />
          </div>
          <div className={`${cardBase} col-span-1 lg:col-start-4 lg:row-start-2 order-5 lg:order-none items-center justify-center min-h-[110px]`}>
            <PublicationsAndPatentsWidget count={safe(data.scientificWritingsCount, 0)} isArabic={isArabic} />
          </div>
          <div className={`${cardBase} col-span-1 lg:col-start-5 lg:row-start-2 order-6 lg:order-none items-center justify-center min-h-[110px]`}>
            <PrizesWidget count={safe(data.prizesAndRewardsCount, 0)} isArabic={isArabic} />
          </div>
          <div className={`${cardBase} col-span-2 lg:col-span-1 lg:col-start-6 lg:row-start-2 order-7 lg:order-none items-center justify-center min-h-[110px]`}>
            <ResearchWidget count={safe(data.researchCount, 0)} isArabic={isArabic} />
          </div>

          {/* 4. CV Image - تم تصليح السنترة والظهور عند الهوفر */}
          <div
            className={`${cardBase} group relative col-span-2 h-[500px] lg:h-auto lg:row-start-3 lg:row-span-2 lg:col-start-1 lg:col-span-1 order-10 lg:order-none shadow-lg`}
            style={{
              backgroundImage: `url(${cvImage})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
            }}
          >
            {/* الخلفية السوداء اللي بتظهر بس مع الهوفر بفضل الـ group-hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => window.open(cvImage, "_blank")}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#19355A] text-white px-8 py-3 rounded-xl text-md font-bold shadow-2xl border border-white/30"
              >
                {isArabic ? "عرض السيرة الذاتية" : "View CV"}
              </button>
            </div>
          </div>

          {/* 5. Qualifications & Experiences */}
          <div className={`${cardBase} col-span-2 lg:row-start-3 lg:row-span-2 lg:col-start-2 lg:col-span-2 order-8 lg:order-none`}>
            <QualificationsWidget data={qualifications} />
          </div>

          <div className={`${cardBase} col-span-2 lg:row-start-3 lg:row-span-2 lg:col-start-4 lg:col-span-2 order-9 lg:order-none`}>
            <ExperiencesWidget data={experiences} />
          </div>

          {/* 6. Skills */}
          <div className={`${cardBase} col-span-2 lg:col-span-1 lg:row-start-3 lg:row-span-2 lg:col-start-6 order-11 lg:order-none`}>
            <SkillsWidget data={skills} />
          </div>

        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}