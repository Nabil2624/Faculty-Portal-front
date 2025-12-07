import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomDropdown from "./CustomDropdown";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function AddCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [degreeValue, setDegreeValue] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  const [description, setDescription] = useState("");

  const [types, setTypes] = useState([]);
  const [degrees, setDegrees] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // INPUT STYLES
  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none text-[12px] transition-all duration-150 ease-linear";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const openPicker = (ref) => {
    if (!ref.current) return;
    try {
      ref.current.showPicker();
    } catch {
      ref.current.focus();
    }
  };

  // ----------------------------------------------------------------
  // FETCH LOOKUPS
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoading(true);

        const [degreesRes, typesRes] = await Promise.all([
          axiosInstance.get("/LookUpItems/CommitteeParticipationDegrees", {
            skipGlobalErrorHandler: true,
          }),
          axiosInstance.get("/LookUpItems/TypesofCommittee", {
            skipGlobalErrorHandler: true,
          }),
        ]);

        setDegrees(degreesRes.data || []);
        setTypes(typesRes.data || []);
      } catch (error) {
        console.error("Error fetching lookups:", error);
        alert(t("errors.loadLookups"));
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  // ----------------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};
    if (!committeeName) newErrors.committeeName = t("errors.committeeRequired");
    if (!typeValue) newErrors.typeValue = t("errors.typeRequired");
    if (!degreeValue) newErrors.degreeValue = t("errors.degreeRequired");
    if (!startDate) newErrors.startDate = t("errors.startDateRequired");
    // Start date must be before end date
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        newErrors.endDate = t("errors.startBeforeEnd");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Start date must be before end date

  // ----------------------------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------------------------
  const handleAddCommittee = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axiosInstance.post(
        "/ProjectsAndCommittees/CreateCommitteeOrAssociation",
        {
          nameOfCommitteeOrAssociation: committeeName,
          typeOfCommitteeOrAssociationId: typeValue,
          degreeOfSubscriptionId: degreeValue,
          startDate,
          endDate,
          notes: description,
        },
        { skipGlobalErrorHandler: true }
      );

      navigate("/committee-associations");
    } catch (error) {
      console.error("Error adding committee:", error);
      alert(t("errors.failedAdd"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir} className="flex flex-col bg-white p-4 sm:p-6">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("addCommittee.title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1" />
        </h2>

        {/* Form Container */}
        <div className="flex-1 flex flex-col max-h-[calc(87vh-97px)] items-center overflow-x-hidden ">
          <form className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Committee Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.committee")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={committeeName}
                  onChange={(e) => setCommitteeName(e.target.value)}
                  placeholder={t("placeholders.committee")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.committeeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.committeeName}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 text-lg font-medium">
                  {t("fields.type")} <span className="text-[#b38e19]">*</span>
                </label>

                <CustomDropdown
                  value={typeValue}
                  onChange={setTypeValue}
                  placeholder={t("placeholders.type")}
                  isArabic={isArabic}
                  options={types.map((item) => ({
                    id: item.id,
                    label: isArabic ? item.valueAr : item.valueEn,
                  }))}
                />

                {errors.typeValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.typeValue}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className=" mb-2 text-lg font-medium">
                  {t("fields.degree")} <span className="text-[#b38e19]">*</span>
                </label>

                <CustomDropdown
                  value={degreeValue}
                  onChange={setDegreeValue}
                  placeholder={t("placeholders.degree")}
                  isArabic={isArabic}
                  options={degrees.map((item) => ({
                    id: item.id,
                    label: isArabic ? item.valueAr : item.valueEn,
                  }))}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.degreeValue}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={startDate}
                      placeholder={t("placeholders.startDate")}
                      className={`${inputBase} ${focusStyle}`}
                      onClick={() => openPicker(startDateRef)}
                    />
                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                      onClick={() => openPicker(startDateRef)}
                    />

                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.endDate")}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={endDate}
                      placeholder={t("placeholders.endDate")}
                      className={`${inputBase} ${focusStyle}`}
                      onClick={() => openPicker(endDateRef)}
                    />

                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                      onClick={() => openPicker(endDateRef)}
                    />

                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
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
                  placeholder={t("placeholders.description")}
                  className={`${inputBase} ${focusStyle} resize-none`}
                />
              </div>
            </div>
          </form>

          {/* Bottom Buttons */}
          <div
            className={`sticky bottom-0 flex flex-col sm:flex-row gap-3 mt-40 justify-${
              isArabic ? "end" : "start"
            } w-full max-w-6xl mx-auto bg-white pt-4`}
          >
            <button
              type="button"
              onClick={handleAddCommittee}
              disabled={loading}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md text-sm`}
            >
              {t("buttons.save")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/committee-associations")}
              className="bg-gray-300 text-black sm:w-24 h-10 rounded-md text-sm"
            >
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
