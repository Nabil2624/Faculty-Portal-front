// LoginPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Globe,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

// تأكد من المسار الصحيح لصورة غرفة الاجتماعات
import boardroomImage from "../assets/Magles.jpeg";

export default function Login() {
  const { t, i18n } = useTranslation("Login");
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const isArabic = i18n.language === "ar";


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#b38e19]">
      {/* Background Image with Original Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={boardroomImage}
          alt="System Background"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Gradient Overlay using the original Navy colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/80 via-[#19355a]/50 to-[#050b14]" />
      </div>

      {/* Language Toggle */}
      <div className={`fixed top-6 ${isArabic ? "left-6" : "right-6"} z-[100]`}>
        <button
          onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all shadow-xl"
        >
          <Globe size={14} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? "English" : "عربي"}
          </span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between px-8 gap-12">
        
        {/* Left Side: Brand Text */}
        <div className={`w-full lg:w-3/5 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}>
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-1 bg-[#19355a]/40 rounded-full border border-[#19355a]/20">
            <div className="h-1.5 w-1.5 bg-[#19355a] rounded-full animate-pulse" />
            <span className="text-white font-bold uppercase tracking-[3px] text-xs">
              {isArabic ? "النظام الإداري الذكي" : "Smart Management System"}
            </span>
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight mb-4 text-white">
            {isArabic ? "بوابة الإدارة المركزية" : "CENTRAL MANAGEMENT PORTAL"}
          </h1>
          <p className="text-white/40 text-lg max-w-md font-light">
            {isArabic 
              ? "منصة متكاملة لإدارة الموارد والعمليات بكفاءة عالية."
              : "Integrated platform for efficient resource and operations management."}
          </p>
        </div>

        {/* Right Side: Slim Login Card */}
        <div className="w-full max-w-[380px] relative"> {/* صغرنا العرض الأقصى هنا */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#b38e19]/20 to-transparent blur-2xl rounded-[2rem]" />
          
          <div className="relative bg-[#19355a]/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <header className="mb-8 text-center">
              <div className="w-12 h-12 bg-white/5 border border-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {t("loginTitle")}
              </h3>
              <p className="text-white/40 text-[10px] uppercase tracking-[2px]">
                {t("loginSubtitle")}
              </p>
            </header>

            <form  className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center rounded-lg font-medium">
                  {error}
                </div>
              )}

              {/* Input: Username */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">
                  {t("username")}
                </label>
                <div className="relative group">
                  <User size={16} className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} text-white/20 group-focus-within:text-[#b38e19] transition-colors`} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full bg-black/20 border border-white/5 focus:border-[#b38e19]/40 text-white text-sm py-3.5 ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl outline-none transition-all`}
                    placeholder="Enter ID"
                  />
                </div>
              </div>

              {/* Input: Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">
                  {t("password")}
                </label>
                <div className="relative group">
                  <Lock size={16} className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} text-white/20 group-focus-within:text-[#b38e19] transition-colors`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-black/20 border border-white/5 focus:border-[#b38e19]/40 text-white text-sm py-3.5 ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors ${isArabic ? "left-4" : "right-4"}`}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#19355a] hover:bg-[#1e416e] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-[2px] shadow-lg border border-white/5 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t("loginButton")}</span>
                    {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <button
                onClick={() => navigate("/forget-password")}
                className="text-[10px] text-white/30 hover:text-[#b38e19] uppercase tracking-tighter transition-colors"
              >
                {t("forgotPassword")}?
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-white/10 text-[8px] font-medium uppercase tracking-[8px]">
          Secure Access Layer • Optimized for Strategic Operations
        </p>
      </footer>
    </div>
  );
}