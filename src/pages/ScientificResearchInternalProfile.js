import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiCalendar,
  FiLayers,
  FiPaperclip,
  FiArrowRight,
  FiArrowLeft,
  FiEdit3,
  FiFilePlus,
  FiCheckCircle,
} from "react-icons/fi";
import { BookMarked } from "lucide-react";
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
    const role = c.isTheMajorResearcher ? t("mainResearcher") : t("coResearcher");
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
    if (lower.includes("phd") || lower.includes("ph.d")) return isArabic ? "دكتوراه" : "PhD";
    if (lower.includes("master")) return isArabic ? "ماجستير" : "Master’s";
    if (lower.includes("other")) return isArabic ? "أخرى" : "Other";
    if (lower.includes("internal") || lower.includes("local")) return isArabic ? "محلي" : "Internal";
    if (lower.includes("international")) return isArabic ? "دولي" : "International";
    if (lower.includes("magazine")) return isArabic ? "مجلة" : "Magazine";
    if (lower.includes("conference")) return isArabic ? "مؤتمر" : "Conference";
    return value;
  };

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadResearchAttachment(research.id, attachment.id);
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

  return (
    <ResponsiveLayoutProvider>
      <div className={`w-full min-h-[90vh] mx-auto pt-[clamp(1.5rem,2.5vh,3rem)] px-[clamp(1rem,8vw,20rem)] ${isArabic ? "rtl text-right" : "ltr text-left"}`}>
        
        {/* 1. Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-[clamp(1.5rem,4vh,3rem)] gap-6 border-b border-gray-100 pb-8">
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
              onClick={() => navigate(`/edit-scientific-research`, { state: { research } })}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,14px)] uppercase tracking-[2px] hover:bg-[#19355A] transition-all shadow-lg shadow-[#B38E19]/20"
            >
              <FiEdit3 size="1.2em" /> {isArabic ? "تعديل" : "Edit"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 text-gray-400 bg-white border border-gray-100 px-5 rounded-xl font-black text-[clamp(10px,0.8vw,14px)] uppercase tracking-[2px] hover:text-[#19355A] shadow-sm"
            >
              {isArabic ? <FiArrowLeft size="1.2em" /> : <FiArrowRight size="1.2em" />} <span>{isArabic ? "الرجوع" : "Back"}</span>
            </button>
          </div>
        </div>

        {/* 2. Top Content: Abstract & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1rem,2.5vw,2.5rem)] mb-8">
          {/* Abstract */}
          <div className="lg:col-span-8 bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-50 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}></div>
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] mb-4 flex items-center gap-2 uppercase tracking-[2.5px]">
              <FiFileText className="text-[#B38E19]" /> {isArabic ? "الملخص" : "Abstract"}
            </h3>
            <p className="text-gray-500 leading-relaxed text-[clamp(0.85rem,1vw,1.5rem)] font-medium">
              {research.abstract || (isArabic ? "لا يوجد ملخص." : "No abstract.")}
            </p>
          </div>

          {/* Publication Info Sidebar */}
          <div className="lg:col-span-4 bg-gray-50/50 rounded-[1.5rem] p-6 border border-gray-100 h-fit">
            <h4 className="text-[#19355A] font-black text-[clamp(11px,0.8vw,14px)] uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-2">
              {isArabic ? "تفاصيل النشر" : "Publication Info"}
            </h4>
            <div className="space-y-4">
              <MiniDetail label={isArabic ? "الناشر" : "Publisher"} value={research.publisher} icon={<FiBookOpen />} />
              <MiniDetail label={isArabic ? "المجلة / المؤتمر" : "Journal/Conference"} value={research.journalOrConfernce} icon={<BookMarked size={18}/>} />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <StatBox label={isArabic ? "العدد/المجلد" : "Issue"} value={research.issue} />
                {/* <StatBox label={isArabic ? "المجلد" : "Vol."} value={research.volume} /> */}
                <StatBox label={isArabic ? "الصفحات" : "Pages"} value={research.noOfPages} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Research Team Section (3 columns with Scroll) */}
        <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FiUsers className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] uppercase tracking-[2.5px]">
              {isArabic ? "الفريق البحثي" : "Research Team"}
            </h3>
          </div>
          <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...(research.contributions || [])].reverse().map((member, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                  <div className="shrink-0 rounded-xl bg-[#19355A] group-hover:bg-[#B38E19] flex items-center justify-center font-black text-white transition-colors"
                       style={{ width: "clamp(45px,3vw,60px)", height: "clamp(45px,3vw,60px)", fontSize: "clamp(14px,1vw,18px)" }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <p className="font-bold text-[clamp(13px,1vw,16px)] text-[#19355A] truncate mb-0.5">
                      {member.memberAcademicName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider leading-none">
                      {formatContributorMeta(member)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Attachments Section (3 columns with Scroll) */}
        <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiPaperclip className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] uppercase tracking-[2.5px]">
              {isArabic ? "المرفقات" : "Attachments"}
            </h3>
          </div>
          <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(research.attachments || []).map((file, i) => (
                <div
                  key={i}
                  onClick={() => handleDownload(file)}
                  className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-[#B38E19]/30 transition-all cursor-pointer group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-[#B38E19] group-hover:bg-[#B38E19]/10 transition-colors">
                    <FiPaperclip size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-[clamp(12px,0.8vw,15px)] text-[#19355A] truncate">
                      {file.fileName || file.name || `File ${i + 1}`}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{isArabic ? "تحميل الملف" : "Download File"}</p>
                  </div>
                </div>
              ))}
              {(!research.attachments || research.attachments.length === 0) && (
                <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-300 text-sm">
                  {isArabic ? "لا توجد ملفات مرفقة" : "No attachments available"}
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B38E19; }
          .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f8fafc; }
        `}</style>
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
        <span className="text-[clamp(9px,0.7vw,12px)] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</span>
        <span className="text-[clamp(11px,0.8vw,14px)] font-bold text-[#19355A] break-words">{value}</span>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white p-2 rounded-xl border border-gray-100 text-center shadow-sm">
      <span className="text-[10px] text-gray-400 block uppercase font-black mb-0.5 leading-none">{label}</span>
      <span className="text-[12px] font-black text-[#19355A] leading-none">{value || "-"}</span>
    </div>
  );
}