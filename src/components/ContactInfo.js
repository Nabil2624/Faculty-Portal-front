import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function ContactInfo() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("contactinfo");
  const isArabic = i18n.language === "ar";

  // fallback text
  const emptyText = isArabic ? "لا يوجد" : "none";

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

  // **********************************************
  //      FETCH CONTACT DATA FROM BACKEND
  // **********************************************
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(
          "/FacultyMemberData/ContactData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContactData({
          mainPhoneNumber: response.data.mainPhoneNumber || "",
          workPhoneNumber: response.data.workPhoneNumber || "",
          homePhoneNumber: response.data.homePhoneNumber || "",
          officialEmail: response.data.officialEmail || "",
          personalEmail: response.data.personalEmail || "",
          alternativeEmail: response.data.alternativeEmail || "",
          faxNumber: response.data.faxNumber || "",
          address: response.data.address || "",
        });
      } catch (error) {
        console.error("❌ Error fetching contact info:", error);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchContactData();
  }, [navigate, isArabic]);

  // **********************************************
  //         MAP GRID DATA
  // **********************************************
  const contactInfo = [
    { label: t("officialEmail"), value: contactData.officialEmail || emptyText },
    { label: t("mainMobile"), value: contactData.mainPhoneNumber || emptyText },
    { label: t("fax"), value: contactData.faxNumber || emptyText },
    { label: t("personalEmail"), value: contactData.personalEmail || emptyText },
    { label: t("homePhone"), value: contactData.homePhoneNumber || emptyText },
    { label: t("address"), value: contactData.address || emptyText },
    {
      label: t("alternativeEmail"),
      value: contactData.alternativeEmail || emptyText,
    },
    { label: t("workPhone"), value: contactData.workPhoneNumber || emptyText },
  ];

  // **********************************************
  //                  RENDER
  // **********************************************
  return (
    <Layout>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}
      >
        {/* Page title */}
        <h2
          className={`text-3xl font-bold mb-[90px] inline-block relative text-${
            isArabic ? "right" : "left"
          }`}
        >
          {t("contactInfo")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${
              isArabic ? "ml-auto" : "mr-auto"
            }`}
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
                <div className="bg-[#19355a] text-white w-[120px] flex items-center justify-center px-2 text-center">
                  {item.label}
                </div>
                <div className="bg-gray-200 text-black flex-1 flex items-center justify-center px-2 text-center">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex gap-3 absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
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
