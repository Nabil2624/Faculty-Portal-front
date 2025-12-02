import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import CustomDropdown from "./CustomDropdown";

export default function AddJournalForm({ onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    nameOfMagazine: "",
    websiteOfMagazine: "",
    typeOfParticipationId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const response = await axiosInstance.get("/LookUpItems/MagazineParticipationRoles", {
          skipGlobalErrorHandler: true,
        });
        const options = (response.data || []).map((item) => ({
          id: item.id,
          label: isArabic ? item.valueAr : item.valueEn,
        }));
        setTypes(options);
      } catch (err) {
        console.error("Failed to fetch participation types:", err);
        setTypes([
          { id: "research", label: t("research_participation") },
          { id: "review", label: t("review_participation") },
          { id: "other", label: t("other_participation") },
        ]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [i18n.language, isArabic, t]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nameOfMagazine.trim()) newErrors.nameOfMagazine = t("required_journal_name");
    if (!formData.typeOfParticipationId) newErrors.typeOfParticipationId = t("required_participation_type");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.post(
        "/ProjectsAndCommittees/CreateParticipationInMagazine",
        formData,
        { skipGlobalErrorHandler: true }
      );

      if (response.status === 200 && response.data?.id) {
        onSuccess && onSuccess(response.data);
        onCancel && onCancel();
      } else {
        setErrors({ submit: t("submit_error") });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: t("submit_error") });
    } finally {
      setLoading(false);
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
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Plus className="text-[#B38E19] mx-1" size={23} />
        <h2 className="text-xl font-semibold text-gray-800">{t("add_journal")}</h2>
      </div>

      {/* Journal Name */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("journal_name")} <span className="text-[#b38e19]">*</span>
        </label>
        <input
          type="text"
          name="nameOfMagazine"
          value={formData.nameOfMagazine}
          onChange={(e) => handleChange("nameOfMagazine", e.target.value)}
          placeholder={t("enter_journal_name")}
          className={`${inputClass} ${focusClasses}`}
        />
        {errors.nameOfMagazine && (
          <p className="text-red-500 text-sm mt-1">{errors.nameOfMagazine}</p>
        )}
      </div>

      {/* Journal Website */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("journal_website")}
        </label>
        <input
          type="text"
          name="websiteOfMagazine"
          value={formData.websiteOfMagazine}
          onChange={(e) => handleChange("websiteOfMagazine", e.target.value)}
          placeholder={t("enter_journal_website")}
          className={`${inputClass} ${focusClasses}`}
        />
      </div>

      {/* Participation Type */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t("participation_type")} <span className="text-[#b38e19]">*</span>
        </label>
        <CustomDropdown
          value={formData.typeOfParticipationId}
          onChange={(val) => handleChange("typeOfParticipationId", val)}
          options={types}
          placeholder={t("select_participation_type")}
          isArabic={isArabic}
        />
        {errors.typeOfParticipationId && (
          <p className="text-red-500 text-sm mt-1">{errors.typeOfParticipationId}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && <p className="text-red-500 text-center mb-4">{errors.submit}</p>}

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {loading ? t("loading") : t("add")}
        </button>
        <button
          type="button"
          onClick={() => onCancel && onCancel()}
          className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
            isArabic ? "cairo" : "roboto"
          } text-sm`}
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
