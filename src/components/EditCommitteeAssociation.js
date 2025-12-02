import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomDropdown from "./CustomDropdown";

export default function EditCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state?.item || null;

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [committee, setCommittee] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [degreeValue, setDegreeValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [types, setTypes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill form
  useEffect(() => {
    if (existingData) {
      setCommittee(existingData.nameOfCommitteeOrAssociation ?? "");
      setTypeValue(existingData.typeOfCommitteeOrAssociation?.id ?? "");
      setDegreeValue(existingData.degreeOfSubscription?.id ?? "");
      setStartDate(existingData.startDate ?? "");
      setEndDate(existingData.endDate ?? "");
      setDescription(existingData.notes ?? "");
    }
  }, [existingData]);

  // Fetch lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      setLoading(true);
      try {
        const [typesResp, degreesResp] = await Promise.all([
          axiosInstance.get("/LookUpItems/TypesofCommittee", {
            skipGlobalErrorHandler: true,
          }),
          axiosInstance.get("/LookUpItems/CommitteeParticipationDegrees", {
            skipGlobalErrorHandler: true,
          }),
        ]);

        setTypes(typesResp.data ?? []);
        setDegrees(degreesResp.data ?? []);
      } catch (err) {
        console.error("Failed to fetch lookup data:", err);
        setError(t("errors.loadLookups"));
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, [t]);

  const inputBase =
    "w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-[#E2E2E2] outline-none transition-all duration-150 ease-linear text-[12px]";
  const focusStyle =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const openPicker = (ref) => {
    if (!ref.current) return;
    try {
      ref.current.showPicker();
    } catch (_) {
      ref.current.focus();
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!committee) newErrors.committee = t("errors.committeeRequired");
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
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      await axiosInstance.put(
        `/ProjectsAndCommittees/UpdateCommitteeOrAssociation/${existingData.id}`,
        {
          nameOfCommitteeOrAssociation: committee,
          typeOfCommitteeOrAssociationId: typeValue,
          degreeOfSubscriptionId: degreeValue,
          startDate,
          endDate,
          notes: description,
        },
        { skipGlobalErrorHandler: true }
      );

      navigate("/committee-associations");
    } catch (err) {
      console.error("Failed to update:", err);
      setError(t("errors.failedAdd"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div dir={dir} className="flex flex-col min-h-screen bg-white p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("editCommittee.title") ||
            (isArabic ? "تعديل لجنة / جمعية" : "Edit Committee / Association")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1" />
        </h2>

        <div className="flex-1 flex flex-col max-h-[calc(87vh-97px)] items-center overflow-x-hidden ">
          <form className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Committee / Association */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.committee")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  placeholder={t("placeholders.committee")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>
              {error.committee && (
                <p className="text-red-500 text-sm mt-1">{error.committee}</p>
              )}

              {/* Type dropdown */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.type")} <span className="text-[#b38e19]">*</span>
                </label>

                <CustomDropdown
                  value={typeValue}
                  onChange={setTypeValue}
                  options={types.map((tItem) => ({
                    id: tItem.id,
                    label: isArabic ? tItem.valueAr : tItem.valueEn,
                  }))}
                  placeholder={t("placeholders.type")}
                  isArabic={isArabic}
                />
              </div>
              {error.typeValue && (
                <p className="text-red-500 text-sm mt-1">{error.typeValue}</p>
              )}

              {/* Degree dropdown */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.degree")} <span className="text-[#b38e19]">*</span>
                </label>

                <CustomDropdown
                  value={degreeValue}
                  onChange={setDegreeValue}
                  options={degrees.map((d) => ({
                    id: d.id,
                    label: isArabic ? d.valueAr : d.valueEn,
                  }))}
                  placeholder={t("placeholders.degree")}
                  isArabic={isArabic}
                />
              </div>
              {error.degreeValue && (
                <p className="text-red-500 text-sm mt-1">{error.degreeValue}</p>
              )}
            </div>

            {/* RIGHT COLUMN */}
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
                      onClick={() => openPicker(startDateRef)}
                      className={`${inputBase} ${focusStyle}`}
                      placeholder={t("placeholders.startDate")}
                    />
                    <FiCalendar
                      size={18}
                      onClick={() => openPicker(startDateRef)}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                    />
                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  {error.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.startDate}
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
                      onClick={() => openPicker(endDateRef)}
                      className={`${inputBase} ${focusStyle}`}
                      placeholder={t("placeholders.endDate")}
                    />
                    <FiCalendar
                      size={18}
                      onClick={() => openPicker(endDateRef)}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] cursor-pointer"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                    />
                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                {error.endDate && (
                  <p className="text-red-500 text-sm mt-1">{error.endDate}</p>
                )}
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

          {/* BUTTONS */}
          <div
            className={`sticky bottom-0 flex flex-col sm:flex-row gap-3 mt-40 justify-${
              isArabic ? "end" : "start"
            } w-full max-w-6xl mx-auto bg-white pt-4`}
          >
            <button
              type="button"
              onClick={handleSave}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.save")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/committee-associations")}
              className={`bg-gray-300 text-black sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
