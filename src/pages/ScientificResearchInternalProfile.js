import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiExternalLink,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiCalendar,
  FiBookmark,
  FiLayers,
  FiPaperclip,
  FiArrowRight,
  FiArrowLeft,
  FiInfo,
  FiEdit3,
} from "react-icons/fi";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function ScientificResearchInternalProfile() {
  const { t, i18n } = useTranslation(["ScientificResearches"]);
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const research = location.state?.research;

  if (!research) return null;

  return (
    <ResponsiveLayoutProvider>
      
      <div
        className={`w-full min-h-[90vh] mx-auto 
        pt-[clamp(1.5rem,2.5vh,3rem)]  
        px-[clamp(1rem,8vw,20rem)] 
        ${isArabic ? "rtl text-right" : "ltr text-left"}`}
      >
        {/* Header - ملموم في الـ HD ومنتشر في الـ 4K */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-[clamp(1.5rem,4vh,3rem)] gap-6">
          <div className="max-w-full xl:max-w-[75%]">
            <h1 className="font-black text-[#19355A] leading-tight mb-3 text-[clamp(1.2rem,2.2vw,2.5rem)] tracking-tight">
              {research.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-[clamp(9px,0.7vw,11px)] font-black uppercase tracking-[1.5px] text-[#B38E19]">
              <span className="flex items-center gap-1.5 bg-[#B38E19]/5 px-2.5 py-0.5 rounded-lg border border-[#B38E19]/10">
                <FiCalendar size="1.1em" /> {research.pubYear}
              </span>
              <span className="flex items-center gap-1.5 bg-[#19355A]/5 text-[#19355A] px-2.5 py-0.5 rounded-lg border border-[#19355A]/10">
                <FiLayers size="1.1em" /> {research.publicationType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
            {/* أزرار ملمومة أكتر h-11 بدل clamp ضخم */}
            <button
              onClick={() =>
                navigate(`/edit-scientific-research`, { state: { research } })
              }
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(7px,0.8vw,17px)] uppercase tracking-[2px] hover:bg-[#19355A] transition-all shadow-lg shadow-[#B38E19]/20"
            >
              <FiEdit3 size="1.2em" /> {isArabic ? "تعديل" : "Edit"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 text-gray-400 bg-white border border-gray-100 px-5 rounded-xl font-black text-[clamp(7px,0.8vw,17px)] uppercase tracking-[2px] hover:text-[#19355A] shadow-sm"
            >
              {isArabic ? (
                <FiArrowLeft size="1.2em" />
              ) : (
                <FiArrowRight size="1.2em" />
              )}
              <span>{isArabic ? "الرجوع" : "Back"}</span>
            </button>
          </div>
        </div>

        {/* Content Grid - تحسين الـ Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1rem,2.5vw,2.5rem)]">
          <div className="lg:col-span-8 space-y-[clamp(1rem,3vh,2rem)]">
            <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-50 shadow-sm relative overflow-hidden">
              <div
                className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}
              ></div>
              <h3 className="text-[#19355A] font-black text-[clamp(7px,0.8vw,17px)] mb-4 flex items-center gap-2 uppercase tracking-[2.5px]">
                <FiFileText className="text-[#B38E19]" />{" "}
                {isArabic ? "الملخص" : "Abstract"}
              </h3>
              <p className="text-gray-500 leading-relaxed text-[clamp(0.85rem,1vw,3rem)] font-medium italic">
                {research.abstract ||
                  (isArabic ? "لا يوجد ملخص." : "No abstract.")}
              </p>
            </div>

            <div className="bg-[#19355A] rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <FiUsers className="text-[#B38E19] text-[clamp(7px,1vw,25px)]" />
                <h3 className="text-[#B38E19] font-black text-[clamp(7px,0.8vw,17px)] uppercase tracking-[3px]">
                  {isArabic ? "الفريق البحثي" : "Team"}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-3 gap-3">
                {research.contributions?.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#B38E19] flex items-center justify-center font-black text-white text-[10px]">
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-[clamp(11px,0.9vw,18px)] truncate">
                        {member.memberAcademicName}
                      </p>
                      <p className="text-[clamp(8px,0.7vw,15px)] text-white/30 uppercase font-black tracking-widest">
                        {member.isTheMajorResearcher
                          ? isArabic
                            ? "رئيسي"
                            : "Lead"
                          : isArabic
                            ? "مشارك"
                            : "Co"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-[clamp(1rem,3vh,2rem)]">
            <div className="bg-gray-50/50 rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2rem)] border border-gray-100">
              <h4 className="text-[#19355A] font-black text-[clamp(12px,0.9vw,20px)] uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-2">
                {isArabic ? "بيانات النشر" : "Publication"}
              </h4>
              <div className="space-y-4">
                <MiniDetail
                  label={isArabic ? "الناشر" : "Publisher"}
                  value={research.publisher}
                  icon={<FiBookOpen size="1.2em" />}
                />
                <MiniDetail
                  label={isArabic ? "المجلة" : "Journal"}
                  value={research.journalOrConfernce}
                  icon={<FiBookmark size="1.2em" />}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                    <span className="text-[clamp(12px,0.8vw,17px)] text-gray-400 block uppercase font-black mb-0.5">
                      {isArabic ? "العدد" : "Issue"}
                    </span>
                    <span className="text-[clamp(10px,0.8vw,14px)] font-black text-[#19355A]">
                      {research.issue || "-"}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                    <span className="text-[clamp(12px,0.8vw,17px)] text-gray-400 block uppercase font-black mb-0.5">
                      {isArabic ? "المجلد" : "Vol."}
                    </span>
                    <span className="text-[clamp(10px,0.8vw,14px)] font-black text-[#19355A]">
                      {research.volume || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {research.researchLink && (
                <a
                  href={research.researchLink}
                  target="_blank"
                  rel="noreferrer"
                  className=" flex items-center justify-center gap-2 w-full py-3 bg-[#19355A] text-white rounded-xl font-black text-[clamp(9px,0.8vw,17px)] uppercase tracking-[2px] hover:bg-[#B38E19] transition-all"
                >
                  <FiExternalLink /> {isArabic ? "الرابط" : "Link"}
                </a>
              )}

              <div className="p-4 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-white">
                <p className="text-[clamp(7px,0.8vw,17px)] font-black text-gray-300 uppercase text-center mb-4 tracking-[3px]">
                  {isArabic ? "المرفقات" : "Attachments"}
                </p>
                <div className="space-y-2">
                  {research.attachments?.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[clamp(7px,0.8vw,20px)] font-bold text-[#19355A] bg-gray-50 p-2 rounded-lg border border-transparent hover:border-[#B38E19]/30 transition-all cursor-pointer"
                    >
                      <span className="truncate w-32">
                        {f.name || `File ${i + 1}`}
                      </span>
                      <FiPaperclip className="text-[#B38E19]" size="1em" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}

function MiniDetail({ label, value, icon }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 items-start group">
      <div className="mt-0.5 text-[#B38E19] shrink-0">{icon}</div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[clamp(7px,0.8vw,17px)] font-black text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </span>
        <span className="text-[clamp(10px,0.8vw,12px)] font-bold text-[#19355A] leading-snug whitespace-normal break-words">
          {value}
        </span>
      </div>
    </div>
  );
}
