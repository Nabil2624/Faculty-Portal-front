import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function EditContactInfo() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("contactinfo");
  const isArabic = i18n.language === "ar";

  const contactInfo = [
    { label: t("officialEmail"), value: "Email01@gmail.com" },
    { label: t("mainMobile"), value: "01XXXXXXXX" },    
    { label: t("fax"), value: "لا يوجد" },
    { label: t("personalEmail"), value: "Email02@gmail.com" },
    { label: t("homePhone"), value: "02XXXXXXXX" },
    { label: t("address"), value: "العاشر" },    
    { label: t("alternativeEmail"), value: "لا يوجد" },
    { label: t("workPhone"), value: "02XXXXXXXX" },


  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}>
        {/* Page title */}
        <h2 className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}>
          {t("contactInfo")}
          <span className={`block w-16 h-1 bg-[#b38e19] mt-1 ${isArabic ? "ml-auto" : "mr-auto"}`}></span>
        </h2>

        {/* Grid */}
        <div className="flex justify-center items-center w-full">
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300 
                  focus-within:border-[#B38E19] focus-within:ring-2 focus-within:ring-[#B38E19] transition"
              >
                {/* Label */}
                <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center font-bold px-2">
                  {item.label}
                </div>
                {/* Input */}
                <input
                  defaultValue={item.value}
                  className="bg-gray-200 text-black flex-1 px-2 outline-none border-0 text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 absolute ${isArabic ? "left-[53px]" : "right-[53px]"} bottom-[52px]`}>
          <button 
          onClick={()=>navigate("/contact-info")}
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}>
            {t("save")}
          </button>
          <button
          onClick={()=>navigate("/contact-info")} 
          className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
