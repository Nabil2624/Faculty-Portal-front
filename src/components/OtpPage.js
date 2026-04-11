import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Globe,
  LockKeyhole,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../assets/helwan-university.jpeg";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OtpPage() {
  const { t, i18n } = useTranslation("otp");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const email = location.state?.email || "";
  const isArabic = i18n.language === "ar";

  // 🔹 Handle Paste Functionality
  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(data)) return; // Only process if digits

    const pasteData = data.slice(0, 6).split(""); // Take first 6 digits
    const newOtp = [...otp];

    pasteData.forEach((char, index) => {
      newOtp[index] = char;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    setOtp(newOtp);

    // Focus the next available input or the last one
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputRefs.current[nextIndex].focus();
    e.preventDefault();
  };

  // 🔹 OTP Input Logic
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError(t("errors.emailMissing"));
      return;
    }

    if (otp.some((digit) => digit === "")) {
      setError(t("errors.fillAllDigits"));
      return;
    }

    const otpValue = otp.join("");
    setLoading(true);

    try {
      await axiosInstance.post(
        "/Authentication/VerifyOTP",
        { otp: otpValue, email },
        { skipGlobalErrorHandler: true },
      );
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) setError(t("errors.invalidOtp"));
      else if (status === 429) setError(t("errors.tooManyRequests"));
      else if (status === 500) navigate("/error/500");
      else setError(t("errors.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050b14]">
      {/* Background with Filters */}
      <div className="absolute inset-0 z-0">
        <img
          src={helwanImage}
          alt="University Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050b14] via-[#19355a]/40 to-[#050b14]/80" />
      </div>

      {/* Language Toggle */}
      <div className={`fixed top-6 ${isArabic ? "left-6" : "right-6"} z-[100]`}>
        <button
          onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300 group shadow-2xl"
        >
          <Globe size={16} className="text-[#b38e19]" />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {isArabic ? "English" : "عربي"}
          </span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between px-6 gap-10">
        <div
          className={`w-full lg:w-1/2 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#b38e19] rounded-full" />
            <span className="text-[#b38e19] font-black uppercase tracking-[5px] text-[clamp(0.6rem,1.2vw,1rem)]">
              {isArabic ? "تحقق الأمان" : "Security Verification"}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-[900] leading-none mb-6 tracking-tighter text-white uppercase">
            {isArabic ? "رمز التحقق" : "OTP VERIFICATION"}
          </h1>
          <p className="text-[clamp(0.9rem,1.2vw,1.25rem)] text-white/50 max-w-md font-light leading-relaxed">
            {isArabic
              ? `لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك الإلكتروني: ${email}.`
              : `We have sent a 6-digit code to your email: ${email}.`}
          </p>
        </div>

        <div className="w-full lg:w-[460px] relative">
          <div className="absolute inset-0 bg-[#b38e19]/10 blur-[80px] rounded-full" />

          <div className="relative bg-[#19355a]/20 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <header
              className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}
            >
              <div className="w-14 h-14 bg-[#19355a] border border-[#b38e19]/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <LockKeyhole className="text-[#b38e19]" size={32} />
              </div>
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-black text-white tracking-tight mb-1">
                {t("title")}
              </h3>
              <p className="text-[#b38e19] text-[clamp(0.6rem,0.8vw,0.7rem)] font-black uppercase tracking-[4px]">
                {t("subtitle")}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              {/* OTP Inputs Grid with onPaste */}
              <div
                className="flex justify-between gap-2 md:gap-3"
                style={{ direction: "ltr" }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onPaste={handlePaste} // 👈 إضافة خاصية اللصق هنا
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className="w-full h-14 md:h-16 bg-white/5 border border-white/10 focus:border-[#b38e19]/50 focus:bg-white/10 text-white text-center text-2xl font-black rounded-xl outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden py-5 rounded-2xl font-black text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[4px] shadow-2xl flex items-center justify-center gap-3 group transition-all
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#19355a] text-white hover:shadow-[#19355a]/40 hover:-translate-y-0.5 active:scale-95"
  }`}
              >
                {loading ? (
                  <span>{t("loading")}</span>
                ) : (
                  <>
                    <span>{t("verifyButton")}</span>
                    {isArabic ? (
                      <ArrowLeft size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </>
                )}

                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b38e19]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-white/10 text-[8px] font-black uppercase tracking-[10px]">
          Strategic Portal • Capital University
        </p>
      </footer>
    </div>
  );
}
