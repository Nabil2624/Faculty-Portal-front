import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../images/profileImage.png";
import { FiUpload, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function EditPersonalInfo() {
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const initialInfo = {
    title: "أ.د",
    university: "جامعة حلوان",
    birthDate: "2026-11-26",
    name: "احمد هشام محمد",
    department: "هندسة البرمجيات",
    college: "كلية الحاسبات والذكاء الاصطناعي",
    nationalId: "30XXXXXXXXXXX",
    generalSpecialization: "هندسة البرمجيات",
    field: "مجال علوم الحاسبات",
    gender: "ذكر",
    roles: "لا يوجد",
    exactSpecialization: "مهندس حوسبة سحابية",
    birthPlace: "القاهرة، مصر",
    maritalStatus: "أعزب",
    positions: "لا يوجد",
  };

  const [personalInfo, setPersonalInfo] = useState(initialInfo);
  const [profileImage, setProfileImage] = useState(subPicture);

  const dateInputRef = useRef(null);

  const handleChange = (key, value) => {
    setPersonalInfo({ ...personalInfo, [key]: value });
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

  return (
    <Layout>
      {/* CSS to hide native date icon / spinner across browsers */}
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

            <div className="flex gap-3 mt-11">
              <button
                onClick={()=>{navigate("/personal")}}
                className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("save")}
              </button>
              <button
                onClick={()=>{navigate("/personal")}}
                className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("cancel")}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] max-w-[1050px] flex flex-col gap-4 ml-10">
            <div className="grid grid-cols-3 gap-5">
              {Object.keys(personalInfo).map((key, index) => (
                <div
                  key={index}
                  className="flex h-[40px] rounded-md overflow-hidden text-sm border border-gray-300 
                    focus-within:border-[#B38E19] focus-within:ring-2 focus-within:ring-[#B38E19] transition"
                >
                  <label className="bg-[#19355a] text-white w-32 flex items-center justify-center font-bold px-2">
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
                        value={personalInfo[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full h-full bg-gray-200 text-black outline-none [color-scheme:light] text-center"
                      />
                    </div>
                  ) : key === "nationalId" ? (
                    <div className="flex-1 bg-gray-200 flex items-center justify-center text-center">
                      {personalInfo[key]}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={personalInfo[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 bg-gray-200 px-2 text-black outline-none text-center"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
