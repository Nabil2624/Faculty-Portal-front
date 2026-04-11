import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ProfileContent from "../components/widgets/Profile/ProfileContent";
import { useTranslation } from "react-i18next";
import Intro from "../components/widgets/Profile/Intro";
import ContributionsWidget from "../components/widgets/Profile/ContributionsWidget";
import ProjectsWidget from "../components/widgets/Profile/ProjectsWidget";
import PublicationsAndPatentsWidget from "../components/widgets/Profile/PublicationsAndPatentsWidget";
import PrizesWidget from "../components/widgets/Profile/PrizesWidget";
import ResearchWidget from "../components/widgets/Profile/ResearchWidget";
import QualificationsWidget from "../components/widgets/Profile/QualificationsWidget";
import ExperiencesWidget from "../components/widgets/Profile/ExperiencesWidget";
import SkillsWidget from "../components/widgets/Profile/SkillsWidget";
import useProfile from "../hooks/useProfile";
import { updateBioSummary } from "../services/profile.service";
import { getTemplate } from "../services/cv.service";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import profileImage from "../assets/prof.jpg";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// ── Static blurred placeholder that visually represents a CV template ──────────
const TEMPLATE_CONFIGS = {
  modern: {
    headerBg: "#19355a",
    accentColor: "#b38e19",
    sidebarBg: "#e8edf3",
    label: "Modern",
  },
  academic: {
    headerBg: "#2d4a2d",
    accentColor: "#7ab648",
    sidebarBg: "#eef3ee",
    label: "Academic",
  },
  professional: {
    headerBg: "#3a3a3a",
    accentColor: "#c0392b",
    sidebarBg: "#f2f2f2",
    label: "Professional",
  },
};

