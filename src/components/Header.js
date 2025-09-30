



// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Bell, Mail, Search, ChevronDown } from "lucide-react";
// import "../styles/Header.css";

// // Import flag images
// import egyptFlag from "../images/egyptFlag.png";
// import ukFlag from "../images/americaFlag.png";

// export default function Header() {
//   const { t, i18n } = useTranslation("HeaderAndSideBar");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     const isArabic = i18n.language === "ar";
//     document.documentElement.dir = isArabic ? "rtl" : "ltr";

 
//     if (isArabic) {
//       document.documentElement.classList.add("arabic-font");
//       document.documentElement.classList.remove("english-font");
//     } else {
//       document.documentElement.classList.add("english-font");
//       document.documentElement.classList.remove("arabic-font");
//     }
//   }, [i18n.language]);

//   const handleLanguageChange = (lang) => {
//     i18n.changeLanguage(lang);
//     setDropdownOpen(false); // close dropdown after choosing
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching for:", searchQuery);
//   };

//   return (
//     <header className={`header ${i18n.language === "ar" ? "ar" : "en"}`}>
//       {/* Logout + Language Dropdown */}
//       <div className="header-left">
//         <button className="logout-btn">{t("logout")}</button>

//         <div className="lang-dropdown">
//           <button
//             className="lang-btn"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             {i18n.language === "ar" ? (
//               <>
//                 <img src={egyptFlag} alt="Arabic" className="flag-icon" /> ع
//               </>
//             ) : (
//               <>
//                 <img src={ukFlag} alt="English" className="flag-icon" /> En
//               </>
//             )}
//             <ChevronDown size={16} className="chevron-icon" />
//           </button>

//           {dropdownOpen && (
//             <div className="dropdown-menu">
//               <button
//                 onClick={() => handleLanguageChange("ar")}
//                 className="dropdown-item"
//               >
//                 <img src={egyptFlag} alt="Arabic" className="flag-icon" /> ع
//               </button>
//               <button
//                 onClick={() => handleLanguageChange("en")}
//                 className="dropdown-item"
//               >
//                 <img src={ukFlag} alt="English" className="flag-icon" /> En
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Search Bar */}
//       <form
//         className={`header-center ${i18n.language === "ar" ? "rtl" : "ltr"}`}
//         onSubmit={handleSearch}
//       >
//         <input
//           type="search"
//           placeholder={t("searchPlaceholder") || "Search..."}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button type="submit" className="search-btn">
//           <Search className="search-icon" size={18} />
//         </button>
//       </form>

//       {/* Icons */}
//       <div className="header-right">
//         <Bell className="header-icon" size={20} />
//         <Mail className="header-icon" size={20} />
//       </div>
//     </header>
//   );
// }

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Mail, Search, ChevronDown } from "lucide-react";
import "../styles/Header.css";

// Import flag images
import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";

export default function Header() {
  const { t, i18n } = useTranslation("HeaderAndSideBar");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className={`header ${i18n.language === "ar" ? "ar" : "en"}`}>
      {/* Icons (left side) */}
      <div className="header-right">
        <Bell className="header-icon" size={20} />
        <Mail className="header-icon" size={20} />
      </div>

      {/* Search Bar (center, flips in RTL) */}
      <form
        className={`header-center ${i18n.language === "ar" ? "rtl" : "ltr"}`}
        onSubmit={handleSearch}
      >
        {i18n.language === "ar" ? (
          <>
            
            <input
              type="search"
              placeholder={t("searchPlaceholder") || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}

            />
            <button type="submit" className="search-btn">
              <Search className="search-icon" size={18} />
            </button>
          </>
        ) : (
          <>
           <button type="submit" className="search-btn">
              <Search className="search-icon" size={18} />
            </button>
            <input
              type="search"
              placeholder={t("searchPlaceholder") || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
           
          </>
        )}
      </form>

      {/* Logout + Language Selector (right side) */}
      <div className="header-left">
        {/* Logout first */}
        

        {/* Language Dropdown */}
        <div className="lang-dropdown">
          <button
            className="lang-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {i18n.language === "ar" ? (
              <>
                <img src={egyptFlag} alt="Arabic" className="flag-icon" /> ع
              </>
            ) : (
              <>
                <img src={ukFlag} alt="English" className="flag-icon" /> En
              </>
            )}
            <ChevronDown size={16} className="chevron-icon" />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                onClick={() => handleLanguageChange("ar")}
                className="dropdown-item"
              >
                <img src={egyptFlag} alt="Arabic" className="flag-icon" /> ع
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className="dropdown-item"
              >
                <img src={ukFlag} alt="English" className="flag-icon" /> En
              </button>
            </div>
          )}
        </div>
        <button className="logout-btn">{t("logout")}</button>
      </div>
    </header>
  );
}