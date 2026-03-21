// src/pages/EditConference.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import AttachmentUploader from "../components/ui/AttachmentUploader";
import {
  uploadSeminarAttachments,
  deleteSeminarAttachment,
} from "../services/seminarsAndConferences.service";

export default function EditConference() {
  const { t, i18n } = useTranslation("add-conference");
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const existingData = location.state?.item || null;
  const navigate = useNavigate();
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const fileInputRef = useRef(null);
  const [originalAttachments, setOriginalAttachments] = useState([]);
  // api states
  const [participationRoles, setParticipationRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    localOrInternational: "",
    conferenceName: "",
    participationRole: "",
    organizingBody: "",
    website: null,
    venue: null,
    description: null,
    attachments: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchLookups = async () => {
      setLoading(true);
      try {
        const rolesResp = await axiosInstance.get(
          "/LookUpItems/SeminarParticipationTypes",
          { skipGlobalErrorHandler: true },
        );

        setParticipationRoles(rolesResp.data ?? []);
      } catch (err) {
        console.error("Failed to fetch participation roles:", err);
        setError("Failed to load lookup data");
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  // Pre-fill form with existing data
  useEffect(() => {
    if (!existingData) return;

    setFormData({
      type: existingData.type?.toLowerCase() || "",
      localOrInternational:
        existingData.localOrInternational?.toLowerCase() || "",
      conferenceName: existingData.name || "",
      participationRole:
        existingData.roleOfParticipation?.id ||
        existingData.participationRole ||
        "",
      organizingBody: existingData.organizingAuthority || "",
      website: existingData.website || "",
      venue: existingData.venue || "",
      description: existingData.notes || "",
      startDate: existingData.startDate || "",
      endDate: existingData.endDate || "",
    });

    // ATTACHMENTS PREFILL
    const mappedAttachments =
      existingData.attachments?.map((att) => ({
        id: att.id,
        fileName: att.fileName,
        contentType: att.contentType,
        size: att.size,
        name: att.fileName, // مهم للعرض
      })) || [];

    setAttachments(mappedAttachments);
    setOriginalAttachments(mappedAttachments);
  }, [existingData]);

  const openDatePicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!existingData?.id) return;

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        setError(t("errors.startBeforeEnd"));
        return; // prevents end date before start date
      }
    }
    setLoading(true);
    setError("");

    try {
      const payload = {
        type: formData.type === "conference" ? 2 : 1,
        localOrInternational: formData.localOrInternational === "local" ? 1 : 2,
        name: formData.conferenceName,
        roleOfParticipationId: formData.participationRole,
        organizingAuthority: formData.organizingBody,
        website: formData.website,
        startDate: formData.startDate,
        endDate: formData.endDate,
        venue: formData.venue,
        notes: formData.description,
      };

      await axiosInstance.put(
        `/Missions/UpdateConferncesOrSeminars/${existingData.id}`,
        payload,
        { skipGlobalErrorHandler: true },
      );

      // =====================
      // ATTACHMENTS DIFF
      // =====================

      // 1️⃣ deleted attachments
      const deletedAttachments = originalAttachments.filter(
        (orig) => !attachments.find((a) => a.id === orig.id),
      );

      for (const att of deletedAttachments) {
        await deleteSeminarAttachment(existingData.id, att.id);
      }

      // 2️⃣ new attachments (ملهاش id)
      const newAttachments = attachments.filter((a) => !a.id);

      if (newAttachments.length > 0) {
        await uploadSeminarAttachments(existingData.id, newAttachments);
      }

      navigate("/seminars-and-conferences");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update conference");
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
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="p-4 sm:p-6 bg-white min-h-screen"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 inline-block w-full max-w-6xl">
          {t("editConference")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-36 gap-y-6 w-full max-w-6xl"
          >
            {/* RIGHT Column */}
            <div className="space-y-6">
              {/* Type + Local/International */}
              <div className="flex gap-8">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.type")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="seminar"
                        checked={formData.type === "seminar"}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("fields.seminar")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="conference"
                        checked={formData.type === "conference"}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("fields.conference")}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.localOrInternational")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="localOrInternational"
                        value="local"
                        checked={formData.localOrInternational === "local"}
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("fields.local")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="localOrInternational"
                        value="international"
                        checked={
                          formData.localOrInternational === "international"
                        }
                        onChange={handleChange}
                        className="accent-[#B38E19]"
                      />
                      {t("fields.international")}
                    </label>
                  </div>
                </div>
              </div>

              {/* Conference Name */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.conferenceName")}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="conferenceName"
                  placeholder={t("placeholders.conferenceName")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.conferenceName}
                  onChange={handleChange}
                />
              </div>

              {/* Participation Role */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.participationRole")}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    name="participationRole"
                    className={`${inputBase} ${focusStyle} appearance-none flex-1`}
                    value={formData.participationRole}
                    onChange={handleChange}
                  >
                    <option value="">{t("fields.selectRole")}</option>
                    {participationRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {isArabic ? role.valueAr : role.valueEn}
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

              {/* Organizing Body */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.organizingBody")}
                  <span className="text-[#b38e19]">*</span>
                </label>
                <input
                  type="text"
                  name="organizingBody"
                  placeholder={t("placeholders.organizingBody")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.organizingBody}
                  onChange={handleChange}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.website")}
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder={t("placeholders.website")}
                  className={`${inputBase} ${focusStyle}`}
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* LEFT Column */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.startDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.startDate}
                      placeholder={t("placeholders.startDate")}
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
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.endDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.endDate}
                      placeholder={t("placeholders.endDate")}
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
                  {error && (
                    <div className="text-red-600 mb-4 text-sm">{error}</div>
                  )}
                </div>
              </div>

              {/* Country + City */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-lg font-medium">
                    {t("fields.city")}
                  </label>
                  <input
                    type="text"
                    name="venue"
                    placeholder={t("placeholders.city")}
                    className={`${inputBase} ${focusStyle}`}
                    value={formData.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg font-medium">
                  {t("fields.description")}
                </label>
                <textarea
                  name="description"
                  placeholder={t("placeholders.description")}
                  className={`${inputBase} ${focusStyle} h-32 resize-none`}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Attachments */}
              <AttachmentUploader
                label={t("fields.attachments")}
                note={t("attachmentsHint")}
                buttonLabel={t("fields.chooseFile")}
                files={attachments}
                setFiles={setAttachments}
              />
            </div>
          </form>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
              isArabic ? "left-[53px]" : "right-[53px]"
            } bottom-[28px]`}
          >
            {/* Save Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md cursor-pointer font-${
                isArabic ? "cairo" : "roboto"
              } text-sm`}
            >
              {t("save")}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/seminars-and-conferences")}
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
