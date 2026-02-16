import React from "react";
import { useTranslation } from "react-i18next";

import CustomInputField from "../../ui/CustomInputField";
import CustomDateField from "../../ui/CustomDateField";

export default function ParticipationInQualityWorkForm({
  title,
  isArabic,
  formData,
  errors = {},
  handleChange,
  submitForm,
  loading,
}) {
  const { t, i18n } = useTranslation("participation-quality-work-form");
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <form
      dir={dir}
      onSubmit={submitForm}
      style={{
        width: "clamp(320px, 32vw, 600px)",
        padding: "clamp(1rem, 2.5vw, 2rem)",
        borderRadius: "clamp(12px, 1.8vw, 22px)",
        direction: dir,
      }}
      className="bg-[#EDEDED] border-2 border-[#b38e19] shadow-sm mx-auto"
    >
      {/* Header */}
      <div
        className="flex items-center justify-center"
        style={{ marginBottom: "clamp(1rem, 3vw, 2rem)" }}
      >
        <h2
          className="font-semibold text-gray-800"
          style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.6rem)" }}
        >
          {title}
        </h2>
      </div>

      {/* Participation Name */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={t("participation_name")}
          value={formData.participationTitle}
          onChange={(e) => handleChange("participationTitle", e.target.value)}
          placeholder={t("enter_participation_name")}
          error={errors.participationTitle}
          required
          isArabic={isArabic}
        />
      </div>

      {/* Start Date */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomDateField
          label={t("start_date")}
          value={formData.startDate || ""}
          onChange={(val) => handleChange("startDate", val)}
          placeholder={t("select_start_date")}
          error={errors.startDate}
          required
          isArabic={isArabic}
        />
      </div>

      {/* End Date */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomDateField
          label={t("end_date")}
          value={formData.endDate || ""}
          onChange={(val) => handleChange("endDate", val)}
          placeholder={t("select_end_date")}
          error={errors.endDate}
          required
          isArabic={isArabic}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={t("description")}
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={t("enter_description")}
          error={errors.description}
          textarea
          isArabic={isArabic}
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p className="text-red-500 text-center mb-4">{errors.submit}</p>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "clamp(6.5rem, 16vw, 9rem)",
            height: "clamp(2.5rem, 5.5vw, 3.2rem)",
          }}
          className={`bg-[#b38e19] text-white rounded-md font-${
            isArabic ? "cairo" : "roboto"
          }`}
        >
          {loading ? t("loading") : t("save")}
        </button>
      </div>
    </form>
  );
}
