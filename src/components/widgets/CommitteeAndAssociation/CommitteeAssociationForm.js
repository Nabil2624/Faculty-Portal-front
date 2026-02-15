// CommitteeAssociationForm.jsx
import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";

export default function CommitteeAssociationForm({
  title,
  t,
  isArabic,

  committee,
  setCommittee,

  typeValue,
  setTypeValue,
  types = [],

  degreeValue,
  setDegreeValue,
  degrees = [],

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  description,
  setDescription,

  error = {},
  serverError = "",

  onSave,
  onCancel,
}) {
  return (
    <div className="flex flex-col bg-white min-h-[90vh]">
      <div className="flex-1 px-[clamp(16px,1vw,80px)]">
        {/* TITLE */}
        <h2 className="font-semibold mb-[clamp(20px,3vw,70px)] text-[clamp(20px,2.2vw,60px)] text-start">
          {title}
          <span className="block w-[clamp(40px,5vw,140px)] h-[clamp(3px,0.2vw,8px)] bg-[#b38e19] mt-2 rounded-full" />
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          {/* LEFT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <InputField
              label={t("fields.committee")}
              value={committee}
              onChange={(e) => setCommittee(e.target.value)}
              placeholder={t("placeholders.committee")}
              required
              error={error.committee}
            />

            {/* TYPE */}
            <div>
              <label className="block mb-2 font-medium text-[clamp(14px,1.2vw,32px)]">
                {t("fields.type")} <span className="text-[#b38e19]">*</span>
              </label>

              <CustomDropdown
                value={typeValue}
                onChange={setTypeValue}
                options={types.map((item) => ({
                  id: item.id,
                  label: isArabic ? item.valueAr : item.valueEn,
                }))}
                placeholder={t("placeholders.type")}
                isArabic={isArabic}
              />

              {error.typeValue && (
                <p className="text-red-500 text-sm mt-1">{error.typeValue}</p>
              )}
            </div>

            {/* DEGREE */}
            <div>
              <label className="block mb-2 font-medium text-[clamp(14px,1.2vw,32px)]">
                {t("fields.degree")} <span className="text-[#b38e19]">*</span>
              </label>

              <CustomDropdown
                value={degreeValue}
                onChange={setDegreeValue}
                options={degrees.map((item) => ({
                  id: item.id,
                  label: isArabic ? item.valueAr : item.valueEn,
                }))}
                placeholder={t("placeholders.degree")}
                isArabic={isArabic}
              />

              {error.degreeValue && (
                <p className="text-red-500 text-sm mt-1">{error.degreeValue}</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(12px,1.5vw,40px)]">
              <DateField
                label={t("fields.startDate")}
                value={startDate}
                onChange={setStartDate}
                required
                error={error.startDate}
                placeholder={t("placeholders.startDate")}
                isArabic={isArabic}
              />

              <DateField
                label={t("fields.endDate")}
                value={endDate}
                onChange={setEndDate}
                error={error.endDate}
                placeholder={t("placeholders.endDate")}
                isArabic={isArabic}
              />
            </div>

            <InputField
              label={t("fields.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("placeholders.description")}
              textarea
            />
          </div>
        </form>

        {/* Server Error */}
        {serverError && (
          <p className="text-red-500 text-sm mt-4">{serverError}</p>
        )}
      </div>

      {/* FOOTER */}
      <div
        className="sticky bottom-0 bg-white flex gap-3 p-4"
        style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
      >
        <FormButton variant="primary" onClick={onSave}>
          {t("buttons.save")}
        </FormButton>

        <FormButton variant="secondary" onClick={onCancel}>
          {t("buttons.cancel")}
        </FormButton>
      </div>
    </div>
  );
}
