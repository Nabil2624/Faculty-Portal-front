import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { GraduationCap } from "lucide-react";

import attendExternalImg from "../assets/attendConference.avif"; 
import historyImg from "../assets/History.png"; 
import PageHeaderAction from "../components/ui/PageHeaderAction";

const ExternalConferenceCategoryPage = () => {
  const { t, i18n } = useTranslation("CategoriesPage");
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  const cardsData = [
    {
      id: "attend-qf04",
      titleKey: "attendQf04.title",
      descKey: "attendQf04.description",
      imageUrl: attendExternalImg,
      link: "/forms/qf-04", 
    },
    {
      id: "history",
      titleKey: "historyExternal.title",
      descKey: "historyExternal.description",
      imageUrl: historyImg,
      link: "/external-conferences/history", 
    },
  ];

  const handleCardClick = (card) => {
    console.log(`Navigating to: ${card.id}`);
    navigate(card.link);
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className="min-h-[90vh] px-4 sm:px-1 lg:px-2"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* عنوان الصفحة الخارجية */}
        <PageHeaderAction title={t("externalTitle")} icon={GraduationCap} />

        <div className="max-w-4xl mx-auto mt-8">
          {/* شبكة الكروت الثنائية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
            {cardsData.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="group relative w-full max-w-sm h-full flex flex-col bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.03]"
              >
                {/* صورة الكارت بالأبعاد الأصلية الفخمة */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={card.imageUrl}
                    alt={t(card.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x450/19355a/ffffff?text=Academic";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19355A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* محتوى الكارت: توب وجوانب واسعين (8) وسفلي ملموم (5) */}
                <div className="pt-8 px-8 pb-5 relative flex-1 flex flex-col">
                  {/* الخط الذهبي متناسق مع الـ padding الـ 8 الحالي */}
                  <div
                    className={`absolute top-0 h-[3.5px] bg-[#B38E19] transition-all duration-500 ease-in-out group-hover:w-full w-14 ${isRtl ? "right-8" : "left-8"}`}
                  ></div>

                  {/* رجوع الخط الكبير الفخم للعنوان */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#19355A] mb-2 pt-3 group-hover:text-[#B38E19] transition-colors duration-300">
                    {t(card.titleKey)}
                  </h3>

                  {/* رجوع حجم خط الوصف الأصلي المريح للعين مع flex-grow للضغط لأسفل */}
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5 flex-grow">
                    {t(card.descKey)}
                  </p>

                  {/* 🌟 زرار التفاصيل الموحد والمقاوم لتداخل الاتجاهات 🌟 */}
                  <div
                    className="w-full text-xs md:text-sm font-bold text-[#19355A] group-hover:text-[#B38E19] transition-colors duration-300 mt-auto flex items-center justify-end gap-1"
                  >
                    <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
                    <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                      →
                    </span>
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

export default ExternalConferenceCategoryPage;