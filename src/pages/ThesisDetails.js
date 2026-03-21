import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiArrowLeft,
  FiEdit3,
  FiPaperclip,
  FiAward,
  FiBook,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { FolderKanban } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import { downloadThesisAttachment } from "../services/theses.services";

export default function ThesesDetails() {
  const { t, i18n } = useTranslation(["ThesesDetails", "Common"]);
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const thesis = location.state?.thesis;

  if (!thesis) return null;

  const formatThesisType = (type) => {
    if (!type) return "";
    const tMap = {
      PHD: isArabic ? "دكتوراه" : "PHD",
      MASTER: isArabic ? "ماجستير" : "Master",
      MA: isArabic ? "ماجستير" : "Master",
    };
    return tMap[type.toUpperCase()] || type;
  };

  const formatRole = (role) => {
    if (!role) return "";
    const roleMap = {
      Adminstration: isArabic ? "إدارة" : "Administration",
      Supervisor: isArabic ? "مشرف" : "Supervisor",
      "Co-Supervisor": isArabic ? "مشرف مشارك" : "Co-Supervisor",
    };
    return roleMap[role] || role;
  };

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadThesisAttachment(thesis.id, attachment.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName || "attachment";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`w-full min-h-[90vh] mx-auto pt-[clamp(1.5rem,2.5vh,3rem)] px-[clamp(1rem,8vw,20rem)] ${isArabic ? "rtl text-right" : "ltr text-left"}`}
      >
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-[clamp(1.5rem,4vh,3rem)] gap-6 border-b border-gray-100 pb-8">
          <div className="max-w-full xl:max-w-[75%]">
            <h1 className="font-black text-[#19355A] leading-tight mb-3 text-[clamp(1.2rem,2.2vw,2.5rem)] tracking-tight">
              {thesis.title || "No Title"}
            </h1>
            <div className="flex flex-wrap gap-2 text-[clamp(9px,0.7vw,11px)] font-black uppercase tracking-[1.5px] text-[#B38E19]">
              <span className="flex items-center gap-1.5 bg-[#B38E19]/5 px-2.5 py-0.5 rounded-lg border border-[#B38E19]/10">
                <FiAward size="1.1em" />{" "}
                {isArabic ? thesis.grade?.valueAr : thesis.grade?.valueEn}
              </span>
              <span className="flex items-center gap-1.5 bg-[#19355A]/5 text-[#19355A] px-2.5 py-0.5 rounded-lg border border-[#19355A]/10">
                <FiBook size="1.1em" /> {formatThesisType(thesis.type)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
            <button
              onClick={() => navigate(`/edit-thesis`, { state: { thesis } })}
              className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,0.8vw,17px)] uppercase tracking-[2px] hover:bg-[#19355A] transition-all shadow-lg shadow-[#B38E19]/20"
            >
              <FiEdit3 size="1.2em" /> {isArabic ? "تعديل" : "Edit"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="group h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-600 px-6 rounded-xl font-bold text-[clamp(11px,0.85vw,14px)] uppercase tracking-wider hover:border-[#19355A]/30 hover:text-[#19355A] hover:bg-gray-50/50 hover:shadow-md active:scale-95 transition-all duration-300"
            >
              {/* الأيقونة بتتحرك حركة بسيطة عند الهوفر */}
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

        {/* 1. بيانات المتابعة: توزيع متساوي عرضي */}
        <div className="bg-gray-50/50 rounded-[1.5rem] p-8 border border-gray-100 mb-8 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-8">
            <FolderKanban className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
            <h3 className="text-[#19355A] font-black text-[clamp(13px,0.8vw,17px)] uppercase tracking-[3px]">
              {isArabic ? "بيانات المتابعة" : "Tracking Data"}
            </h3>
          </div>

          <div className="flex flex-nowrap lg:justify-between gap-8 min-w-max lg:min-w-0 px-2">
            <MiniDetail
              label={isArabic ? "تاريخ القيد" : "Enrollment Date"}
              value={thesis.enrollmentDate}
              icon={<FiClock />}
            />
            <MiniDetail
              label={isArabic ? "تاريخ التسجيل" : "Registration Date"}
              value={thesis.registrationDate}
              icon={<FiCalendar />}
            />
            <MiniDetail
              label={isArabic ? "تاريخ التقدير الداخلي" : "Internal Grade Date"}
              value={thesis.internalGradeDate}
              icon={<FiCheckCircle />}
            />
            <MiniDetail
              label={isArabic ? "تأكيد الإشراف" : "Supervision Confirmation"}
              value={thesis.supervisionConfirmationDate}
              icon={<FiBriefcase />}
            />
            <MiniDetail
              label={isArabic ? "تاريخ المناقشة" : "Discussion Date"}
              value={thesis.discussionDate}
              icon={<FiInfo />}
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* 2. أعضاء اللجنة: سكرول فيتيكال */}
          <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] shadow-sm border border-gray-50 relative overflow-hidden">
            <div
              className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-1 h-full bg-[#B38E19]`}
            ></div>
            <div className="flex items-center gap-2 mb-6">
              <FiUsers className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
              <h3 className="text-[#19355A] font-black text-[clamp(13px,0.8vw,17px)] uppercase tracking-[3px]">
                {isArabic ? "أعضاء اللجنة" : "Committee Members"}
              </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {thesis.comitteeMembers?.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100"
                  >
                    <div
                      className="shrink-0 rounded-lg bg-[#B38E19] flex items-center justify-center font-black text-white"
                      style={{
                        width: "clamp(45px,3vw,60px)",
                        height: "clamp(45px,3vw,60px)",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden leading-tight">
                      <p className="font-bold text-[clamp(13px,1vw,16px)] truncate mb-0.5 text-[#19355A]">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-gray-400 uppercase font-black tracking-wider leading-none">
                        {isArabic
                          ? member.jobLevel?.valueAr
                          : member.jobLevel?.valueEn}{" "}
                        - {formatRole(member.role)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. الأبحاث المرتبطة: سكرول فيتيكال */}
          <div className="bg-white rounded-[1.5rem] p-[clamp(1.2rem,2.5vw,2.2rem)] border border-gray-50 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <FiFileText className="text-[#B38E19] text-[clamp(18px,1.5vw,25px)]" />
              <h3 className="text-[#19355A] font-black text-[clamp(13px,0.9vw,20px)] uppercase tracking-[2.5px]">
                {isArabic ? "الأبحاث" : "Researches"}
              </h3>
            </div>
            <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                {thesis.researches?.length > 0 ? (
                  thesis.researches.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-lg text-[#19355A] font-bold text-sm border-l-2 border-[#B38E19]"
                    >
                      {r}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 italic text-sm text-center py-4">
                    {isArabic ? "لا توجد أبحاث حالياً" : "No researches yet"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4. المرفقات: سكرول هورزنتال */}
          <div className="p-5 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-white">
            <p className="text-[clamp(10px,0.9vw,17px)] font-black text-gray-400 uppercase text-center mb-6 tracking-[3px]">
              {isArabic ? "المرفقات" : "Attachments"}
            </p>
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {thesis.attachments?.length > 0 ? (
                thesis.attachments.map((file, i) => (
                  <div
                    key={i}
                    onClick={() => handleDownload(file)}
                    className="flex items-center justify-between min-w-[250px] text-[clamp(12px,0.8vw,15px)] font-bold text-[#19355A] bg-gray-50 p-4 rounded-xl border border-transparent hover:border-[#B38E19]/30 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <span className="truncate flex-1 mr-2">
                      {file.fileName || `File ${i + 1}`}
                    </span>
                    <FiPaperclip className="text-[#B38E19] group-hover:scale-110 transition-transform" />
                  </div>
                ))
              ) : (
                <p className="w-full text-center text-gray-300 text-xs py-2">
                  {isArabic ? "لا توجد ملفات" : "No files"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B38E19; }
      `}</style>
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
        <span className="text-[clamp(10px,0.75vw,14px)] font-bold text-[#19355A]">
          {value}
        </span>
      </div>
    </div>
  );
}
