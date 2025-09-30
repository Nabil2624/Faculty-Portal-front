import React from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import "../styles/ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation("ForgotPassword");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
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

  return (
    <div className="forgot-password-page">
      <div className="register-container">
        <div className="other-side">
          {/* Language switcher */}
          <div className="language-select">
            <select onChange={handleLanguageChange} value={i18n.language}>
              <option value="ar">🇪🇬 ع</option>
              <option value="en">🇬🇧 En</option>
            </select>
          </div>

          <div className="form-box">
            {/* Page Title */}
            <div className="form-content">
              <h1 className="head">{t("title")}</h1>
            </div>

            <div className="subtitle-with-icon">
              <Info size={18} className="info-icon" />
              <p className="fp-subtitle">{t("subtitle")}</p>
            </div>

            {/* Email or National ID input */}
            <input
              type="text"
              placeholder={t("identifier")}
              className="input-field"
            />

            {/* Reset password button */}
            <button className="register-button">{t("resetButton")}</button>

         
          </div>
        </div>

        {/* Left side image & welcome text */}
        <div className="register-image">
          <div className="image-text-container">
            <h3
              className={`image-text ${
                i18n.language === "ar" ? "arabic" : "english"
              }`}
            >
              {t("welcome")}
            </h3>
            <p className="sub-text">{t("sub")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}