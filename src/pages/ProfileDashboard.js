import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ProfileContent from "../components/widgets/Profile/ProfileContent";
import { useTranslation } from "react-i18next";
import defaultProfileImg from "../assets/prof.jpg";
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

export default function GridLayoutFullScreen() {
  const { i18n } = useTranslation();
  const { data, loading, error } = useProfile();
  const isArabic = i18n.language === "ar";

  const [bio, setBio] = useState("");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  // ================= PROFILE IMAGE =================
  const profileImage = data.profilePictureId
    ? `${import.meta.env.VITE_API_BASE_URL}/Files/${data.profilePictureId}`
    : defaultProfileImg;

  // ================= BASIC INFO =================
  const fullName = `${isArabic ? data.title?.valueAr : data.title?.valueEn} ${data.name}`;
  const university = isArabic
    ? data.university?.valueAr
    : data.university?.valueEn;
  const department = isArabic
    ? data.department?.valueAr
    : data.department?.valueEn;

  // ================= SOCIALS =================
  const socials = [
    { type: "facebook", url: data.facebook },
    { type: "linkedin", url: data.linkedIn },
    { type: "github", url: null },
    // { type: "instagram", url: data.instagram },
    // { type: "x", url: data.x },
    // { type: "youtube", url: data.youTube },
  ];

  // ================= COUNTS =================
  const contributionsCount = data.contributionsCount;
  const projectsCount = data.projectsCount;
  const writingsCount = data.scientificWritingsCount;
  const prizesCount = data.prizesAndRewardsCount;
  const researchCount = data.researchCount;

  // ================= EXPERIENCES =================
  const experiences =
    data.topExperiences?.map((exp) => ({
      jobDegree: exp.title,
      country: "",
      city: exp.organization,
      startDate: exp.startDate,
      endDate: exp.endDate,
    })) || [];

  // ================= QUALIFICATIONS =================
  const qualifications =
    data.topAcademicQualifications?.map((q) => ({
      title: isArabic ? q.qualification?.valueAr : q.qualification?.valueEn,
      organization: q.universityOrFaculty,
      startDate: q.dateOfObtainingTheQualification,
      endDate: null,
    })) || [];

  // ================= SKILLS =================
  const skills =
    data.skills?.map((skill, index) => ({
      id: index,
      text: skill,
    })) || [];

  // ================= HANDLE BIO SAVE =================
  const handleBioSave = async (newBio) => {
    try {
      await updateBioSummary(newBio); // call API
      setBio(newBio); // update local state
    } catch (err) {
      console.error("Failed to update bio:", err);
    }
  };
  console.log(socials);

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
              content={bio || data.bioSummary || ""}
              onSave={handleBioSave} // ✅ هنا مربوط بالـ API
            />
          </div>

          {/* Stats */}
          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-2">
            <ContributionsWidget
              count={contributionsCount}
              isArabic={isArabic}
            />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-3">
            <ProjectsWidget count={projectsCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-4">
            <PublicationsAndPatentsWidget
              count={writingsCount}
              isArabic={isArabic}
            />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-5">
            <PrizesWidget count={prizesCount} isArabic={isArabic} />
          </div>

          <div className="bg-[#EDEDED] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-6">
            <ResearchWidget count={researchCount} isArabic={isArabic} />
          </div>

          {/* CV Image with hover overlay */}
          <div
            className="relative row-start-3 row-span-2 col-start-1 overflow-hidden rounded-[clamp(14px,1vw,20px)] border-[clamp(1.5px,0.3vw,3px)] border-[#19355A]"
            style={{
              backgroundImage: `url(${cvImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => window.open(cvImage, "_blank")}
                className="opacity-0 hover:opacity-100 transition-opacity duration-300 px-[clamp(8px,1vw,16px)] py-[clamp(4px,0.5vw,8px)] bg-[#19355A] text-white rounded-[clamp(6px,0.5vw,12px)] text-[clamp(12px,1vw,20px)]"
              >
                {i18n.language === "ar" ? "عرض السيرة الذاتية" : "View CV"}
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
