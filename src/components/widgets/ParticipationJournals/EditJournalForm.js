import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pen } from "lucide-react";

import Dropdown from "../../ui/Dropdown";
import CustomInputField from "../../ui/CustomInputField";

import useEditJournal from "../../../hooks/useEditJournal";
import useMagazineParticipationTypes from "../../../hooks/useMagazineParticipationTypes";

export default function EditJournalForm({ data, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("journal-forms");
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    nameOfMagazine: "",
    websiteOfMagazine: "",
    typeOfParticipationId: "",
  });

  const { types, loading: loadingTypes } =
    useMagazineParticipationTypes();

  const { submit, loading, errors } = useEditJournal({
    id: data?.id,
    onCancel,
    onSuccess,
  });

  useEffect(() => {
    if (!data || !types.length) return;

    const matchedType = types.find(
      (t) =>
        t.label ===
        (isArabic
          ? data.typeOfParticipation?.valueAr
          : data.typeOfParticipation?.valueEn)
    );

    setFormData({
      nameOfMagazine: data.nameOfMagazine ?? "",
      websiteOfMagazine: data.websiteOfMagazine ?? "",
      typeOfParticipationId: matchedType?.id ?? "",
    });
  }, [data, types, isArabic]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      key={i18n.language}
      dir={dir}
      onSubmit={(e) => {
        e.preventDefault();
        submit(formData);
      }}
      style={{
        width: "clamp(320px, 32vw, 600px)",
        padding: "clamp(1.25rem, 2.5vw, 2.25rem)",
        borderRadius: "clamp(14px, 1.8vw, 22px)",
      }}
      className="
        bg-[#F6F6F6]
        border border-[#D6B55C]
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        mx-auto
      "
    >
      {/* Header */}
      <div
        className="flex items-center justify-center text-center"
        style={{ marginBottom: "clamp(1.25rem, 3vw, 2rem)" }}
      >
        <Pen
          className="text-[#B38E19]"
          style={{
            width: "clamp(20px, 2.8vw, 26px)",
            height: "clamp(20px, 2.8vw, 26px)",
            marginInline: "0.5rem",
          }}
        />
        <h2
          className="font-semibold text-gray-800"
          style={{ fontSize: "clamp(1.15rem, 2.6vw, 1.6rem)" }}
        >
          {t("edit_journal")}
        </h2>
      </div>

      {/* Fields */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.9rem, 2vw, 1.4rem)",
        }}
      >
        <CustomInputField
          label={t("journal_name")}
          value={formData.nameOfMagazine}
          onChange={(e) =>
            handleChange("nameOfMagazine", e.target.value)
          }
          placeholder={t("enter_journal_name")}
          required
          error={errors.nameOfMagazine}
        />

        <CustomInputField
          label={t("journal_website")}
          value={formData.websiteOfMagazine}
          onChange={(e) =>
            handleChange("websiteOfMagazine", e.target.value)
          }
          placeholder={t("enter_journal_website")}
        />

        <div>
          <label
            className="block font-medium text-gray-700"
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
            disabled={loadingTypes}
            error={errors.typeOfParticipationId}
          />
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p
          className="text-red-500 text-center"
          style={{
            fontSize: "clamp(0.8rem, 1.8vw, 0.95rem)",
            marginTop: "clamp(0.75rem, 2vw, 1rem)",
          }}
        >
          {errors.submit}
        </p>
      )}

      {/* Actions */}
      <div
        className="flex justify-center"
        style={{ marginTop: "clamp(1.5rem, 4vw, 2.25rem)" }}
      >
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "clamp(6.5rem, 16vw, 9rem)",
            height: "clamp(2.5rem, 5.5vw, 3.2rem)",
            fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)",
          }}
          className="bg-[#b38e19] text-white rounded-md shadow-sm hover:opacity-90 transition"
        >
          {loading ? t("loading") : t("save")}
        </button>
      </div>
    </form>
  );
}
