import React from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import Mo2tamar from "../assets/mo2tamar.jpg";
import Mo2tamar2 from "../assets/Mo2tamar2.jpg";
import MissionImg from "../assets/MissionImage.jfif";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeaderAction from "../components/ui/PageHeaderAction";

const CategoriesPage = () => {
  const { t, i18n } = useTranslation("CategoriesPage");
  const navigate = useNavigate();

  const isRtl = i18n.language === "ar";

  const cardsData = [
    {
      id: "external",
      titleKey: "categories.external_conference.title",
      descKey: "categories.external_conference.description",
      imageUrl: Mo2tamar2,
    },
    {
      id: "internal",
      titleKey: "categories.internal_conference.title",
      descKey: "categories.internal_conference.description",
      imageUrl: Mo2tamar,
    },
    {
      id: "scientific",
      titleKey: "categories.scientific_mission.title",
      descKey: "categories.scientific_mission.description",
      imageUrl: MissionImg,
    },
  ];

  const handleCardClick = (id) => {
    if (id === "internal") {
      navigate("/internal-categories");
    } else if (id === "external") {
      navigate("/external-categories");
    } else if (id === "scientific") {
      navigate("/scientific-missions-categories");
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className="min-h-[90vh] px-4 sm:px-1 lg:px-2"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <PageHeaderAction
          title={t("categories.title")}
          icon={GraduationCap}
          
        />
        <div className="max-w-7xl mx-auto mt-8">
          {/* شبكة الكروت بأبعادك الأصلية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
            {cardsData.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="group relative w-full max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.03]"
              >
                {/* صورة الكارت بالأبعاد الأصلية */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
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

                {/* محتوى الكارت مع الـ p-8 الأصلية بتاعتك */}
                <div className="p-8 relative">
                  {/* الخط الديكوري الذهبي ينمو من الجانب الموازي للغة */}
                  <div
                    className={`absolute top-0 h-[3.5px] bg-[#B38E19] transition-all duration-500 ease-in-out group-hover:w-full w-14 ${isRtl ? "right-8" : "left-8"}`}
                  ></div>

                  {/* مساحة pt-5 لتنزيل العنوان عن الخط العلوي */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#19355A] mb-4 pt-5 group-hover:text-[#B38E19] transition-colors duration-300">
                    {t(card.titleKey)}
                  </h3>

                  {/* مساحة mb-6 والـ min-h-[72px] الأصلية لحجم الكارت الثابت */}
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed min-h-[72px] mb-6">
                    {t(card.descKey)}
                  </p>

                  {/* 🌟 تعديل الزرار فقط دون المساس بهيكل الكارت 🌟 */}
                  <div
                    className="w-full text-xs md:text-sm font-bold text-[#19355A] group-hover:text-[#B38E19] transition-colors duration-300 flex items-center justify-end gap-1"
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

export default CategoriesPage;