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
import profileImage from "../assets/profileImage.png";

export default function GridLayoutFullScreen() {
  const { i18n } = useTranslation();
  const { data: rawData, loading } = useProfile();

  const data = rawData ?? {}; // 🔥 حماية كاملة
  const isArabic = i18n.language === "ar";

  const [bio, setBio] = useState("");

  if (loading) return <LoadingSpinner />;

  // ================= SAFE HELPER =================
  const safe = (value, fallback = "") => value ?? fallback;

  // ================= BASIC INFO =================
  const title = isArabic
    ? safe(data.title?.valueAr)
    : safe(data.title?.valueEn);

  const name = safe(data.name);

  const fullName = `${title} ${name}`.trim();

  const university = isArabic
    ? safe(data.university?.valueAr)
    : safe(data.university?.valueEn);

  const department = isArabic
    ? safe(data.department?.valueAr)
    : safe(data.department?.valueEn);

  // ================= SOCIALS =================
  const socials = [
    { type: "facebook", url: safe(data.facebook) },
    { type: "linkedin", url: safe(data.linkedIn) },
  ].filter((s) => s.url);

  // ================= COUNTS =================
  const contributionsCount = safe(data.contributionsCount, 0);
  const projectsCount = safe(data.projectsCount, 0);
  const writingsCount = safe(data.scientificWritingsCount, 0);
  const prizesCount = safe(data.prizesAndRewardsCount, 0);
  const researchCount = safe(data.researchCount, 0);

  // ================= EXPERIENCES =================
  const experiences =
    data.topExperiences?.map((exp) => ({
      jobDegree: safe(exp?.title),
      country: "",
      city: safe(exp?.organization),
      startDate: safe(exp?.startDate, null),
      endDate: safe(exp?.endDate, null),
    })) ?? [];

  // ================= QUALIFICATIONS =================
  const qualifications =
    data.topAcademicQualifications?.map((q) => ({
      title: isArabic
        ? safe(q?.qualification?.valueAr)
        : safe(q?.qualification?.valueEn),
      organization: safe(q?.universityOrFaculty),
      startDate: safe(q?.dateOfObtainingTheQualification, null),
      endDate: null,
    })) ?? [];

  // ================= SKILLS =================
  const skills =
    data.skills?.map((skill, index) => ({
      id: index,
      text: safe(skill),
    })) ?? [];

  // ================= HANDLE BIO SAVE =================
  const handleBioSave = async (newBio) => {
    try {
      await updateBioSummary(newBio);
      setBio(newBio);
    } catch (err) {
      console.error("Failed to update bio:", err);
    }
  };

  return (
    <ResponsiveLayoutProvider>
     <div className="rtl w-screen-[90vh] h-[90vh] p-2">
        <div className="grid grid-rows-4 grid-cols-6 gap-[clamp(4px,0.5vw,16px)] w-full h-full">
          
          {/* Profile Card */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#b38e19] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-span-2 col-span-1">
            <ProfileContent
              fullName={fullName}
              college={university}
              jobTitle={department}
              profileImage={profileImage}
              socials={socials}
              isArabic={isArabic}
            />
          </div>

          {/* Intro */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center col-start-2 col-span-5">
            <Intro
              content={bio || safe(data.bioSummary)}
              onSave={handleBioSave}
            />
          </div>

          {/* Stats */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-2">
            <ContributionsWidget count={contributionsCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-3">
            <ProjectsWidget count={projectsCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-4">
            <PublicationsAndPatentsWidget count={writingsCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-5">
            <PrizesWidget count={prizesCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-6">
            <ResearchWidget count={researchCount} isArabic={isArabic} />
          </div>

          {/* CV Image */}
          <div
            className="relative row-start-3 row-span-2 col-start-1 overflow-hidden rounded-[clamp(14px,1vw,20px)] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A]"
            style={{
              backgroundImage: `url(${cvImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => window.open(cvImage, "_blank")}
                className="opacity-0 hover:opacity-100 transition-opacity duration-300 px-[clamp(8px,1vw,16px)] py-[clamp(4px,0.5vw,8px)] bg-[#19355A] text-white rounded-[clamp(6px,0.5vw,12px)] text-[clamp(12px,1vw,20px)]"
              >
                {isArabic ? "عرض السيرة الذاتية" : "View CV"}
              </button>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] row-start-3 row-span-2 col-start-2 col-span-2">
            <QualificationsWidget data={qualifications} />
          </div>

          {/* Experiences */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] row-start-3 row-span-2 col-start-4 col-span-2">
            <ExperiencesWidget data={experiences} />
          </div>

          {/* Skills */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] row-start-3 row-span-2 col-start-6 overflow-hidden">
            <SkillsWidget data={skills} />
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}