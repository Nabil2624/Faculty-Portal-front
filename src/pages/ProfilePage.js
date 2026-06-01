import React from "react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import HeroProfile from "../components/widgets/PublicProfile/HeroProfile";
import TopResearch from "../components/widgets/PublicProfile/TopResearch";
import InfoSection from "../components/widgets/PublicProfile/InfoSection";
const experienceData = [
  { title: "مستشار تقني لتطوير البوابات الجامعية", subtitle: "جامعة القاهرة", date: "2023 - الحاضر" },
  { title: "مدير مشروع بوابة التعلم الذكي", subtitle: "وزارة التعليم العالي", date: "2021 - 2023" },
  { title: "خبير نظم الربط المباشر (SignalR)", subtitle: "المجمع التكنولوجي المتكامل", date: "2019 - 2021" },
];

const ProfilePage = () => {
  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen bg-[#F4F7F9] font-sans text-[#19355A]">
        <div className="max-w-[1250px] mx-auto px-4 lg:px-8 pt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* 1. System Navigation Header - يعطي طابع النظام الأكاديمي */}
          <div className=" flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-[2px] bg-[#B38E19]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B38E19]">
                  Official Profile
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#19355A] tracking-tight">
                الملف الشخصي الأكاديمي
              </h1>
            </div>

            {/* Status Badge */}
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Active System Instance
              </span>
            </div>
          </div>

          {/* 2. Page Content - Structured as a Professional Profile */}
          <div className="max-w-[1200px] mx-auto px-4">
 


            {/* Main Grid Layout */}
            <div className="flex flex-col gap-y-12">
              {/* الجزء الأول: الكارت التعريفي (المرجع الأساسي للهوية) */}
              <section className="w-full">
                <HeroProfile />
              </section>

              {/* الجزء الثاني: لوحة البيانات (Data Dashboard) */}
              <div className="grid grid-cols-1 gap-y-8">
                {/* تجميعة الأبحاث */}
                <div>
                  <TopResearch />
                </div>

                {/* تجميعة السجلات الوظيفية والعلمية */}
                <div className="grid grid-cols-1 gap-8">
                  <div >
                    <InfoSection
                      title="المهمات العلمية والبعثات"
                      buttonText="سجل البعثات"
                      data={experienceData} // بيانات المهمات
                    />
                  </div>

                  <div >
                    <InfoSection
                      title="الخبرات المهنية المعتمدة"
                      buttonText="السجل الوظيفي"
                      data={experienceData} // بيانات الخبرات
                      showCitations={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Official System Footer */}
          <footer className="mt-16 py-8 bg-white border-t border-gray-200">
            <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Profile Status: Active & Verified
                </span>
              </div>
              <p className="text-[10px] font-medium">
                Internal Registry:{" "}
                <span className="text-[#19355A]">STAFF-2026-X99</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default ProfilePage;
