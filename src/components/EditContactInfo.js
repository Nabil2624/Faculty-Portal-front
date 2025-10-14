import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // ✅ use shared axios instance

export default function EditContactInfo() {
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

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/PersonalData/contact-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactData(response.data);
      } catch (error) {
        console.error("❌ Error fetching contact info:", error);
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchContactData();
  }, [navigate]);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle save (PUT request)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        "/PersonalData/contact-data",
        {
          workPhoneNumber: contactData.workPhoneNumber,
          homePhoneNumber: contactData.homePhoneNumber,
          personalEmail: contactData.personalEmail,
          alternativeEmail: contactData.alternativeEmail,
          faxNumber: contactData.faxNumber,
          address: contactData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/contact-info");
    } catch (error) {
      console.error("❌ Error updating contact info:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  const contactInfo = [
    { label: t("officialEmail"), key: "officialEmail", editable: false },
    { label: t("mainMobile"), key: "mainPhoneNumber", editable: false },
    { label: t("fax"), key: "faxNumber", editable: true },
    { label: t("personalEmail"), key: "personalEmail", editable: true },
    { label: t("homePhone"), key: "homePhoneNumber", editable: true },
    { label: t("address"), key: "address", editable: true },
    { label: t("alternativeEmail"), key: "alternativeEmail", editable: true },
    { label: t("workPhone"), key: "workPhoneNumber", editable: true },
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
                <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center px-2 text-center">
                  {item.label}
                </div>

                {/* Input */}
                <input
                  value={contactData[item.key] || ""}
                  onChange={(e) => item.editable && handleChange(item.key, e.target.value)}
                  disabled={!item.editable}
                  className={`bg-gray-200 text-black flex-1 px-2 outline-none border-0 text-center ${
                    !item.editable ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 absolute ${isArabic ? "left-[53px]" : "right-[53px]"} bottom-[28px]`}>
          <button
            onClick={handleSave}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}
          >
            {t("save")}
          </button>
          <button
            onClick={() => navigate("/contact-info")}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm`}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
