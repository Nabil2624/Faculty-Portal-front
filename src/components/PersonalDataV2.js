import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import subPicture from "../assets/profileImage.png";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function PersonalDataV2() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation([
    "PersonalData",
    "contactinfo",
    "socialnetworkingpages",
    "identification",
  ]);
  const isArabic = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("personal");
  const [personalData, setPersonalData] = useState({});
  const [contactData, setContactData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [identificationData, setIdentificationData] = useState({});
  const [loading, setLoading] = useState(true);

  const emptyText = isArabic ? "لا يوجد" : "none";

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchPersonal = async () => {
    try {
      const res = await axiosInstance.get("/FacultyMemberData/PersonalData", {
        skipGlobalErrorHandler: true,
      });
      setPersonalData(res.data || {});
    } catch (err) {
      if (err.response?.status === 404) setPersonalData({});
      else console.error(err);
    }
  };

  const fetchContact = async () => {
    try {
      const res = await axiosInstance.get("/FacultyMemberData/ContactData", {
        skipGlobalErrorHandler: true,
      });
      setContactData(res.data || {});
    } catch (err) {
      if (err.response?.status === 404) setContactData({});
      else console.error(err);
    }
  };

  const fetchSocial = async () => {
    try {
      const res = await axiosInstance.get(
        "/FacultyMemberData/SocialMediaPlatforms",
        { skipGlobalErrorHandler: true },
      );
      setSocialData(res.data || {});
    } catch (err) {
      if (err.response?.status === 404) setSocialData({});
      else console.error(err);
    }
  };

  const fetchIdentification = async () => {
    try {
      const res = await axiosInstance.get(
        "/FacultyMemberData/IdentificationCard",
        { skipGlobalErrorHandler: true },
      );
      setIdentificationData(res.data || {});
    } catch (err) {
      if (err.response?.status === 404) setIdentificationData({});
      else console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPersonal();
      await fetchContact();
      await fetchSocial();
      await fetchIdentification();
      setLoading(false);
    };
    loadData();
  }, []);

  // ---------------- HELPERS ----------------
  const getValue = (val) => {
    if (!val || val === "") return emptyText;
    if (typeof val === "string") return val;
    return isArabic ? val.valueAr || emptyText : val.valueEn || emptyText;
  };

  const getDomain = (url) => {
    if (!url) return "";
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const isURL = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) return <LoadingSpinner />;

  // ---------------- PERSONAL ----------------
  const personalInfo = [
    { label: t("name", { ns: "PersonalData" }), value: getValue(personalData?.name) },
    { label: t("nationalNumber", { ns: "PersonalData" }), value: getValue(personalData?.nationalNumber) },
    { label: t("gender", { ns: "PersonalData" }), value: getValue(personalData?.gender) },
    { label: t("maritalStatus", { ns: "PersonalData" }), value: getValue(personalData?.maritalStatus) },
    { label: t("birthDate", { ns: "PersonalData" }), value: getValue(personalData?.birthDate) },
    { label: t("birthPlace", { ns: "PersonalData" }), value: getValue(personalData?.birthPlace) },
  ];

  const workInfo = [
    { label: t("title", { ns: "PersonalData" }), value: getValue(personalData?.title) },
    { label: t("university", { ns: "PersonalData" }), value: getValue(personalData?.university) },
    { label: t("department", { ns: "PersonalData" }), value: getValue(personalData?.department) },
    { label: t("authority", { ns: "PersonalData" }), value: getValue(personalData?.authority) },
    { label: t("field", { ns: "PersonalData" }), value: getValue(personalData?.field) },
    { label: t("generalSpecialization", { ns: "PersonalData" }), value: getValue(personalData?.generalSpecialization) },
    { label: t("exactSpecialization", { ns: "PersonalData" }), value: getValue(personalData?.accurateSpecialization) },
  ];

  const maxLength = Math.max(personalInfo.length, workInfo.length);
  const personalRows = Array.from({ length: maxLength }, (_, i) => ({
    left: personalInfo[i] || { label: "", value: "" },
    right: workInfo[i] || { label: "", value: "" },
  }));

  // ---------------- CONTACT ----------------
  const contactInfo = [
    { label: t("officialEmail", { ns: "contactinfo" }), value: getValue(contactData?.officialEmail) },
    { label: t("mainMobile", { ns: "contactinfo" }), value: getValue(contactData?.mainPhoneNumber) },
    { label: t("fax", { ns: "contactinfo" }), value: getValue(contactData?.faxNumber) },
    { label: t("personalEmail", { ns: "contactinfo" }), value: getValue(contactData?.personalEmail) },
    { label: t("homePhone", { ns: "contactinfo" }), value: getValue(contactData?.homePhoneNumber) },
    { label: t("address", { ns: "contactinfo" }), value: getValue(contactData?.address) },
    { label: t("alternativeEmail", { ns: "contactinfo" }), value: getValue(contactData?.alternativeEmail) },
    { label: t("workPhone", { ns: "contactinfo" }), value: getValue(contactData?.workPhoneNumber) },
  ];

  const contactRows = [];
  for (let i = 0; i < contactInfo.length; i += 2) {
    contactRows.push({ left: contactInfo[i], right: contactInfo[i + 1] || { label: "", value: "" } });
  }

  // ---------------- SOCIAL ----------------
  const socialInfo = [
    { label: t("PersonalWebsite", { ns: "socialnetworkingpages" }), value: socialData.personalWebsite },
    { label: t("Facebook", { ns: "socialnetworkingpages" }), value: socialData.facebook },
    { label: t("X/Twitter", { ns: "socialnetworkingpages" }), value: socialData.x },
    { label: t("GoogleScholar", { ns: "socialnetworkingpages" }), value: socialData.googleScholar },
    { label: t("LinkedIn", { ns: "socialnetworkingpages" }), value: socialData.linkedIn },
    { label: t("Scopus", { ns: "socialnetworkingpages" }), value: socialData.scopus },
    { label: t("Instagram", { ns: "socialnetworkingpages" }), value: socialData.instagram },
    { label: t("YouTube", { ns: "socialnetworkingpages" }), value: socialData.youTube },
  ];

  const socialRows = [];
  for (let i = 0; i < socialInfo.length; i += 2) {
    socialRows.push({
      left: socialInfo[i],
      right: socialInfo[i + 1] || { label: "", value: "" },
    });
  }

  // ---------------- IDENTIFICATION ----------------
  const identificationInfoColOne = [
    { label: t("ORCID-ID", { ns: "identification" }), value: identificationData?.orcid },
    { label: t("ResearchGateProfile", { ns: "identification" }), value: identificationData?.researcherGate },
    { label: t("Academia.Eduprofile", { ns: "identification" }), value: identificationData?.academiaEdu },
  ];
  const identificationInfoColTwo = [
    { label: t("ResearcherID", { ns: "identification" }), value: identificationData?.researcherId },
    { label: t("EBK", { ns: "identification" }), value: identificationData?.ekb },
  ];

  // ---------------- RENDER ----------------
  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-2`}>
        {/* TITLE + TABS */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl font-bold">
            {t("personalData", { ns: "PersonalData" })}
            <span className="block w-16 h-1 bg-[#b38e19] mt-2"></span>
          </h2>

          <div className="flex gap-6">
            {["personal", "contact", "social", "identification"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 font-semibold ${activeTab === tab ? "text-[#b38e19]" : "text-gray-500"}`}
              >
                {tab === "personal"
                  ? t("personalData", { ns: "PersonalData" })
                  : tab === "contact"
                    ? t("contactInfo", { ns: "contactinfo" })
                    : tab === "social"
                      ? t("socialNetworkingPages", { ns: "socialnetworkingpages" })
                      : t("IdentificationCard", { ns: "identification" })}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b38e19]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col lg:flex-row gap-8">
          {/* PROFILE */}
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#b38e19]">
              <img src={subPicture} alt="profile" className="w-full h-full object-cover" />
            </div>
            <h6 className="font-bold mt-4 text-center text-lg">
              {getValue(personalData?.title)} {getValue(personalData?.name)}
            </h6>
            <button
              onClick={() => {
                const path =
                  activeTab === "personal"
                    ? "/editpersonal"
                    : activeTab === "contact"
                      ? "/edit-contact-info"
                      : activeTab === "social"
                        ? "/edit-Social"
                        : "/edit-identification-card";
                navigate(path);
              }}
              className="mt-6 bg-[#b38e19] text-white px-6 py-2 rounded-md hover:opacity-90"
            >
              {t("edit", {
                ns:
                  activeTab === "personal"
                    ? "PersonalData"
                    : activeTab === "contact"
                      ? "contactinfo"
                      : activeTab === "social"
                        ? "socialnetworkingpages"
                        : "identification",
              })}
            </button>
          </div>

          {/* TABLE */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: isArabic ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isArabic ? 15 : -15 }}
                transition={{ duration: 0.25 }}
                className="rounded-lg overflow-hidden border"
              >
                {(activeTab === "personal"
                  ? personalRows
                  : activeTab === "contact"
                    ? contactRows
                    : activeTab === "social"
                      ? socialRows
                      : null
                )?.map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="px-4 py-3 font-semibold bg-gray-200">{row.left?.label}</div>
                    {activeTab === "social" ? (
                      <div
                        className="px-4 py-3 cursor-pointer text-black"
                        onClick={() =>
                          row.left?.value &&
                          isURL(row.left.value) &&
                          window.open(row.left.value, "_blank")
                        }
                      >
                        {getValue(row.left?.value)}
                      </div>
                    ) : (
                      <div className="px-4 py-3">{row.left?.value}</div>
                    )}

                    <div className="px-4 py-3 font-semibold bg-gray-200">{row.right?.label}</div>
                    {activeTab === "social" ? (
                      <div
                        className="px-4 py-3 cursor-pointer text-black"
                        onClick={() =>
                          row.right?.value &&
                          isURL(row.right.value) &&
                          window.open(row.right.value, "_blank")
                        }
                      >
                        {getValue(row.right?.value)}
                      </div>
                    ) : (
                      <div className="px-4 py-3">{row.right?.value}</div>
                    )}
                  </div>
                ))}

                {/* Composition فقط في personal */}
                {activeTab === "personal" && personalData?.compositionTopics && (
                  <div className="mt-6">
                    <label className="font-semibold block mb-2">{t("compositionTopicTitle")}</label>
                    <div className="border rounded-md bg-gray-50 p-3 min-h-[120px] whitespace-pre-wrap">
                      {getValue(personalData?.compositionTopics) || t("none")}
                    </div>
                  </div>
                )}

                {/* ---------------- Identification ---------------- */}
                {activeTab === "identification" && (
                  <div className="rounded-lg overflow-hidden border">
                    {(() => {
                      const allItems = [...identificationInfoColOne, ...identificationInfoColTwo];
                      return allItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-2 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                          <div className="px-4 py-3 font-semibold bg-gray-200">{item.label || ""}</div>
                          <div
                            className="px-4 py-3 cursor-pointer text-black"
                            onClick={() =>
                              item.value && isURL(item.value) && window.open(item.value, "_blank")
                            }
                          >
                            {item.value ? getDomain(item.value) : emptyText}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}