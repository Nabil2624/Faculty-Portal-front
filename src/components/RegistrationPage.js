import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import helwanImage from "../images/helwan-university.jpeg";
import egyptFlag from "../images/egyptFlag.png";
import ukFlag from "../images/americaFlag.png";
import LoadingSpinner from "../components/LoadingSpinner";
import axiosInstance from "../utils/axiosInstance";

export default function RegisterPage() {
  const { t, i18n } = useTranslation("register");
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [nationalID, setNationalID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setOpenDropdown(false);
  };

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    if (isArabic) {
      document.documentElement.classList.add("arabic-font");
    } else {
      document.documentElement.classList.remove("arabic-font");
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpenDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const isArabic = i18n.language === "ar";

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedID = nationalID.trim(); // trim spaces

    // 🔹 Validation rules
    if (!/^[0-9]+$/.test(trimmedID)) {
      setError(t("onlyNumbersError") || "National ID must contain only numbers.");
      return;
    }

    if (trimmedID.length !== 14) {
      setError(t("invalidLengthError") || "National ID must be exactly 14 digits.");
      return;
    }

    try {
      setLoading(true);

      const registerRes = await axiosInstance.post(
        "/Auth/Register",
        { ssn: trimmedID }, // use trimmed value
        { skipGlobalErrorHandler: true }
      );

      if (registerRes.data?.status) {
        await axiosInstance.post(
          "/Auth/Send-Credintials-Email",
          {},
          { skipGlobalErrorHandler: true }
        );

        navigate("/login");
      } else {
        setError(
          registerRes.data?.message ||
            t("serverError") ||
            "Something went wrong."
        );
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            t("invalidNationalID") ||
            "Invalid national ID."
        );
      } else if (err.response?.status === 409) {
        setError(t("alreadyRegistered") || "User already registered.");
      } else if (err.response?.status >= 500) {
        window.location.href = "/error/500";
      } else {
        setError(
          t("unexpectedError") ||
            "An unexpected error occurred. Please try again."
        );
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

      <div className="flex flex-col flex-1 px-8 py-6 relative">
        {/* 🌍 Language Selector */}
        <div className="flex mb-6">
          <div
            ref={dropdownRef}
            className={`relative inline-block ${isArabic ? "mr-auto" : "ml-auto"}`}
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

        {/* 🧾 Form */}
        <form
          onSubmit={handleRegister}
          className={`max-w-md w-full mx-auto ${isArabic ? "text-right" : "text-left"}`}
        >
          <h1 className="text-4xl font-bold mt-[50px] mb-3 text-gray-900">
            {t("signUp")}
          </h1>
          <p className="text-gray-600 mb-10">{t("subtitle")}</p>

          {error && (
            <div className="mb-3 text-red-600 text-sm border border-red-400 p-2 rounded-md bg-red-50">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder={t("nationalID")}
            value={nationalID}
            onChange={(e) => setNationalID(e.target.value)} // keep typing as is
            disabled={loading}
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-base focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#003366] text-white py-2 rounded-md font-semibold hover:bg-[#002244] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {t("signUp")}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500">{t("or")}</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <p className="text-sm text-center">
            {t("loginText")}{" "}
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="text-yellow-600 font-semibold hover:underline"
              disabled={loading}
            >
              {t("login")}
            </button>
          </p>
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
