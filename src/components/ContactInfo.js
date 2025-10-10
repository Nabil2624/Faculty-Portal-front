import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // ✅ your pre-configured axios instance

export default function ContactInfo() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("contactinfo");
  const isArabic = i18n.language === "ar";

  const [contactData, setContactData] = useState({
    mainPhoneNumber: "",
    workPhoneNumber: "",
    homePhoneNumber: "",
    officialEmail: "",
    personalEmail: "",
    alternativeEmail: "",
    faxNumber: "",
    address: "",
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Token injection
        const response = await axiosInstance.get("/PersonalData/contact-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactData(response.data);
      } catch (error) {
        console.error("❌ Error fetching contact info:", error);
        if (error.response?.status === 401) {
          navigate("/login"); // ✅ Redirect to login if token expired
        }
      }
    };

    fetchContactData();
  }, [navigate]);

  const contactInfo = [
    { label: t("officialEmail"), value: contactData.officialEmail || "—" },
    { label: t("mainMobile"), value: contactData.mainPhoneNumber || "—" },
    { label: t("fax"), value: contactData.faxNumber || "—" },
    { label: t("personalEmail"), value: contactData.personalEmail || "—" },
    { label: t("homePhone"), value: contactData.homePhoneNumber || "—" },
    { label: t("address"), value: contactData.address || "—" },
    { label: t("alternativeEmail"), value: contactData.alternativeEmail || "—" },
    { label: t("workPhone"), value: contactData.workPhoneNumber || "—" },
  ];

  return (
    <Layout>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}
      >
        {/* Page title */}
        <h2
          className={`text-3xl font-bold mb-[90px] inline-block relative text-${isArabic ? "right" : "left"}`}
        >
          {t("contactInfo")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${isArabic ? "ml-auto" : "mr-auto"}`}
          ></span>
        </h2>

        {/* Personal info grid */}
        <div
          className="flex justify-center items-center w-full"
          style={{ flexGrow: 0 }}
        >
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm"
              >
                <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center  px-2 text-center">
                  {item.label}
                </div>
                <div className="bg-gray-200 text-black flex-1 flex items-center justify-center px-2 text-center">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons at bottom-left (Arabic) or bottom-right (English) */}
        <div
          className={`flex gap-3 absolute ${isArabic ? "left-[53px]" : "right-[53px]"} bottom-[52px]`}
        >
          <button
            onClick={() => navigate("/edit-contact-info")}
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
    </Layout>
  );
}
