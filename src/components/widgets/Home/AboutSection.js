import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen, Users, ShieldCheck, Zap } from "lucide-react";

const AboutSection = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  const features = [
    { icon: <Zap size={32} color="#B38E19" />, title: isAr ? "سرعة الإنجاز" : "Fast Execution", desc: isAr ? "إتمام المهام الإدارية بضغطة زر" : "Complete administrative tasks with a click" },
    { icon: <ShieldCheck size={32} color="#B38E19" />, title: isAr ? "سرية وأمان" : "Secure & Safe", desc: isAr ? "حماية كاملة للبيانات الأكاديمية" : "Full protection for academic data" },
    { icon: <BookOpen size={32} color="#B38E19" />, title: isAr ? "مكتبة رقمية" : "Digital Library", desc: isAr ? "وصول سريع للأبحاث والمقررات" : "Quick access to research and courses" },
    { icon: <Users size={32} color="#B38E19" />, title: isAr ? "تواصل فعال" : "Effective Comms", desc: isAr ? "ربط مباشر بين أعضاء هيئة التدريس" : "Direct connection between faculty members" },
  ];

  return (
    <section id="about" className="w-full min-h-screen py-32 px-[5%] flex items-center justify-center bg-gray-50 relative overflow-hidden" style={{ direction: isAr ? "rtl" : "ltr" }}>
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* الجزء النصي */}
        <motion.div initial={{ opacity: 0, x: isAr ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <span className="text-[#B38E19] font-bold tracking-widest uppercase mb-4 text-lg border-b-2 border-[#B38E19] pb-1 inline-block">
            {isAr ? "رؤيتنا الأكاديمية" : "Our Academic Vision"}
          </span>
          <h2 className="font-black mb-8 uppercase text-[#19355A]" style={{ fontSize: "clamp(2.5rem, 4vw, 5rem)", lineHeight: "1.2" }}>
            {isAr ? "منظومة إلكترونية متكاملة" : "Integrated Digital System"}
          </h2>
          <p className="leading-relaxed text-[#19355A]/70 font-medium mb-8" style={{ fontSize: "clamp(1.1rem, 1.2vw, 1.5rem)" }}>
            {isAr 
              ? "صُممت هذه المنصة لتكون العصب الرقمي للجامعة، حيث توفر بيئة احترافية تُسهل المهام الأكاديمية لأعضاء هيئة التدريس، وتضمن دقة وسرعة تدفق المعلومات داخل الحرم الجامعي بشكل يواكب التطور التكنولوجي المستمر."
              : "Designed to be the digital backbone of the university, providing a professional environment that streamlines academic tasks for faculty members, ensuring accurate and fast information flow on campus."}
          </p>
        </motion.div>

        {/* جزء المميزات (لملء الشاشة) */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-gray-50 inline-block group-hover:scale-110 group-hover:bg-[#B38E19]/10 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#19355A] mb-3">{feature.title}</h3>
              <p className="text-gray-500 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;