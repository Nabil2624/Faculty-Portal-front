import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import helwanImage from "../images/helwan-university.jpeg";
import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";

export default function RegisterPage() {
  const { t, i18n } = useTranslation("Registration");
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setOpenDropdown(false);
  };

  React.useEffect(() => {
    const isArabic = i18n.language === "ar";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    if (isArabic) {
      document.documentElement.classList.add("arabic-font");
    } else {
      document.documentElement.classList.remove("arabic-font");
    }
  }, [i18n.language]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isArabic = i18n.language === "ar";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden p-5">
      {/* Left Side - Form */}
      <div className="flex flex-col flex-1 px-8 py-6 relative">
        {/* Language Selector */}
        <div className="flex mb-6">
          <div
            ref={dropdownRef}
            className={`relative inline-block ${isArabic ? "mr-auto" : "ml-auto"}`}
          >
            <button
              onClick={() => setOpenDropdown((s) => !s)}
              className="flex items-center gap-2 px-3 py-1 border rounded-sm bg-white shadow-sm cursor-pointer"
            >
              <img
                src={isArabic ? egyptFlag : ukFlag}
                alt="flag"
                className="w-5 h-5 object-cover"
              />
              <ChevronDown size={16} />
            </button>

            {openDropdown && (
              <div
                className={`absolute top-full mt-1 w-36 bg-white shadow-md rounded-sm border z-50 ${
                  isArabic ? "left-0" : "right-0"
                }`}
              >
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 text-sm"
                >
                  <img src={egyptFlag} alt="Arabic" className="w-5 h-5" />
                  <span className="whitespace-nowrap">العربية</span>
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 text-sm"
                >
                  <img src={ukFlag} alt="English" className="w-5 h-5" />
                  <span className="whitespace-nowrap">English</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className={`max-w-md w-full mx-auto ${isArabic ? "text-right" : "text-left"}`}>
          <h1 className="text-4xl font-bold mt-[50px] mb-3 text-gray-900">
            {t("signUp")}
          </h1>
          <p className="text-gray-600 mb-12">{t("subtitle")}</p>

          <input
            type="text"
            placeholder={t("nationalID")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5 text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button className="w-full bg-[#003366] text-white py-2 rounded-md font-semibold hover:bg-[#002244] transition">
            {t("signUp")}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500">{t("or")}</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Login link */}
          <p className="text-sm text-center">
            {t("loginText")}{" "}
            <a href="#" className="text-yellow-600 font-semibold hover:underline">
              {t("login")}
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div
        className="hidden md:flex w-1/2 relative rounded-[35px] mr-5 justify-center items-center text-white text-center bg-cover bg-right"
        style={{ backgroundImage: `url(${helwanImage})` }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-[35px] z-0"></div>
        <div className="absolute inset-0 bg-black/45 rounded-[35px] z-0"></div>

        <div className="relative z-10 flex flex-col items-center w-full text-center px-6">
          <h3
            className={`font-bold ${
              isArabic
                ? "text-[2.5rem] text-right mr-5"
                : "text-[3rem] text-left ml-5"
            }`}
          >
            {t("welcome")}
          </h3>
          <p className="text-lg mt-3 text-gray-200 max-w-[80%]">{t("sub")}</p>
        </div>
      </div>
    </div>
  );
}
