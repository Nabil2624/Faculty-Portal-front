// src/components/Missions/MissionForm.jsx
import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { Briefcase } from "lucide-react";
import { useMissionForm } from "../../../hooks/useMissionForm";

export default function MissionForm({
  t,
  isArabic,
  initialData = null,
  onSave,
  onCancel,
  loading = false,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";
  
  // الهوك الآن شايل الداتا، الأخطاء، والتحقق
  const { formData, handleChange, errors, validate } = useMissionForm(initialData, t);

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      <PageHeaderNoAction title={formTitle} icon={Briefcase} />

      <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
            {/* القـسم الأيـسر */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              <InputField
                label={t("fields.task")}
                value={formData.missionName}
                onChange={(e) => handleChange("missionName", e.target.value)}
                placeholder={t("placeholders.task")}
                required
                disabled={loading}
                error={errors.missionName}
              />

              <InputField
                label={t("fields.country_city")}
                value={formData.countryOrCity}
                onChange={(e) => handleChange("countryOrCity", e.target.value)}
                placeholder={t("placeholders.country_city")}
                required
                disabled={loading}
                error={errors.countryCity}
              />

              <InputField
                label={t("fields.university_college")}
                value={formData.universityOrFaculty}
                onChange={(e) => handleChange("universityOrFaculty", e.target.value)}
                placeholder={t("placeholders.university_college")}
                disabled={loading}
              />
            </div>

            {/* القـسم الأيمـن */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                <DateField
                  label={t("fields.startDate")}
                  value={formData.startDate}
                  onChange={(val) => handleChange("startDate", val)}
                  required
                  disabled={loading}
                  placeholder={t("placeholders.startDate")}
                  isArabic={isArabic}
                  error={errors.startDate}
                />

                <DateField
                  label={t("fields.endDate")}
                  value={formData.endDate}
                  onChange={(val) => handleChange("endDate", val)}
                  disabled={loading}
                  placeholder={t("placeholders.endDate")}
                  isArabic={isArabic}
                  error={errors.endDate}
                />
              </div>

              <div className="flex-1">
                <InputField
                  label={t("fields.description")}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder={t("placeholders.description")}
                  textarea
                  disabled={loading}
                  className="h-full min-h-[clamp(120px,10vh,200px)]"
                />
              </div>
            </div>
          </form>

          {/* الفـوتر */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
            <div className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {loading ? t("loading") : t("buttons.save")}
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