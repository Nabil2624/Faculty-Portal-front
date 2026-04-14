import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import RadioGroup from "../../ui/RadioGroup";
import AttachmentUploader from "../../ui/AttachmentUploader";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { Award } from "lucide-react";

export default function PatentForm({
  title,
  form,
  setForm,
  errors,
  onSave,
  onCancel,
  t,
  isArabic,
  attachments,
  setAttachments,
  loading = false,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  // دالة المعالجة لضمان إرسال الأرقام (1 أو 2) كما كان في الكود القديم
  const handleRadioChange = (val) => {
    // نتحقق من القيمة المختارة ونحولها للرقم المقابل
    const numericValue = val === t("fields.local") ? 1 : 2;
    setForm({ ...form, localOrInternational: numericValue });
  };

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      {/* 1. Header */}
      <PageHeaderNoAction title={title || t("title")} icon={Award} />

      {/* 2. Main Container */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          <form 
            className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,1.6vw,4rem)] relative z-20"
            onSubmit={(e) => e.preventDefault()} // منع الفورم من عمل Refresh
          >
            
            {/* القسـم الأيسـر */}
            <div className="space-y-[clamp(1rem,1.4vw,2.5rem)]">
              <RadioGroup
                label={t("fields.type")}
                // نربط الـ value بالقيمة النصية عشان الـ UI يلقط الاختيار
                value={form.localOrInternational === 1 ? t("fields.local") : t("fields.international")}
                onChange={handleRadioChange}
                disabled={loading}
                options={[
                  { value: t("fields.local"), label: t("fields.local") },
                  { value: t("fields.international"), label: t("fields.international") },
                ]}
              />
              {errors.localOrInternational && (
                <p className="text-red-500 text-sm mt-[-1rem]">{errors.localOrInternational}</p>
              )}

              <InputField
                label={t("fields.name")}
                value={form.nameOfPatent || ""}
                onChange={(e) => setForm({ ...form, nameOfPatent: e.target.value })}
                placeholder={t("placeholders.name")}
                required
                disabled={loading}
                error={errors.nameOfPatent}
              />

              <InputField
                label={t("fields.authority")}
                value={form.accreditingAuthorityOrCountry || ""}
                onChange={(e) => setForm({ ...form, accreditingAuthorityOrCountry: e.target.value })}
                placeholder={t("placeholders.authority")}
                required
                disabled={loading}
                error={errors.accreditingAuthorityOrCountry}
              />

              <DateField
                label={t("fields.applyingDate")}
                value={form.applyingDate}
                onChange={(v) => setForm({ ...form, applyingDate: v })}
                required
                disabled={loading}
                placeholder={t("placeholders.applyingDate")}
                error={errors.applyingDate}
                isArabic={isArabic}
              />
            </div>

            {/* القسـم الأيمـن */}
            <div className="space-y-[clamp(1rem,1.4vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <DateField
                label={t("fields.accreditationDate")}
                value={form.accreditationDate}
                onChange={(v) => setForm({ ...form, accreditationDate: v })}
                disabled={loading}
                placeholder={t("placeholders.accreditationDate")}
                error={errors.accreditationDate}
                isArabic={isArabic}
              />

              <InputField
                label={t("fields.description")}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t("placeholders.description")}
                textarea
                disabled={loading}
                className="min-h-[clamp(100px,8vh,180px)]"
              />

              <div className="mt-auto">
                <AttachmentUploader
                  label={t("fields.attachment")}
                  buttonLabel={t("buttons.upload")}
                  files={attachments}
                  setFiles={setAttachments}
                  disabled={loading}
                />
              </div>
            </div>
          </form>

          {/* 3. Footer */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
            <div
              className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={onSave} // تأكد أن الـ Parent مبيعملش e.preventDefault() بطريقة غلط
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