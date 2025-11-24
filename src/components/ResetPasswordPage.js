import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../images/helwan-university.jpeg";
import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation("resetpassword");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || ""; // ✅ get email from OTP page

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setOpenDropdown(false);
  };

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.classList.toggle("arabic-font", isArabic);
  }, [i18n.language]);

  const isArabic = i18n.language === "ar";

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(t("errors.missingEmail"));
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(t("passwordRequirements"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      // ✅ send email along with new password
      await axiosInstance.post("/Authentication/ResetPassword", {
        Email:email,
        NewPassword: newPassword,
        NewPasswordConifrmed: confirmPassword,
      });

      setSuccess(t("resetSuccess"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError(t("invalidToken"));
      } else {
        setError(t("unexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden p-5 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      {/* Left Side - Form */}
      <div className="flex flex-col flex-1 px-8 py-6 relative">
        {/* Language Selector */}
        <div className="flex mb-6">
          <div
            ref={dropdownRef}
            className={`relative inline-block ${
              isArabic ? "mr-auto" : "ml-auto"
            }`}
          >
            <button
              onClick={() => setOpenDropdown((s) => !s)}
              aria-haspopup="true"
              aria-expanded={openDropdown}
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
                  <span>العربية</span>
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 text-sm"
                >
                  <img src={ukFlag} alt="English" className="w-5 h-5" />
                  <span>English</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleReset}
          className={`max-w-md w-full mx-auto ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <h1 className="text-4xl font-bold mt-[50px] mb-3 text-gray-900">
            {t("resetTitle")}
          </h1>
          <p className="text-gray-600 mb-12">{t("resetSubtitle")}</p>

          {error && (
            <div className="mb-4 text-red-600 text-sm border border-red-400 p-2 rounded-md bg-red-50">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm border border-green-400 p-2 rounded-md bg-green-50">
              {success}
            </div>
          )}

          {/* New Password */}
          <div className="relative w-full mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              dir={isArabic ? "rtl" : "ltr"}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                isArabic ? "pl-10" : "pr-10"
              } focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              className={`absolute top-1/2 -translate-y-1/2 text-yellow-600 ${
                isArabic ? "left-2" : "right-2"
              }`}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative w-full mb-5">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              dir={isArabic ? "rtl" : "ltr"}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                isArabic ? "pl-10" : "pr-10"
              } focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={loading}
              className={`absolute top-1/2 -translate-y-1/2 text-yellow-600 ${
                isArabic ? "left-2" : "right-2"
              }`}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#003366] text-white py-2 rounded-md font-semibold hover:bg-[#002244] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {t("resetButton")}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-yellow-600 hover:underline text-sm"
              disabled={loading}
            >
              {t("backToLogin")}
            </button>
          </div>
        </form>
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
                ? "text-[2.6rem] text-right mr-5"
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
