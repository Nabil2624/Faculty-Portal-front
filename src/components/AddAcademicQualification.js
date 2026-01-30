// src/pages/AddAcademicQualification.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // assuming you have axiosInstance

export default function AddAcademicQualification() {
  const { t, i18n } = useTranslation("add-academic-qualification");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const graduationDateRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    degree: "",
    specialization: "",
    delegation: "",
    grade: "",
    graduationDate: "",
    countryCity: "",
    university: "",
    college: "",
    attachments: null,
  });

  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  const [dispatchTypes, setDispatchTypes] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLookups();
  }, []);

  const fetchLookups = async () => {
    try {
      const [gradesRes, dispatchRes, qualificationsRes] = await Promise.all([
        axiosInstance.get("/LookUpItems/AcademicGrades"),
        axiosInstance.get("/LookUpItems/DispatchTypes"),
        axiosInstance.get("/LookUpItems/AcademicQualifications"),
      ]);

      setGrades(gradesRes.data);
      setDispatchTypes(dispatchRes.data);
      setQualifications(qualificationsRes.data);
    } catch (error) {
      console.error("Error fetching lookup data:", error);
    }
  };

  const openDatePicker = () => {
    if (
      graduationDateRef.current &&
      typeof graduationDateRef.current.showPicker === "function"
    ) {
      graduationDateRef.current.showPicker();
    }
  };

const handleChange = (e) => {
  const { name, value, files } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};

  const validate = () => {
    const newErrors = {};
    if (!formData.degree) newErrors.degree = t("requiredField");
    if (!formData.specialization) newErrors.specialization = t("requiredField");
    if (!formData.delegation) newErrors.delegation = t("requiredField");
    if (!formData.grade) newErrors.grade = t("requiredField");
    if (!formData.graduationDate) newErrors.graduationDate = t("requiredField");
    if (!formData.countryCity) newErrors.countryCity = t("requiredField");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const formPayload = new FormData();

    formPayload.append("qualificationId", formData.degree);
    formPayload.append("specialization", formData.specialization);
    formPayload.append("gradeId", formData.grade);
    formPayload.append("dispatchId", formData.delegation);
    formPayload.append("universityOrFaculty", formData.university);
    formPayload.append("countryOrCity", formData.countryCity);
    formPayload.append(
      "dateOfObtainingTheQualification",
      formData.graduationDate
    );

    if (formData.attachments) {
      formPayload.append("attachments", formData.attachments);
    }

    await axiosInstance.post(
      "/ScientificProgression/CreateAcademicQualification",
      formPayload
    );

    navigate("/academic-qualifications");
  } catch (error) {
    console.error("Error creating academic qualification:", error);
  } finally {
    setLoading(false);
  }
};


  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  return (
    <Layout>
      <div dir={isArabic ? "rtl" : "ltr"} className="p-4 sm:p-6 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block w-full max-w-6xl">
          {t("addAcademicQualification")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl"
          >
            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Degree */}
              <div>
                <label className="block mb-2 text-lg font-medium flex items-center gap-1">
                  {t("degree")} <span className="text-[#B38E19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    name="degree"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.degree}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectDegree")}</option>
                    {qualifications.map((q) => (
                      <option key={q.id} value={q.id}>
                        {isArabic ? q.valueAr : q.valueEn}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
                {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
              </div>

              {/* Delegation */}
              <div>
                <label className="block mb-2 text-lg font-medium flex items-center gap-1">
                  {t("delegation")} <span className="text-[#B38E19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    name="delegation"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.delegation}
                    onChange={handleChange}
                  >
                    <option value="">{t("delegation-placeholder")}</option>
                    {dispatchTypes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isArabic ? d.valueAr : d.valueEn}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
                {errors.delegation && <p className="text-red-500 text-sm">{errors.delegation}</p>}
              </div>

              {/* Country / City */}
              <div>
                <label className="block mb-2 text-lg font-medium flex items-center gap-1">
                  {t("countryCity")} <span className="text-[#B38E19]">*</span>
                </label>
                <input
                  type="text"
                  name="countryCity"
                  placeholder={t("countryCityPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.countryCity}
                  onChange={handleChange}
                />
                {errors.countryCity && <p className="text-red-500 text-sm">{errors.countryCity}</p>}
              </div>

              {/* University */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("university/college")}</label>
                <input
                  type="text"
                  name="university"
                  placeholder={t("universityPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Specialization */}
              <div>
                <label className="mb-2 text-lg font-medium flex items-center gap-1">
                  {t("specialization")} <span className="text-[#B38E19]">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  placeholder={t("specializationPlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.specialization}
                  onChange={handleChange}
                />
                {errors.specialization && (
                  <p className="text-red-500 text-sm">{errors.specialization}</p>
                )}
              </div>

              {/* Grade */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("grade")}</label>
                <div className="relative flex items-center">
                  <select
                    name="grade"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.grade}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectGrade")}</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {isArabic ? g.valueAr : g.valueEn}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={18}
                    className={`absolute text-[#B38E19] pointer-events-none ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                </div>
                {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block mb-2 text-lg font-medium flex items-center gap-1">
                  {t("graduationDate")} <span className="text-[#B38E19]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.graduationDate}
                    placeholder={t("graduationDate")}
                    readOnly
                    className={`${inputBase} ${focusStyle}`}
                    onFocus={openDatePicker}
                  />
                  <FiCalendar
                    role="button"
                    onClick={openDatePicker}
                    size={18}
                    className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  />
                  <input
                    type="date"
                    ref={graduationDateRef}
                    className="absolute opacity-0 pointer-events-none"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        graduationDate: e.target.value,
                      })
                    }
                  />
                </div>
                {errors.graduationDate && (
                  <p className="text-red-500 text-sm">{errors.graduationDate}</p>
                )}
              </div>

              {/* Attachments (skip API send for now) */}
              <div>
                <label className="block mb-2 text-lg font-medium">{t("attachments")}</label>
                <div className="flex items-start gap-2 mb-2">
                  <Info size={17} className="text-gray-600 mt-1" />
                  <p className="text-yellow-600 text-sm">{t("subtitle")}</p>
                </div>

                <input
                  type="file"
                  name="attachments"
                  accept=".pdf,.jpg,.png"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    className="bg-[#19355A] text-white px-9 py-1 rounded-md hover:bg-[#162d4a] transition-colors"
                  >
                    {t("chooseFile")}
                  </button>

                  {formData.attachments && (
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {formData.attachments.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end  max-w-6xl absolute ${
                isArabic ? "left-[53px]" : "right-[53px]"
              } bottom-[28px]`}
            >
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {loading ? t("saving") : t("save")}
              </button>

              <button
                type="button"
                onClick={() => navigate("/academic-qualifications")}
                className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                  isArabic ? "cairo" : "roboto"
                } text-sm`}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
