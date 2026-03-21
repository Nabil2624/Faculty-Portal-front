import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react"; 
import capitalImg from "../assets/helwan-university.jpeg";
// تأكد من استيراد اللوجو هنا بالاسم والمسار الصحيح
import logoImg from "../assets/Capital.png"; 
import { useNavigate } from "react-router-dom";

const FacultyLandingPage = () => {
  const [lang, setLang] = useState("ar");
  const isAr = lang === "ar";
  const navigate = useNavigate();

  const mainBlue = "#19355A";
  const accentGold = "#b38e19";

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: mainBlue,
        direction: isAr ? "rtl" : "ltr",
        fontFamily: isAr ? "'Cairo', sans-serif" : "'Roboto', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-[5%] py-6 z-50">
        {/* حتة اللوجو المعدلة */}
        <div 
          className="rounded-full border-2 flex items-center justify-center transition-all overflow-hidden bg-white/5"
          style={{ 
            borderColor: accentGold,
            width: "clamp(50px, 4vw, 90px)", 
            height: "clamp(50px, 4vw, 90px)" 
          }}
        >
          <img 
            src={logoImg} 
            alt="University Logo" 
            className="w-[80%] h-[80%] object-contain" 
          />
        </div>

        <button
          onClick={() => setLang(isAr ? "en" : "ar")}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#b38e19]/50 text-white hover:bg-white/10 transition-all shadow-lg"
          style={{ fontSize: "clamp(0.85rem, 0.8vw, 1.2rem)" }}
        >
          <Globe size={18} style={{ color: accentGold }} />
          <span>{isAr ? "English" : "العربية"}</span>
        </button>
      </nav>

      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#19355A]/85 via-[#19355A]/60 to-[#19355A] z-10" />
        <img src={capitalImg} alt="University" className="w-full h-full object-cover shadow-2xl" />
      </div>

      {/* Main Content */}
      <main className="relative z-20 w-full px-6 flex flex-col items-center">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Uni Name Badge */}
          <span
            className="inline-block rounded-full border-2 font-bold tracking-[0.2em] uppercase mb-6"
            style={{ 
              borderColor: accentGold, 
              color: accentGold,
              padding: "clamp(0.4rem, 0.6vw, 1rem) clamp(1.2rem, 1.5vw, 3rem)",
              fontSize: "clamp(0.7rem, 0.8vw, 1.3rem)" 
            }}
          >
            {isAr ? "جامعة العاصمة" : "Capital University"}
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 7rem)", 
              lineHeight: "1.2",
              color: "#FFFFFF",
              maxWidth: "clamp(600px, 80vw, 1800px)" 
            }}
            className="font-black mb-8 mx-auto leading-tight drop-shadow-2xl"
          >
            {isAr ? "مرحباً بكم في منصة أعضاء هيئة التدريس" : "Welcome to the Faculty Members Platform"}
          </h1>

          {/* Description */}
          <p
            style={{ 
              fontSize: "clamp(1rem, 1.3vw, 2.2rem)",
              maxWidth: "clamp(400px, 50vw, 1100px)" 
            }}
            className="text-gray-200 font-light mb-12 leading-relaxed"
          >
            {isAr ? "نظام إدارة اعضاء هيئة التدريس" : "Faculty Portal Management System"}
          </p>

          {/* Buttons Area */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
            <button
              className="font-bold text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95 rounded-xl"
              style={{ 
                backgroundColor: accentGold,
                width: "clamp(180px, 12vw, 350px)",
                height: "clamp(55px, 4.5vw, 90px)",
                fontSize: "clamp(0.95rem, 1vw, 1.6rem)"
              }}
              onClick={() => navigate("/login")}
            >
              {isAr ? "تسجيل الدخول" : "Login"}
            </button>

            <button
              className="font-bold border-2 transition-all hover:bg-white/5 active:scale-95 rounded-xl"
              style={{ 
                borderColor: accentGold, 
                color: accentGold,
                width: "clamp(180px, 12vw, 350px)",
                height: "clamp(55px, 4.5vw, 90px)",
                fontSize: "clamp(0.95rem, 1vw, 1.6rem)"
              }}
              onClick={() => navigate("/register")}
            >
              {isAr ? "إنشاء حساب" : "Sign Up"}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Decorative Accents */}
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <div className="w-24 h-24 border-l-4 border-b-4" style={{ borderColor: accentGold }} />
      </div>
    </div>
  );
};

export default FacultyLandingPage;