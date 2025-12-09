import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

// ------------------------------------------------------
// Extract domain
// ------------------------------------------------------
const getDomain = (value) => {
  if (!value) return "";
  try {
    return new URL(value).hostname.replace("www.", "");
  } catch {
    return value;
  }
};

// ------------------------------------------------------
// URL detection
// ------------------------------------------------------
const isURL = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default function EditIdentificationCard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("identification");
  const isArabic = i18n.language === "ar";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const noData = isArabic ? "لا يوجد" : "none";

  // ------------------------------------------------------
  // FETCH IDENTIFICATION CARDS
  // ------------------------------------------------------
  const fetchIdentification = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        "/FacultyMemberData/IdentificationCard",
        { skipGlobalErrorHandler: true }
      );

      setData(res.data || {});
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
      }

      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentification();
  }, []);

  // ------------------------------------------------------
  // SAVE
  // ------------------------------------------------------
  const handleSave = async () => {
    try {
      await axiosInstance.put(
        "/FacultyMemberData/UpdateIdentificationCard",
        data
      );
      navigate("/identification-card");
    } catch (err) {
      console.error(err);
      alert("Error updating data");
    }
  };

  // ------------------------------------------------------
  // HANDLE TYPING
  // ------------------------------------------------------
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ------------------------------------------------------
  // SHOW NONE / لا يوجد in inputs
  // ------------------------------------------------------
  const showValue = (value) => {
    if (!value || value.trim() === "") return noData;
    return value;
  };

  const cleanValue = (value) => {
    if (value === noData) return "";
    return value;
  };

  // ------------------------------------------------------
  // Loading
  // ------------------------------------------------------
  if (loading || data === null) {
    return <LoadingSpinner />;
  }

  const identificationCard = [
    { label: t("ORCID-ID"), key: "orcid" },
    { label: t("EBK"), key: "ekb" },
    { label: t("ResearcherID"), key: "researcherId" },
    { label: t("ResearchGateProfile"), key: "researcherGate" },
    { label: t("Academia.Eduprofile"), key: "academiaEdu" }
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col w-full box-border`}>

        {/* Title */}
        <h2
          className={`text-3xl font-bold mb-[90px] inline-block relative text-${
            isArabic ? "right" : "left"
          }`}
        >
          {t("editIdentificationCard")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${
              isArabic ? "ml-auto" : "mr-auto"
            }`}
          ></span>
        </h2>

        {/* Grid */}
        <div className="flex justify-center items-center w-full">
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">

            {identificationCard.map((item, index) => (
              <div
                key={index}
                className="flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300 
                focus-within:border-[#B38E19] focus-within:ring-2 focus-within:ring-[#B38E19]
                transition"
              >

                {/* Label */}
                <div className="bg-[#19355a] text-white w-[150px] flex items-center justify-center px-2 text-center">
                  {item.label}
                </div>

                {/* Input */}
                <input
                  value={showValue(data[item.key])}
                  onChange={(e) =>
                    handleChange(item.key, cleanValue(e.target.value))
                  }
                  className="bg-gray-200 text-black flex-1 px-2 outline-none border-0 text-center"
                />

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
            onClick={handleSave}
            className="bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("save")}
          </button>

          <button
            onClick={() => navigate("/identification-card")}
            className="bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("back")}
          </button>
        </div>

      </div>
    </Layout>
  );
}
