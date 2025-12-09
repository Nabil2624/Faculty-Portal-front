import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";


export default function ContactInfo() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("contactinfo");
  const isArabic = i18n.language === "ar";

  const emptyText = isArabic ? "لا يوجد" : "none";

  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  //         FETCH DATA
  // --------------------------------------------------
  const fetchContactData = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/ContactData",
        { skipGlobalErrorHandler: true }
      );

      setContactData(response.data || {});
    } catch (err) {
      console.error("Error fetching contact info:", err);

      if (err.response?.status === 401) {
        navigate("/login");
      }

      setContactData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // if (loading || !contactData)
  //   return (
  //     <Layout>
  //       <div className="p-10 text-center text-lg">{t("loading")}</div>
  //     </Layout>
  //   );
    if (loading) return <LoadingSpinner />;
  // -----------------------------------------
  //         Convert empty → لا يوجد
  // -----------------------------------------
  const getValue = (val) => {
    if (!val || val === "") return emptyText;
    return val;
  };

  // -----------------------------------------
  //             MAP TO GRID
  // -----------------------------------------
  const contactInfo = [
    { label: t("officialEmail"), value: getValue(contactData.officialEmail) },
    { label: t("mainMobile"), value: getValue(contactData.mainPhoneNumber) },
    { label: t("fax"), value: getValue(contactData.faxNumber) },
    { label: t("personalEmail"), value: getValue(contactData.personalEmail) },
    { label: t("homePhone"), value: getValue(contactData.homePhoneNumber) },
    { label: t("address"), value: getValue(contactData.address) },
    { label: t("alternativeEmail"), value: getValue(contactData.alternativeEmail) },
    { label: t("workPhone"), value: getValue(contactData.workPhoneNumber) },
  ];

  // -----------------------------------------
  //                 RENDER (unchanged)
  // -----------------------------------------
  return (
    <Layout>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}
      >
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

        <div className="flex justify-center items-center w-full">
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
