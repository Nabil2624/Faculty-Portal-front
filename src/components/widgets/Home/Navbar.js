import React, { useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoImg from "../../../assets/Capital.png";

const Navbar = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  
  // الحالة الافتراضية للناف بار (شفاف)
  const [isBlue, setIsBlue] = useState(false);

  // دالة واحدة بتعمل الحاجتين: تغير اللون وتروح للسكشن
  const handleNavClick = (id) => {
    // 1. التحكم في اللون: كحلي لو اختار About، وشفاف لأي حاجة تانية
    if (id === "about") {
      setIsBlue(true);
    } else {
      setIsBlue(false); // بيرجع شفاف لما تدوس على Home أو Contact
    }

    // 2. الانتقال للسكشن
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-[5%] py-4 z-50 transition-all duration-300 ease-in-out ${
        isBlue ? "bg-[#19355A] shadow-md" : "bg-transparent"
      }`}
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      {/* اللوجو بيرجع للهوم ويخلي الناف بار شفاف */}
      <div 
        className="cursor-pointer hover:scale-105 transition-transform duration-300" 
        onClick={() => handleNavClick("home")}
      >
        <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
      </div>

      {/* الروابط والأزرار */}
      <div className="hidden md:flex items-center gap-8 text-white font-medium">
        
        <button onClick={() => handleNavClick("home")} className="relative group transition-colors hover:text-gray-200">
          {isAr ? "الرئيسية" : "Home"}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </button>

        <button onClick={() => handleNavClick("about")} className="relative group transition-colors hover:text-gray-200">
          {isAr ? "من نحن" : "About"}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </button>

        <button onClick={() => handleNavClick("contact")} className="relative group transition-colors hover:text-gray-200">
          {isAr ? "تواصل معنا" : "Contact"}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </button>
        
        {/* زرار تغيير اللغة */}
        <button
          onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
          className="flex items-center gap-2 px-5 py-2 border border-white/70 rounded-full hover:bg-white hover:text-[#19355A] transition-all duration-300 font-semibold"
        >
          <Globe size={18} />
          <span>{isAr ? "English" : "العربية"}</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;