import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { Briefcase } from "lucide-react";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function AdminPositionForm({
  t,
  isArabic,
  formData,
  onChange,
  onSave,
  onCancel,
  loading,
  error,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        <PageHeaderNoAction title={formTitle} icon={Briefcase} />

        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[clamp(350px,45vw,800px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[clamp(1.2rem,1vw,2rem)] p-[clamp(1.2rem,1.5vw,4rem)] relative z-20"
            >
              {/* 1. المنصب الإداري */}
              <InputField
                label={t("admin_pos")}
                value={formData.position}
                onChange={(e) => onChange("position", e.target.value)}
                placeholder={t("position_placeholder")}
                required
                disabled={loading}
                error={error.position ? t("admin-position-required") : ""}
              />

              {/* 2. التواريخ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                <DateField
                  label={t("start_date")}
                  value={formData.startDate}
                  onChange={(val) => onChange("startDate", val)}
                  required
                  disabled={loading}
                  placeholder={t("select_start_date")}
                  error={error.startDate ? t("startDate-required") : ""}
                  isArabic={isArabic}
                />

                <DateField
                  label={t("end_date")}
                  value={formData.endDate}
                  onChange={(val) => onChange("endDate", val)}
                  disabled={loading}
                  placeholder={t("select_end_date")}
                  isArabic={isArabic}
                  error={error.endDate}
                />
              </div>

              {/* 3. الملاحظات */}
              <InputField
                label={t("notes")}
                value={formData.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder={t("notes_placeholder")}
                textarea
                disabled={loading}
                className="min-h-[clamp(100px,12vh,180px)]"
              />

              {error.api && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center">
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
