import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiDownload, FiEdit3, FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function FullCVPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const htmlContent = state?.html || "<h1>No Content</h1>";

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CV.html";
    link.click();
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-4 ${isArabic ? "rtl" : "ltr"}`}>
      {/* Toolbar */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200 sticky top-4 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#19355A] font-bold hover:bg-gray-100 p-2 rounded-lg transition-all"
        >
          <FiArrowLeft className={isArabic ? "rotate-180" : ""} /> 
          {isArabic ? "رجوع" : "Back"}
        </button>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/edit-profile")} // افترضت لينك التعديل
            className="flex items-center gap-2 bg-[#B38E19] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#19355A] transition-all shadow-md"
          >
            <FiEdit3 /> {isArabic ? "تعديل" : "Edit"}
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-[#19355A] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all shadow-md"
          >
            <FiDownload /> {isArabic ? "تحميل" : "Download"}
          </button>
        </div>
      </div>

      {/* CV Paper Appearance */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm border border-gray-300 mb-10 overflow-hidden">
        {/* عرض الـ HTML بالكامل */}
        <div className="p-[2%]">
             <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}