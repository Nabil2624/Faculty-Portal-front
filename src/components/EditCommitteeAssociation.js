import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomDropdown from "../components/ui/CustomDropdown";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function EditCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state?.item || null;

  // Refs for the date inputs
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
  const [error, setError] = useState({});

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

  useEffect(() => {
    const fetchLookups = async () => {
      setLoading(true);
      try {
        const [typesResp, degreesResp] = await Promise.all([
          axiosInstance.get("/LookUpItems/TypesofCommittee", { skipGlobalErrorHandler: true }),
          axiosInstance.get("/LookUpItems/CommitteeParticipationDegrees", { skipGlobalErrorHandler: true }),
        ]);
        setTypes(typesResp.data ?? []);
        setDegrees(degreesResp.data ?? []);
      } catch (err) {
        console.error("Failed to fetch lookup data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLookups();
  }, []);

  // FIXED PICKER FUNCTION
  const handlePickerOpen = (ref) => {
    if (ref.current) {
      // showPicker() is the modern standard, fallback to focus/click
      if (typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
      } else {
        ref.current.focus();
      }
    }
  };

  const inputBase =
    "w-full border border-gray-300 rounded-md 3xl:rounded-xl px-4 py-2 3xl:px-5 3xl:py-3 4xl:px-7 4xl:py-5 3xl:text-xl 4xl:text-3xl placeholder-gray-400 bg-[#E2E2E2] outline-none text-[12px]";
  const focusStyle = "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const validateForm = () => {
    const newErrors = {};
    if (!committee) newErrors.committee = t("errors.committeeRequired");
    if (!typeValue) newErrors.typeValue = t("errors.typeRequired");
    if (!degreeValue) newErrors.degreeValue = t("errors.degreeRequired");
    if (!startDate) newErrors.startDate = t("errors.startDateRequired");
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = t("errors.startBeforeEnd");
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir} className="flex flex-col bg-white h-auto min-h-[90vh] overflow-x-hidden">
        <div className="flex-1 p-2 sm:p-3">
          <h2 className="text-2xl sm:text-3xl 3xl:text-4xl 4xl:text-5xl font-bold mb-6 3xl:mb-14 4xl:mb-14 text-start">
            {t("editCommittee.title") || (isArabic ? "تعديل لجنة / جمعية" : "Edit Committee / Association")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1 md:mx-0" />
          </h2>

          <form className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-x-40 3xl:gap-44 gap-y-10">
            {/* LEFT COLUMN */}
            <div className="space-y-10">
              <div>
                <label className="block mb-2 text-lg 3xl:text-3xl 4xl:text-4xl font-medium">
                  {t("fields.committee")} <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  placeholder={t("placeholders.committee")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {error.committee && <p className="text-red-500 text-sm mt-1">{error.committee}</p>}
              </div>

              <div>
                <label className="block mb-2 text-lg font-medium 3xl:text-3xl 4xl:text-4xl">
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
                {error.typeValue && <p className="text-red-500 text-sm mt-1">{error.typeValue}</p>}
              </div>

              <div>
                <label className="block mb-2 text-lg font-medium 3xl:text-3xl 4xl:text-4xl">
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
                {error.degreeValue && <p className="text-red-500 text-sm mt-1">{error.degreeValue}</p>}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block mb-2 text-lg font-medium 3xl:text-3xl 4xl:text-4xl">
                    {t("fields.startDate")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <div 
                    className="relative cursor-pointer" 
                    onClick={() => handlePickerOpen(startDateRef)}
                  >
                    <input
                      type="text"
                      readOnly
                      value={startDate}
                      className={`${inputBase} ${focusStyle} cursor-pointer`}
                      placeholder={t("placeholders.startDate")}
                    />
                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none 3xl:w-8 3xl:h-8 4xl:w-10 4xl:h-10"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                    />
                    {/* The real input is hidden but stays in the DOM for the ref */}
                    <input
                      type="date"
                      ref={startDateRef}
                      className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  {error.startDate && <p className="text-red-500 text-sm mt-1">{error.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label className="block mb-2 text-lg font-medium 3xl:text-3xl 4xl:text-4xl">
                    {t("fields.endDate")}
                  </label>
                  <div 
                    className="relative cursor-pointer" 
                    onClick={() => handlePickerOpen(endDateRef)}
                  >
                    <input
                      type="text"
                      readOnly
                      value={endDate}
                      className={`${inputBase} ${focusStyle} cursor-pointer`}
                      placeholder={t("placeholders.endDate")}
                    />
                    <FiCalendar
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none 3xl:w-8 3xl:h-8 4xl:w-10 4xl:h-10"
                      style={isArabic ? { left: "10px" } : { right: "10px" }}
                    />
                    <input
                      type="date"
                      ref={endDateRef}
                      className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  {error.endDate && <p className="text-red-500 text-sm mt-1">{error.endDate}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium 3xl:text-3xl 4xl:text-4xl">
                  {t("fields.description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholders.description")}
                  className={`${inputBase} ${focusStyle} resize-none min-h-[80px] sm:min-h-[120px] md:min-h-[160px] lg:min-h-[165px] 3xl:min-h-[200px] 4xl:min-h-[270px]`}
                />
              </div>
            </div>
          </form>
        </div>

        <div
          className="sticky bottom-0 w-full flex flex-row gap-3 bg-white p-4 justify-center md:justify-start"
          style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
        >
          <button
            type="button"
            onClick={handleSave}
            className={`bg-[#b38e19] text-white sm:w-24 h-10 3xl:w-32 3xl:h-[60px] rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm 3xl:text-2xl`}
          >
            {t("buttons.save")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/committee-associations")}
            className={`bg-gray-300 text-black sm:w-24 h-10 3xl:w-32 3xl:h-[60px] rounded-md cursor-pointer font-${isArabic ? "cairo" : "roboto"} text-sm 3xl:text-2xl`}
          >
            {t("buttons.cancel")}
          </button>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}