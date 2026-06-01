import React, { useState, useRef, useEffect } from "react";
import { Bell, Mail, Search, Menu, LogOut, Globe, Clock, GraduationCap } from "lucide-react"; // تم إضافة GraduationCap هنا
import { useTranslation } from "react-i18next";
import FloatingSearch from "./FloatingSearch";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

export default function MobileHeader({ onBurgerClick }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  // داتا الإشعارات
  const [notifications] = useState([
    { id: 1, title: "محاضرة جديدة", body: "تم رفع فيديو محاضرة التحليل الإنشائي", time: "منذ 5 دقائق", unread: true },
    { id: 2, title: "تعديل جدول", body: "تغيير موعد معمل الفيزياء للفرقة الثانية", time: "منذ ساعتين", unread: true },
    { id: 3, title: "تنبيه إداري", body: "يرجى سداد المصروفات المتبقية قبل نهاية الأسبوع", time: "منذ يوم", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageToggle = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
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
    <header
      className="flex items-center justify-between w-full h-16 bg-[#19355a]/95 backdrop-blur-md text-white fixed top-0 z-[50] px-3 border-b border-white/10 shadow-lg"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Left side: Burger & Grouped Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBurgerClick}
          className="p-2 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all duration-200"
        >
          <Menu size={22} />
        </button>

        {/* المجموعه اللي فيها الأيقونات - حافظنا على الـ Container الأصلي وضفنا الزرار جواه */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-2xl p-1 border border-white/5">
          
          {/* Notification Wrapper */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 transition-colors relative rounded-lg ${
                notificationsOpen ? "bg-white/10 text-[#B38E19]" : "hover:text-[#B38E19]"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className={`absolute top-2.5 ${isArabic ? "left-2.5" : "right-2.5"} flex h-2 w-2`}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B38E19] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B38E19]"></span>
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {notificationsOpen && (
              <div
                className={`absolute top-[120%] ${isArabic ? "-right-2" : "-left-2"} w-72 bg-[#19355a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[60] animate-in fade-in zoom-in duration-200`}
              >
                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <span className="text-xs font-bold">{isArabic ? "الإشعارات" : "Notifications"}</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#B38E19] px-2 py-0.5 rounded-full text-white font-bold">
                      {unreadCount} {isArabic ? "جديدة" : "New"}
                    </span>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto scrollbar-hide">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                        n.unread ? "bg-[#B38E19]/5" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-[11px] font-bold ${n.unread ? "text-[#B38E19]" : "text-gray-200"}`}>
                          {n.title}
                        </h4>
                        <span className="text-[9px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {n.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{n.body}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 text-[10px] text-center bg-white/5 hover:bg-[#B38E19] hover:text-white text-[#B38E19] font-bold transition-all border-t border-white/5">
                  {isArabic ? "عرض الكل" : "View All"}
                </button>
              </div>
            )}
          </div>

          <button className="p-2 hover:text-[#B38E19] transition-colors">
            <Mail size={18} />
          </button>

          
          <button
            onClick={() => navigate("/categories")}
            className="p-2 hover:text-[#B38E19] active:bg-white/10 rounded-lg transition-colors group"
            title={isArabic ? "الأنشطة الأكاديمية" : "Academic Activities"}
          >
            <GraduationCap size={18} className="group-hover:rotate-6 transition-transform duration-200" />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:text-[#B38E19] transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Right side: Language & Logout */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 px-3 h-9 bg-black/40 border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all"
        >
          <Globe size={14} className="text-[#b38e19]" />
          <span className="text-[10px] font-black uppercase">
            {isArabic ? "EN" : "عربي"}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-9 h-9 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg"
        >
          <LogOut size={18} />
        </button>
      </div>

      <FloatingSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}