import React from "react";
import { Bell, Mail, Search, LogOut, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

export default function Header({ isExpanded }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const isSupportAdmin = userRoles.includes("SupportAdmin");

  const handleLanguageChange = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

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
      className={`flex items-center gap-[clamp(10px,1.5vw,30px)]
        w-[calc(100%-0.5rem)]
        h-[clamp(48px,3.2vw,130px)]
        px-[clamp(16px,2vw,40px)]
        bg-[#19355a] text-white rounded-[clamp(1px,0.5vw,20px)]
        ${isArabic ? "mr-1" : "ml-1"}
        relative z-50 top-0 border-b border-white/10 shadow-lg
      `}
    >
      {/* 1. Icons Section (Notification & Mail) */}
      <div className="flex items-center gap-1 shrink-0">
        <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative group">
          <Bell
            size={20}
            className="text-white/40 group-hover:text-white transition-colors"
          />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#b38e19] rounded-full border border-[#19355a]"></span>
        </button>
        <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all group">
          <Mail
            size={20}
            className="text-white/40 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      {/* 2. Integrated Search Bar */}
      <div className="relative flex-1 max-w-[400px] group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#b38e19] transition-colors" />
        <input
          type="text"
          placeholder={isArabic ? "بحث في النظام..." : "Search system..."}
          className="w-full h-[clamp(35px,2.5vw,45px)] bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:bg-white/10 focus:border-[#b38e19] outline-none transition-all placeholder:text-white/60"
        />
      </div>

      {/* 3. Controls Section (Language & Logout) */}
      <div className="flex items-center gap-5 ms-auto shrink-0">
        {/* المقلد من صفحة الـ Login: Glassmorphism Language Toggle */}
        <button
          onClick={handleLanguageChange}
          className="flex items-center gap-2 px-4 h-[clamp(32px,2.2vw,42px)] bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300 group shadow-lg"
        >
          <Globe size={16} className="text-[#b38e19]" />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {isArabic ? "English" : "عربي"}
          </span>
        </button>

        {/* Professional Logout Button (نسخة واضحة ومحددة) */}
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
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </header>
  );
}
