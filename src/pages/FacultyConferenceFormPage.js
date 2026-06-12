import React, { useState, useEffect } from "react";
import { FormSection } from "../components/ui/FormSection";
import { RadioCard } from "../components/ui/RadioCard";
import { InputFieldForm } from "../components/ui/InputFieldForm";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import { CustomSelect } from "../components/ui/CustomSelect";
import { FileUploader } from "../components/ui/FileUploader";
import { BulletPointsFieldForm } from "../components/ui/BulletPointsFieldForm";

export default function FacultyConferenceFormPage() {
  const { t, i18n } = useTranslation("faculty-conference");
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    conferenceTitle: "",
    holdingDate: "",
    conferenceType: "",
    holdingPlace: "",
    attendanceType: "physical", 
    coordinatorName: "",
    coordinatorMobile: "",
    collaboratingEntities: [], 
    foreignParticipants: "no", 
    sponsors: [],
    expectedExpenses: "",
    expectedRevenues: "",
    deptSessionNo: "",
    deptSessionDate: "",
    facultySessionNo: "",
    facultySessionDate: "",
    uniContribution: "without", 
    deanApproval: "",
    lastConfName: "",
    lastConfDate: "",
    lastConfPlace: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    let baseAttachments = [
      {
        attachmentId: 1,
        attachmentName: isArabic
          ? "محاور وأهداف المؤتمر"
          : "Conference axes and objectives",
      },
      {
        attachmentId: 2,
        attachmentName: isArabic
          ? "قائمة بالجهات التي سيتم إرسال خطابات إليها"
          : "List of targeted entities for invitations",
      },
      {
        attachmentId: 3,
        attachmentName: isArabic
          ? "مشروع الميزانية التقديرية (إيرادات ومصروفات)"
          : "Estimated budget draft",
      },
      {
        attachmentId: 4,
        attachmentName: isArabic
          ? "العائد المتوقع الاقتصادي والعلمي"
          : "Expected economic/scientific return",
      },
    ];

    if (formData.foreignParticipants === "yes") {
      baseAttachments = [
        ...baseAttachments,
        {
          attachmentId: 5,
          attachmentName: isArabic
            ? "أسماء المشاركين الأجانب وجنسياتهم"
            : "Foreign participants names and nationalities",
        },
        {
          attachmentId: 6,
          attachmentName: isArabic
            ? "صور جوازات السفر للمشاركين الأجانب"
            : "Passports copies of foreign participants",
        },
      ];
    }

    setAttachments(baseAttachments);
  }, [formData.foreignParticipants, isArabic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data", formData);
    console.log("Uploaded Files", uploadedFiles);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen p-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 max-w-4xl mx-auto py-4"
        >
          {/* Header */}
          <div
            className={`border-[#b38e19] py-2 mb-6 ${isArabic ? "border-r-[clamp(6px,1vw,10px)] pr-4" : "border-l-[clamp(6px,1vw,10px)] pl-4"}`}
          >
            <h1 className="text-[clamp(1.2rem,1.8vw,2.5rem)] font-bold text-[#19355a]">
              {t("formTitle")}
            </h1>
            <p className="text-[clamp(0.75rem,0.9vw,1.2rem)] text-gray-500 font-medium mt-1">
              {t("officeTitle")} | QF-06/CRO/PR-01
            </p>
          </div>

          {/* 1. بيانات المؤتمر */}
          <FormSection title={t("conferenceDetails")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputFieldForm
                label={t("conferenceTitle")}
                name="conferenceTitle"
                value={formData.conferenceTitle}
                onChange={handleInputChange}
                placeholder={t("placeholders.conferenceTitle")}
              />

              <CustomSelect
                label={t("conferenceType")}
                placeholder={t("placeholders.selectType")}
                value={formData.conferenceType}
                onChange={handleInputChange}
                options={[
                  {
                    value: "international",
                    label: t("conferenceTypes.international"),
                  },
                  { value: "local", label: t("conferenceTypes.local") },
                  { value: "symposium", label: t("conferenceTypes.symposium") },
                  { value: "workshop", label: t("conferenceTypes.workshop") },
                  { value: "forum", label: t("conferenceTypes.forum") },
                ]}
              />

              <InputFieldForm
                label={t("holdingDate")}
                type="date"
                name="holdingDate"
                value={formData.holdingDate}
                onChange={handleInputChange}
                placeholder={t("placeholders.holdingDate")}
              />

              <InputFieldForm
                label={t("holdingPlace")}
                name="holdingPlace"
                value={formData.holdingPlace}
                onChange={handleInputChange}
                placeholder={t("placeholders.holdingPlace")}
              />

              {/* نوع الحضور */}
              <div className="md:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block text-sm font-bold text-[#19355a] mb-2">
                  {t("attendanceType")}
                </span>
                <div className="flex gap-4">
                  <RadioCard
                    label={t("physical")}
                    name="attendanceType"
                    value="physical"
                    checked={formData.attendanceType === "physical"}
                    onChange={handleInputChange}
                  />
                  <RadioCard
                    label={t("virtual")}
                    name="attendanceType"
                    value="virtual"
                    checked={formData.attendanceType === "virtual"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <InputFieldForm
                label={t("coordinatorName")}
                name="coordinatorName"
                value={formData.coordinatorName}
                onChange={handleInputChange}
                placeholder={t("placeholders.coordinatorName")}
              />

              <InputFieldForm
                label={t("coordinatorMobile")}
                type="tel"
                name="coordinatorMobile"
                value={formData.coordinatorMobile}
                onChange={handleInputChange}
                placeholder={t("placeholders.coordinatorMobile")}
              />

              <div className="md:col-span-2">
                <BulletPointsFieldForm
                  label={t("collaboratingEntities")}
                  name="collaboratingEntities"
                  value={formData.collaboratingEntities}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.collaboratingEntities")}
                />
              </div>

              {/* المشاركين الأجانب */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block text-sm font-bold text-[#19355a] mb-2">
                  {t("foreignParticipants")}
                </span>
                <div className="flex gap-4">
                  <RadioCard
                    label={t("yes")}
                    name="foreignParticipants"
                    value="yes"
                    checked={formData.foreignParticipants === "yes"}
                    onChange={handleInputChange}
                  />
                  <RadioCard
                    label={t("no")}
                    name="foreignParticipants"
                    value="no"
                    checked={formData.foreignParticipants === "no"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <BulletPointsFieldForm
                  label={t("sponsors")}
                  name="sponsors"
                  value={formData.sponsors}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.sponsors")}
                />
              </div>
            </div>
          </FormSection>

          {/* 2. التفاصيل المالية */}
          <FormSection title={t("financialDetails")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputFieldForm
                label={t("expectedRevenues")}
                type="number"
                name="expectedRevenues"
                value={formData.expectedRevenues}
                onChange={handleInputChange}
                placeholder={t("placeholders.expectedRevenues")}
              />
              <InputFieldForm
                label={t("expectedExpenses")}
                type="number"
                name="expectedExpenses"
                value={formData.expectedExpenses}
                onChange={handleInputChange}
                placeholder={t("placeholders.expectedExpenses")}
              />
            </div>
          </FormSection>

          {/* 3. الموافقات الإدارية والمجالس */}
          <FormSection title={t("administrativeApprovals")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="uniContribution"
                      value="with"
                      checked={formData.uniContribution === "with"}
                      onChange={handleInputChange}
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />
                    {t("withContribution")}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="uniContribution"
                      value="without"
                      checked={formData.uniContribution === "without"}
                      onChange={handleInputChange}
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />
                    {t("withoutContribution")}
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <InputFieldForm
                  label={t("deanApproval")}
                  name="deanApproval"
                  value={formData.deanApproval}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.deanApproval")}
                />
              </div>
            </div>
          </FormSection>

          {/* 4. مساهمات سابقة */}
          <FormSection title={t("previousContributions")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFieldForm
                label={t("lastConfName")}
                name="lastConfName"
                value={formData.lastConfName}
                onChange={handleInputChange}
                placeholder={t("placeholders.lastConfName")}
              />
              <InputFieldForm
                label={t("lastConfDate")}
                type="date"
                name="lastConfDate"
                value={formData.lastConfDate}
                onChange={handleInputChange}
                placeholder={t("placeholders.lastConfDate")}
              />
              <InputFieldForm
                label={t("lastConfPlace")}
                name="lastConfPlace"
                value={formData.lastConfPlace}
                onChange={handleInputChange}
                placeholder={t("placeholders.lastConfPlace")}
              />
            </div>
          </FormSection>

          {/* 5. المرفقات */}
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

          {/* أزرار الإرسال */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="w-full bg-[#19355a] text-white font-bold py-[clamp(0.6rem,1vw,1.2rem)] px-6 rounded-[clamp(8px,1vw,14px)] shadow-md hover:bg-[#112540] active:scale-[0.99] transition-all text-[clamp(0.9rem,1.1vw,1.4rem)] tracking-wide focus:outline-none focus:ring-2 focus:ring-[#19355a]/40"
            >
              {t("submit")}
            </button>
            <button
              type="button"
              className="w-full bg-green-600 text-white font-bold py-[clamp(0.6rem,1vw,1.2rem)] px-6 rounded-[clamp(8px,1vw,14px)] shadow-md hover:bg-green-700 active:scale-[0.99] transition-all text-[clamp(0.9rem,1.1vw,1.4rem)] tracking-wide focus:outline-none focus:ring-2 focus:ring-green-600/40"
            >
              {t("send")}
            </button>
          </div>
        </form>
      </div>
    </ResponsiveLayoutProvider>
  );
}
