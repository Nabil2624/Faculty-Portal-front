import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../images/profileImage.png";
import { FiUpload, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function EditPersonalInfo() {
  const { t, i18n } = useTranslation("personaldata");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({});
  const [profileImage, setProfileImage] = useState(subPicture);
  const [loading, setLoading] = useState(true);
  const dateInputRef = useRef(null);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Current token:", token || "No token found");

        const res = await axiosInstance.get("/PersonalData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setPersonalInfo({
          title: data.title || "",
          name: data.name || "",
          ssn: data.ssn?.trim() || "",
          gender: data.gender || "",
          birthPlace: data.birthPlace || "",
          university: data.universityName || "",
          department: data.departmentName || "",
          faculty: data.facultyName || "",
          generalSpecialization: data.generalSpecialization || "",
          field: data.fieldOfStudy || "",
          exactSpecialization: data.accurateSpecialization || "",
          compositionTopic: data.compositionTopic || "لا يوجد",
          nameInComposition: data.nameInComposition || "",
          birthDate: data.birthDate || "",
          maritalStatus: data.socialStatus || "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch personal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, []);

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
    if (typeof dateInputRef.current.showPicker === "function") {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current.focus();
    }
  };

  // ✅ Save (PUT request)
  const handleSave = async () => {
    try {
      const payload = {
        title: personalInfo.title,
        name: personalInfo.name,
        birthPlace: personalInfo.birthPlace,
        nameInComposition: personalInfo.nameInComposition,
        socialStatus: personalInfo.maritalStatus,
        birthDate: personalInfo.birthDate,
        compositionTopic: personalInfo.compositionTopic,
      };

      console.log("📤 Sending updated data:", payload);
      await axiosInstance.put("/PersonalData", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/personal");
    } catch (err) {
      console.error("❌ Failed to update personal data:", err);
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

  return (
    <Layout>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
        input[type="date"]::-webkit-clear-button,
        input[type="date"]::-webkit-inner-spin-button { display: none; -webkit-appearance: none; }
        input[type="date"] { -moz-appearance: textfield; appearance: none; }
        input[type="date"]::-ms-clear { display: none; }
      `}</style>

      <div className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col`}>
        <h2 className="text-3xl font-bold mb-[80px] inline-block relative text-start">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex flex-wrap justify-center flex-row-reverse gap-x-20">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#19355a] text-white px-4 py-2 rounded-md">
              <FiUpload size={18} />
              {t("uploadPhoto")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>

            <div className={`flex gap-3 mt-[68px] ${isArabic ? "left-[53px]" : "right-[53px]"}`}>
              <button
                onClick={handleSave}
                className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("save")}
              </button>
              <button
                onClick={() => navigate("/personal")}
                className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("cancel")}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4 ml-10">
            <div className="grid grid-cols-3 gap-5">
              {Object.keys(personalInfo).map((key, index) => {
                const nonEditableFields = [
                  "ssn",
                  "gender",
                  "university",
                  "department",
                  "faculty",
                  "generalSpecialization",
                  "field",
                  "exactSpecialization",
                ];

                const isNonEditable = nonEditableFields.includes(key);

                return (
                  <div
                    key={index}
                    className="flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300 
                      focus-within:border-[#B38E19] focus-within:ring-2 focus-within:ring-[#B38E19] transition"
                  >
                    <label className="bg-[#19355a] text-white w-32 flex items-center justify-center px-2 text-center">
                      {t(key)}
                    </label>

                    {key === "birthDate" ? (
                      <div className="relative flex-1 flex items-center bg-gray-200">
                        <FiCalendar
                          role="button"
                          aria-label="Open date picker"
                          onClick={openDatePicker}
                          size={18}
                          className={`cursor-pointer text-[#B38E19] absolute ${
                            isArabic ? "left-3" : "right-3"
                          }`}
                        />
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={personalInfo[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full h-full bg-gray-200 text-black outline-none [color-scheme:light] text-center px-2"
                        />
                      </div>
                    ) : isNonEditable ? (
                      // ✅ Updated disabled styling
                      <div className="flex-1 bg-gray-100 text-gray-500 flex items-center justify-center text-center cursor-not-allowed">
                        {personalInfo[key] || "-"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={personalInfo[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="flex-1 bg-gray-200 px-2 text-black outline-none text-center"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
