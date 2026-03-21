import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { HandHeart, HandHelping } from "lucide-react";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function CommunityServiceContributionsForm({
  formData,
  errors = {},
  handleChange,
  submitForm,
  onCancel,
  loading,
  formTitle,
}) {
  const { t, i18n } = useTranslation("university-contribution-form");
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        {/* 1. Header */}
        <PageHeaderNoAction title={formTitle || t("title")} icon={HandHeart} />

        {/* 2. Main Container */}
        <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
            <form
              onSubmit={submitForm}
              className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20"
            >
              {/* القسـم الأيسـر - البيانات الأساسية */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
                <InputField
                  label={t("contribution_name")}
                  value={formData.contributionName || ""}
                  onChange={(e) =>
                    handleChange("contributionName", e.target.value)
                  }
                  placeholder={t("enter_contribution_name")}
                  error={errors.contributionName}
                  required
                  disabled={loading}
                />

                <DateField
                  label={t("contribution_date")}
                  value={formData.contributionDate || ""}
                  onChange={(val) => handleChange("contributionDate", val)}
                  placeholder={t("select_contribution_date")}
                  error={errors.contributionDate}
                  required
                  disabled={loading}
                  isArabic={isArabic}
                />
              </div>

              {/* القسـم الأيمـن - الوصف */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
                <div className="flex-1">
                  <InputField
                    label={t("description")}
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder={t("enter_description")}
                    error={errors.description}
                    textarea
                    disabled={loading}
                    className="h-full min-h-[clamp(200px,25vh,400px)]"
                  />
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-sm text-center font-medium">
                    {errors.submit}
                  </p>
                )}
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
                    onClick={submitForm}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {loading ? t("loading") : t("save")}
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
    </ResponsiveLayoutProvider>
  );
}
