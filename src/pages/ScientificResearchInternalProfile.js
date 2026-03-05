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
  FiEdit3,
  FiFilePlus,
  FiCheckCircle,
} from "react-icons/fi";
import {BookMarked}from "lucide-react"
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import { downloadResearchAttachment } from "../services/scientificResearchService";

export default function ScientificResearchInternalProfile() {
  const { t, i18n } = useTranslation(["ScientificResearchFullDetails"]);
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const research = location.state?.research;

  if (!research) return null;

  // --- Logic Helpers ---
  const formatContributorMeta = (c) => {
    const role = c.isTheMajorResearcher
      ? t("mainResearcher")
      : t("coResearcher");
    let source = "";
    if (c.contributorType === "FromUniverstity" || c.contributorType === 0) {
      source = isArabic ? "من الجامعة" : "From University";
    } else if (c.contributorType === "ExternalContributor") {
      source = isArabic ? "خارج الجامعة" : "External";
    } else if (c.contributorType === "Unspecified") {
      source = isArabic ? "غير محدد" : "Unspecified";
    }
    return `${role} - ${source}`;
  };

  const formatValue = (value) => {
    if (!value || typeof value !== "string") return value;
    const lower = value.toLowerCase();
    if (lower.includes("phd") || lower.includes("ph.d"))
      return isArabic ? "دكتوراه" : "PhD";
    if (lower.includes("master")) return isArabic ? "ماجستير" : "Master’s";
    if (lower.includes("other")) return isArabic ? "أخرى" : "Other";
    if (lower.includes("internal") || lower.includes("local"))
      return isArabic ? "محلي" : "Internal";
    if (lower.includes("international"))
      return isArabic ? "دولي" : "International";
    if (lower.includes("magazine")) return isArabic ? "مجلة" : "Magazine";
    if (lower.includes("conference")) return isArabic ? "مؤتمر" : "Conference";
    return value;
  };

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadResearchAttachment(
        research.id,
        attachment.id
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName || attachment.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const safeLink = research.researchLink
    ? research.researchLink.startsWith("http")
      ? research.researchLink
      : `https://${research.researchLink}`
    : null;

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`w-full min-h-[90vh] mx-auto pt-[clamp(1.5rem,2.5vh,3rem)] px-[clamp(1rem,8vw,20rem)] 
        ${isArabic ? "rtl text-right" : "ltr text-left"}`}
      >
        {/* Header Section */}
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
                <FiLayers size="1.1em" /> {formatValue(research.publicationType)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
            <button
              onClick={() =>
                navigate(`/edit-scientific-research`, { state: { research } })
              }
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,17px)] uppercase tracking-[2px] hover:bg-[#19355A] transition-all shadow-lg shadow-[#B38E19]/20"
            >
              <FiEdit3 size="1.2em" /> {isArabic ? "تعديل" : "Edit"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 text-gray-400 bg-white border border-gray-100 px-5 rounded-xl font-black text-[clamp(10px,0.8vw,17px)] uppercase tracking-[2px] hover:text-[#19355A] shadow-sm"
            >
              {isArabic ? <FiArrowLeft size="1.2em" /> : <FiArrowRight size="1.2em" />}
              <span>{isArabic ? "الرجوع" : "Back"}</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1rem,2.5vw,2.5rem)]">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-[clamp(1rem,3vh,2rem)]">
            {/* Abstract Card */}
            <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-50 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}></div>
              <h3 className="text-[#19355A] font-black text-[clamp(7px,0.9vw,20px)] mb-4 flex items-center gap-2 uppercase tracking-[2.5px]">
                <FiFileText className="text-[#B38E19]" /> {isArabic ? "الملخص" : "Abstract"}
              </h3>
              <p className="text-gray-500 leading-relaxed text-[clamp(0.85rem,1vw,1.5rem)] font-medium">
                {research.abstract || (isArabic ? "لا يوجد ملخص." : "No abstract.")}
              </p>
            </div>

            {/* Team Card - Modified for Fixed Box Sizes and Better Text Flow */}
            <div className="bg-[#19355A] rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <FiUsers className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
                <h3 className="text-[#B38E19] font-black text-[clamp(7px,0.8vw,17px)] uppercase tracking-[3px]">
                  {isArabic ? "الفريق البحثي" : "Research Team"}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...(research.contributions || [])]
                  .reverse()
                  .map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5"
                    >
                      {/* Fixed Size Number Box */}
                      <div
                        className="shrink-0 rounded-lg bg-[#B38E19] flex items-center justify-center font-black text-white text-[16px]"
                        style={{ width: "42px", height: "42px" }}
                      >
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden leading-tight">
                        <p className="font-bold text-[clamp(13px,1vw,16px)] truncate mb-0.5 text-white">
                          {member.memberAcademicName}
                        </p>
                        <p className="text-[11px] text-white/50 uppercase font-black tracking-wider leading-none">
                          {formatContributorMeta(member)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-[clamp(1rem,3vh,2rem)]">
            <div className="bg-gray-50/50 rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2rem)] border border-gray-100">
              <h4 className="text-[#19355A] font-black text-[clamp(12px,0.9vw,20px)] uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-2">
                {isArabic ? "تفاصيل النشر" : "Publication Info"}
              </h4>
              <div className="space-y-5">
                <MiniDetail
                  label={isArabic ? "الناشر" : "Publisher"}
                  value={research.publisher}
                  icon={<FiBookOpen />}
                />
                <MiniDetail
                  label={isArabic ? "المجلة / المؤتمر" : "Journal/Conference"}
                  value={research.journalOrConfernce}
                  icon={<BookMarked />}
                />
                <MiniDetail
                  label={isArabic ? "نوع الناشر" : "Publisher Type"}
                  value={formatValue(research.publisherType)}
                  icon={<FiCheckCircle />}
                />
                <MiniDetail
                  label={isArabic ? "مشتق من" : "Derived From"}
                  value={formatValue(research.researchDerivedFrom)}
                  icon={<FiFilePlus />}
                />

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <StatBox label={isArabic ? "العدد" : "Issue"} value={research.issue} />
                  <StatBox label={isArabic ? "المجلد" : "Vol."} value={research.volume} />
                  <StatBox label={isArabic ? "الصفحات" : "Pages"} value={research.noOfPages} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {safeLink && (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#19355A] text-white rounded-xl font-black text-[clamp(12px,0.8vw,15px)] uppercase tracking-[2px] hover:bg-[#B38E19] transition-all shadow-lg shadow-[#19355A]/20"
                >
                  <FiExternalLink /> {isArabic ? "زيارة الرابط" : "Visit Link"}
                </a>
              )}

              <div className="p-5 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-white">
                <p className="text-[clamp(10px,0.9vw,17px)] font-black text-gray-400 uppercase text-center mb-4 tracking-[3px]">
                  {isArabic ? "المرفقات" : "Attachments"}
                </p>
                <div className="space-y-2">
                  {(research.attachments || []).map((file, i) => (
                    <div
                      key={i}
                      onClick={() => handleDownload(file)}
                      className="flex items-center justify-between text-[clamp(12px,0.8vw,15px)] font-bold text-[#19355A] bg-gray-50 p-3 rounded-lg border border-transparent hover:border-[#B38E19]/30 hover:bg-white transition-all cursor-pointer group"
                    >
                      <span className="truncate flex-1 mr-2">
                        {file.fileName || file.name || `File ${i + 1}`}
                      </span>
                      <FiPaperclip className="text-[#B38E19] group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                  {(!research.attachments || research.attachments.length === 0) && (
                    <p className="text-center text-gray-300 text-xs py-2">
                      {isArabic ? "لا توجد ملفات" : "No files available"}
                    </p>
                  )}
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
    <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
      <span className="text-[clamp(10px,0.8vw,14px)] text-gray-400 block uppercase font-black mb-0.5 leading-none">
        {label}
      </span>
      <span className="text-[clamp(10px,0.75vw,14px)] font-black text-[#19355A] leading-none">
        {value || "-"}
      </span>
    </div>
  );
}