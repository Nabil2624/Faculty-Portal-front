import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Globe,
  ShieldCheck,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../assets/helwan-university.jpeg";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation("resetpassword");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isArabic = i18n.language === "ar";

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(t("missingEmail"));
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
      await axiosInstance.post("/Authentication/ResetPassword", {
        Email: email,
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
        {/* Welcome Text Section */}
        <div
          className={`w-full lg:w-1/2 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#b38e19] rounded-full" />
            <span className="text-[#b38e19] font-black uppercase tracking-[5px] text-[clamp(0.6rem,1.2vw,1rem)]">
              {isArabic ? "تأمين الحساب" : "Account Security"}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,4vw,5rem)] font-[900] leading-none mb-6 tracking-tighter text-white">
            {isArabic ? "تعيين كلمة المرور" : "RESET PASSWORD"}
          </h1>
          <p className="text-[clamp(0.9rem,1.2vw,1.25rem)] text-white/50 max-w-md font-light leading-relaxed">
            {isArabic
              ? "قم بإنشاء كلمة مرور قوية وفريدة لحماية بياناتك الأكاديمية والوصول الآمن لخدمات الجامعة."
              : "Create a strong, unique password to protect your academic data and ensure secure access to university services."}
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full lg:w-[440px] relative">
          <div className="absolute inset-0 bg-[#b38e19]/10 blur-[80px] rounded-full" />

          <div className="relative bg-[#19355a]/20 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <header
              className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}
            >
              <div className="w-14 h-14 bg-[#19355a] border border-[#b38e19]/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <ShieldCheck className="text-[#b38e19]" size={32} />
              </div>
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-black text-white tracking-tight mb-1">
                {t("resetTitle")}
              </h3>
              <p className="text-[#b38e19] text-[clamp(0.6rem,0.8vw,0.7rem)] font-black uppercase tracking-[4px]">
                {t("resetSubtitle")}
              </p>
            </header>

            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-xl">
                  {success}
                </div>
              )}

              {/* New Password Input */}
              <div className="group space-y-2">
                <label className="text-[clamp(0.65rem,1vw,0.9rem)] font-black uppercase tracking-widest text-white/30 px-1">
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <LockKeyhole
                    className={`absolute top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#b38e19] transition-colors ${isArabic ? "right-4" : "left-4"}`}
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full bg-white/5 border border-white/10 focus:border-[#b38e19]/50 focus:bg-white/10 text-white py-4 ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-2xl outline-none transition-all font-bold placeholder:text-white/10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-white/40 hover:text-[#b38e19] transition-colors ${isArabic ? "left-4" : "right-4"}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="group space-y-2">
                <label className="text-[clamp(0.65rem,1vw,0.9rem)] font-black uppercase tracking-widest text-white/30 px-1">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <LockKeyhole
                    className={`absolute top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#b38e19] transition-colors ${isArabic ? "right-4" : "left-4"}`}
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full bg-white/5 border border-white/10 focus:border-[#b38e19]/50 focus:bg-white/10 text-white py-4 ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-2xl outline-none transition-all font-bold placeholder:text-white/10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-white/40 hover:text-[#b38e19] transition-colors ${isArabic ? "left-4" : "right-4"}`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-[#19355a] text-white py-5 rounded-2xl font-black text-[clamp(0.7rem,0.9vw,0.85rem)] uppercase tracking-[4px] shadow-2xl hover:shadow-[#19355a]/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <>
                  <span>{t("resetButton")}</span>
                  {isArabic ? (
                    <ArrowLeft size={16} />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b38e19]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <button
                onClick={() => navigate("/login")}
                className="text-[clamp(0.6rem,0.8vw,0.7rem)] font-black text-[#b38e19] hover:text-white uppercase tracking-[2px] transition-colors underline underline-offset-8"
              >
                {t("backToLogin")}
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
    </div>
  );
}
