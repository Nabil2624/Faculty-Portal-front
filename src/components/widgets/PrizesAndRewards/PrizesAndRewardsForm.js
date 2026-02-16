import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import CustomDropdown from "../../ui/CustomDropdown";
import AttachmentUploader from "../AddScientificResearch/AttachmentUploader";

export default function PrizesAndRewardsForm({
  title,
  prizeId,
  setPrizeId,
  awardingAuthority,
  setAwardingAuthority,
  dateReceived,
  setDateReceived,
  description,
  setDescription,
  attachments,
  setAttachments,
  error = {},
  onSave,
  onCancel,
  t,
  isArabic,
  prizesOptions = [],
}) {
  return (
    <div className="flex flex-col bg-white min-h-[90vh]">
      <div className="flex-1 px-[clamp(16px,1vw,80px)]">
        <h2 className="font-semibold mb-[clamp(20px,3vw,70px)] text-[clamp(20px,2.2vw,60px)] text-start">
          {title}
          <span className="block w-[clamp(40px,5vw,140px)] h-[clamp(3px,0.2vw,8px)] bg-[#B38E19] mt-2 rounded-full" />
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            {/* Prize dropdown */}
            <CustomDropdown
              label={t("fields.prize")}
              value={prizeId}
              onChange={setPrizeId}
              options={prizesOptions.map((p) => ({
                id: p.id,
                label: isArabic ? p.valueAr : p.valueEn,
              }))}
              placeholder={t("placeholders.prize")}
              error={error.prizeId}
              isArabic={isArabic}
            />

            <InputField
              label={t("fields.awardingAuthority")}
              value={awardingAuthority}
              onChange={(e) => setAwardingAuthority(e.target.value)}
              placeholder={t("placeholders.awardingAuthority")}
              required
              error={error.awardingAuthority}
            />

            <DateField
              label={t("fields.dateReceived")}
              value={dateReceived}
              onChange={setDateReceived}
              required
              error={error.dateReceived}
              placeholder={t("placeholders.dateReceived")}
              isArabic={isArabic}
            />

            <InputField
              label={t("fields.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("placeholders.description")}
              textarea
              error={error.description}
            />
          </div>

          {/* Right column for attachments */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            <AttachmentUploader
              label={t("fields.attachments")}
              buttonLabel={t("buttons.addAttachment")}
              note={t("placeholders.attachmentsNote")}
              value={attachments}
              onChange={setAttachments}
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
