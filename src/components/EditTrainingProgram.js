// src/pages/EditTrainingProgram.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function EditTrainingProgram() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingData = location.state?.programData || {};
  const { t, i18n } = useTranslation("add-training-program");
  const isArabic = i18n.language === "ar";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [formData, setFormData] = useState({
    programType: "",
    programName: "",
    trainingProgramName: "",
    organizingAuthority: "",
    venue: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Populate formData with existing data when editing
  useEffect(() => {
    if (existingData) {
      setFormData({
        id: existingData.id,

        // Convert returned values to integers (backend requires 1 or 2)
        programType: existingData.type?.toLowerCase() === "specialist" ? 1 : 2,

        participationType:
          existingData.participationType?.toLowerCase() === "internal" ? 1 : 2,

        programName: existingData.trainingProgramName || "",
        organizingAuthority: existingData.organizingAuthority || "",
        venue: existingData.venue || "",
        description: existingData.description || "",
        startDate: existingData.startDate || "",
        endDate: existingData.endDate || "",
      });
    }
  }, [existingData]);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure that you are sending the correct data (integer values for type and participation)
      const programTypeInt = formData.programType === "specialist" ? 1 : 2;
      const participationTypeInt =
        formData.participationType === "internal" ? 1 : 2;

      await axiosInstance.put(
        `/Missions/UpdateTrainingProgram/${formData.id}`,
        {
          type: Number(formData.programType),
          participationType: Number(formData.participationType),
          trainingProgramName: formData.programName, // FIXED
          organizingAuthority: formData.organizingAuthority,
          venue: formData.venue,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
        }
      );

      navigate("/training-programs");
    } catch (err) {
      console.error("Failed to update training program:", err);
      setError("Failed to update training program");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/training-programs");
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <Layout>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 bg-white min-h-screen"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 inline-block w-full max-w-6xl">
          {t("editTrainingProgram")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl relative"
          >
            {/* LEFT Column */}
            <div className="space-y-6">
             <label className="block mb-2 text-lg font-medium">
                {t("participationType")}{" "}
                <span className="text-[#b38e19]">*</span>
              </label>
              <div className="flex gap-4">
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="programType"
                    value="1"
                    checked={formData.programType == 1}
                    onChange={handleChange}
                  />
                  {t("specialist")}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="programType"
                    value="2"
                    checked={formData.programType == 2}
                    onChange={handleChange}
                  />
                  {t("general")}
                </label>
              </div>

 <label className="block mb-2 text-lg font-medium">
                {t("programName")} <span className="text-[#b38e19]">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="participationType"
                    value="1"
                    checked={formData.participationType == 1}
                    onChange={handleChange}
                  />
                  {t("internal")}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="participationType"
                    value="2"
                    checked={formData.participationType == 2}
                    onChange={handleChange}
                  />
                  {t("external")}
                </label>
              </div>

              {/* Program Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("programName")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="programName"
                  placeholder={t("programNamePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.programName}
                  onChange={handleChange}
                />
              </div>

               <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("organizingBody")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="orgainizingAuthority"
                  placeholder={t("programNamePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.organizingAuthority}
                  onChange={handleChange}
                />
              </div>

              {/* Organizing Body */}
              {/* <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("organizingBody")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="organizingAuthority"
                  value={formData.organizingAuthority}
                  onChange={handleChange}
                />
              </div> */}
              {/* Location */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {isArabic ? "مكان الانعقاد" : "Location"}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  placeholder={
                    isArabic ? "اكتب مكان الانعقاد" : "Enter location"
                  }
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.venue}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("startDate")} <span className="text-[#b38e19]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.startDate}
                        placeholder={t("startDate")}
                        readOnly
                        className={`${inputBase} ${focusStyle}`}
                        onFocus={() => openDatePicker(startDateRef)}
                      />
                      <FiCalendar
                        role="button"
                        onClick={() => openDatePicker(startDateRef)}
                        size={18}
                        className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                          isArabic ? "left-4" : "right-4"
                        }`}
                      />
                      <input
                        type="date"
                        ref={startDateRef}
                        className="absolute opacity-0 pointer-events-none"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-lg font-medium">
                      {t("endDate")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.endDate}
                        placeholder={t("endDate")}
                        readOnly
                        className={`${inputBase} ${focusStyle}`}
                        onFocus={() => openDatePicker(endDateRef)}
                      />
                      <FiCalendar
                        role="button"
                        onClick={() => openDatePicker(endDateRef)}
                        size={18}
                        className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                          isArabic ? "left-4" : "right-4"
                        }`}
                      />
                      <input
                        type="date"
                        ref={endDateRef}
                        className="absolute opacity-0 pointer-events-none"
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("description")}
                  </label>
                  <textarea
                    name="description"
                    placeholder={t("descriptionPlaceholder")}
                    className={`${inputBase} ${focusStyle} h-32 resize-none`}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            <button
              type="submit"
              onClick={handleSubmit}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("save")}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
