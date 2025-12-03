// src/pages/EditAcademicQualification.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info, ExternalLink } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditAcademicQualification() {
  const { t, i18n } = useTranslation("add-academic-qualification");
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const existingData = location.state?.item || null;
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
    universityCollege: "",
    attachments: null,
  });

  const [loading, setLoading] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    degrees: [],
    dispatchTypes: [],
    grades: [],
  });
  const [errors, setErrors] = useState({});

  // Fetch dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setLoading(true);
        const [dispatchRes, gradesRes, qualificationsRes] = await Promise.all([
          axiosInstance.get("/LookUpItems/DispatchTypes"),
          axiosInstance.get("/LookUpItems/AcademicGrades"),
          axiosInstance.get("/LookUpItems/AcademicQualifications"),
        ]);

        setDropdowns({
          dispatchTypes: dispatchRes.data,
          grades: gradesRes.data,
          degrees: qualificationsRes.data,
        });
      } catch (error) {
        console.error("Dropdown fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  // Map existingData to formData
  useEffect(() => {
    if (existingData) {
      setFormData({
        degree: existingData.qualification?.valueEn || "",
        specialization: existingData.specialization || "",
        delegation: existingData.dispatchType?.valueEn || "",
        grade: existingData.grade?.valueEn || "",
        graduationDate: existingData.dateOfObtainingTheQualification || "",
        countryCity: existingData.countryOrCity || "",
        universityCollege: existingData.universityOrFaculty || "",
        attachments: existingData.attachmentUrl
          ? {
              name: existingData.attachmentName,
              url: existingData.attachmentUrl,
            }
          : null,
      });
    }
  }, [existingData]);

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
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.degree) newErrors.degree = t("required");
    if (!formData.specialization) newErrors.specialization = t("required");
    if (!formData.delegation) newErrors.delegation = t("required");
    if (!formData.graduationDate) newErrors.graduationDate = t("required");
    if (!formData.countryCity) newErrors.countryCity = t("required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        qualificationId: dropdowns.degrees.find(d => d.valueEn === formData.degree)?.id,
        specialization: formData.specialization,
        gradeId: dropdowns.grades.find(g => g.valueEn === formData.grade)?.id,
        dispatchId: dropdowns.dispatchTypes.find(d => d.valueEn === formData.delegation)?.id,
        universityOrFaculty: formData.universityCollege,
        countryOrCity: formData.countryCity,
        dateOfObtainingTheQualification: formData.graduationDate,
      };

      await axiosInstance.put(
        `/ScientificProgression/UpdateAcademicQualification/${existingData.id}`,
        payload
      );

      navigate("/academic-qualifications");
    } catch (error) {
      console.error("Update error:", error);
      setErrors({ submit: t("updateFailed") });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 bg-white relative"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block w-full max-w-6xl">
          {t("edit-academic-qualification")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {errors.submit && (
          <p className="text-red-600 mb-4">{errors.submit}</p>
        )}

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl relative"
          >
            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Degree */}
              <div>
                <label className="mb-2 text-lg font-medium flex items-center gap-1">
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
                    {dropdowns.degrees.map((deg) => (
                      <option key={deg.id} value={deg.valueEn}>
                        {isArabic ? deg.valueAr : deg.valueEn}
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
                {errors.degree && <p className="text-red-600 text-sm">{errors.degree}</p>}
              </div>

              {/* Delegation */}
              <div>
                <label className="mb-2 text-lg font-medium flex items-center gap-1">
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
                    {dropdowns.dispatchTypes.map((d) => (
                      <option key={d.id} value={d.valueEn}>
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
                {errors.delegation && (
                  <p className="text-red-600 text-sm">{errors.delegation}</p>
                )}
              </div>

              {/* Country / City */}
              <div>
                <label className="mb-2 text-lg font-medium flex items-center gap-1">
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
                {errors.countryCity && (
                  <p className="text-red-600 text-sm">{errors.countryCity}</p>
                )}
              </div>

              {/* University / College */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("university/college")}
                </label>
                <input
                  type="text"
                  name="universityCollege"
                  placeholder={t("universityCollegePlaceholder")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.universityCollege}
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
                  <p className="text-red-600 text-sm">{errors.specialization}</p>
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
                    {dropdowns.grades.map((g) => (
                      <option key={g.id} value={g.valueEn}>
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
                      setFormData({ ...formData, graduationDate: e.target.value })
                    }
                  />
                </div>
                {errors.graduationDate && (
                  <p className="text-red-600 text-sm">{errors.graduationDate}</p>
                )}
              </div>

              {/* Attachments */}
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

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    className="bg-[#19355A] text-white px-9 py-1 rounded-md hover:bg-[#162d4a] transition-colors"
                  >
                    {t("chooseFile")}
                  </button>

                  {formData.attachments && formData.attachments.url && (
                    <a
                      href={formData.attachments.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-black hover:underline"
                    >
                      {formData.attachments.name}
                      <ExternalLink size={16} className={`ml-1`} />
                    </a>
                  )}

                  {formData.attachments &&
                    formData.attachments.name &&
                    !formData.attachments.url && (
                      <button
                        type="button"
                        onClick={() =>
                          window.open(URL.createObjectURL(formData.attachments))
                        }
                        className="flex items-center text-sm text-black hover:underline"
                      >
                        {formData.attachments.name}
                        <ExternalLink size={16} className={`ml-1`} />
                      </button>
                    )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

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
          onClick={() => navigate("/academic-qualifications")}
          className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("cancel")}
        </button>
      </div>
    </Layout>
  );
}
