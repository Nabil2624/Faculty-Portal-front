import React from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const { t, i18n } = useTranslation("Login");
  const [showPassword, setShowPassword] = React.useState(false);

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
            <h1 className="head">{t("loginTitle")}</h1>
            <p className="subtitle">{t("loginSubtitle")}</p>
          </div>

          {/* Username input */}
          <input
            type="text"
            placeholder={t("username")}
            className="input-field"
          />

          {/* Password input with eye icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              className="input-field"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Login button */}
          <button className="register-button">{t("loginButton")}</button>

   
          <div
            className={`forgot-password-container ${
              i18n.language === "ar" ? "rtl" : "ltr"
            }`}
          >
            <a href="/forgot-password" className="forgot-password-link">
              {t("forgotPassword")}
            </a>
          </div>

          <div className="divider">
            <div className="line"></div>
            <span>{t("or")}</span>
            <div className="line"></div>
          </div>

          <p className="login-text">
            {t("noAccount")}{" "}
            <a href="#" className="login-link">
              {t("signUp")}
            </a>
          </p>
        </div>
      </div>

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
