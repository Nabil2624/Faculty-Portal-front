// CommitteeAssociationForm.jsx
import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";

export default function ScientificWritingForm({
  formTitle,
  t,
  isArabic,

  title,
  setTitle,

  role,
  setRole,
  roles = [],

  isbn,
  setIsbn,

  setPublishingHouse,
  publishingHouse,

  publishingDate,
  setPublishingDate,

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
          {formTitle}
          <span className="block w-[clamp(40px,5vw,140px)] h-[clamp(3px,0.2vw,8px)] bg-[#b38e19] mt-2 rounded-full" />
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          {/* LEFT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <InputField
              label={t("fields.Booktitle")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("placeholders.Booktitle")}
              required
              error={error.title}
            />

            {/* TYPE */}
            <div>
              <label className="block mb-2 font-medium text-[clamp(14px,1.2vw,32px)]">
                {t("fields.role")} <span className="text-[#b38e19]">*</span>
              </label>

              <CustomDropdown
                value={role}
                onChange={setRole}
                options={roles.map((item) => ({
                  id: item.id,
                  label: isArabic ? item.valueAr : item.valueEn,
                }))}
                placeholder={t("placeholders.role")}
                isArabic={isArabic}
              />

              {error.role && (
                <p className="text-red-500 text-sm mt-1">{error.role}</p>
              )}
            </div>
            <InputField
              label={t("fields.isbn")}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder={t("placeholders.isbn")}
              required
              error={error.isbn}
            />
            <InputField
              label={t("fields.publishingHouse")}
              value={publishingHouse}
              onChange={(e) => setPublishingHouse(e.target.value)}
              placeholder={t("placeholders.publishingHouse")}
              required
              error={error.publishingHouse}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <DateField
              label={t("fields.publishingDate")}
              value={publishingDate}
              onChange={setPublishingDate}
              required
              error={error.publishingDate}
              placeholder={t("placeholders.publishingDate")}
              isArabic={isArabic}
            />

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
