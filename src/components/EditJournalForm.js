import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pen, ChevronDown } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import CustomDropdown from "./CustomDropdown";

export default function EditJournalForm({ data, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [participationRoles, setParticipationRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [formData, setFormData] = useState({
    nameOfMagazine: "",
    websiteOfMagazine: "",
    participationType: "", // this will store the ID
  });

  const [errors, setErrors] = useState({});

  // Load existing data
  useEffect(() => {
    if (data) {
      setFormData({
        nameOfMagazine: data.nameOfMagazine || "",
        websiteOfMagazine: data.websiteOfMagazine || "",
        participationType: data.participationTypeId || "",
      });
    }
  }, [data]);

  // Fetch participation roles
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await axiosInstance.get(
          "/LookUpItems/MagazineParticipationRoles",
          { skipGlobalErrorHandler: true }
        );

        setParticipationRoles(res.data || []);
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    }

    fetchRoles();
  }, []);

  const validate = () => {
    const errs = {};

    if (!formData.nameOfMagazine.trim()) errs.nameOfMagazine = t("required");
    if (!formData.participationType) errs.participationType = t("required");

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null })); // remove local error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      nameOfMagazine: formData.nameOfMagazine,
      websiteOfMagazine: formData.websiteOfMagazine,
      typeOfParticipationId:  formData.participationType,
  
    };

    try {
      await axiosInstance.put(
        `/ProjectsAndCommittees/UpdateParticipationInMagazine/${data.id}`,
        payload,
        { skipGlobalErrorHandler: true }
      );

      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-800 transition duration-150 bg-[#E2E2E2]";
  const focusClasses =
    "focus:outline-none focus:ring-2 focus:ring-[#B38E19] transition duration-150 shadow";

  return (
    <form
      key={i18n.language}
      dir={dir}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-6 bg-[#EDEDED] border-[#b38e19] border-2 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-center mb-6">
        <Pen className="text-[#B38E19] mx-1" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">
          {t("edit_journal")}
        </h2>
      </div>

      {/* Journal Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">
          {t("journal_name")} <span className="text-[#B38E19]">*</span>
        </label>

        <input
          type="text"
          name="nameOfMagazine"
          value={formData.nameOfMagazine}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_journal_name")}
        />

        {errors.nameOfMagazine && (
          <p className="text-red-600 text-xs mt-1">{errors.nameOfMagazine}</p>
        )}
      </div>

      {/* Journal Website */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">
          {t("journal_website")}
        </label>

        <input
          type="text"
          name="websiteOfMagazine"
          value={formData.websiteOfMagazine}
          onChange={handleChange}
          className={`${inputClass} ${focusClasses}`}
          placeholder={t("enter_journal_website")}
        />
      </div>

      {/* Participation Type */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">
          {t("participation_type")} <span className="text-[#B38E19]">*</span>
        </label>

        <CustomDropdown
          value={formData.participationType}
          onChange={(val) => {
            setFormData({ ...formData, participationType: val });
            setErrors((prev) => ({ ...prev, participationType: null }));
          }}
          options={participationRoles.map((role) => ({
            id: role.id,
            label: isArabic ? role.valueAr : role.valueEn,
          }))}
          placeholder={t("select_participation_type")}
          isArabic={isArabic}
        />

        {errors.participationType && (
          <p className="text-red-600 text-xs mt-1">
            {errors.participationType}
          </p>
        )}

        {errors.participationType && (
          <p className="text-red-600 text-xs mt-1">
            {errors.participationType}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          type="submit"
          className="bg-[#b38e19] text-white w-24 h-10 rounded-md text-sm"
        >
          {t("save")}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black w-24 h-10 rounded-md text-sm"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
