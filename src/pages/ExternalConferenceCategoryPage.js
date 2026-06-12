import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import { GraduationCap } from "lucide-react";
import attendExternalImg from "../assets/attendConference.avif";
import historyImg from "../assets/History.png";

const ExternalConferenceCategoryPage = () => {
  const { t, i18n } = useTranslation("CategoriesPage");
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  // نفس إعدادات الـ Fluid Design التي اعتمدناها
  const cardStyles = {
    "--card-width": "clamp(320px, 25vw, 480px)",
    "--card-padding": "clamp(1.1rem, 1.3vw, 2.3rem)",
    "--title-size": "clamp(1.25rem, 1.5vw, 1.75rem)",
    "--desc-size": "clamp(0.95rem, 1vw, 1.3rem)",
    "--btn-size": "clamp(0.85rem, 0.9vw, 1rem)",

  };

  const cardsData = [
    {
      id: "attend-qf04",
      titleKey: "attendQf04.title",
      descKey: "attendQf04.description",
      imageUrl: attendExternalImg,
      link: "/conference-form",
      state: { conferenceType: "external" },
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
    navigate(card.link, { state: card.state });
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="px-4" dir={isRtl ? "rtl" : "ltr"}>
        <PageHeaderAction title={t("externalTitle")} icon={GraduationCap} />

        {/* الحاوية المركزية */}
        <div className="flex items-center justify-center min-h-[calc(100vh-350px)] px-6">
          <div 
            className="grid w-full max-w-6xl justify-items-center" 
            style={{ 
              gridTemplateColumns: "repeat(2, 1fr)" 
            }}
          >
            {cardsData.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                style={{ ...cardStyles, width: "var(--card-width)" }}
                className="group relative flex flex-col bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03]"
              >
                {/* الصورة */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={card.imageUrl}
                    alt={t(card.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://placehold.co/600x450/19355a/ffffff?text=Academic"; }}
                  />
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

export default ExternalConferenceCategoryPage;