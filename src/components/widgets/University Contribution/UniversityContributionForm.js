import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

import Dropdown from "../../ui/Dropdown";
import CustomInputField from "../../ui/CustomInputField";
import TextareaField from "../../ui/TextareaField";

export default function UniversityContributionForm({
  title,
  types = [],
  loadingTypes,
  isArabic,
  formData,
  errors = {},
  handleChange,
  submitForm,
  loading,
}) {
  const { t, i18n } = useTranslation("university-contribution-form");
  const dir = i18n.dir();

  /* 🔥 نحول الـ types لشكل مناسب للـ Dropdown */
  const mappedTypes = useMemo(() => {
    return types.map((type) => ({
      value: type.id,
      label: isArabic ? type.valueAr : type.valueEn,
    }));
  }, [types, isArabic]);

  return (
    <form
      dir={dir}
      onSubmit={submitForm}
      style={{
        width: "clamp(320px, 32vw, 600px)",
        padding: "clamp(1rem, 2.5vw, 2rem)",
        borderRadius: "clamp(12px, 1.8vw, 22px)",
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

      {/* Contribution Name */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={`${t("contribution_name")} *`}
          value={formData.contributionName || ""}
          onChange={(e) =>
            handleChange("contributionName", e.target.value)
          }
          placeholder={t("enter_contribution_name")}
          error={errors.contributionName}
          required
        />
      </div>

      {/* Contribution Type */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <label className="block font-medium mb-2">
          {`${t("contribution_type")} *`}
        </label>

        <Dropdown
          value={formData.contributionTypeId || ""}
          onChange={(val) =>
            handleChange("contributionTypeId", val)
          }
          options={mappedTypes}
          placeholder={t("select_contribution_type")}
          error={errors.contributionTypeId}
          disabled={loadingTypes}
        />
      </div>

      {/* Contribution Date */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={`${t("contribution_date")} *`}
          type="date"
          icon={<Calendar />}
          value={formData.contributionDate || ""}
          onChange={(e) =>
            handleChange("contributionDate", e.target.value)
          }
          placeholder={t("select_contribution_date")}
          error={errors.contributionDate}
          required
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <TextareaField
          label={t("description")}
          value={formData.description || ""}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
          placeholder={t("enter_description")}
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p className="text-red-500 text-center mb-4">
          {errors.submit}
        </p>
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
