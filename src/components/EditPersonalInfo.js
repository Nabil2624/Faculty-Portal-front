import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../assets/profile.jpg";
import { FiUpload, FiCalendar } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function EditPersonalInfo() {
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const navigate = useNavigate();
  const location = useLocation();

  const routerData = location.state;

  const [personalInfo, setPersonalInfo] = useState({});
  const [profileImage, setProfileImage] = useState(subPicture);
  const [loading, setLoading] = useState(true);

  const dateInputRef = useRef(null);

  // ----------------------------------------------------------
  // SIMPLE NONE CHECK
  // ----------------------------------------------------------
  const showValue = (value) => {
    if (!value || value === "") return t("none");
    return value;
  };

  // ----------------------------------------------------------
  // OBJECT FIELD TRANSLATION
  // ----------------------------------------------------------
  const getTranslated = (obj) => {
    if (!obj) return t("none");
    return isArabic ? obj.valueAr || t("none") : obj.valueEn || t("none");
  };

  // ----------------------------------------------------------
  // LOAD DATA (MATCH PERSONAL DATA PAGE)
  // ----------------------------------------------------------
  useEffect(() => {
    if (routerData) {
      setPersonalInfo({ ...routerData });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/FacultyMemberData/PersonalData", {
          skipGlobalErrorHandler: true,
        });

        setPersonalInfo(res.data || {});
      } catch (err) {
        console.error("Failed to load personal data:", err);
        setPersonalInfo({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [routerData, isArabic]);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------
  const handleChange = (key, value) => {
    setPersonalInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const openDatePicker = () => {
    if (!dateInputRef.current) return;

    if (dateInputRef.current.showPicker) {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current.focus();
    }
  };

  // ----------------------------------------------------------
  // SAVE (UPDATED TO MATCH PERSONALDATAPAGE)
  // ----------------------------------------------------------
  const handleSave = async () => {
    try {
      await axiosInstance.put(
        "/FacultyMemberData/UpdatePersonalData",
        personalInfo,
        { skipGlobalErrorHandler: true },
      );

      navigate("/personal");
    } catch (err) {
      console.error("Failed to update personal data:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-xl font-semibold text-[#19355a]">
          {t("loading")}...
        </div>
      </Layout>
    );
  }

  // ----------------------------------------------------------
  // OBJECT FIELD NAMES
  // ----------------------------------------------------------
  const objectFields = [
    "title",
    "gender",
    "maritalStatus",
    "university",
    "department",
    "authority",
    "field",
  ];

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <Layout>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { display:none; }
      `}</style>

      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col`}>
        <h2 className="text-3xl font-bold mb-20">
          {t("editPersonalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-20">
          {/* IMAGE ------------------------------------------------ */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden">
              <img src={profileImage} className="w-full h-full object-cover" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#19355a] text-white px-4 py-2 rounded-md">
              <FiUpload />
              {t("uploadPhoto")}
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* BUTTONS ------------------------------------------------ */}
          <div
            className={`flex gap-3 mt-6 absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              className="bg-[#b38e19] text-white w-24 h-10 rounded-md"
              onClick={handleSave}
            >
              {t("save")}
            </button>

            <button
              className="bg-gray-300 w-24 h-10 rounded-md"
              onClick={() => navigate("/personal")}
            >
              {t("cancel")}
            </button>
          </div>

          {/* FIELDS ------------------------------------------------ */}
          <div className="flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-5">
              {[
                "name",
                "nationalNumber",
                "title",
                "gender",
                "maritalStatus",
                "university",
                "department",
                "authority",
                "field",
                "generalSpecialization",
                "accurateSpecialization",
                "birthDate",
                "birthPlace",
                "nameInComposition",
              ].map((key) => (
                <div
                  key={key}
                  className="flex h-[40px] rounded-md overflow-hidden border border-gray-300"
                >
                  <label className="bg-[#19355a] text-white w-32 flex items-center justify-center">
                    {t(key)}
                  </label>

                  {key === "birthDate" ? (
                    <div className="relative flex-1 flex items-center bg-gray-200">
                      <FiCalendar
                        onClick={openDatePicker}
                        size={18}
                        className={`cursor-pointer absolute text-[#B38E19] ${
                          isArabic ? "left-3" : "right-3"
                        }`}
                      />
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={personalInfo[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full text-center bg-gray-200 outline-none"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={
                        objectFields.includes(key)
                          ? isArabic
                            ? personalInfo[key]?.valueAr || ""
                            : personalInfo[key]?.valueEn || ""
                          : personalInfo[key] || ""
                      }
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={key === "nationalNumber" || key === "gender"}
                      className={`flex-1 px-2 text-center outline-none ${
                        key === "nationalNumber" || key === "gender"
                          ? "bg-gray-100 cursor-not-allowed text-gray-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* COMPOSITION TOPICS ----------------------------------- */}
            <div className="w-full mt-10">
              <div className="max-w-[690px]">
                <h3 className="text-xl font-bold mb-2">
                  {t("compositionTopicTitle")}
                </h3>

                <textarea
                  value={personalInfo.compositionTopics || ""}
                  onChange={(e) =>
                    handleChange("compositionTopics", e.target.value)
                  }
                  className="bg-gray-200 text-black rounded-[12px] border border-[#19355a] w-full h-[120px] p-4 overflow-y-auto break-words whitespace-pre-wrap"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
