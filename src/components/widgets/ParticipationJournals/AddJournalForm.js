import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import Dropdown from "../../ui/Dropdown";
import CustomInputField from "../../ui/CustomInputField";

import useAddJournal from "../../../hooks/useAddJournal";
import useMagazineParticipationTypes from "../../../hooks/useMagazineParticipationTypes";

export default function AddJournalForm({ onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    nameOfMagazine: "",
    websiteOfMagazine: "",
    typeOfParticipationId: "",
  });

  const { types, loading: loadingTypes } = useMagazineParticipationTypes();
  const { submit, loading, errors } = useAddJournal({ onCancel, onSuccess });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(formData);
  };

  return (
    <form
      dir={dir}
      onSubmit={handleSubmit}
      style={{
        /* فرق واضح بين الموبايل والشاشات الكبيرة */
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
        <Plus
          className="text-[#B38E19]"
          style={{
            width: "clamp(20px, 3vw, 28px)",
            height: "clamp(20px, 3vw, 28px)",
            marginInline: "0.5rem",
          }}
        />
        <h2
          className="font-semibold text-gray-800"
          style={{
            fontSize: "clamp(1.1rem, 2.6vw, 1.6rem)",
          }}
        >
          {t("add_journal")}
        </h2>
      </div>

      {/* Journal Name */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={t("journal_name")}
          value={formData.nameOfMagazine}
          onChange={(e) =>
            handleChange("nameOfMagazine", e.target.value)
          }
          placeholder={t("enter_journal_name")}
          error={errors.nameOfMagazine}
          required
        />
      </div>

      {/* Journal Website */}
      <div style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        <CustomInputField
          label={t("journal_website")}
          value={formData.websiteOfMagazine}
          onChange={(e) =>
            handleChange("websiteOfMagazine", e.target.value)
          }
          placeholder={t("enter_journal_website")}
        />
      </div>

      {/* Participation Type */}
      <div style={{ marginBottom: "clamp(1rem, 2.5vw, 1.5rem)" }}>
        <label
          className="block font-medium"
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            marginBottom: "clamp(0.5rem, 1.5vw, 0.75rem)",
          }}
        >
          {t("participation_type")}
          <span className="text-[#b38e19] ml-1">*</span>
        </label>

        <Dropdown
          value={formData.typeOfParticipationId}
          onChange={(val) =>
            handleChange("typeOfParticipationId", val)
          }
          options={types}
          placeholder={t("select_participation_type")}
          error={errors.typeOfParticipationId}
          disabled={loadingTypes}
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p
          className="text-red-500 text-center"
          style={{
            fontSize: "clamp(0.8rem, 1.8vw, 0.95rem)",
            marginBottom: "clamp(0.75rem, 2vw, 1rem)",
          }}
        >
          {errors.submit}
        </p>
      )}

      {/* Actions */}
      <div
        className="flex justify-center"
        style={{ marginTop: "clamp(1.25rem, 4vw, 2.25rem)" }}
      >
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "clamp(6.5rem, 16vw, 9rem)",
            height: "clamp(2.5rem, 5.5vw, 3.2rem)",
            fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)",
          }}
          className={`bg-[#b38e19] text-white rounded-md font-${
            isArabic ? "cairo" : "roboto"
          }`}
        >
          {loading ? t("loading") : t("add")}
        </button>
      </div>
    </form>
  );
}
