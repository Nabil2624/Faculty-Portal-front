import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowLeft,
  FiEdit3,
  FiUser,
  FiUserx,
  FiBook,
  FiCalendar,
  FiAward,
  FiMapPin,
  FiLayers,
  FiUserCheck,

} from "react-icons/fi";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAcademicGrades } from "../services/lookup.service";

export default function SupervisionInfo() {
  const { t, i18n } = useTranslation("SupervisionInfo");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!location.state) {
        navigate("/supervision-thesis");
        return;
      }
      setInfo(location.state);
      try {
        const res = await getAcademicGrades();
        setGrades(res.data || []);
      } catch (err) {
        console.error("Failed to fetch grades");
      }
    };
    loadData();
  }, [location.state, navigate]);

  if (!info) return null;
  if (loading) return <LoadingSpinner />;

  // Logic Helpers
  const resolvedDegree = info.grade
    ? isArabic ? info.grade.valueAr : info.grade.valueEn
    : "-";

  const translatedThesisType = info.type === "PHD" ? t("PHD") : t("MASTERS");

  const translatedRole = (() => {
    switch (info.facultyMemberRole) {
      case "Adminstrator": return t("Adminstrator");
      case "Reviewer": return t("Reviewer");
      case "AdminstratorAndReviewer":
      case "ReviewerAndAdminstrator": return t("AdminstratorAndReviewer");
      default: return info.facultyMemberRole;
    }
  })();

  const handleEdit = () => {
    navigate("/edit-supervision", {
      state: {
        ...info,
        facultyMemberRole: (() => {
          switch (info.facultyMemberRole) {
            case "Adminstrator": return 1;
            case "Reviewer": return 2;
            case "AdminstratorAndReviewer":
            case "ReviewerAndAdminstrator": return 3;
            default: return 1;
          }
        })(),
        grade: info.grade || null,
      },
    });
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`w-full min-h-[90vh] mx-auto pt-[clamp(1.5rem,2.5vh,3rem)] px-[clamp(1rem,2vw,10rem)] ${isArabic ? "rtl text-right" : "ltr text-left"}`}>
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-[clamp(1.5rem,4vh,3rem)] gap-6 border-b border-gray-100 pb-8">
          <div className="max-w-full xl:max-w-[75%]">
            <h1 className="font-black text-[#19355A] leading-tight mb-3 text-[clamp(1.2rem,2.2vw,2.5rem)] tracking-tight">
              {info.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-[clamp(9px,0.7vw,11px)] font-black uppercase tracking-[1.5px] text-[#B38E19]">
              <span className="flex items-center gap-1.5 bg-[#B38E19]/5 px-2.5 py-0.5 rounded-lg border border-[#B38E19]/10">
                <FiLayers size="1.1em" /> {translatedThesisType}
              </span>
              <span className="flex items-center gap-1.5 bg-[#19355A]/5 text-[#19355A] px-2.5 py-0.5 rounded-lg border border-[#19355A]/10">
                <FiUserCheck size="1.1em" /> {translatedRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
            <button
              onClick={handleEdit}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,17px)] uppercase tracking-[2px] hover:bg-[#cfa82a] transition-all shadow-lg shadow-[#19355A]/20"
            >
              <FiEdit3 size="1.2em" /> {t("edit")}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 text-gray-400 bg-white border border-gray-100 px-5 rounded-xl font-black text-[clamp(10px,0.8vw,17px)] uppercase tracking-[2px] hover:text-[#19355A] shadow-sm"
            >
              {isArabic ? <FiArrowLeft size="1.2em" /> : <FiArrowRight size="1.2em" />} {isArabic ? "الرجوع" : "Back"}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1rem,2.5vw,2.5rem)]">
          
          {/* Left Column: Student & Specialization */}
          <div className="lg:col-span-8 space-y-[clamp(1rem,3vh,2rem)]">
            
            <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-50 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}></div>
              <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] mb-6 flex items-center gap-2 uppercase tracking-[2.5px]">
                <FiUser className="text-[#B38E19]" /> {isArabic ? "بيانات الطالب" : "Student Details"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#B38E19] uppercase tracking-widest">{isArabic ? "اسم الطالب" : "Student Name"}</p>
                  <p className="text-[clamp(1.1rem,1.5vw,1.8rem)] font-black text-[#19355A] leading-tight">{info.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#B38E19] uppercase tracking-widest">{isArabic ? "التخصص" : "Specialization"}</p>
                  <p className="text-[clamp(1.1rem,1.5vw,1.8rem)] font-black text-[#19355A] leading-tight">{info.specialization || "-"}</p>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white border border-gray-100 rounded-[1.5rem] p-8 shadow-sm">
               <h3 className="text-[#19355A] font-black text-[clamp(13px,0.8vw,17px)] uppercase tracking-[3px] mb-8 flex items-center gap-2">
                 <FiCalendar className="text-[#B38E19]" /> {isArabic ? "التسلسل الزمني" : "Timeline"}
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBox label={isArabic ? "التسجيل" : "Registration"} value={info.registrationDate} />
                  <StatBox label={isArabic ? "التشكيل" : "Formation"} value={info.supervisionFormationDate} />
                  <StatBox label={isArabic ? "المناقشة" : "Discussion"} value={info.discussionDate} />
                  <StatBox label={isArabic ? "المنح" : "Granting"} value={info.grantingDate} />
               </div>
            </div>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="lg:col-span-4 space-y-[clamp(1rem,3vh,2rem)]">
            <div className="bg-gray-50/50 rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2rem)] border border-gray-100">
              <h4 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-2">
                {isArabic ? "معلومات إضافية" : "Additional Info"}
              </h4>
              <div className="space-y-6">
                <SidebarItem label={isArabic ? "الدرجة العلمية" : "Academic Grade"} value={resolvedDegree} icon={<FiAward />} />
                <SidebarItem label={isArabic ? "الجامعة / الكلية" : "University / Faculty"} value={info.universityOrFaculty} icon={<FiMapPin />} />
                <SidebarItem label={isArabic ? "نوع الرسالة" : "Thesis Type"} value={translatedThesisType} icon={<FiBook />} />
                <SidebarItem label={isArabic ? "الدور" : "Role"} value={translatedRole} icon={<FiUserCheck />} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}

// Reusable Sub-components (Same style as the reference)
function SidebarItem({ label, value, icon }) {
  if (!value || value === "0" || value === "-") return null;
  return (
    <div className="flex gap-3 items-start group">
      <div className="mt-1 text-[#B38E19] shrink-0 text-lg">{icon}</div>
      <div className="flex flex-col overflow-hidden leading-tight">
        <span className="text-[clamp(10px,0.8vw,18px)] font-black text-gray-400 uppercase tracking-widest mb-0.5">
          {label}
        </span>
        <span className="text-[clamp(10px,0.75vw,14px)] font-bold text-[#19355A] break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
      <span className="text-[10px] text-[#B38E19] block uppercase font-black mb-2 leading-none tracking-tighter">
        {label}
      </span>
      <span className="text-[clamp(12px,0.8vw,15px)] font-black text-[#19355A] leading-none">
        {value || "-"}
      </span>
    </div>
  );
}