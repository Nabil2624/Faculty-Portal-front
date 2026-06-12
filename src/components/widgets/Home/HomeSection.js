import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// تأكد إن مسار الصورة صح على حسب مكان الملف
import capitalImg from "../../../assets/helwan-university.jpeg";

const HomeSection = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();

  const accentGold = "#B38E19";

  return (
    <div 
      id="home" 
      // ضفت min-h-screen عشان ياخد الشاشة كاملة
      className="w-full min-h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#19355A]/90 via-[#19355A]/70 to-[#19355A] z-10" />
        <img
          src={capitalImg}
          alt="University"
          className="w-full h-full object-cover shadow-2xl"
        />
      </div>

      <main className="relative z-20 w-full px-6 flex flex-col items-center pt-20">
        <motion.div
          key={i18n.language}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full"
        >
          <span
            className="inline-block rounded-full border-2 font-bold tracking-[0.2em] uppercase mb-6"
            style={{
              borderColor: accentGold,
              color: accentGold,
              padding: "clamp(0.4rem, 0.6vw, 1rem) clamp(1.2rem, 1.5vw, 3rem)",
              fontSize: "clamp(0.7rem, 0.8vw, 1.3rem)",
            }}
          >
            {isAr ? "جامعة العاصمة" : "Capital University"}
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 7rem)",
              lineHeight: "1.2",
              color: "#FFFFFF",
              maxWidth: "clamp(600px, 80vw, 1800px)",
            }}
            className="font-black mb-8 mx-auto leading-tight drop-shadow-2xl"
          >
            {isAr
              ? "مرحباً بكم في منصة أعضاء هيئة التدريس"
              : "Welcome to the Faculty Members Platform"}
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.3vw, 2.2rem)",
              maxWidth: "clamp(400px, 50vw, 1100px)",
            }}
            className="text-gray-200 font-light mb-12 leading-relaxed"
          >
            {isAr ? "نظام إدارة اعضاء هيئة التدريس" : "Faculty Portal Management System"}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
            <button
              className="font-bold text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95 rounded-xl"
              style={{
                backgroundColor: accentGold,
                width: "clamp(180px, 12vw, 350px)",
                height: "clamp(55px, 4.5vw, 90px)",
                fontSize: "clamp(0.95rem, 1vw, 1.6rem)",
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
                fontSize: "clamp(0.95rem, 1vw, 1.6rem)",
              }}
              onClick={() => navigate("/register")}
            >
              {isAr ? "إنشاء حساب" : "Sign Up"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomeSection;