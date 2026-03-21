import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { GraduationCap, Presentation } from "lucide-react"; // أيقونة مناسبة للتدريس

export default function TeachingExperienceForm({
  title,
  courseName,
  setCourseName,
  academicLevel,
  setAcademicLevel,
  universityOrFaculty,
  setUniversityOrFaculty,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  error = {},
  onSave,
  onCancel,
  isArabic,
  t,
  loading = false,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  // دالة المعالجة للتأكد من منع الـ Refresh الافتراضي
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave();
  };

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      {/* 1. Header */}
      <PageHeaderNoAction title={title || t("title")} icon={Presentation} />

      {/* 2. Main Container */}
      <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
            {/* القسـم الأيسـر (بيانات الدورة والجامعة) */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              <InputField
                label={t("fields.course")}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder={t("placeholders.course")}
                required
                disabled={loading}
                error={error.courseName}
              />

              <InputField
                label={t("fields.academicLevel")}
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                placeholder={t("placeholders.AcademicLevel")}
                required
                disabled={loading}
                error={error.academicLevel}
              />

              <InputField
                label={t("fields.university")}
                value={universityOrFaculty}
                onChange={(e) => setUniversityOrFaculty(e.target.value)}
                placeholder={t("placeholders.university")}
                required
                disabled={loading}
                error={error.universityOrFaculty}
              />
            </div>

            {/* القسـم الأيمـن (الوصف) */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                <DateField
                  label={t("fields.startDate")}
                  value={startDate}
                  onChange={setStartDate}
                  required
                  disabled={loading}
                  placeholder={t("placeholders.startDate")}
                  error={error.startDate}
                  isArabic={isArabic}
                />
                <DateField
                  label={t("fields.endDate")}
                  value={endDate}
                  onChange={setEndDate}
                  disabled={loading}
                  placeholder={t("placeholders.endDate")}
                  error={error.endDate}
                  isArabic={isArabic}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label={t("fields.description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholders.description")}
                  textarea
                  disabled={loading}
                  className="h-full min-h-[clamp(150px,12vh,300px)]"
                  error={error.description}
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
                  onClick={handleSubmit}
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
