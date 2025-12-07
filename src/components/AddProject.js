import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AddProject() {
  const { t, i18n } = useTranslation("AddProject");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Form Data
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [role, setRole] = useState("");
  const [nationality, setNationality] = useState("International");
  const [fundingSource, setFundingSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Lookup Data
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectRoles, setProjectRoles] = useState([]);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  // Load lookup lists
  useEffect(() => {
    const fetchLookUps = async () => {
      setLoading(true);
      try {
        const typesRes = await axiosInstance.get("/LookUpItems/ProjectTypes", {
          skipGlobalErrorHandler: true,
        });

        const rolesRes = await axiosInstance.get("/LookUpItems/ProjectRoles", {
          skipGlobalErrorHandler: true,
        });

        // Filter out null items
        setProjectTypes((typesRes.data || []).filter((x) => x != null));
        setProjectRoles((rolesRes.data || []).filter((x) => x != null));
      } catch (err) {
        setLocalError(t("errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchLookUps();
  }, []);

  // Form Validation
  const validate = () => {
    if (!projectName) return t("errors.projectNameRequired");
    if (!projectType) return t("errors.projectTypeRequired");
    if (!role) return t("errors.roleRequired");
    if (!startDate) return t("errors.startDateRequired");
    if (!fundingSource) return t("errors.fundingRequired");

    return "";
  };

  // Handle Submit
  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setLocalError(error);
      return;
    }

    const payload = {
      localOrInternational: nationality === "دولي" ? "International" : "Local",
      nameOfProject: projectName,
      typeOfProjectId: projectType,
      participationRoleId: role,
      financingAuthority: fundingSource,
      startDate: startDate,
      endDate: endDate || startDate,
      description: description,
    };

    setLoading(true);
    setLocalError("");

    try {
      await axiosInstance.post("/ProjectsAndCommittees/CreateProject", payload, {
        skipGlobalErrorHandler: true,
      });

      navigate("/projects");
    } catch (err) {
      setLocalError(t("errors.submitFailed"));
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
        className="p-4 sm:p-6 flex flex-col bg-white"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-19 inline-block relative text-start">
          {t("title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {localError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {localError}
          </div>
        )}

        <div className="flex flex-col items-center">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Nationality */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.nationality")}
                </label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="nationality"
                      value="دولي"
                      checked={nationality === "دولي"}
                      onChange={(e) => setNationality(e.target.value)}
                      className="mr-2"
                    />
                    {t("options.international")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="nationality"
                      value="محلي"
                      checked={nationality === "محلي"}
                      onChange={(e) => setNationality(e.target.value)}
                      className="mr-2"
                    />
                    {t("options.local")}
                  </label>
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.projectName")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t("placeholders.projectName")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.projectType")} <span className="text-[#B38E19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option value="" disabled>
                      {t("placeholders.projectType")}
                    </option>

                    {projectTypes.map((p) =>
                      p ? (
                        <option key={p.id} value={p.id}>
                          {isArabic ? p.valueAr || p.valueEn : p.valueEn || p.valueAr}
                        </option>
                      ) : null
                    )}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute text-[#B38E19]"
                    style={isArabic ? { left: "10px" } : { right: "10px" }}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.role")} <span className="text-[#b38e19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>
                      {t("placeholders.role")}
                    </option>

                    {projectRoles.map((r) =>
                      r ? (
                        <option key={r.id} value={r.id}>
                          {isArabic ? r.valueAr || r.valueEn : r.valueEn || r.valueAr}
                        </option>
                      ) : null
                    )}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute text-[#B38E19]"
                    style={isArabic ? { left: "10px" } : { right: "10px" }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")} <span className="text-[#B38E19]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      readOnly
                      placeholder={t("placeholders.startDate")}
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(startDateRef)}
                    />
                    <FiCalendar
                      size={18}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                      onClick={() => openDatePicker(startDateRef)}
                    />
                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* End */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.endDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      readOnly
                      placeholder={t("placeholders.endDate")}
                      className={`${inputBase} ${focusStyle}`}
                      onFocus={() => openDatePicker(endDateRef)}
                    />
                    <FiCalendar
                      size={18}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-[#B38E19] ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                      onClick={() => openDatePicker(endDateRef)}
                    />
                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Funding */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.funding")} <span className="text-[#B38E19]">*</span>
                </label>
                <input
                  type="text"
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  placeholder={t("placeholders.funding")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.description")}
                </label>
                <textarea
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputBase} ${focusStyle} resize-none`}
                  placeholder={t("placeholders.description")}
                />
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
              type="button"
              onClick={handleSubmit}
              className="bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer text-sm"
            >
              {t("buttons.save")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer text-sm"
            >
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
