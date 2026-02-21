import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import AttachmentUploader from "../AddScientificResearch/AttachmentUploader";

export default function PatentForm({
  title,
  form,
  setForm,
  errors,
  onSave,
  onCancel,
  t,
  isArabic,
}) {
  return (
    <div className="flex flex-col bg-white min-h-[90vh]">
      <div className="flex-1 px-[clamp(16px,1vw,80px)]">
        <h2 className="font-semibold mb-[clamp(20px,3vw,70px)] text-[clamp(20px,2.2vw,60px)] text-start">
          {title}
          <span className="block w-[clamp(40px,5vw,140px)] h-[clamp(3px,0.2vw,8px)] bg-[#b38e19] mt-2 rounded-full" />
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          {/* LEFT SIDE */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
            {/* Local / International */}
            <div>
              <label className="font-medium text-gray-700 text-2xl">
                {t("fields.type")}
                <span className="text-[#B38E19] ml-1">*</span>
              </label>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.localOrInternational === 1}
                    onChange={() =>
                      setForm({ ...form, localOrInternational: 1 })
                    }
                  />
                  {t("fields.local")}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.localOrInternational === 2}
                    onChange={() =>
                      setForm({ ...form, localOrInternational: 2 })
                    }
                  />
                  {t("fields.international")}
                </label>
              </div>

              {errors.localOrInternational && (
                <p className="text-red-500 mt-1">
                  {errors.localOrInternational}
                </p>
              )}
            </div>

            {/* Patent Name */}
            <InputField
              label={t("fields.name")}
              placeholder={t("placeholders.name")}
              value={form.nameOfPatent}
              onChange={(e) =>
                setForm({ ...form, nameOfPatent: e.target.value })
              }
              required
              error={errors.nameOfPatent}
            />

            {/* Accrediting Authority */}
            <InputField
              label={t("fields.authority")}
              placeholder={t("placeholders.authority")}
              value={form.accreditingAuthorityOrCountry}
              onChange={(e) =>
                setForm({
                  ...form,
                  accreditingAuthorityOrCountry: e.target.value,
                })
              }
              required
              error={errors.accreditingAuthorityOrCountry}
            />

            {/* Applying Date */}
            <DateField
              label={t("fields.applyingDate")}
              placeholder={t("placeholders.applyingDate")}
              value={form.applyingDate}
              onChange={(v) => setForm({ ...form, applyingDate: v })}
              required
              error={errors.applyingDate}
              isArabic={isArabic}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-[clamp(30px,2.2vw,60px)]">
            {/* Accreditation Date */}
            <DateField
              label={t("fields.accreditationDate")}
              placeholder={t("placeholders.accreditationDate")}
              value={form.accreditationDate}
              onChange={(v) => setForm({ ...form, accreditationDate: v })}
              error={errors.accreditationDate}
              isArabic={isArabic}
            />
            {/* Description */}
            <InputField
              label={t("fields.description")}
              placeholder={t("placeholders.description")}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              textarea
            />

            <AttachmentUploader
              label={t("fields.attachment")}
              buttonLabel={t("buttons.upload")}
            />
          </div>
        </form>
      </div>

      {/* Buttons */}
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
