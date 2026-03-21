import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import RadioGroup from "../../ui/RadioGroup";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { GraduationCap } from "lucide-react";
import { useTrainingForm } from "../../../hooks/useTrainingForm";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function TrainingProgramForm({
  t,
  isArabic,
  initialData = {},
  onSave,
  onCancel,
  loading = false,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";
  const { formData, setFormData, errors, handleSubmit } = useTrainingForm(
    initialData,
    onSave,
    t,
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        <PageHeaderNoAction title={formTitle} icon={GraduationCap} />

        <main className="flex-1 p-[clamp(0.2rem,0.3vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.2rem,1.5vw,4rem)] relative z-20">
              {/* القسـم الأيسـر */}
              <div className="space-y-[clamp(1rem,1vw,2.5rem)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RadioGroup
                    label={t("programType")}
                    value={formData.programType}
                    onChange={(val) => updateField("programType", Number(val))}
                    options={[
                      { value: 1, label: t("specialist") },
                      { value: 2, label: t("general") },
                    ]}
                  />
                  <RadioGroup
                    label={t("participationType")}
                    value={formData.participationType}
                    onChange={(val) =>
                      updateField("participationType", Number(val))
                    }
                    options={[
                      { value: 1, label: t("internal") },
                      { value: 2, label: t("external") },
                    ]}
                  />
                </div>

                <InputField
                  label={t("programName")}
                  value={formData.programName}
                  onChange={(e) => updateField("programName", e.target.value)}
                  placeholder={t("programNamePlaceholder")}
                  required
                  error={errors.programName}
                />

                <InputField
                  label={t("organizingBody")}
                  value={formData.organizingAuthority}
                  onChange={(e) =>
                    updateField("organizingAuthority", e.target.value)
                  }
                  placeholder={t("organizingBodyPlaceholder")}
                  required
                  error={errors.organizingAuthority}
                />
              </div>

              {/* القسـم الأيمـن */}
              <div className="space-y-[clamp(1rem,1vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
                <InputField
                  label={isArabic ? "مكان الانعقاد" : "Location"}
                  value={formData.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                  placeholder={t("locationPlaceholder")}
                  required
                  error={errors.venue}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                  <DateField
                    label={t("startDate")}
                    value={formData.startDate}
                    onChange={(val) => updateField("startDate", val)}
                    required
                    isArabic={isArabic}
                    error={errors.startDate}
                    placeholder={t("startDatePlaceholder")}
                  />
                  <DateField
                    label={t("endDate")}
                    value={formData.endDate}
                    onChange={(val) => updateField("endDate", val)}
                    isArabic={isArabic}
                    error={errors.endDate}
                    placeholder={t("endDatePlaceholder")}
                  />
                </div>

                <div className="flex-1">
                  <InputField
                    label={t("description")}
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    textarea
                    className="h-full min-h-[clamp(150px,12vh,250px)]"
                  />
                </div>
              </div>
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
              <div
                className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)]"
                  >
                    {loading ? t("loading") : t("save")}
                  </FormButton>
                </div>
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)]"
                  >
                    {t("cancel")}
                  </FormButton>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </ResponsiveLayoutProvider>
  );
}
