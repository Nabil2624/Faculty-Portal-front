import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import Dropdown from "../../ui/Dropdown"; // استيراد الـ Dropdown الخاص بك
import { GraduationCap, Milestone } from "lucide-react";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";
import CustomDropdown from "../../ui/CustomDropdown";

export default function JobGradeForm({
  t,
  isArabic,
  formData,
  degrees,
  onChange,
  onSave,
  onCancel,
  loading,
  loadingDegrees,
  error,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  // تحويل البيانات لشكل يقبله الـ Dropdown المخصص (عادة id و value)
  const degreeOptions = degrees.map((deg) => ({
    id: deg.id,
    label: isArabic ? deg.valueAr : deg.valueEn,
  }));

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        <PageHeaderNoAction title={formTitle} icon={Milestone} />

        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[clamp(350px,45vw,800px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
              }}
              className="flex flex-col gap-[clamp(1.2rem,1vw,2rem)] p-[clamp(1.2rem,1.5vw,4rem)] relative z-20"
            >
              {/* اختيار الدرجة الوظيفية باستخدام الـ Custom Dropdown */}
              <CustomDropdown
                label={t("job_grade")}
                options={degreeOptions}
                value={formData.jobGrade}
                onChange={(val) => onChange("jobGrade", val)} // نمرر القيمة المباشرة
                placeholder={
                  loadingDegrees ? t("loading") : t("select_job_grade")
                }
                error={error.jobGrade}
                disabled={loading || loadingDegrees}
                required
              />

              {/* التاريخ */}
              <DateField
                label={t("grade_date")}
                value={formData.gradeDate}
                onChange={(val) => onChange("gradeDate", val)}
                required
                disabled={loading}
                placeholder={t("select_grade_date")}
                error={error.gradeDate}
                isArabic={isArabic}
              />

              {/* الملاحظات */}
              <InputField
                label={t("notes")}
                value={formData.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder={t("notes_placeholder")}
                textarea
                disabled={loading}
                className="min-h-[clamp(100px,12vh,150px)]"
              />

              {error.api && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                  {error.api}
                </div>
              )}
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
              <div
                className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="min-w-[clamp(140px,6vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={onSave}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,2.5vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {t("save")}
                  </FormButton>
                </div>
                <div className="min-w-[clamp(140px,6vw,220px)]">
                  <FormButton
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,2.5vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
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
