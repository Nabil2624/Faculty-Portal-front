import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin } from "lucide-react";

const ContactSection = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  const contactData = [
    { 
      // قللت حجم الأيقونات
      icon: <Phone size={28} color="#B38E19" />, 
      title: isAr ? "الدعم الهاتفي" : "Phone Support",
      value: "+20 123 456 7890", 
      sub: isAr ? "متاح أثناء ساعات العمل" : "Available during working hours",
      link: "tel:+201234567890" 
    },
    { 
      icon: <Mail size={28} color="#B38E19" />, 
      title: isAr ? "البريد الإلكتروني" : "Email Address",
      value: "faculty@capital-uni.edu", 
      sub: isAr ? "نرد خلال 24 ساعة عمل" : "We reply within 24 business hours",
      link: "mailto:faculty@capital-uni.edu.eg" 
    },
    { 
      icon: <Clock size={28} color="#B38E19" />, 
      title: isAr ? "ساعات العمل" : "Working Hours",
      value: isAr ? "الأحد - الخميس" : "Sun - Thu", 
      sub: isAr ? "08:00 صباحاً - 04:00 مساءً" : "08:00 AM - 04:00 PM",
      link: "#" 
    },
  ];

  return (
    // شيلت min-h-screen وقللت الـ py
    <section id="contact" className="w-full py-16 md:py-24 px-[5%] bg-[#19355A] text-white relative overflow-hidden flex flex-col justify-center items-center" style={{ direction: isAr ? "rtl" : "ltr" }}>
      
      {/* خلفية جمالية */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B38E19] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* قللت الـ mb */}
        <div className="text-center mb-10">
          <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            // صغرت حجم العنوان الرئيسي شوية
            className="font-black uppercase mb-4" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", color: "#FFFFFF", lineHeight: "1.1" }}>
            {isAr ? "ابقَ على تواصل" : "Get In Touch"}
          </motion.h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            {isAr ? "فريق الدعم الفني والإداري متاح دائماً للرد على استفساراتكم وحل أي مشكلات قد تواجهكم على المنصة." : "Our technical and administrative support team is always available to answer your inquiries and resolve any issues."}
          </p>
        </div>

        <motion.div 
          // قللت الـ gap والـ mb
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        >
          {contactData.map((item, index) => (
            <motion.a key={index} href={item.link} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              // قللت الـ padding (p-8 بدل p-12)
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#B38E19] hover:bg-white/10 transition-all duration-300 backdrop-blur-md group shadow-2xl"
            >
              {/* قللت الـ mb والـ padding للدايرة بتاعة الأيقونة */}
              <div className="mb-4 p-4 rounded-full bg-[#19355A] border border-[#B38E19]/30 group-hover:-translate-y-2 group-hover:bg-[#B38E19]/20 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#B38E19] mb-1">{item.title}</h3>
              {/* صغرت حجم النص بتاع القيمة */}
              <span className="text-xl font-bold text-white text-center mb-1" style={{ direction: "ltr" }}>{item.value}</span>
              <span className="text-gray-400 text-sm text-center">{item.sub}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Location & Socials in a compact bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          // قللت الـ padding هنا برضه
          className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
        >
          <div className="flex items-center gap-4 md:mb-0">
            <MapPin size={24} color="#B38E19" />
            <div>
              <h4 className="font-bold text-white text-base">{isAr ? "الحرم الجامعي" : "Main Campus"}</h4>
              <p className="text-gray-400 text-sm">{isAr ? "القاهرة، جمهورية مصر العربية" : "Cairo, Egypt"}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#B38E19] transition-all"><Facebook size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#B38E19] transition-all"><Linkedin size={18} /></a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;