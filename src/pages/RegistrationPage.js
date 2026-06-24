import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Globe,
  Fingerprint,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../assets/helwan-university.jpeg";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RegisterPage() {
  const { t, i18n } = useTranslation("register");
  const navigate = useNavigate();

  const [nationalID, setNationalID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // حالة التحقق اللحظي: idle (مبدئي), valid (صحيح), invalid (خاطئ)
  const [validationStatus, setValidationStatus] = useState("idle");

  const isArabic = i18n.language === "ar";

  // دالة مراقبة التغيير في الإدخال
  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setNationalID(value);

    // التحقق: يجب أن يكون أرقام فقط وطوله 14 رقم بالضبط
    const isOnlyNumbers = /^[0-9]*$/.test(value);
    const isCorrectLength = value.length === 14;

    if (value === "") {
      setValidationStatus("idle");
    } else if (isOnlyNumbers && isCorrectLength) {
      setValidationStatus("valid");
    } else {
      setValidationStatus("invalid");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // التأكد من صحة البيانات قبل الإرسال
    if (validationStatus !== "valid") {
      setError(t("invalidLengthError") || "يرجى إدخال 14 رقماً صحيحاً");
      return;
    }

    try {
      setLoading(true);
      const registerRes = await axiosInstance.post(
        "/Authentication/Register",
        { NationalNumber: nationalID },
        { skipGlobalErrorHandler: true, withCredentials: false },
      );

      if (registerRes.data?.status !== false) {
        navigate("/login");
      } else {
        setError(registerRes.data?.message || t("serverError"));
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || t("invalidNationalID"));
      } else if (err.response?.status === 409) {
        setError(t("alreadyRegistered"));
      } else if (err.response?.status === 404) {
        setError(t("notFound"));
      } else if (err.response?.status >= 500) {
        window.location.href = "/error/500";
      } else {
        setError(t("unexpectedError"));
      }
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
          alt="Capital University"
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
        {/* Welcome Text Section */}
        <div className={`w-full lg:w-1/2 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#b38e19] rounded-full" />
            <span className="text-[#b38e19] font-black uppercase tracking-[5px] text-[clamp(0.6rem,1.2vw,1rem)]">
              {isArabic ? "بوابة التسجيل" : "Registration Portal"}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-[900] leading-none mb-6 tracking-tighter text-white">
            {isArabic ? "جامعة العاصمة" : "CAPITAL UNIVERSITY"}
          </h1>
          <p className="text-[clamp(0.9rem,1.2vw,1.25rem)] text-white/50 max-w-md font-light leading-relaxed">
            {isArabic
              ? "ابدأ رحلتك الرقمية معنا. قم بإنشاء حسابك للوصول إلى كافة الخدمات الأكاديمية المتطورة."
              : "Start your digital journey with us. Create your account to access advanced academic services."}
          </p>
        </div>

        {/* Register Card */}
        <div className="w-full lg:w-[440px] relative">
          <div className="absolute inset-0 bg-[#b38e19]/10 blur-[80px] rounded-full" />

          <div className="relative bg-[#19355a]/20 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <header className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="w-14 h-14 bg-[#19355a] border border-[#b38e19]/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <Fingerprint className="text-[#b38e19]" size={32} />
              </div>
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-black text-white tracking-tight mb-1">
                {t("signUp")}
              </h3>
              <p className="text-[#b38e19] text-[clamp(0.6rem,0.8vw,0.7rem)] font-black uppercase tracking-[4px]">
                {t("subtitle")}
              </p>
            </header>

            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl animate-shake">
                  {error}
                </div>
              )}

              {/* National ID Input Group */}
              <div className="group space-y-2">
                <label className="text-[clamp(0.65rem,1vw,0.9rem)] font-black uppercase tracking-widest text-white/30 px-1">
                  {t("nationalID")}
                </label>
                
                <div className="relative">
                  {/* Icon Focus/Validation logic */}
                  <User
                    className={`absolute top-1/2 -translate-y-1/2 transition-colors duration-300 ${isArabic ? "right-4" : "left-4"} 
                      ${validationStatus === 'valid' ? 'text-green-500' : 
                        validationStatus === 'invalid' ? 'text-red-500' : 'text-white/20 group-focus-within:text-[#b38e19]'}`}
                    size={18}
                  />

                  <input
                    type="text"
                    value={nationalID}
                    onChange={handleInputChange}
                    disabled={loading}
                    maxLength={14}
                    className={`w-full bg-white/5 border py-4 rounded-2xl outline-none transition-all duration-300 font-bold placeholder:text-white/10
                      ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"}
                      ${validationStatus === 'valid' ? 'border-green-500/50 focus:border-green-500 bg-green-500/5 text-white' : 
                        validationStatus === 'invalid' ? 'border-red-500/50 focus:border-red-500 bg-red-500/5 text-white' : 
                        'border-white/10 focus:border-[#b38e19]/50 focus:bg-white/10 text-white'}`}
                    placeholder="2990101XXXXXXXX"
                  />

                  {/* Feedback Icons (End of input) */}
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"}`}>
                    {validationStatus === "valid" && (
                      <CheckCircle2 className="text-green-500 animate-in zoom-in duration-300" size={20} />
                    )}
                    {validationStatus === "invalid" && (
                      <AlertCircle className="text-red-500 animate-in shake duration-300" size={20} />
                    )}
                  </div>
                </div>

                {/* Real-time Hint Message */}
                <div className="h-4 px-1">
                    {validationStatus === "invalid" && nationalID.length > 0 && (
                        <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-wider">
                           {/^[0-9]+$/.test(nationalID) ? t("invalidLengthError") : t("onlyNumbersError")}
                        </p>
                    )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || validationStatus !== "valid"}
                className={`w-full relative overflow-hidden py-5 rounded-2xl font-black text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[4px] shadow-2xl flex items-center justify-center gap-3 group transition-all
                ${loading || validationStatus !== "valid"
                  ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                  : "bg-[#19355a] text-white hover:shadow-[#19355a]/40 hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {loading ? (
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     <span>{t("loading")}</span>
                   </div>
                ) : (
                  <>
                    <span>{t("signUp")}</span>
                    {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </>
                )}

                {!loading && validationStatus === "valid" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b38e19]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <p className="text-[clamp(0.6rem,0.8vw,0.7rem)] font-black text-white/20 uppercase tracking-[2px]">
                {t("loginText")}{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#b38e19] hover:text-white font-black text-[clamp(0.6rem,0.8vw,0.7rem)] transition-colors underline underline-offset-8"
                >
                  {t("login")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-white/10 text-[8px] font-black uppercase tracking-[10px]">
          Strategic Portal • Capital University
        </p>
      </footer>

      {/* Tailwind Custom Animations Style */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}