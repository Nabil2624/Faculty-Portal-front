// src/components/missions/ScientificMissionForm.jsx
import React, { useState, useEffect } from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { GraduationCap, PlaneTakeoff } from "lucide-react"; // أيقونة مناسبة للمهمات العلمية
import { missionValidationService } from "../../../services/missionValidationService";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function ScientificMissionForm({
  t,
  isArabic,
  initialData = {},
  onSave,
  onCancel,
  error: apiError = {},
  loading = false,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  /* ================= state ================= */
  const [missionName, setMissionName] = useState(initialData.missionName || "");
  const [countryOrCity, setCountryOrCity] = useState(
    initialData.countryOrCity || "",
  );
  const [universityOrFaculty, setUniversityOrFaculty] = useState(
    initialData.universityOrFaculty || "",
  );
  const [startDate, setStartDate] = useState(initialData.startDate || "");
  const [endDate, setEndDate] = useState(initialData.endDate || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  const [error, setError] = useState({});

  /* ================= submit ================= */
  const handleSubmit = () => {
    const payload = {
      missionName: missionName.trim(),
      countryOrCity: countryOrCity.trim(),
      universityOrFaculty: universityOrFaculty.trim(),
      startDate,
      endDate: endDate || null,
      Description: notes?.trim() || null,
    };

    const newError = missionValidationService(payload, t);
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({});
    onSave(payload);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        <PageHeaderNoAction
          title={formTitle || t("addTask.title")}
          icon={PlaneTakeoff}
        />

        <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
              {/* القسـم الأيسـر */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
                <InputField
                  label={t("fields.task")}
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  placeholder={t("placeholders.task")}
                  required
                  disabled={loading}
                  error={error.missionName || apiError.missionName}
                />

                <InputField
                  label={t("fields.country_city")}
                  value={countryOrCity}
                  onChange={(e) => setCountryOrCity(e.target.value)}
                  placeholder={t("placeholders.country_city")}
                  required
                  disabled={loading}
                  error={error.countryOrCity || apiError.countryOrCity}
                />

                <InputField
                  label={t("fields.university_college")}
                  value={universityOrFaculty}
                  onChange={(e) => setUniversityOrFaculty(e.target.value)}
                  placeholder={t("placeholders.university_college")}
                  disabled={loading}
                  error={apiError.universityOrFaculty}
                />
              </div>

              {/* القسـم الأيمـن */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                  <DateField
                    label={t("fields.startDate")}
                    value={startDate}
                    onChange={setStartDate}
                    required
                    disabled={loading}
                    placeholder={t("placeholders.startDate")}
                    error={error.startDate || apiError.startDate}
                    isArabic={isArabic}
                  />

                  <DateField
                    label={t("fields.endDate")}
                    value={endDate}
                    onChange={setEndDate}
                    disabled={loading}
                    placeholder={t("placeholders.endDate")}
                    error={error.endDate || apiError.endDate}
                    isArabic={isArabic}
                  />
                </div>

                <div className="flex-1">
                  <InputField
                    label={t("fields.description")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("placeholders.description")}
                    textarea
                    disabled={loading}
                    className="h-full min-h-[clamp(150px,12vh,250px)]"
                    error={apiError.notes}
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)]">
              <div
                className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={handleSubmit}
                    loading={loading}
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
    </ResponsiveLayoutProvider>
  );
}