function CVTemplatePlaceholder({ template }) {
  const cfg = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.modern;
  const bar = (w, h = 8, opacity = 0.35) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        background: cfg.headerBg,
        opacity,
        marginBottom: 6,
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        filter: "blur(3px)",
        userSelect: "none",
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: cfg.headerBg,
          padding: "18px 16px 14px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: "55%",
            height: 10,
            borderRadius: 4,
            background: "rgba(255,255,255,0.7)",
            marginBottom: 6,
          }}
        />
        <div
          style={{
            width: "40%",
            height: 7,
            borderRadius: 4,
            background: "rgba(255,255,255,0.45)",
          }}
        />
        {/* accent line */}
        <div
          style={{
            width: "100%",
            height: 3,
            background: cfg.accentColor,
            marginTop: 12,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Body: two columns */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "34%",
            background: cfg.sidebarBg,
            padding: "12px 10px",
            flexShrink: 0,
          }}
        >
          {[80, 65, 70, 60, 75, 55, 68].map((w, i) => (
            <div key={i} style={{ marginBottom: i % 3 === 2 ? 14 : 0 }}>
              {bar(`${w}%`, 7, 0.3)}
            </div>
          ))}
        </div>
        {/* Main content */}
        <div style={{ flex: 1, padding: "12px 10px" }}>
          {[90, 75, 85, 60, 80, 70, 88, 65, 78].map((w, i) => (
            <div key={i} style={{ marginBottom: i % 3 === 2 ? 14 : 0 }}>
              {bar(`${w}%`, i % 4 === 0 ? 9 : 7, 0.28)}
            </div>
          ))}
        </div>
      </div>

      {/* Template label badge */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          background: cfg.accentColor,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 6,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        {cfg.label}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function GridLayoutFullScreen() {
  const { i18n } = useTranslation();
  const { data: rawData, loading } = useProfile();
  const [profileImg, setProfileImg] = useState(profileImage);
  const [cvTemplate, setCvTemplate] = useState("modern");
  const data = rawData ?? {};
  const isArabic = i18n.language === "ar";
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const safe = (value, fallback = "") => value ?? fallback;

  // ================= DATA MAPPING =================
  const title = isArabic
    ? safe(data.title?.valueAr)
    : safe(data.title?.valueEn);
  const name = isArabic ? safe(data.nameAr) : safe(data.nameEn);
  const fullName = `${title} ${name}`.trim();
  const university = isArabic
    ? safe(data.university?.valueAr)
    : safe(data.university?.valueEn);
  const department = isArabic
    ? safe(data.department?.valueAr)
    : safe(data.department?.valueEn);
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        if (data?.profilePictureId) {
          const url = `/Attachments/${data.personalDataId}/${data.profilePictureId}?context=3`;
          const response = await axiosInstance.get(url, {
            responseType: "blob",
          });
          const imageBlob = response.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImg(imageUrl);
        } else {
          setProfileImg(profileImage);
        }
      } catch (err) {
        setProfileImg(profileImage);
      }
    };
    loadProfileImage();
  }, [data]);

  useEffect(() => {
    getTemplate()
      .then((res) => {
        if (res?.data) setCvTemplate(res.data.toLowerCase());
      })
      .catch(() => {});
  }, []);

  const socials = [
    { type: "facebook", url: safe(data.facebook) },
    { type: "linkedin", url: safe(data.linkedIn) },
  ].filter((s) => s.url);

  const experiences =
    data.topExperiences?.map((exp) => ({
      jobDegree: safe(exp?.title),
      city: safe(exp?.organization),
      startDate: safe(exp?.startDate, null),
      endDate: safe(exp?.endDate, null),
    })) ?? [];

  const qualifications =
    data.topAcademicQualifications?.map((q) => ({
      title: isArabic
        ? safe(q?.qualification?.valueAr)
        : safe(q?.qualification?.valueEn),
      organization: safe(q?.universityOrFaculty),
      startDate: safe(q?.dateOfObtainingTheQualification, null),
    })) ?? [];

  const skills =
    data.skills?.map((skill, index) => ({
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

  const cardBase =
    "bg-white border-[clamp(1.5px,0.3vw,3px)] border-[#19355A] rounded-[clamp(14px,1vw,20px)] flex flex-col overflow-hidden transition-all duration-300";
  if (loading) return <LoadingSpinner />;
  return (
    <ResponsiveLayoutProvider>
      <div className="rtl w-full h-auto lg:h-[90vh] p-2 bg-gray-50/50">
        <div className="grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-4 gap-3 lg:gap-[clamp(4px,0.5vw,16px)] w-full lg:h-full">
          {/* 1. Profile Card */}
          <div
            className={`${cardBase} border-[#b38e19] col-span-2 lg:col-span-1 lg:row-span-2 order-1 lg:order-none items-center justify-center p-4`}
          >
            <ProfileContent
              fullName={fullName}
              college={university}
              jobTitle={department}
              profileImage={profileImg}
              socials={socials}
              isArabic={isArabic}
            />
          </div>

          {/* 2. Intro */}
          <div
            className={`${cardBase} col-span-2 lg:col-start-2 lg:col-span-5 order-2 lg:order-none justify-center`}
          >
            <Intro
              content={bio || safe(data.bioSummary)}
              onSave={handleBioSave}
            />
          </div>

          {/* 3. Stats Section */}
          <div
            className={`${cardBase} col-span-1 lg:col-start-2 lg:row-start-2 order-3 lg:order-none items-center justify-center min-h-[110px]`}
          >
            <ContributionsWidget
              count={safe(data.contributionsCount, 0)}
              isArabic={isArabic}
            />
          </div>
          <div
            className={`${cardBase} col-span-1 lg:col-start-3 lg:row-start-2 order-4 lg:order-none items-center justify-center min-h-[110px]`}
          >
            <ProjectsWidget
              count={safe(data.projectsCount, 0)}
              isArabic={isArabic}
            />
          </div>
          <div
            className={`${cardBase} col-span-1 lg:col-start-4 lg:row-start-2 order-5 lg:order-none items-center justify-center min-h-[110px]`}
          >
            <PublicationsAndPatentsWidget
              count={safe(data.scientificWritingsCount, 0)}
              isArabic={isArabic}
            />
          </div>
          <div
            className={`${cardBase} col-span-1 lg:col-start-5 lg:row-start-2 order-6 lg:order-none items-center justify-center min-h-[110px]`}
          >
            <PrizesWidget
              count={safe(data.prizesAndRewardsCount, 0)}
              isArabic={isArabic}
            />
          </div>
          <div
            className={`${cardBase} col-span-2 lg:col-span-1 lg:col-start-6 lg:row-start-2 order-7 lg:order-none items-center justify-center min-h-[110px]`}
          >
            <ResearchWidget
              count={safe(data.researchCount, 0)}
              isArabic={isArabic}
            />
          </div>

          <div
            className={`${cardBase} group relative col-span-2 h-[500px] lg:h-auto lg:row-start-3 lg:row-span-2 lg:col-start-1 lg:col-span-1 order-10 lg:order-none shadow-lg overflow-hidden`}
          >
            {/* Blurred static CV placeholder */}
            <CVTemplatePlaceholder template={cvTemplate} />
            {/* Overlay with buttons on hover */}
            <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center gap-3">
              <button
                onClick={async () => {
                  try {
                    const tpl = cvTemplate || "modern";
                    const res = await axiosInstance.get("/CV/Preview", {
                      params: { template: tpl },
                    });
                    const win = window.open("", "_blank");
                    if (win) {
                      win.document.write(res.data);
                      win.document.close();
                    }
                  } catch {}
                }}
                className="bg-[#19355A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-2xl border border-white/30"
              >
                {isArabic ? "عرض السيرة الذاتية" : "View CV"}
              </button>

              <button
                onClick={() => navigate("/cv")}
                className="bg-[#b38e19] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-2xl border border-white/30"
              >
                {isArabic ? "تعديل السيرة الذاتية" : "Edit CV"}
              </button>
            </div>
          </div>

          {/* 5. Qualifications & Experiences */}
          <div
            className={`${cardBase} col-span-2 lg:row-start-3 lg:row-span-2 lg:col-start-2 lg:col-span-2 order-8 lg:order-none`}
          >
            <QualificationsWidget data={qualifications} />
          </div>

          <div
            className={`${cardBase} col-span-2 lg:row-start-3 lg:row-span-2 lg:col-start-4 lg:col-span-2 order-9 lg:order-none`}
          >
            <ExperiencesWidget data={experiences} />
          </div>

          {/* 6. Skills */}
          <div
            className={`${cardBase} col-span-2 lg:col-span-1 lg:row-start-3 lg:row-span-2 lg:col-start-6 order-11 lg:order-none`}
          >
            <SkillsWidget data={skills} />
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
