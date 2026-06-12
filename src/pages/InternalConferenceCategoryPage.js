import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import { GraduationCap } from "lucide-react";
import attendImg from "../assets/attendConference.avif";
import origanizeImg from "../assets/OrganizeConference.png";
import historyImg from "../assets/History.png";

const InternalConferenceCategoryPage = () => {
  const { t, i18n } = useTranslation("CategoriesPage");
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  // قيم clamp أكبر لضمان مظهر فخم ومريح للعين
  const cardStyles = {
    "--card-width": "clamp(320px, 25vw, 480px)", // عرض الكارت (متوسط 400px في الشاشات الكبيرة)
    "--card-padding": "clamp(1.1rem, 1.3vw, 2.3rem)", // بادنج مريح
    "--title-size": "clamp(1.25rem, 1.5vw, 1.75rem)", // عنوان كبير وواضح
    "--desc-size": "clamp(0.95rem, 1vw, 1.3rem)", // نص مريح للقراءة
    "--btn-size": "clamp(0.85rem, 0.9vw, 1rem)", // زر بحجم مناسب
  };

  const cardsData = [
    { id: "attend-qf05", titleKey: "attend.title", descKey: "attend.description", imageUrl: attendImg, link: "/conference-form", state: { conferenceType: "internal" } },
    { id: "organize-qf06", titleKey: "organize.title", descKey: "organize.description", imageUrl: origanizeImg, link: "/forms/qf-06" },
    { id: "history", titleKey: "history.title", descKey: "history.description", imageUrl: historyImg, link: "/internal-conferences/history" },
  ];

  return (
    <ResponsiveLayoutProvider>
      <div className="px-4" dir={isRtl ? "rtl" : "ltr"}>
        <PageHeaderAction title={t("internalTitle")} icon={GraduationCap} />

        {/* حاوية الكروت المركزية */}
        <div className="flex items-center justify-center min-h-[calc(100vh-350px)] px-8">
          <div className="grid grid-cols-1 md:grid-cols-3  w-full max-w-[84rem] justify-items-center" style={{gap: "clamp(2rem, 8vw , 20rem)"}}>
            {cardsData.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(card.link, { state: card.state })}
                style={cardStyles} 
                className="group relative flex flex-col bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03]"
                // نطبق العرض من الـ style مباشرة
                style={{ ...cardStyles, width: "var(--card-width)" }} 
              >
                {/* الصورة */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={card.imageUrl} alt={t(card.titleKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19355A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* المحتوى */}
                <div 
                  className="relative flex-1 flex flex-col"
                  style={{ padding: "var(--card-padding)" }}
                >
                  <div className={`absolute top-0 h-[4px] bg-[#B38E19] w-20 transition-all duration-500 group-hover:w-full ${isRtl ? "right-[var(--card-padding)]" : "left-[var(--card-padding)]"}`}></div>

                  <h3 
                    style={{ fontSize: "var(--title-size)" }}
                    className="font-bold text-[#19355A] mb-3 pt-4 transition-colors group-hover:text-[#B38E19]"
                  >
                    {t(card.titleKey)}
                  </h3>

                  <p 
                    style={{ fontSize: "var(--desc-size)" }}
                    className="text-slate-600 leading-relaxed mb-6 flex-grow"
                  >
                    {t(card.descKey)}
                  </p>

                  <div 
                    style={{ fontSize: "var(--btn-size)" }}
                    className="w-full font-bold text-[#19355A] group-hover:text-[#B38E19] mt-auto flex items-center justify-end gap-2"
                  >
                    <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
                    <span className="transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default InternalConferenceCategoryPage;