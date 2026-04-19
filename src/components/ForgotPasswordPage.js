import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Globe,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../assets/helwan-university.jpeg";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation("forgetpassword");
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // حالة التحقق اللحظي للإيميل
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | valid | invalid

  const isArabic = i18n.language === "ar";

  // دالة الـ Regex للإيميل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // مراقبة الإدخال لحظياً
  useEffect(() => {
    const trimmedEmail = identifier.trim();
    if (trimmedEmail === "") {
      setEmailStatus("idle");
    } else if (emailRegex.test(trimmedEmail)) {
      setEmailStatus("valid");
    } else {
      setEmailStatus("invalid");
    }
  }, [identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (emailStatus !== "valid") {
      setError(t("errors.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        "/Authentication/ConfirmEmail",
        { userEmail: identifier.trim() },
        { skipGlobalErrorHandler: true },
      );

      navigate("/OTP", { state: { email: identifier.trim() } });
    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;

      let errorMsg = "";
      if (status === 400) errorMsg = t("errors.emailNotFound");
      else if (status === 404) errorMsg = t("errors.notFound");
      else if (status === 429) errorMsg = t("errors.tooManyRequests");
      else if (status === 500) {
        window.location.href = "/error/500";
        return;
      } else {
        errorMsg = backendMessage || t("errors.unexpected", { message: err.message || "Unknown" });
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050b14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={helwanImage} alt="bg" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050b14] via-[#19355a]/40 to-[#050b14]/80" />
      </div>

      {/* Language Toggle */}
      <div className={`fixed top-6 ${isArabic ? "left-6" : "right-6"} z-[100]`}>
        <button
          onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300 group"
        >
          <Globe size={16} className="text-[#b38e19]" />
          <span className="text-[11px] font-black uppercase">{isArabic ? "English" : "عربي"}</span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between px-6 gap-10">
        {/* Info Text */}
        <div className={`w-full lg:w-1/2 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#b38e19] rounded-full" />
            <span className="text-[#b38e19] font-black uppercase tracking-[5px] text-[clamp(0.6rem,1.2vw,1rem)]">
              {isArabic ? "استعادة الحساب" : "Security Recovery"}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,3.5vw,3.5rem)] font-[900] leading-none mb-6 text-white uppercase tracking-tighter">
            {isArabic ? "هل نسيت كلمة المرور؟" : "Forgot Your Password?"}
          </h1>
        </div>

        {/* Form Card */}
        <div className="w-full lg:w-[440px] relative">
          <div className="absolute inset-0 bg-[#b38e19]/10 blur-[80px] rounded-full" />
          <div className="relative bg-[#19355a]/20 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
            
            <header className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="w-14 h-14 bg-[#19355a] border border-[#b38e19]/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <KeyRound className="text-[#b38e19]" size={32} />
              </div>
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-black text-white mb-1">{t("title")}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Info size={14} className="text-[#b38e19]" />
                <p className="text-[#b38e19] text-[10px] font-black uppercase tracking-[2px]">{t("subtitle")}</p>
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl animate-shake">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="group space-y-2">
                <label className="text-[clamp(0.65rem,1vw,0.9rem)] font-black uppercase tracking-widest text-white/30 px-1">
                  {t("identifier")}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 -translate-y-1/2 transition-colors duration-300 ${isArabic ? "right-4" : "left-4"} 
                      ${emailStatus === 'valid' ? 'text-green-500' : 
                        emailStatus === 'invalid' ? 'text-red-500' : 'text-white/20 group-focus-within:text-[#b38e19]'}`}
                    size={18}
                  />
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                    className={`w-full bg-white/5 border py-4 rounded-2xl outline-none transition-all duration-300 font-bold text-white
                      ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"}
                      ${emailStatus === 'valid' ? 'border-green-500/50 bg-green-500/5' : 
                        emailStatus === 'invalid' ? 'border-red-500/50 bg-red-500/5' : 
                        'border-white/10 focus:border-[#b38e19]/50 focus:bg-white/10'}`}
                    placeholder="example@univ.edu.eg"
                  />
                  
                  {/* Validation Feedback Icon */}
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"}`}>
                    {emailStatus === "valid" && <CheckCircle2 className="text-green-500 animate-in zoom-in" size={20} />}
                    {emailStatus === "invalid" && <AlertCircle className="text-red-500 animate-in shake" size={20} />}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || emailStatus !== "valid"}
                className={`w-full relative overflow-hidden py-5 rounded-2xl font-black text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[4px] shadow-2xl transition-all flex items-center justify-center gap-3 group
                ${loading || emailStatus !== "valid"
                  ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                  : "bg-[#19355a] text-white hover:shadow-[#19355a]/40 hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t("resetButton")}</span>
                    {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </>
                )}
                {!loading && emailStatus === "valid" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b38e19]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <button
                onClick={() => navigate("/login")}
                className="text-[#b38e19] hover:text-white font-black text-[10px] uppercase tracking-[2px] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isArabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                {t("backToLogin") || "Back to Login"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-white/10 text-[8px] font-black uppercase tracking-[10px]">
          Strategic Portal • Capital University
        </p>
      </footer>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}