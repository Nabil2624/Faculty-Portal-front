import React from "react";
import {
  Mail,
  LogOut,
  Globe,
  GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import NotificationsDropdown from "./ui/NotificationsDropdown";
import { useNotifications } from "../hooks/useNotifications";

// استيراد كمبونانت البحث الجديد
import SearchComponent from "./widgets/UserSearch/SearchComponent";

export default function Header({ isExpanded }) {
  const { t, i18n } = useTranslation("HeaderAndSideBar");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const { notifications, markAllAsRead, loadMoreNotifications } = useNotifications();

  const handleLanguageChange = () =>
    i18n.changeLanguage(isArabic ? "en" : "ar");

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userRoles");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(t("logoutError"));
    }
  };

  return (
    <header
      className={`flex items-center gap-[clamp(10px,1.5vw,30px)] w-[calc(100%-0.5rem)] h-[clamp(48px,3.2vw,130px)] px-[clamp(16px,2vw,40px)] bg-[#19355a] text-white rounded-[clamp(1px,0.5vw,20px)] ${
        isArabic ? "mr-1" : "ml-1"
      } relative z-[100] top-0 border-b border-white/10 shadow-lg`}
    >
      {/* 1. Icons Section */}
      <div className="flex items-center gap-1 shrink-0">
        <NotificationsDropdown
          isArabic={isArabic}
          notifications={notifications}
          onMarkAllRead={markAllAsRead}
          loadMore={loadMoreNotifications}
        />

        <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all group">
          <Mail
            size={20}
            className="text-white/40 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      {/* 2. Integrated Search Component */}
      <SearchComponent isArabic={isArabic} />

      {/* 3. Controls Section */}
      <div className="flex items-center gap-3 sm:gap-4 ms-auto shrink-0">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-2 px-4 h-[clamp(32px,2.2vw,42px)] bg-white/5 border border-white/10 hover:border-[#b38e19] rounded-xl text-white transition-all duration-300 group shadow-md active:scale-95"
          title={isArabic ? "الأنشطة الأكاديمية" : "Academic Activities"}
        >
          <GraduationCap
            size={18}
            className="text-white/60 group-hover:text-[#b38e19] group-hover:rotate-6 transition-all duration-300"
          />
          <span className="text-[11px] font-bold tracking-wide hidden sm:inline">
            {isArabic ? "الأنشطة الأكاديمية" : "Academic Activities"}
          </span>
        </button>

        <button
          onClick={handleLanguageChange}
          className="flex items-center gap-2 px-4 h-[clamp(32px,2.2vw,42px)] bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300 group shadow-lg"
        >
          <Globe size={16} className="text-[#b38e19]" />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {isArabic ? "English" : "عربي"}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 h-[clamp(32px,2.2vw,42px)] bg-white/5 border border-white/20 rounded-xl hover:bg-[#b38e19]/10 hover:border-[#b38e19] hover:text-[#b38e19] transition-all group shadow-sm active:scale-95"
        >
          <span className="text-[12px] font-black uppercase tracking-[0.15em]">
            {t("logout")}
          </span>
          <div className="w-[1px] h-4 bg-white/10 group-hover:bg-[#b38e19]/30 transition-colors"></div>
          <LogOut
            size={18}
            className={`transition-transform ${
              isArabic ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"
            }`}
          />
        </button>
      </div>
    </header>
  );
}