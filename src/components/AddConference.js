import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomDropdown from "../components/ui/CustomDropdown";

export default function AddConference() {
  const { t, i18n } = useTranslation("add-conference");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const fileInputRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [localityValue, setLocalityValue] = useState("");
  const [conferenceName, setConferenceName] = useState("");
  const [participationRole, setParticipationRole] = useState("");
  const [organizingBody, setOrganizingBody] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(null);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const rolesRes = await axiosInstance.get(
          "/LookUpItems/SeminarParticipationTypes",
          { skipGlobalErrorHandler: true }
        );
        setRoles(rolesRes.data || []);
      } catch (error) {
        console.error("Error fetching participation roles:", error);
        alert(t("errors.loadLookups"));
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // ----------------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};
    if (!conferenceName)
      newErrors.conferenceName = t("errors.conferenceRequired");
    if (!typeValue) newErrors.typeValue = t("errors.typeRequired");
    if (!localityValue) newErrors.localityValue = t("errors.localityRequired");
    if (!participationRole)
      newErrors.participationRole = t("errors.participationRequired");
    if (!organizingBody)
      newErrors.organizingBody = t("errors.organizingRequired");
    if (!startDate) newErrors.startDate = t("errors.startDateRequired");
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) newErrors.endDate = t("errors.startBeforeEnd");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------------------------
  const handleAddConference = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        type: typeValue,
        localOrInternational: localityValue,
        name: conferenceName,
        roleOfParticipationId: participationRole,
        organizingAuthority: organizingBody,
        website,
        startDate,
        endDate,
        venue: city,
        notes: description,
       // facultyMemberId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // replace with actual member id
      };

      await axiosInstance.post("/Missions/CreateConfernceOrSeminar", payload, {
        skipGlobalErrorHandler: true,
      });

      navigate("/seminars-and-conferences");
    } catch (error) {
      console.error("Error adding conference:", error);
      alert(t("errors.failedAdd"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div dir={dir} className="flex flex-col bg-white p-4 sm:p-6">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("addConference")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1" />
        </h2>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center w-full max-h-[calc(87vh-97px)] overflow-auto lg:overflow-visible">
          <form className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6">
            {/* LEFT Column */}
            <div className="space-y-6">
              {/* INLINE Type + Local/International */}
              <div className="flex gap-6 col-span-2">
                {/* Type */}
                <div className="flex-1">
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.type")} <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="Conference"
                        checked={typeValue === "Conference"}
                        onChange={(e) => setTypeValue(e.target.value)}
                        className="accent-[#b38e19]"
                      />
                      {t("fields.conference")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="Seminar"
                        checked={typeValue === "Seminar"}
                        onChange={(e) => setTypeValue(e.target.value)}
                        className="accent-[#b38e19]"
                      />
                      {t("fields.seminar")}
                    </label>
                  </div>
                  {errors.typeValue && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.typeValue}
                    </p>
                  )}
                </div>

                {/* Local/International */}
                <div className="flex-1">
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.localOrInternational")}{" "}
                    <span className="text-[#b38e19]">*</span>
                  </label>
                  <div className="flex gap-4 ">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="locality"
                        value="Local"
                        checked={localityValue === "Local"}
                        onChange={(e) => setLocalityValue(e.target.value)}
                        className="accent-[#b38e19]"
                      />
                      {t("fields.local")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="locality"
                        value="International"
                        checked={localityValue === "International"}
                        onChange={(e) => setLocalityValue(e.target.value)}
                        className="accent-[#b38e19]"
                      />
                      {t("fields.international")}
                    </label>
                  </div>
                  {errors.localityValue && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.localityValue}
                    </p>
                  )}
                </div>
              </div>

              {/* Conference Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.conferenceName")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={conferenceName}
                  onChange={(e) => setConferenceName(e.target.value)}
                  placeholder={t("placeholders.conferenceName")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.conferenceName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.conferenceName}
                  </p>
                )}
              </div>

              {/* Participation Role */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.participationRole")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <CustomDropdown
                  value={participationRole}
                  onChange={setParticipationRole}
                  placeholder={t("placeholders.participationRole")}
                  isArabic={isArabic}
                  options={roles.map((r) => ({
                    id: r.id,
                    label: isArabic ? r.valueAr : r.valueEn,
                  }))}
                />
                {errors.participationRole && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.participationRole}
                  </p>
                )}
              </div>

              {/* Organizing Body */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.organizingBody")}{" "}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  value={organizingBody}
                  onChange={(e) => setOrganizingBody(e.target.value)}
                  placeholder={t("placeholders.organizingBody")}
                  className={`${inputBase} ${focusStyle}`}
                />
                {errors.organizingBody && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organizingBody}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.website")}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={t("placeholders.website")}
                  className={`${inputBase} ${focusStyle}`}
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")}
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

              {/* City / Venue */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.city")}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t("placeholders.city")}
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
                  placeholder={t("placeholders.description")}
                  className={`${inputBase} ${focusStyle} resize-none`}
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.attachments")}
                </label>
                <div className="flex items-start gap-2 mb-2">
                  <Info size={17} className="text-gray-600 mt-1" />
                  <p className="text-yellow-600 text-sm">
                    {t("attachmentsHint")}
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  ref={fileInputRef}
                  onChange={(e) => setAttachments(e.target.files[0])}
                  className="absolute w-0 h-0 opacity-0"
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
                  {attachments && (
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {attachments.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Bottom Buttons */}
          <div
            className={`sticky bottom-0 flex flex-col sm:flex-row gap-3 mt-6 justify-${
              isArabic ? "end" : "start"
            } w-full max-w-6xl mx-auto bg-white pt-4`}
          >
            <button
              type="button"
              onClick={handleAddConference}
              disabled={loading}
              className="bg-[#b38e19] text-white sm:w-24 h-10 rounded-md text-sm"
            >
              {loading ? t("loading") : t("save")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/seminars-and-conferences")}
              className="bg-gray-300 text-black sm:w-24 h-10 rounded-md text-sm"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
