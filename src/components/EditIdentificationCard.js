import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function IdentificationCard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("identification");
  const isArabic = i18n.language === "ar";

  const [cardData, setCardData] = useState({
    orcid: "",
    ekb: "",
    researcherId: "",
    researcherGate: "",
    academiaEdu: ""
  });

  // Extract domain name from URL
  const getDomain = (url) => {
    if (!url || url === "string") return isArabic ? "لا يوجد" : "None";

    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      return hostname;
    } catch (e) {
      return url;
    }
  };

  const handleClick = (value) => {
    if (!value || value === "string") return;
    if (value.startsWith("http")) window.open(value, "_blank");
  };

  useEffect(() => {
    axiosInstance.get("/FacultyMemberData/IdentificationCard", { skipGlobalErrorHandler: true })
      .then((res) => {
        setCardData(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    axiosInstance
      .put("/FacultyMemberData/UpdateIdentificationCard", cardData)
      .then(() => navigate("/identification-card"))
      .catch(() => alert("Error updating data"));
  };

  const identificationCard = [
    { label: t("ORCID-ID"), value: cardData.orcid, key: "orcid" },
    { label: t("EBK"), value: cardData.ekb, key: "ekb" },
    { label: t("ResearcherID"), value: cardData.researcherId, key: "researcherId" },
    { label: t("ResearchGateProfile"), value: cardData.researcherGate, key: "researcherGate" },
    { label: t("Academia.Eduprofile"), value: cardData.academiaEdu, key: "academiaEdu" },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}>
        <h2 className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}>
          {t("editIdentificationCard")}
          <span className={`block w-16 h-1 bg-[#b38e19] mt-1 ${isArabic ? "ml-auto" : "mr-auto"}`}></span>
        </h2>

        <div className="flex justify-center items-center w-full">
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">
            {identificationCard.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300 
                focus-within:border-[#B38E19] focus-within:ring-2 focus-within:ring-[#B38E19] transition"
              >
                <div className="bg-[#19355a] text-white w-[150px] flex items-center justify-center px-2 text-center">
                  {item.label}
                </div>

                {/* Input with domain only */}
                <input
                  readOnly
                  onClick={() => handleClick(item.value)}
                  value={getDomain(item.value)}
                  className="bg-gray-200 text-black flex-1 px-2 outline-none border-0 text-center cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={`flex gap-3 absolute ${isArabic ? "left-[53px]" : "right-[53px]"} bottom-[28px]`}>
          <button
            onClick={handleSave}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("save")}
          </button>

          <button
            onClick={() => navigate("/identification-card")}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("back")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
