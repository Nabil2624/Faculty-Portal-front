import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Mail, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👈 Add this

import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";

export default function Header({ isExpanded }) {
  const { t, i18n } = useTranslation("headerandsidebar");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // 👈 navigation hook

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    if (isArabic) {
      document.documentElement.classList.add("arabic-font");
      document.documentElement.classList.remove("english-font");
    } else {
      document.documentElement.classList.add("english-font");
      document.documentElement.classList.remove("arabic-font");
    }
  }, [i18n.language]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ clear token
    navigate("/login", { replace: true }); // ✅ redirect to login
  };

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isArabic = i18n.language === "ar";

  return (
    <header
      className={`flex items-center justify-between w-[calc(100%-0.5rem)] 
      bg-[#19355a] px-4 py-2 text-white 
      ${isArabic ? "mr-1" : "ml-1"} mb-4 rounded-lg`}
      style={{
        transition: "margin 0.3s ease-in-out",
      }}
    >
      {/* Right side (icons) */}
      <div className="flex items-center gap-3">
        <Bell className="cursor-pointer" size={18} />
        <Mail className="cursor-pointer" size={18} />
      </div>

      {/* Center (search bar) */}
      <div
        className={`flex items-center bg-white rounded-md px-2 py-0.5 max-w-xs w-full
        ${isArabic ? "flex-row-reverse" : "flex-row"}`}
      >
        {isArabic ? (
          <>
            <input
              type="search"
              placeholder={t("searchPlaceholder") || "بحث..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-center outline-none bg-transparent placeholder:text-center text-black"
            />
            <button type="button" className="p-1">
              <Search size={16} className="text-[#19355a]" />
            </button>
          </>
        ) : (
          <>
            <button type="button" className="p-1">
              <Search size={16} className="text-[#19355a]" />
            </button>
            <input
              type="search"
              placeholder={t("searchPlaceholder") || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-center outline-none bg-transparent placeholder:text-center text-black"
            />
          </>
        )}
      </div>

      {/* Left side (logout + language) */}
      <div className="flex items-center gap-3">
        {/* Language dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded-md border border-gray-300 text-sm"
          >
            {isArabic ? (
              <>
                <img src={egyptFlag} alt="Arabic" className="w-5 h-4" />{" "}
                <span className="text-black">ع</span>
              </>
            ) : (
              <>
                <img src={ukFlag} alt="English" className="w-5 h-4" />{" "}
                <span className="text-black">En</span>
              </>
            )}
            <ChevronDown size={14} className="text-gray-600" />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute mt-1 bg-white border border-gray-300 rounded-md shadow-md z-50 text-sm ${
                isArabic ? "left-0" : "right-0"
              }`}
            >
              <button
                onClick={() => handleLanguageChange("ar")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-black"
              >
                <img src={egyptFlag} alt="Arabic" className="w-5 h-4" /> العربية
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-black"
              >
                <img src={ukFlag} alt="English" className="w-5 h-4" /> English
              </button>
            </div>
          )}
        </div>

        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          className="font-semibold text-sm hover:underline"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
