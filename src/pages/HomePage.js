import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/widgets/Home/Navbar";
import HomeSection from "../components/widgets/Home/HomeSection";
import AboutSection from "../components/widgets/Home/AboutSection";
import ContactSection from "../components/widgets/Home/ContactSection";

const FacultyLandingPage = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const mainBlue = "#19355A";

  return (
    <div
      className="w-full relative flex flex-col"
      style={{
        backgroundColor: mainBlue,
        fontFamily: isAr ? "'Cairo', sans-serif" : "'Roboto', sans-serif",
      }}
    >
      <Navbar />
      
      {/* السكاشن المترتبة */}
      <HomeSection />
      <AboutSection />
      <ContactSection />
      
    </div>
  );
};

export default FacultyLandingPage;