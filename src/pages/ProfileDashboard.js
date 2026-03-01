import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ProfileContent from "../components/widgets/Profile/ProfileContent";
import { useTranslation } from "react-i18next";
import profImg from "../assets/profileImage.png";
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
import { useState } from "react";

const qualificationsData = [
  {
    title: "دكتوراه في هندسة البرمجيات",
    organization: "كلية الحاسبات والذكاء الاصطناعي - جامعة حلوان",
    startDate: "2013-01-01",
    endDate: "2017-01-01",
  },
  {
    title: "ماجستير في الذكاء الاصطناعي",
    organization: "كلية الحاسبات والذكاء الاصطناعي - جامعة حلوان",
    startDate: "2009-01-01",
    endDate: "2012-01-01",
  },
];
const experiencesDummy = [
  {
    jobDegree: "Assistant Professor",
    country: "Egypt",
    city: "Cairo",
    startDate: "2018-09-01",
    endDate: null,
  },
  {
    jobDegree: "Lecturer",
    country: "Egypt",
    city: "Helwan",
    startDate: "2014-09-01",
    endDate: "2018-08-30",
  },
];
const skillsFromBackend = [
  { id: 1, text: "Machine Learning" },
  { id: 2, text: "Distributed Systems" },
  { id: 3, text: "Software Architecture" },
];
export default function GridLayoutFullScreen() {
  const { t, i18n } = useTranslation();
  const [skills, setSkills] = useState(skillsFromBackend);
  const isArabic = i18n.language === "ar";
  const socials = [
    { type: "linkedin", url: "https://linkedin.com/in/ahmed" },
    { type: "github", url: "https://github.com/ahmed" },
    { type: "facebook", url: null },
  ];
  const initialContent = "";

  return (
    <ResponsiveLayoutProvider>
      <div className="rtl w-screen-[90vh] h-[90vh] p-2">
        <div className="grid grid-rows-4 grid-cols-6 gap-[clamp(4px,0.5vw,16px)] w-full h-full">
          {/* Row 1 */}
          <div
            className="        bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#b38e19] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-span-2 col-span-1 min-h-[80px]"
          >
            <ProfileContent
              fullName="Ahmed Hassan"
              college="Faculty of Engineering"
              jobTitle="Assistant Professor"
              profileImage={profImg}
              socials={socials}
              isArabic
            />
          </div>
          <div
            className="    bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center col-start-2 col-span-5 min-h-[80px]"
          >
            <Intro
              content={initialContent}
              onSave={(newContent) => {
                console.log("Text to send to backend:", newContent);
              }}
            />
          </div>

          {/* Row 2 */}
          <div
            className=" bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-2 min-h-[60px]"
          >
            <ContributionsWidget count={15} isArabic={isArabic} />
          </div>
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-3 min-h-[60px]"
          >
            <ProjectsWidget count={10} isArabic={isArabic} />
          </div>
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-4 min-h-[60px]"
          >
            <PublicationsAndPatentsWidget count={6} isArabic={isArabic} />
          </div>
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)]  flex items-center justify-center row-start-2 col-start-5 min-h-[60px]"
          >
            <PrizesWidget count={5} isArabic={isArabic} />
          </div>
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-2 col-start-6 min-h-[60px]"
          >
            <ResearchWidget count={13} isArabic={isArabic} />
          </div>

          {/* Row 3 & 4 */}
          <div
            className="bg-[#EDEDED]
  border-[clamp(1.5px,0.3vw,3px)]
  border-[#19355A]
  rounded-[clamp(14px,1vw,20px)]
  row-start-3 row-span-2 col-start-1
  overflow-hidden"
            style={{
              backgroundImage: `url(${cvImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex items-center justify-center row-start-3 row-span-2 col-start-2 col-span-2 min-h-[100px]"
          >
            <QualificationsWidget data={qualificationsData} />
          </div>
          <div
            className="bg-[#EDEDED]
        border-[clamp(1.5px,0.3vw,3px)]
        border-[#19355A] rounded-[clamp(14px,1vw,20px)]  flex items-center justify-center row-start-3 row-span-2 col-start-4 col-span-2 min-h-[100px]"
          >
            <ExperiencesWidget data={experiencesDummy} />
          </div>
          <div
            className="bg-[#EDEDED]
  border-[clamp(1.5px,0.3vw,3px)]
  border-[#19355A]
  rounded-[clamp(14px,1vw,20px)]
  row-start-3 row-span-2 col-start-6
  overflow-hidden"
          >
            <SkillsWidget data={skills} />
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
