import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import helwanImage from "../assets/helwan-university.jpeg";

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation("ResetPassword");
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

  // حالات التحقق اللحظي
  const [passStatus, setPassStatus] = useState("idle"); // idle | valid | invalid
  const [matchStatus, setMatchStatus] = useState("idle"); // idle | match | mismatch

  const isArabic = i18n.language === "ar";

  // Regex: حرف كبير، حرف صغير، رقم، رمز خاص، 8 خانات على الأقل
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,}$/;

  // مراقبة كلمة المرور الجديدة
  useEffect(() => {
    if (newPassword === "") {
      setPassStatus("idle");
    } else if (passwordRegex.test(newPassword)) {
      setPassStatus("valid");
    } else {
      setPassStatus("invalid");
    }
  }, [newPassword]);

  // مراقبة التطابق
  useEffect(() => {
    if (confirmPassword === "") {
      setMatchStatus("idle");
    } else if (confirmPassword === newPassword && newPassword !== "") {
      setMatchStatus("match");
    } else {
      setMatchStatus("mismatch");
    }
  }, [confirmPassword, newPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passStatus !== "valid") {
      setError(t("passwordRequirements"));
      return;
    }

    if (matchStatus !== "match") {
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
      setError(err.response?.data?.message || t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050b14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={helwanImage} className="w-full h-full object-cover opacity-50" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050b14] via-[#19355a]/40 to-[#050b14]/80" />
      </div>

      {/* Language Toggle */}
      <div className={`fixed top-6 ${isArabic ? "left-6" : "right-6"} z-[100]`}>
        <button
          onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-[#b38e19]/40 rounded-xl text-white hover:border-[#b38e19] transition-all duration-300"
        >
          <Globe size={16} className="text-[#b38e19]" />
          <span className="text-[11px] font-black tracking-widest uppercase">{isArabic ? "English" : "عربي"}</span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between px-6 gap-10">
        {/* Welcome Section */}
        <div className={`w-full lg:w-1/2 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}>
           <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#b38e19] rounded-full" />
            <span className="text-[#b38e19] font-black uppercase tracking-[5px] text-[clamp(0.6rem,1.2vw,1rem)]">
              {isArabic ? "تأمين الحساب" : "Account Security"}
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,4vw,5rem)] font-[900] leading-none mb-6 text-white tracking-tighter">
            {isArabic ? "تعيين كلمة المرور" : "RESET PASSWORD"}
          </h1>
        </div>

        {/* Form Card */}
        <div className="w-full lg:w-[440px] relative">
          <div className="absolute inset-0 bg-[#b38e19]/10 blur-[80px] rounded-full" />
          <div className="relative bg-[#19355a]/20 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
            
            <header className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="w-14 h-14 bg-[#19355a] border border-[#b38e19]/30 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-[#b38e19]" size={32} />
              </div>
              <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-black text-white">{t("resetTitle")}</h3>
            </header>

            <form onSubmit={handleReset} className="space-y-6">
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl animate-shake">{error}</div>}
              {success && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-xl">{success}</div>}

              {/* New Password Input */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t("newPassword")}</label>
                <div className="relative">
                  <LockKeyhole className={`absolute top-1/2 -translate-y-1/2 ${passStatus === 'valid' ? 'text-green-500' : passStatus === 'invalid' ? 'text-red-500' : 'text-white/20'} transition-colors ${isArabic ? "right-4" : "left-4"}`} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full bg-white/5 border py-4 ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-2xl outline-none transition-all font-bold text-white
                      ${passStatus === 'valid' ? 'border-green-500/50 bg-green-500/5' : passStatus === 'invalid' ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    placeholder="••••••••"
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${isArabic ? "left-4" : "right-4"}`}>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/40 hover:text-[#b38e19] transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {passStatus === "valid" && <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in" />}
                    {passStatus === "invalid" && <AlertCircle size={18} className="text-red-500 animate-in shake" />}
                  </div>
                </div>
                {passStatus === "invalid" && (
                    <p className="text-[9px] text-red-500/70 font-bold uppercase">{t("passwordRequirements")}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t("confirmPassword")}</label>
                <div className="relative">
                  <LockKeyhole className={`absolute top-1/2 -translate-y-1/2 ${matchStatus === 'match' ? 'text-green-500' : matchStatus === 'mismatch' ? 'text-red-500' : 'text-white/20'} transition-colors ${isArabic ? "right-4" : "left-4"}`} size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/5 border py-4 ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} rounded-2xl outline-none transition-all font-bold text-white
                      ${matchStatus === 'match' ? 'border-green-500/50 bg-green-500/5' : matchStatus === 'mismatch' ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    placeholder="••••••••"
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${isArabic ? "left-4" : "right-4"}`}>
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-white/40 hover:text-[#b38e19] transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {matchStatus === "match" && <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in" />}
                    {matchStatus === "mismatch" && <XCircle size={18} className="text-red-500 animate-in shake" />}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || passStatus !== "valid" || matchStatus !== "match"}
                className={`w-full relative overflow-hidden py-5 rounded-2xl font-black uppercase tracking-[4px] transition-all flex items-center justify-center gap-3 group
                  ${loading || passStatus !== "valid" || matchStatus !== "match" 
                    ? "bg-white/5 text-white/20 cursor-not-allowed" 
                    : "bg-[#19355a] text-white hover:shadow-[#19355a]/40 hover:-translate-y-0.5 active:scale-95"}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <span>{t("resetButton")}</span>
                    {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <button onClick={() => navigate("/login")} className="text-[10px] font-black text-[#b38e19] hover:text-white uppercase underline underline-offset-8">
                {t("backToLogin")}
              </button>
            </div>
          </div>
        </div>
      </main>

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