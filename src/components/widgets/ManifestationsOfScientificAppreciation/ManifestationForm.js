import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import AttachmentUploader from "../AddScientificResearch/AttachmentUploader";

export default function ManifestationForm({
  title,
  titleOfAppreciation,
  setTitleOfAppreciation,
  issuingAuthority,
  setIssuingAuthority,
  dateOfAppreciation,
  setDateOfAppreciation,
  description,
  setDescription,
  error = {},
  onSave,
  onCancel,
  isArabic,
  t,
}) {
  return (
    <div className="flex flex-col bg-white min-h-[90vh]">
      <div className="flex-1 px-[clamp(16px,1vw,80px)]">
        <h2 className="font-semibold mb-[clamp(20px,3vw,70px)] text-[clamp(20px,2.2vw,60px)] text-start">
          {title}
          <span className="block w-[clamp(40px,5vw,140px)] h-[clamp(3px,0.2vw,8px)] bg-[#b38e19] mt-2 rounded-full" />
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          {/* LEFT COLUMN */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <InputField
              label={t("fields.titleOfAppreciation")}
              value={titleOfAppreciation}
              onChange={(e) => setTitleOfAppreciation(e.target.value)}
              placeholder={t("placeholders.titleOfAppreciation")}
              required
              error={error.titleOfAppreciation}
            />

            <InputField
              label={t("fields.issuingAuthority")}
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              placeholder={t("placeholders.issuingAuthority")}
              required
              error={error.issuingAuthority}
            />

            <DateField
              label={t("fields.dateOfAppreciation")}
              value={dateOfAppreciation}
              onChange={setDateOfAppreciation}
              required
              error={error.dateOfAppreciation}
              placeholder={t("placeholders.dateOfAppreciation")}
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

          {/* RIGHT COLUMN */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <AttachmentUploader
              label={t("fields.attachments")}
              note={t("messages.pdfOnly")}
              buttonLabel={t("buttons.upload")}
            />
          </div>
        </form>
      </div>

      <div
        className="sticky bottom-0 bg-white flex gap-3 p-4"
        style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
      >
        <FormButton variant="secondary" onClick={onCancel}>
          {t("buttons.cancel")}
        </FormButton>

        <FormButton variant="primary" onClick={onSave}>
          {t("buttons.save")}
        </FormButton>
      </div>
    </div>
  );
}
