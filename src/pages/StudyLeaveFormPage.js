import React, { useState, useEffect } from "react";
import { FormSection } from "../components/ui/FormSection";
import { RadioCard } from "../components/ui/RadioCard";
import { InputFieldForm } from "../components/ui/InputFieldForm";
import { CheckboxCard } from "../components/ui/CheckboxCard";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import { FileUploader } from "../components/ui/FileUploader";
import { KnowledgeBase } from "../components/ui/KnowledgeBaseSection";

export default function StudyLeaveFormPage() {
  const { t, i18n } = useTranslation("StudyLeaveForm");
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    appointmentDate: "",
    currentJob: "",
    department: "",
    email: "",
    phone: "",
    nationalId: "",
    phdDate: "",
    dispatchType: "scientificMission", // scientificMission | training | other
    dispatchTypeOther: "",
    dispatchDestination: "",
    country: "",
    fundingSource: "",
    expensesCoverage: "fundingExists", // fundingExists | noFunding
    fundingValue: "",
    startDate: "",
    endDate: "",
    salaryStatus: "withSalary", // withSalary | withoutSalary
    deptSessionNo: "",
    deptSessionDate: "",
    facultySessionNo: "",
    facultySessionDate: "",
    uniContribution: "withContribution", // withContribution | withoutContribution
  });

  const [attachments, setAttachments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    // تعيين المرفقات الافتراضية بناءً على الاستمارة الورقية
    setAttachments([
      {
        attachmentId: 1,
        attachmentName: t("attachments.applicationLetter"),
      },
    ]);
  }, [isArabic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFundingDisabled = formData.expensesCoverage === "noFunding";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    console.log("Uploaded Files:", uploadedFiles);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen p-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 max-w-4xl mx-auto py-4"
        >
          {/* هيدر السستم المتناسق مع الهوية الأكاديمية */}
          <div
            className={`border-[#b38e19] py-2 mb-6 ${
              isArabic
                ? "border-r-[clamp(6px,1vw,10px)] pr-4"
                : "border-l-[clamp(6px,1vw,10px)] pl-4"
            }`}
          >
            <h1 className="text-[clamp(1.2rem,1.8vw,2.5rem)] font-bold text-[#19355a]">
              {t("formTitle")}
            </h1>
            <p className="text-[clamp(0.75rem,0.9vw,1.2rem)] text-gray-500 font-medium mt-1">
              {t("officeTitle")}
            </p>
          </div>

          {/* 1. بيانات العضو */}
          <FormSection title={t("memberData")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputFieldForm
                label={t("name")}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("placeholders.name")}
              />

              <InputFieldForm
                label={t("appointmentDate")}
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                placeholder={t("placeholders.appointmentDate")}
              />

              <InputFieldForm
                label={t("currentJob")}
                name="currentJob"
                value={formData.currentJob}
                onChange={handleInputChange}
                placeholder={t("placeholders.currentJob")}
              />

              <InputFieldForm
                label={t("department")}
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder={t("placeholders.department")}
              />

              <InputFieldForm
                label={t("phone")}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("placeholders.phone")}
              />

              <InputFieldForm
                label={t("email")}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("placeholders.email")}
              />

              <InputFieldForm
                label={t("nationalId")}
                name="nationalId"
                value={formData.nationalId}
                onChange={handleInputChange}
                placeholder={t("placeholders.nationalId")}
              />

              <InputFieldForm
                label={t("phdDate")}
                type="date"
                name="phdDate"
                value={formData.phdDate}
                onChange={handleInputChange}
                placeholder={t("placeholders.phdDate")}
              />
            </div>
          </FormSection>

          {/* 2. بيانات الإجازة الدراسية */}
          <FormSection title={t("leaveData")}>
            {/* نوع الإيفاد */}
            <div className="p-4 bg-white rounded-[clamp(8px,1vw,14px)] space-y-3 border border-slate-200">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("dispatchType")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RadioCard
                  label={t("scientificMission")}
                  name="dispatchType"
                  value="scientificMission"
                  checked={formData.dispatchType === "scientificMission"}
                  onChange={handleInputChange}
                />
                <RadioCard
                  label={t("training")}
                  name="dispatchType"
                  value="training"
                  checked={formData.dispatchType === "training"}
                  onChange={handleInputChange}
                />
                <RadioCard
                  label={t("other")}
                  name="dispatchType"
                  value="other"
                  checked={formData.dispatchType === "other"}
                  onChange={handleInputChange}
                />
              </div>

              {formData.dispatchType === "other" && (
                <div className="pt-2 animate-fadeIn">
                  <InputFieldForm
                    label={t("otherDetails")}
                    name="dispatchTypeOther"
                    value={formData.dispatchTypeOther}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.otherDetails")}
                  />
                </div>
              )}
            </div>

            {/* تفاصيل الوجهة والتمويل */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <InputFieldForm
                label={t("dispatchDestination")}
                name="dispatchDestination"
                value={formData.dispatchDestination}
                onChange={handleInputChange}
                placeholder={t("placeholders.dispatchDestination")}
              />
              <InputFieldForm
                label={t("country")}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder={t("placeholders.country")}
              />
              <InputFieldForm
                label={t("fundingSource")}
                name="fundingSource"
                value={formData.fundingSource}
                onChange={handleInputChange}
                placeholder={t("placeholders.fundingSource")}
              />
            </div>

            {/* مدى تحمل الجهة للنفقات مع إضافة الشروط كـ Bullet Points الذكية */}
            <div className="mt-5 p-4 bg-white rounded-[clamp(8px,1vw,14px)] space-y-4 border border-slate-200">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("expensesCoverage")}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* خيار يوجد تمويل */}
                <div className="flex flex-col space-y-2">
                  <RadioCard
                    label={t("fundingExists")}
                    name="expensesCoverage"
                    value="fundingExists"
                    checked={formData.expensesCoverage === "fundingExists"}
                    onChange={handleInputChange}
                  />
                  <ul className="list-disc list-inside text-xs text-amber-700 bg-amber-50/50 p-2 rounded-md font-medium border border-amber-100/70">
                    <li>{t("fundingExistsNote")}</li>
                  </ul>
                </div>

                {/* خيار لا يوجد تمويل */}
                <div className="flex flex-col space-y-2">
                  <RadioCard
                    label={t("noFunding")}
                    name="expensesCoverage"
                    value="noFunding"
                    checked={formData.expensesCoverage === "noFunding"}
                    onChange={handleInputChange}
                  />
                  <ul className="list-disc list-inside text-xs text-blue-700 bg-blue-50/50 p-2 rounded-md font-medium border border-blue-100/70">
                    <li>{t("noFundingNote")}</li>
                  </ul>
                </div>
              </div>

              {/* حقل القيمة (يغلق تلقائيًا بالاعتماد على الـ State) */}
              <div className="grid grid-cols-1 md:grid-cols-3 pt-2">
                <InputFieldForm
                  label={t("fundingValue")}
                  name="fundingValue"
                  value={isFundingDisabled ? "" : formData.fundingValue}
                  onChange={handleInputChange}
                  disabled={isFundingDisabled}
                  placeholder={
                    isFundingDisabled
                      ? t("placeholders.disabledValue")
                      : t("placeholders.fundingValue")
                  }
                />
              </div>
            </div>
          </FormSection>

          {/* 3. المدة والموافقات */}
          <FormSection title={t("approvalsAndDuration")}>
            {/* حقول المدة المحددة بالاستمارة */}
            <div className="p-4 bg-white border border-slate-200 rounded-[clamp(8px,1vw,14px)] space-y-4">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("duration")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputFieldForm
                  label={t("startDate")}
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.startDate")}
                />
                <InputFieldForm
                  label={t("endDate")}
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.endDate")}
                />
              </div>

              {/* بمرتب أو بدون مرتب */}
              <div className="flex gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="salaryStatus"
                    value="withSalary"
                    checked={formData.salaryStatus === "withSalary"}
                    onChange={handleInputChange}
                    className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                  />
                  {t("withSalary")}
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="salaryStatus"
                    value="withoutSalary"
                    checked={formData.salaryStatus === "withoutSalary"}
                    onChange={handleInputChange}
                    className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                  />
                  {t("withoutSalary")}
                </label>
              </div>
            </div>

            {/* مجالس القسم والكلية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* مجلس القسم */}
              <div className="p-4 bg-white border border-slate-200 rounded-[clamp(8px,1vw,14px)] space-y-3">
                <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                  {t("deptApproval")}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <InputFieldForm
                    label={t("sessionNo")}
                    name="deptSessionNo"
                    value={formData.deptSessionNo}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.sessionNo")}
                  />
                  <InputFieldForm
                    label={t("sessionDate")}
                    type="date"
                    name="deptSessionDate"
                    value={formData.deptSessionDate}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.sessionDate")}
                  />
                </div>
              </div>

              {/* مجلس الكلية */}
              <div className="p-4 bg-white border border-slate-200 rounded-[clamp(8px,1vw,14px)] space-y-3">
                <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                  {t("facultyApproval")}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <InputFieldForm
                    label={t("sessionNo")}
                    name="facultySessionNo"
                    value={formData.facultySessionNo}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.sessionNo")}
                  />
                  <InputFieldForm
                    label={t("sessionDate")}
                    type="date"
                    name="facultySessionDate"
                    value={formData.facultySessionDate}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.sessionDate")}
                  />
                </div>
                {/* الخيارات الخاصة بمساهمة الجامعة المذكورة بالورقة */}
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="uniContribution"
                      value="withContribution"
                      checked={formData.uniContribution === "withContribution"}
                      onChange={handleInputChange}
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />
                    {t("withContribution")}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="uniContribution"
                      value="withoutContribution"
                      checked={
                        formData.uniContribution === "withoutContribution"
                      }
                      onChange={handleInputChange}
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />
                    {t("withoutContribution")}
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 4. المرفقات المذكورة في أسفل الورقة */}
          <FormSection title={t("attachments.title")}>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-[12px] mb-6 text-sm text-blue-900">
              <h3 className="font-bold mb-2">{t("attachments.req_title")}</h3>
              <ul className="list-disc list-inside space-y-1">
                {attachments.map((attachment) => (
                  <li key={attachment.attachmentId}>
                    {attachment.attachmentName}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attachments.map((attachment) => (
                <FileUploader
                  key={attachment.attachmentId}
                  label={attachment.attachmentName}
                  onUpload={(file) => {
                    setUploadedFiles((prev) => ({
                      ...prev,
                      [attachment.attachmentId]: {
                        attachmentId: attachment.attachmentId,
                        attachmentName: attachment.attachmentName,
                        file,
                      },
                    }));
                  }}
                />
              ))}
            </div>
          </FormSection>

          {/* المعرفة الذكية المدمجة في نظامك */}
          <KnowledgeBase dispatchType={formData.dispatchType} />

          {/* أزرار الحفظ والإرسال */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="w-full bg-[#19355a] text-white font-bold 
            py-[clamp(0.6rem,1vw,1.2rem)] px-6 rounded-[clamp(8px,1vw,14px)] shadow-md 
            hover:bg-[#112540] active:scale-[0.99] transition-all 
            text-[clamp(0.9rem,1.1vw,1.4rem)] tracking-wide
            focus:outline-none focus:ring-2 focus:ring-[#19355a]/40"
            >
              {t("submit")}
            </button>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold 
            py-[clamp(0.6rem,1vw,1.2rem)] px-6 rounded-[clamp(8px,1vw,14px)] shadow-md 
            hover:bg-green-700 active:scale-[0.99] transition-all 
            text-[clamp(0.9rem,1.1vw,1.4rem)] tracking-wide
            focus:outline-none focus:ring-2 focus:ring-green-600/40"
            >
              {t("send")}
            </button>
          </div>
        </form>
      </div>
    </ResponsiveLayoutProvider>
  );
}
