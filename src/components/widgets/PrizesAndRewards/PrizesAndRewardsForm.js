import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import CustomDropdown from "../../ui/CustomDropdown";
import AttachmentUploader from "../../ui/AttachmentUploader";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { Award } from "lucide-react"; // أيقونة الجوائز

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
  loading = false,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  const prizesDropdownOptions = prizesOptions.map((p) => ({
    id: p.id,
    label: isArabic ? p.valueAr : p.valueEn,
  }));

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      {/* 1. Header بنفس الاستايل */}
      <PageHeaderNoAction title={title} icon={Award} />

      {/* 2. Main Container */}
      <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
            
            {/* القسـم الأيسـر - المعلومات الأساسية */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              
              <div className="relative z-[100]">
                <CustomDropdown
                  label={t("fields.prize")}
                  value={prizeId}
                  onChange={setPrizeId}
                  options={prizesDropdownOptions}
                  placeholder={t("placeholders.prize")}
                  isArabic={isArabic}
                  required
                  disabled={loading}
                  error={error.prizeId}
                />
              </div>

              <InputField
                label={t("fields.awardingAuthority")}
                value={awardingAuthority}
                onChange={(e) => setAwardingAuthority(e.target.value)}
                placeholder={t("placeholders.awardingAuthority")}
                required
                disabled={loading}
                error={error.awardingAuthority}
              />

              <DateField
                label={t("fields.dateReceived")}
                value={dateReceived}
                onChange={setDateReceived}
                required
                disabled={loading}
                placeholder={t("placeholders.dateReceived")}
                error={error.dateReceived}
                isArabic={isArabic}
              />
            </div>

            {/* القسـم الأيمـن - الوصف والمرفقات */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              
              <InputField
                label={t("fields.description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("placeholders.description")}
                textarea
                disabled={loading}
                className="min-h-[clamp(120px,10vh,200px)]"
                error={error.description}
              />

              <div className="flex-1">
                <AttachmentUploader
                  label={t("fields.attachments")}
                  buttonLabel={t("buttons.addAttachment")}
                  note={t("placeholders.attachmentsNote")}
                  files={attachments}
                  setFiles={setAttachments}
                  disabled={loading}
                />
              </div>
            </div>
          </form>

          {/* 3. Footer بنفس الاستايل والألوان */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
            <div
              className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={onSave}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("buttons.save")}
                </FormButton>
              </div>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="secondary"
                  onClick={onCancel}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("buttons.cancel")}
                </FormButton>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}