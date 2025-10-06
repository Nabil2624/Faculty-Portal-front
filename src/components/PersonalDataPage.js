import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../images/profileImage.png";
import { useNavigate } from "react-router-dom";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const personalInfo = [
    { label: t("title"), value: "أ.د" },
    { label: t("university"), value: "جامعة حلوان" },
    { label: t("birthDate"), value: "26/11/2026" },
    { label: t("name"), value: "احمد هشام محمد" },
    { label: t("department"), value: "هندسة البرمجيات" },
    { label: t("college"), value: "كلية الحاسبات والذكاء الاصطناعي" },    
    { label: t("nationalId"), value: "30XXXXXXXXXXX" },
    { label: t("generalSpecialization"), value: "هندسة البرمجيات" }, 
    { label: t("field"), value: "مجال علوم الحاسبات" },       
    { label: t("gender"), value: "ذكر" },
    { label: t("roles"), value: "لا يوجد" },       
    { label: t("exactSpecialization"), value: "مهندس حوسبة سحابية" },   
    { label: t("birthPlace"), value: "القاهرة، مصر" },     
    { label: t("maritalStatus"), value: "أعزب" },
    { label: t("positions"), value: "لا يوجد" },

  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col`}>
        {/* Page title */}
        <h2 className="text-3xl font-bold mb-6 inline-block relative text-start mb-[80px]">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {/* Main content */}
        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-20">
          {/* Profile photo + buttons */}
          <div className="flex flex-col items-center gap-[100px]">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={subPicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Buttons under the photo */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate("/editpersonal")}
                className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("edit")}
              </button>
              <button
                onClick={() => navigate(-1)}
                className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("back")}
              </button>
            </div>
          </div>

          {/* Personal info */}
          <div className="flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4 ml-10">
            {/* Info grid */}
            <div className="grid grid-cols-3 gap-5">
              {personalInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex h-[40px] rounded-md overflow-hidden text-sm"
                >
                  <div className="bg-[#19355a] text-white w-32 flex items-center justify-center font-bold px-2">
                    {item.label}
                  </div>
                  <div className="bg-gray-200 text-black flex-1 flex items-center justify-center px-2">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
