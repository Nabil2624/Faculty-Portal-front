import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/RegistrationPage.css";

export default function RegisterPage() {
  const { t, i18n } = useTranslation("Registration");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  React.useEffect(() => {
    const isArabic = i18n.language === "ar";

    // Set direction (RTL for Arabic, LTR otherwise)
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    // Toggle Cairo font when Arabic
    if (isArabic) {
      document.documentElement.classList.add("arabic-font");
    } else {
      document.documentElement.classList.remove("arabic-font");
    }
  }, [i18n.language]);

  return (
    <div className="register-container">
      <div className="other-side">
        <div className="language-select">
          <select onChange={handleLanguageChange} value={i18n.language}>
            <option value="ar">🇪🇬 ع</option>
            <option value="en">🇬🇧 En</option>
          </select>
        </div>

        <div className="form-box">
          <div className="form-content">
            <h1 className="head">{t("signUp")}</h1>
            <p className="subtitle">{t("subtitle")}</p>
          </div>

          <input
            type="text"
            placeholder={t("nationalID")}
            className="input-field"
          />
          <button className="register-button">{t("signUp")}</button>

          <div className="divider">
            <div className="line"></div>
            <span>{t("or")}</span>
            <div className="line"></div>
          </div>

          <p className="login-text">
            {t("loginText")}{" "}
            <a href="#" className="login-link">
              {t("login")}
            </a>
          </p>
        </div>
      </div>

      {/* <div className="register-image">
        <h3>{t("welcome")}</h3>
      </div> */}

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
  );
}
