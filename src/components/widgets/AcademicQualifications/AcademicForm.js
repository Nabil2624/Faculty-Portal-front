// src/components/Academic/AcademicForm.jsx
import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import AttachmentUploader from "../../ui/AttachmentUploader";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { GraduationCap } from "lucide-react";

export default function AcademicForm({
  t,
  isArabic,
  lookups,
  formData,
  setFormData,
  attachments,
  setAttachments,
  errors,
  onSave,
  onCancel,
  loading = false,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      <PageHeaderNoAction title={formTitle} icon={GraduationCap} />

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.2rem,1.2vw,4rem)] relative z-20">
            
            {/* Left Column */}
            <div className="space-y-[clamp(0.5rem,1vw,2.5rem)]">
              <CustomDropdown
                label={t("degree")}
                options={lookups.degrees.map((d) => ({
                  id: d.id,
                  label: isArabic ? d.valueAr : d.valueEn,
                }))}
                value={formData.degreeId}
                onChange={(val) => handleChange("degreeId", val)}
                placeholder={t("selectDegree")}
                isArabic={isArabic}
                required
                disabled={loading}
                error={errors.degreeId}
              />

              <CustomDropdown
                label={t("delegation")}
                options={lookups.dispatchTypes.map((d) => ({
                  id: d.id,
                  label: isArabic ? d.valueAr : d.valueEn,
                }))}
                value={formData.delegationId}
                onChange={(val) => handleChange("delegationId", val)}
                placeholder={t("delegation-placeholder")}
                isArabic={isArabic}
                required
                disabled={loading}
                error={errors.delegationId}
              />

              <InputField
                label={t("countryCity")}
                value={formData.countryCity}
                onChange={(e) => handleChange("countryCity", e.target.value)}
                placeholder={t("countryCityPlaceholder")}
                required
                disabled={loading}
                error={errors.countryCity}
              />

              <InputField
                label={t("university/college")}
                value={formData.university}
                onChange={(e) => handleChange("university", e.target.value)}
                placeholder={t("universityPlaceholder")}
                disabled={loading}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-[clamp(0.5rem,1vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <InputField
                label={t("specialization")}
                value={formData.specialization}
                onChange={(e) => handleChange("specialization", e.target.value)}
                placeholder={t("specializationPlaceholder")}
                required
                disabled={loading}
                error={errors.specialization}
              />

              <CustomDropdown
                label={t("grade")}
                options={lookups.grades.map((g) => ({
                  id: g.id,
                  label: isArabic ? g.valueAr : g.valueEn,
                }))}
                value={formData.gradeId}
                onChange={(val) => handleChange("gradeId", val)}
                placeholder={t("selectGrade")}
                isArabic={isArabic}
                disabled={loading}
              />

              <DateField
                label={t("graduationDate")}
                value={formData.graduationDate}
                onChange={(val) => handleChange("graduationDate", val)}
                required
                disabled={loading}
                placeholder={t("graduationDate")}
                isArabic={isArabic}
                error={errors.graduationDate}
              />

              <div className="flex-1 mt-4">
                <AttachmentUploader
                  label={t("attachments")}
                  note={t("subtitle")}
                  buttonLabel={t("chooseFile")}
                  files={attachments}
                  setFiles={setAttachments}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
            <div className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={onSave}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {loading ? t("saving") : t("save")}
                </FormButton>
              </div>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="secondary"
                  onClick={onCancel}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("cancel")}
                </FormButton>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}