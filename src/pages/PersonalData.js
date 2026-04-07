import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import subPicture from "../assets/prof.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import usePersonalData from "../hooks/usePersonalData";
import axiosInstance from "../utils/axiosInstance";

export default function PersonalData() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation([
    "PersonalData",
    "contactinfo",
    "socialnetworkingpages",
    "identification",
  ]);
  const isArabic = i18n.language === "ar";

  const { personalData, contactData, socialData, identificationData, loading } =
    usePersonalData();

  const [activeTab, setActiveTab] = useState("personal");
  const [profileImg, setProfileImg] = useState(subPicture);

  const emptyText = isArabic ? "لا يوجد" : "none";

  // ---------------- LOAD PROFILE IMAGE USING axiosInstance ----------------
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        if (personalData?.profilePicture?.id) {
          const url = `/Attachments/${personalData.id}/${personalData.profilePicture.id}?context=3`;
          const response = await axiosInstance.get(url, {
            responseType: "blob",
          });
          const imageBlob = response.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImg(imageUrl);
        } else {
          setProfileImg(subPicture);
        }
      } catch (err) {
        console.error("Error loading profile image:", err);
        setProfileImg(subPicture);
      }
    };
    loadProfileImage();
  }, [personalData]);

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

  const labelClass = `px-4 py-3 font-semibold bg-gray-200 text-[clamp(0.8rem,1vw,2rem)]`;
  const valueClass = `px-4 py-3 text-[clamp(0.8rem,1vw,2rem)]`;

  const mapRows = (arr) => {
    const rows = [];
    for (let i = 0; i < arr.length; i += 2) {
      rows.push({ left: arr[i], right: arr[i + 1] || null });
    }
    return rows;
  };

  // ---------------- DATA ----------------
  const personalInfo = [
    {
      label: t("title", { ns: "PersonalData" }),
      value: getValue(personalData?.title),
    },
    {
      label: t("nameEn", { ns: "PersonalData" }),
      value: getValue(personalData?.nameEn),
    },
    {
      label: t("nameAr", { ns: "PersonalData" }),
      value: getValue(personalData?.nameAr),
    },

    {
      label: t("nationalNumber", { ns: "PersonalData" }),
      value: getValue(personalData?.nationalNumber),
    },
    {
      label: t("gender", { ns: "PersonalData" }),
      value: getValue(personalData?.gender),
    },
    {
      label: t("maritalStatus", { ns: "PersonalData" }),
      value: getValue(personalData?.maritalStatus),
    },
    {
      label: t("birthDate", { ns: "PersonalData" }),
      value: getValue(personalData?.birthDate),
    },
  ];

  const workInfo = [
    {
      label: t("birthPlace", { ns: "PersonalData" }),
      value: getValue(personalData?.birthPlace),
    },
    {
      label: t("university", { ns: "PersonalData" }),
      value: getValue(personalData?.university),
    },
    {
      label: t("department", { ns: "PersonalData" }),
      value: getValue(personalData?.department),
    },
    {
      label: t("authority", { ns: "PersonalData" }),
      value: getValue(personalData?.authority),
    },
    {
      label: t("field", { ns: "PersonalData" }),
      value: getValue(personalData?.field),
    },
    {
      label: t("generalSpecialization", { ns: "PersonalData" }),
      value: getValue(personalData?.generalSpecialization),
    },
    {
      label: t("exactSpecialization", { ns: "PersonalData" }),
      value: getValue(personalData?.accurateSpecialization),
    },
  ];

  const personalRows = Array.from(
    { length: Math.max(personalInfo.length, workInfo.length) },
    (_, i) => ({ left: personalInfo[i] || null, right: workInfo[i] || null }),
  );

  const contactRows = mapRows([
    {
      label: t("officialEmail", { ns: "contactinfo" }),
      value: getValue(contactData?.officialEmail),
    },
    {
      label: t("mainMobile", { ns: "contactinfo" }),
      value: getValue(contactData?.mainPhoneNumber),
    },
    {
      label: t("fax", { ns: "contactinfo" }),
      value: getValue(contactData?.faxNumber),
    },
    {
      label: t("personalEmail", { ns: "contactinfo" }),
      value: getValue(contactData?.personalEmail),
    },
    {
      label: t("homePhone", { ns: "contactinfo" }),
      value: getValue(contactData?.homePhoneNumber),
    },
    {
      label: t("address", { ns: "contactinfo" }),
      value: getValue(contactData?.address),
    },
    {
      label: t("alternativeEmail", { ns: "contactinfo" }),
      value: getValue(contactData?.alternativeEmail),
    },
    {
      label: t("workPhone", { ns: "contactinfo" }),
      value: getValue(contactData?.workPhoneNumber),
    },
  ]);

  const socialRows = mapRows([
    {
      label: t("PersonalWebsite", { ns: "socialnetworkingpages" }),
      value: socialData.personalWebsite,
    },
    {
      label: t("Facebook", { ns: "socialnetworkingpages" }),
      value: socialData.facebook,
    },
    {
      label: t("X/Twitter", { ns: "socialnetworkingpages" }),
      value: socialData.x,
    },

    {
      label: t("Instagram", { ns: "socialnetworkingpages" }),
      value: socialData.instagram,
    },
    {
      label: t("LinkedIn", { ns: "socialnetworkingpages" }),
      value: identificationData.linkedIn,
    },
    {
      label: t("YouTube Channel", { ns: "socialnetworkingpages" }),
      value: socialData.youTube,
    },
  ]);

  const identificationList = [
    {
      label: t("ORCID-ID", { ns: "identification" }),
      value: identificationData?.orcid,
    },
    {
      label: t("ResearchGateProfile", { ns: "identification" }),
      value: identificationData?.researcherGate,
    },
    {
      label: t("Academia.Eduprofile", { ns: "identification" }),
      value: identificationData?.academiaEdu,
    },
    {
      label: t("ResearcherID", { ns: "identification" }),
      value: identificationData?.researcherId,
    },

    {
      label: t("Scopus", { ns: "socialnetworkingpages" }),
      value: identificationData.scopus,
    },
    {
      label: t("GoogleScholar", { ns: "socialnetworkingpages" }),
      value: socialData.googleScholar,
    },
    {
      label: t("EBK", { ns: "identification" }),
      value: identificationData?.ekb,
    },
  ];
  const name = isArabic
    ? getValue(personalData?.nameAr)
    : getValue(personalData?.nameEn);
  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-2`}>
        {/* TITLE + TABS */}
        <div className="flex justify-between items-end mb-4 flex-wrap gap-2 ">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold">
            {t("personalData", { ns: "PersonalData" })}
            <span className="block w-16 h-1 bg-[#b38e19] mt-2"></span>
          </h2>

          <div className="flex gap-4 overflow-x-auto px-5">
            {["personal", "contact", "social", "identification"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 font-semibold flex-shrink-0 text-[clamp(0.9rem,1vw,1.1rem)] ${
                  activeTab === tab ? "text-[#b38e19]" : "text-gray-500"
                }`}
              >
                {tab === "personal"
                  ? t("personalData", { ns: "PersonalData" })
                  : tab === "contact"
                    ? t("contactInfo", { ns: "contactinfo" })
                    : tab === "social"
                      ? t("socialNetworkingPages", {
                          ns: "socialnetworkingpages",
                        })
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
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col lg:flex-row gap-8">
          {/* PROFILE */}
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="w-[clamp(120px,12vw,180px)] h-[clamp(120px,12vw,180px)] rounded-full overflow-hidden border-2 border-[#b38e19]">
              <img
                src={profileImg}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h6 className="font-bold mt-4 text-center text-[clamp(1rem,1.2vw,1.3rem)]">
              {getValue(personalData?.title)} {name}
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
              className="mt-6 bg-[#b38e19] text-white px-6 py-2 rounded-md hover:opacity-90 text-[clamp(0.85rem,1vw,1rem)]"
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

          {/* TABLE AREA */}
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
                {activeTab === "identification"
                  ? identificationList.map((item, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <div className={labelClass}>{item.label}</div>
                        <div
                          className={`${valueClass} cursor-pointer text-black hover:text-[#b38e19] transition-colors`}
                          onClick={() =>
                            item.value &&
                            isURL(item.value) &&
                            window.open(item.value, "_blank")
                          }
                        >
                          {item.value ? getDomain(item.value) : emptyText}
                        </div>
                      </div>
                    ))
                  : (activeTab === "personal"
                      ? personalRows
                      : activeTab === "contact"
                        ? contactRows
                        : socialRows
                    ).map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-2 sm:grid-cols-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        {/* LEFT SIDE */}
                        {row.left ? (
                          <>
                            <div className={labelClass}>{row.left.label}</div>
                            <div
                              className={`${valueClass} ${
                                activeTab === "social"
                                  ? "cursor-pointer text-black hover:text-[#b38e19] transition-colors"
                                  : ""
                              }`}
                              onClick={() =>
                                activeTab === "social" &&
                                row.left?.value &&
                                isURL(row.left.value) &&
                                window.open(row.left.value, "_blank")
                              }
                            >
                              {getValue(row.left.value)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="hidden sm:block"></div>
                            <div className="hidden sm:block"></div>
                          </>
                        )}

                        {/* RIGHT SIDE */}
                        {row.right ? (
                          <>
                            <div className={labelClass}>{row.right.label}</div>
                            <div
                              className={`${valueClass} ${
                                activeTab === "social"
                                  ? "cursor-pointer text-black hover:text-[#b38e19] transition-colors"
                                  : ""
                              }`}
                              onClick={() =>
                                activeTab === "social" &&
                                row.right?.value &&
                                isURL(row.right.value) &&
                                window.open(row.right.value, "_blank")
                              }
                            >
                              {getValue(row.right.value)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="hidden sm:block"></div>
                            <div className="hidden sm:block"></div>
                          </>
                        )}
                      </div>
                    ))}

                {activeTab === "personal" &&
                  personalData?.compositionTopics && (
                    <div className="p-4 bg-white border-t">
                      <label className="font-semibold block mb-2 text-[clamp(0.8rem,1vw,2rem)]">
                        {t("compositionTopicTitle", { ns: "PersonalData" })}
                      </label>
                      <div className="border rounded-md bg-gray-50 p-3 min-h-[120px] whitespace-pre-wrap text-[clamp(0.8rem,1vw,1.3rem)]">
                        {getValue(personalData?.compositionTopics)}
                      </div>
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
