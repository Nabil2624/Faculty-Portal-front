import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import RadioGroup from "../../ui/RadioGroup";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import AttachmentUploader from "../../ui/AttachmentUploader";
import CommitteeMembersCard from "../AddThesis/CommitteeMembersCard";
import RelatedResearchCard from "../AddThesis/RelatedResearchCard";
import { Newspaper } from "lucide-react";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function ThesisForm({
  values,
  setters,
  helpers,
  errors = {},
  loading = false,
  attachments,
  setAttachments,
  initialAttachments = [],
  formTitle,
  onCancel,
}) {
  const { t, i18n } = useTranslation("AddThesis");
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  // تحويل الدرجات العلمية لخيارات Dropdown
  const degreeOptions = values.grades.map((g) => ({
    id: g.id,
    label: isArabic ? g.valueAr : g.valueEn,
  }));

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] min-h-screen ${dir}`}>
        {/* 1. Header */}
        <PageHeaderNoAction
          title={formTitle || t("pageTitle")}
          icon={Newspaper}
        />

        {/* 2. Main Container */}
        <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(85%,95%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
                <RadioGroup
                  label={t("thesisType")}
                  value={values.thesisType}
                  onChange={setters.setThesisType}
                  disabled={loading}
                  options={[
                    { value: "PHD", label: t("phd") },
                    { value: "Master", label: t("master") },
                  ]}
                />

                <InputField
                  label={t("thesisTitle")}
                  value={values.thesisTitle}
                  onChange={(e) => setters.setThesisTitle(e.target.value)}
                  placeholder={t("thesisTitlePlaceholder")}
                  required
                  textarea
                  disabled={loading}
                  error={errors.thesisTitle}
                  className="min-h-[120px]"
                />

                {/* الدرجة العلمية مع الـ Placeholder */}
                <CustomDropdown
                  label={t("degree")}
                  value={values.degreeId}
                  onChange={setters.setDegreeId}
                  options={degreeOptions}
                  placeholder={t("selectDegree")}
                  isArabic={isArabic}
                  disabled={loading}
                  error={errors.degreeId}
                />

                {/* شبكة التواريخ مع الـ Placeholders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateField
                    label={t("registrationDate")}
                    value={values.registrationDate}
                    onChange={setters.setRegistrationDate}
                    placeholder={t("registrationDatePlaceholder")}
                    required
                    isArabic={isArabic}
                    error={errors.registrationDate}
                  />
                  <DateField
                    label={t("enrollmentDate")}
                    value={values.enrollmentDate}
                    onChange={setters.setEnrollmentDate}
                    placeholder={t("enrollmentDatePlaceholder")}
                    required
                    isArabic={isArabic}
                    error={errors.enrollmentDate}
                  />
                  <DateField
                    label={t("internalDegreeDate")}
                    value={values.internalDegreeDate}
                    onChange={setters.setInternalDegreeDate}
                    placeholder={t("internalDegreeDatePlaceholder")}
                    isArabic={isArabic}
                  />
                  <DateField
                    label={t("jointSupervisionDate")}
                    value={values.jointSupervisionDate}
                    onChange={setters.setJointSupervisionDate}
                    placeholder={t("jointSupervisionDatePlaceholder")}
                    isArabic={isArabic}
                  />
                </div>

                {/* المرفقات */}
                <div className="mt-4">
                  <AttachmentUploader
                    label={t("attachments")}
                    note={t("attachmentsNote")}
                    buttonLabel={t("uploadAttachments")}
                    files={attachments}
                    setFiles={setAttachments}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* القسـم الأيمـن: الإشراف والأبحاث */}
              <div className="space-y-[clamp(1.5rem,2vw,3rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <CommitteeMembersCard
                    t={t}
                    members={values.members}
                    addMember={helpers.addMember}
                    updateMember={helpers.updateMember}
                    isArabic={isArabic}
                    jobLevelOptions={values.employmentDegrees}
                    universityOptions={values.universities}
                  />
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <RelatedResearchCard
                    t={t}
                    researches={values.researches}
                    searchTerm={values.searchTerm}
                    setSearchTerm={setters.setSearchTerm}
                    searchResults={values.searchResults}
                    addSelectedResearch={helpers.addSelectedResearch}
                    removeResearch={helpers.removeResearch}
                  />
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-sm text-center font-medium">
                    {errors.submit}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Footer */}
            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)]">
              <div
                className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={() =>
                      helpers.handleSave(attachments, initialAttachments)
                    }
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
                    {t("back")}
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
