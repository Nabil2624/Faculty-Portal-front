import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiExternalLink,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiArrowLeft,
  FiGlobe,
  FiHash,
  FiBarChart2,
  FiLayers,
  FiCheckCircle,
  FiFilePlus,
  FiLink,
} from "react-icons/fi";
import { BookMarked } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CitationsChart from "../components/widgets/ScientificResearchDetails/CitationsChart";

export default function ScientificResearchExternalProfile() {
  const { t, i18n } = useTranslation(["ScientificResearchFullDetails"]);
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const research = location.state?.research;

  if (!research) return null;

  const sourceMap = { External: "Google Scholar" };
  const displaySource =
    sourceMap[research.source] || research.source || "Google Scholar";

  const getFullLink = (link) => {
    if (!link) return null;
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return `https://scholar.google.com${link}`;
    return `https://${link}`;
  };

  const formatContributorMeta = (c) => {
    const role = c.isTheMajorResearcher
      ? t("mainResearcher")
      : t("coResearcher");
    let source = isArabic ? "خارج الجامعة" : "External";
    if (c.contributorType === "FromUniverstity" || c.contributorType === 0) {
      source = isArabic ? "من الجامعة" : "From University";
    }
    return `${role} - ${source}`;
  };

  const researchLink = getFullLink(research.researchLink);
  const relatedLink = getFullLink(research.relatedResearchLink);
  const hasCitations =
    research.noOfCititations > 0 && research.cites && research.cites.length > 0;

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`w-full min-h-[90vh] mx-auto pt-[clamp(1.5rem,2.5vh,3rem)] px-[clamp(1rem,8vw,20rem)] ${isArabic ? "rtl text-right" : "ltr text-left"}`}
      >
        {/* 1. Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6 border-b border-gray-100 pb-8">
          <div className="max-w-full xl:max-w-[70%]">
            <h1 className="font-black text-[#19355A] leading-tight mb-3 text-[clamp(1.2rem,2.2vw,2.5rem)] tracking-tight">
              {research.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-[clamp(9px,0.7vw,11px)] font-black uppercase tracking-[1.5px] text-[#B38E19]">
              <span className="flex items-center gap-1.5 bg-[#B38E19]/5 px-2.5 py-0.5 rounded-lg border border-[#B38E19]/10">
                <FiCalendar size="1.1em" /> {research.pubYear}
              </span>
              <span className="flex items-center gap-1.5 bg-[#19355A]/5 text-[#19355A] px-2.5 py-0.5 rounded-lg border border-[#19355A]/10">
                <FiLayers size="1.1em" />{" "}
                {research.publicationType || "Research Paper"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {relatedLink && (
              <a
                href={relatedLink}
                target="_blank"
                rel="noreferrer"
                className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#19355A] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,14px)] uppercase tracking-[2px] hover:bg-[#2a4a75] transition-all active:scale-95 shadow-lg"
              >
                <FiExternalLink size="1.2em" />{" "}
                {isArabic ? "أبحاث ذات صلة" : "Related Research"}
              </a>
            )}
            {researchLink && (
              <a
                href={researchLink}
                target="_blank"
                rel="noreferrer"
                className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,14px)] uppercase tracking-[2px] hover:bg-[#cfa82a] transition-all active:scale-95 shadow-lg shadow-amber-900/10"
              >
                <FiLink size="1.2em" />{" "}
                {isArabic ? "رابط البحث" : "Research Link"}
              </a>
            )}
            <button
              onClick={() => navigate(-1)}
              className="group h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-600 px-6 rounded-xl font-bold text-[clamp(11px,0.85vw,14px)] uppercase tracking-wider hover:border-[#19355A]/30 hover:text-[#19355A] hover:bg-gray-50/50 hover:shadow-md active:scale-95 transition-all duration-300"
            >
              <span
                className={`transition-transform duration-300 ${isArabic ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"}`}
              >
                {isArabic ? (
                  <FiArrowRight size="1.3em" />
                ) : (
                  <FiArrowLeft size="1.3em" />
                )}
              </span>

              <span className="border-l border-gray-200 h-4 mx-1 invisible group-hover:visible lg:visible opacity-30"></span>

              {isArabic ? "العودة للخلف" : "Go Back"}
            </button>
          </div>
        </div>

        {/* 2. Top Grid: Abstract + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1rem,2.5vw,2.5rem)] mb-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-[1.5rem] p-8 border border-gray-50 shadow-sm relative overflow-hidden">
            <div
              className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}
            ></div>
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] mb-4 flex items-center gap-2 uppercase tracking-[2.5px]">
              <FiFileText className="text-[#B38E19]" />{" "}
              {isArabic ? "الملخص" : "Abstract"}
            </h3>
            <p className="text-gray-500 leading-relaxed text-[clamp(0.85rem,1vw,1.5rem)] text-justify font-medium">
              {research.abstract ||
                (isArabic ? "لا يوجد ملخص." : "No abstract.")}
            </p>
          </div>

          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-fit self-start">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#19355A] font-black text-[clamp(10px,1vw,20px)] uppercase tracking-[2px] flex items-center gap-2">
                <FiBarChart2 className="text-[#B38E19]" />{" "}
                {isArabic ? "تطور الاقتباسات" : "Citations Trend"}
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-[#B38E19] uppercase tracking-widest leading-none mb-1">
                  {isArabic ? "الإجمالي" : "Total"}
                </p>
                <p className="text-[clamp(1.5rem,2vw,2.2rem)] font-black text-[#19355A] leading-none">
                  {research.noOfCititations || 0}
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-[200px] flex items-center justify-center overflow-hidden">
              {hasCitations ? (
                <div className="w-full h-[250px]">
                  <CitationsChart data={research.cites || []} />
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50/50 rounded-2xl w-full border border-dashed border-gray-200">
                  <FiBarChart2
                    className="mx-auto text-gray-300 mb-2"
                    size={40}
                  />
                  <p className="text-gray-400 font-bold text-[clamp(12px,0.8vw,16px)]">
                    {isArabic ? "لا يوجد اقتباسات متاحة" : "No citation data."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Publication Info - Modified for Alignment */}
        <div className="bg-gray-50/50 rounded-[1.5rem] p-6 border border-gray-100 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 items-center justify-items-center ">
            <HorizontalInfo
              label={isArabic ? "المصدر" : "Source"}
              value={displaySource}
              icon={<FiGlobe />}
            />
            <HorizontalInfo
              label={isArabic ? "المعرف DOI" : "DOI"}
              value={research.doi}
              icon={<FiHash />}
            />
            <HorizontalInfo
              label={isArabic ? "المجلة" : "Journal"}
              value={research.journalOrConfernce}
              icon={<BookMarked size="1.1em" />}
            />
            <HorizontalInfo
              label={isArabic ? "الناشر" : "Publisher"}
              value={research.publisher}
              icon={<FiBookOpen />}
            />
            <HorizontalInfo
              label={isArabic ? "العدد/المجلد" : "Issue/Vol"}
              value={`${research.issue || "-"}/${research.volume || "-"}`}
              icon={<FiCheckCircle />}
            />
            <HorizontalInfo
              label={isArabic ? "الصفحات" : "Pages"}
              value={research.noOfPages}
              icon={<FiFilePlus />}
            />
          </div>
        </div>

        {/* 4. Research Team */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiUsers className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] uppercase tracking-[2.5px]">
              {isArabic ? "الفريق البحثي" : "Research Team"}
            </h3>
          </div>
          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(research.contributions || [])
                .slice()
                .reverse()
                .map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 transition-all duration-300 hover:scale-[1] hover:bg-white hover:shadow-md hover:border-[#B38E19]/20 group cursor-default"
                  >
                    <div className="shrink-0 rounded-xl bg-[#19355A] group-hover:bg-[#B38E19] flex items-center justify-center font-black text-white w-[50px] h-[50px] transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="overflow-hidden leading-tight">
                      <p className="font-bold text-[clamp(13px,1vw,20px)] text-[#19355A] truncate group-hover:text-[#B38E19] transition-colors">
                        {member.memberAcademicName}
                      </p>
                      <p className="text-[clamp(10px,0.6vw,15px)] text-gray-400 font-black uppercase tracking-wider">
                        {formatContributorMeta(member)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B38E19; }
      `}</style>
    </ResponsiveLayoutProvider>
  );
}

// المكون المعدل لضمان المحاذاة
function HorizontalInfo({ label, value, icon }) {
  if (!value || value === "0" || value === "-") return null;
  return (
    <div className="flex flex-col h-full group">
      <div className="flex items-center gap-1.5 text-[#B38E19] mb-2 min-h-[35px]">
        <span className="flex items-center justify-center shrink-0 text-[1.1em]">
          {icon}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-[1.2]">
          {label}
        </span>
      </div>
      
      {/* منطقة القيمة */}
      <div className="text-[clamp(12px,0.8vw,14px)] font-bold text-[#19355A] leading-tight break-words pt-1 border-t border-transparent group-hover:border-[#B38E19]/10 transition-colors">
        {value}
      </div>
    </div>
  );
}