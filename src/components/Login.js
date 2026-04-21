import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, User, Lock, Globe } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import boardroomImage from "../assets/Magles.jpeg";

export default function Login() {
  const { t, i18n } = useTranslation("Login");
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isArabic = i18n.language === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. تنفيذ الـ Login ريكويست
      const response = await axiosInstance.post("/auth/login", { username, password });
      console.log("Step 1: Login Success");

      // 2. الانتظار "إجبارياً" حتى تنتهي الـ authme داخل الـ Context
      await handleLoginSuccess(response.data.user || response.data);
      console.log("Step 2: AuthMe Success - Safe to navigate");
      
      // 3. الآن فقط ننتقل للـ Dashboard
      navigate("/dashboard"); 
      
    } catch (err) {
      console.error("Login Step Failed:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#b38e19]">
      <div className="absolute inset-0 z-0">
        <img src={boardroomImage} alt="Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/80 via-[#19355a]/50 to-[#050b14]" />
      </div>

      <div className={`fixed top-6 ${isArabic ? "left-6" : "right-6"} z-[100]`}>
        <button onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all shadow-xl">
          <Globe size={14} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{isArabic ? "English" : "عربي"}</span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between px-8 gap-12">
        <div className={`w-full lg:w-3/5 ${isArabic ? "text-right" : "text-left"} hidden lg:block`}>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight mb-4 text-white">
            {isArabic ? "بوابة الإدارة المركزية" : "CENTRAL MANAGEMENT PORTAL"}
          </h1>
        </div>

        <div className="w-full max-w-[380px] relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-[#b38e19]/20 to-transparent blur-2xl rounded-[2rem]" />
          <div className="relative bg-[#19355a]/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <header className="mb-8 text-center">
              <div className="w-12 h-12 bg-white/5 border border-white/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{t("loginTitle")}</h3>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{t("username")}</label>
                <div className="relative group">
                  <User size={16} className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} text-white/20 group-focus-within:text-[#b38e19] transition-colors`} />
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full bg-black/20 border border-white/5 focus:border-[#b38e19]/40 text-white text-sm py-3.5 ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl outline-none transition-all`} placeholder="Enter ID" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{t("password")}</label>
                <div className="relative group">
                  <Lock size={16} className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} text-white/20 group-focus-within:text-[#b38e19] transition-colors`} />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-black/20 border border-white/5 focus:border-[#b38e19]/40 text-white text-sm py-3.5 ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl outline-none transition-all`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors ${isArabic ? "left-4" : "right-4"}`}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#19355a] hover:bg-[#1e416e] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-[2px] shadow-lg border border-white/5 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>{t("loginButton")}</span>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}