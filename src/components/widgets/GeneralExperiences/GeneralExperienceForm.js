import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";

export default function GeneralExperienceForm({
  title,
  t,
  isArabic,

  experience,
  setExperience,

  countryCity,
  setCountryCity,

  authority,
  setAuthority,

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  description,
  setDescription,

  error = {},

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
            {/* الخبرة */}
            <InputField
              label={t("fields.experience")}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder={t("placeholders.experience")}
              required
              error={error.experience}
            />

            {/* الدولة / المدينة */}
            <InputField
              label={t("fields.countryCity")}
              value={countryCity}
              onChange={(e) => setCountryCity(e.target.value)}
              placeholder={t("placeholders.countryCity")}
              required
              error={error.countryCity}
            />
            {/* الجهة */}
            <InputField
              label={t("fields.authority")}
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              placeholder={t("placeholders.authority")}
              required
              error={error.authority}
            />

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
          </div>

          {/* RIGHT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            {/* الوصف */}
            <InputField
              label={t("fields.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("placeholders.description")}
              textarea
            />
          </div>
        </form>
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
