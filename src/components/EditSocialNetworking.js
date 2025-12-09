import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function EditSocialNetworking() {
  const { t, i18n } = useTranslation("socialnetworkingpages");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [socialData, setSocialData] = useState({
    linkedIn: "",
    instagram: "",
    personalWebsite: "",
    googleScholar: "",
    scopus: "",
    facebook: "",
    x: "",
    youTube: "",
  });

  // -------------------------------------------------------
  // Convert URL → Display Name (Instagram → "Instagram")
  // -------------------------------------------------------
  const simplifyURL = (url) => {
    if (!url || url.trim() === "") return isArabic ? "لا يوجد" : "None";

    const lower = url.toLowerCase();

    if (lower.includes("instagram")) return "Instagram";
    if (lower.includes("linkedin")) return "LinkedIn";
    if (lower.includes("facebook")) return "Facebook";
    if (lower.includes("youtube")) return "YouTube";
    if (lower.includes("scholar.google")) return "Google Scholar";
    if (lower.includes("scopus")) return "Scopus";
    if (lower.includes("x.com") || lower.includes("twitter")) return "X";
    if (lower.includes("http") || lower.includes("www")) return "Website";

    return url;
  };

  // -------------------------------------------------------
  // Fetch social media data
  // -------------------------------------------------------
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(
          "/FacultyMemberData/SocialMediaPlatforms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSocialData(response.data);
      } catch (error) {
        console.error("Error fetching social media:", error);
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchSocialMedia();
  }, [navigate]);

  // -------------------------------------------------------
  // Handle change
  // -------------------------------------------------------
  const handleChange = (field, value) => {
    setSocialData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -------------------------------------------------------
  // Save changes (PUT)
  // -------------------------------------------------------
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.put(
        "/FacultyMemberData/UpdateSocialMediaPlatforms",
        socialData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/social-networking");
    } catch (error) {
      console.error("Error updating social media:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  // -------------------------------------------------------
  // Labels mapped to backend keys
  // -------------------------------------------------------
  const socialNetworkingPages = [
    { label: t("PersonalWebsite"), key: "personalWebsite" },
    { label: t("Facebook"), key: "facebook" },
    { label: t("Twitter"), key: "x" },
    { label: t("GoogleScholar"), key: "googleScholar" },
    { label: t("LinkedIn"), key: "linkedIn" },
    { label: t("Scopus"), key: "scopus" },
    { label: t("Instagram"), key: "instagram" },
    { label: t("YouTube"), key: "youTube" },
  ];

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
          {t("editsocialNetworkingPages")}
          <span
            className={`block w-16 h-1 bg-[#b38e19] mt-1 ${
              isArabic ? "ml-auto" : "mr-auto"
            }`}
          ></span>
        </h2>

        {/* Editable grid */}
        <div className="flex justify-center items-center w-full" style={{ flexGrow: 0 }}>
          <div className="grid grid-cols-3 gap-7 max-w-[1250px] w-full">
            {socialNetworkingPages.map((item, index) => (
              <div
                key={index}
                className={`flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300
                focus-within:border-[#B38E19] text-center focus-within:ring-2 focus-within:ring-[#B38E19] transition duration-150`}
              >
                {/* Label */}
                <div className="bg-[#19355a] text-center text-white w-[120px] flex items-center justify-center px-2">
                  {item.label}
                </div>

                {/* Input (but shows simplified value visually) */}
                <input
                  value={simplifyURL(socialData[item.key])}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className={`bg-gray-200 text-black flex-1 px-2 outline-none border-0 text-center`}
                />

                {/* Hidden real link click */}
                {socialData[item.key] && (
                  <a
                    href={socialData[item.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  ></a>
                )}
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
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("save")}
          </button>
          <button
            onClick={() => navigate("/social-networking")}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
