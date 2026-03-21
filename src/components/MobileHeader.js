import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Search,
  Menu,
  LogOut,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import FloatingSearch from "./FloatingSearch";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

export default function MobileHeader({ onBurgerClick }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  // دالة تبديل اللغة (Toggle)
  const handleLanguageToggle = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      alert(t("logoutError") || "Logout failed");
    }
  };

  return (
    <header className="flex items-center justify-between w-full h-16 bg-[#19355a]/95 backdrop-blur-md text-white fixed top-0 z-[50] px-3 border-b border-white/10 shadow-lg">
      
      {/* Left side: Burger & Main Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBurgerClick}
          className="p-2 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all duration-200"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-0.5 bg-white/5 rounded-2xl p-1">
          <button className="p-2 hover:text-[#B38e19] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#b38e19] rounded-full border border-[#19355a]"></span>
          </button>
          <button className="p-2 hover:text-[#B38e19] transition-colors">
            <Mail size={18} />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:text-[#B38e19] transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Right side: Language Toggle & Logout */}
      <div className="flex items-center gap-2">
        
        {/* المقلد: Glassmorphism Language Toggle (Mobile Version) */}
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 px-3 h-9 bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300 active:scale-95 shadow-lg"
        >
          <Globe size={14} className="text-[#b38e19]" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            {isArabic ? "EN" : "عربي"}
          </span>
        </button>

        {/* Professional Logout Button (نسخة مصغرة للموبايل) */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-9 h-9 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 active:scale-95"
          title={t("logout")}
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Floating Search Component */}
      <FloatingSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}