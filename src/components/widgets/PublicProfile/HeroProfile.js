import React from "react";
import { useTranslation } from "react-i18next";
import useDownloadCV from "../../../hooks/useDownloadCV";

const HeroProfile = ({ data = {}, interests = [], img }) => {
  const isVerified = data.isVerified;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { downloadCV, loading } = useDownloadCV();

  const handleDownloadCV = async () => {
    try {
      const cv = await downloadCV(data.facultyMemberId);

      console.log(cv);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      className="w-full py-8 px-6 flex justify-center"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ID Card Container */}
      <div className="relative w-full max-w-[1150px] bg-white rounded-2xl shadow-xl overflow-hidden border-t-[10px] border-[#19355A] flex flex-col lg:flex-row min-h-[420px]">
        {/* Left/Right Side: Photo Sidebar */}
        <div
          className={`w-full lg:w-[28%] bg-[#fcfcfc] p-6 flex flex-col items-center justify-center border-gray-100 border-dashed ${isArabic ? "lg:border-l-0 lg:border-r" : "lg:border-r-0 lg:border-l"}`}
        >
          <div className="relative w-48 h-56 mb-5">
            {/* ID Frame */}
            <div className="w-full h-full border-[6px] border-white shadow-lg overflow-hidden rounded-md transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={img}
                alt={isArabic ? "الصورة الشخصية" : "Profile"}
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>
            {/* Ghost Signature */}
            <p
              className={`absolute -bottom-3 ${isArabic ? "left-2" : "right-2"} font-serif text-sm italic text-gray-400/50 -rotate-12 select-none pointer-events-none`}
            >
              {data.name}
            </p>
          </div>

          <div className="text-center space-y-1">
            <span
              className={`text-gray-400 block uppercase tracking-widest font-bold ${isArabic ? "text-xs" : "text-[10px]"}`}
            >
              {isArabic ? "رقم التسجيل" : "Registration ID"}
            </span>
            <span className="font-mono text-base font-black text-[#19355A]">
              {data.registrationId}
            </span>
          </div>

          <button
            onClick={handleDownloadCV}
            disabled={loading}
            className={`mt-6 w-full py-3 bg-[#19355A] text-white font-black rounded-lg hover:bg-[#B38E19] transition-all shadow-md active:scale-95 uppercase tracking-[0.2em] ${isArabic ? "text-xs" : "text-[11px]"}`}
          >
            {isArabic ? "عرض السيرة الذاتية" : "View CV"}
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[72%] p-8 lg:p-10 relative flex flex-col justify-between">
          {/* Header Section */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-[#B38E19] rounded-full"></div>
                  <h2
                    className={`text-[#B38E19] font-black uppercase tracking-[0.3em] ${isArabic ? "text-[13px]" : "text-[11px]"}`}
                  >
                    {isArabic ? "باحث أكاديمي" : "Academic Researcher"}
                  </h2>
                </div>
                <h1
                  className={`font-black text-[#19355A] tracking-tight ${isArabic ? "text-5xl lg:text-6xl" : "text-4xl lg:text-5xl"}`}
                >
                  {data.name}
                </h1>
              </div>

              {/* Security Status */}
              <div
                className={`hidden sm:block ${isArabic ? "text-left" : "text-right"}`}
              >
                <span
                  className={`text-gray-400 block uppercase font-bold mb-1 ${isArabic ? "text-xs" : "text-[10px]"}`}
                >
                  {isArabic ? "الحالة الأمنية" : "Security Status"}
                </span>
                <span
                  className={`px-3 py-1 font-black rounded border transition-colors ${isArabic ? "text-xs" : "text-[10px]"} ${
                    isVerified
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {isVerified
                    ? isArabic
                      ? "وصول موثّق"
                      : "VERIFIED ACCESS"
                    : isArabic
                      ? "غير موثّق"
                      : "UNVERIFIED ACCESS"}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <span
                  className={`text-gray-400 block uppercase font-black tracking-widest ${isArabic ? "text-xs" : "text-[10px]"}`}
                >
                  {isArabic ? "مجالات الاهتمام" : "Fields of Interest"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-1.5 bg-white border border-gray-200 text-[#19355A] font-bold rounded shadow-sm hover:border-[#B38E19] transition-colors ${isArabic ? "text-sm" : "text-xs"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span
                  className={`text-gray-400 block uppercase font-black tracking-widest ${isArabic ? "text-xs" : "text-[10px]"}`}
                >
                  {isArabic ? "نبذة تعريفية" : "Biography"}
                </span>
                <p
                  className={`text-[#19355A]/90 text-justify font-medium italic border-[#B38E19] py-2 bg-slate-50/50 ${
                    isArabic
                      ? "text-xl leading-[1.8] border-r-4 pr-5 rounded-l-lg"
                      : "text-lg leading-relaxed border-l-4 pl-5 rounded-r-lg"
                  }`}
                >
                  {data.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 flex flex-wrap justify-between items-end mt-8 pt-6 border-t border-gray-100">
            <div className="flex gap-8">
              <div className="space-y-0.5">
                <span
                  className={`text-gray-400 block uppercase font-bold ${isArabic ? "text-[11px]" : "text-[9px]"}`}
                >
                  {isArabic ? "تاريخ الإصدار" : "Issue Date"}
                </span>
                <span
                  className={`font-black text-[#19355A] ${isArabic ? "text-sm" : "text-xs"}`}
                >
                  {data.issueDate}
                </span>
              </div>
              <div className="space-y-0.5">
                <span
                  className={`text-gray-400 block uppercase font-bold ${isArabic ? "text-[11px]" : "text-[9px]"}`}
                >
                  {isArabic ? "النظام" : "System"}
                </span>
                <span
                  className={`font-black text-[#19355A] ${isArabic ? "text-sm" : "text-xs"}`}
                >
                  {data.system}
                </span>
              </div>
            </div>

            {/* Compact Barcode */}
            <div className="flex flex-col items-end gap-1">
              <div className="h-9 w-36 bg-white flex gap-[1.5px] items-end opacity-70">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-black flex-1"
                    style={{
                      height: `${Math.floor(Math.random() * (100 - 40 + 1) + 40)}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
