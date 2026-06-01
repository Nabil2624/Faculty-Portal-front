import React, { useState } from "react";
import { FormSection } from "../components/ui/FormSection";
import { RadioCard } from "../components/ui/RadioCard";
import { InputFieldForm } from "../components/ui/InputFieldForm";
import { CheckboxCard } from "../components/ui/CheckboxCard";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import { CustomSelect } from "../components/ui/CustomSelect";
import { FileUploader } from "../components/ui/FileUploader";
import { KnowledgeBase } from "../components/ui/KnowledgeBaseSection";
export default function ExternalConferenceForm() {
  const { t, i18n } = useTranslation("ExternalForm");
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    currentJob: "",
    appointmentDate: "",
    department: "",
    email: "",
    phone: "",
    nationalId: "",
    lastAttendanceDate: "",
    lastGrantDate: "",
    deptSessionDate: "",
    facultySessionDate: "",
    country: "",
    conferenceName: "",
    value: "",
    aboutConference: "",
    duration: "",
    location: "",
    organizer: "",
    expensesCoverage: "",
    participation: "researchPresenter", // 💡 القيمة الابتدائية الافتراضية (مقدم بحث)
    acceptanceType: "",
    researchName: "",
    fees: "",
    deptSessionNo: "",
    facultySessionNo: "",
    deanApproval: "",
    substituteWorker: "",
  });

  const [isFirstTime, setIsFirstTime] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 💡 لمعرفة هل المستخدم اختار "مستمع فقط" لتعطيل الحقول
  const isListenerOnly = formData.participation === "listenerOnly";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("بيانات الفورم النهائية جاهزة للإرسال:", formData);
  };

  // 💡 ستايل الدروب داون الموحد بنفس حجم الارتفاع h-12 والبادنج الصغير

  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen p-2 ">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 max-w-4xl mx-auto py-4"
        >
          {/* هيدر السستم */}
          <div
            className={`border-[#b38e19] py-2 mb-6 ${isArabic ? "border-r-[clamp(6px,1vw,10px)] pr-4" : "border-l-[clamp(6px,1vw,10px)] pl-4"}`}
          >
            <h1 className="text-[clamp(1.2rem,1.8vw,2.5rem)] font-bold text-[#19355a]">
              {t("formTitle")}
            </h1>
            <p className="text-[clamp(0.75rem,0.9vw,1.2rem)] text-gray-500 font-medium mt-1">
              {t("officeTitle")} | QF-04/CRO/PR-01
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
                label={t("department")}
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder={t("placeholders.department")}
              />

              <InputFieldForm
                label={t("currentJob")}
                name="currentJob"
                value={formData.currentJob}
                onChange={handleInputChange}
                placeholder={t("placeholders.currentJob")}
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
            </div>

            {/* تفاصيل آخر حضور */}
            <div className="mt-5 p-4 bg-white rounded-[clamp(8px,1vw,14px)] space-y-4 border border-slate-200">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("lastAttendance")}
              </span>

              <div className="w-fit pb-1">
                <CheckboxCard
                  label={t("firstTime")}
                  checked={isFirstTime}
                  onChange={(e) => setIsFirstTime(e.target.checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <InputFieldForm
                  label={t("date")}
                  type="date"
                  name="lastAttendanceDate"
                  value={formData.lastAttendanceDate}
                  onChange={handleInputChange}
                  disabled={isFirstTime}
                  placeholder={t("placeholders.lastAttendanceDate")}
                />
                <InputFieldForm
                  label={t("country")}
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isFirstTime}
                  placeholder={t("placeholders.country")}
                />
                <InputFieldForm
                  label={t("conferenceName")}
                  name="conferenceName"
                  value={formData.conferenceName}
                  onChange={handleInputChange}
                  disabled={isFirstTime}
                  placeholder={t("placeholders.conferenceName")}
                />
              </div>
            </div>

            {/* تفاصيل آخر مساهمة */}
            <div className="mt-4 p-4 bg-white rounded-[clamp(8px,1vw,14px)] space-y-3 border border-slate-200">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("lastGrant")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputFieldForm
                  label={t("value")}
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.value")}
                />
                <InputFieldForm
                  label={t("aboutConference")}
                  name="aboutConference"
                  value={formData.aboutConference}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.aboutConference")}
                />
                <InputFieldForm
                  label={t("date")}
                  type="date"
                  name="lastGrantDate"
                  value={formData.lastGrantDate}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.lastGrantDate")}
                />
              </div>
            </div>
          </FormSection>

          {/* 2. بيانات المؤتمر الراغب السفر إليه */}
          <FormSection title={t("travelDetails")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputFieldForm
                label={t("conferenceName")}
                name="conferenceName"
                value={formData.conferenceName}
                onChange={handleInputChange}
                placeholder={t("placeholders.conferenceName")}
              />
              <InputFieldForm
                label={t("duration")}
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder={t("placeholders.duration")}
              />
              <InputFieldForm
                label={t("location")}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t("placeholders.location")}
              />
              <InputFieldForm
                label={t("organizer")}
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder={t("placeholders.organizer")}
              />
              <div className="md:col-span-2">
                <InputFieldForm
                  label={t("expensesCoverage")}
                  name="expensesCoverage"
                  value={formData.expensesCoverage}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.expensesCoverage")}
                />
              </div>
            </div>

            {/* نوع المشاركة وتفاصيل البحث */}
            <div className="mt-5 p-4 bg-white rounded-[clamp(8px,1vw,14px)] space-y-4 border border-slate-200">
              <span className="block text-[clamp(0.85rem,1vw,1.2rem)] font-bold text-[#19355a]">
                {t("participationType")}
              </span>

              {/* 💡 ربط الريديو كاردز بالـ State الموحدة وقيمها الحالية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RadioCard
                  label={t("researchPresenter")}
                  name="participation"
                  value="researchPresenter"
                  checked={formData.participation === "researchPresenter"}
                  onChange={handleInputChange}
                />
                <RadioCard
                  label={t("listenerOnly")}
                  name="participation"
                  value="listenerOnly"
                  checked={formData.participation === "listenerOnly"}
                  onChange={handleInputChange}
                />
                <CheckboxCard label={t("online")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 💡 تحويل "نوع القبول" لـ Dropdown ذكي يقفل تلقائياً إذا كان مستمع فقط */}
                <CustomSelect
                  label={t("acceptanceType")}
                  placeholder={t("placeholders.acceptanceType")}
                  value={formData.acceptanceType}
                  onChange={handleInputChange}
                  disabled={isListenerOnly}
                  options={[
                    { value: "oral", label: t("acceptanceOptions.oral") },
                    { value: "poster", label: t("acceptanceOptions.poster") },
                    { value: "publish", label: t("acceptanceOptions.publish") },
                  ]}
                />

                {/* 💡 حقل "اسم البحث" يقفل تلقائياً إذا كان مستمع فقط */}
                <InputFieldForm
                  label={t("researchName")}
                  name="researchName"
                  value={formData.researchName}
                  onChange={handleInputChange}
                  disabled={isListenerOnly}
                  placeholder={t("placeholders.researchName")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <InputFieldForm
                  label={t("fees")}
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.fees")}
                />
              </div>
            </div>
          </FormSection>

          {/* 3. الموافقات الإدارية والمجالس */}
          <FormSection title={t("deptApproval") + " & " + t("facultyApproval")}>
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
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="uni_contrib"
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />{" "}
                    {t("withContribution")}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="uni_contrib"
                      className="text-[#19355a] focus:ring-[#19355a]/20 focus:outline-none accent-[#19355a]"
                    />{" "}
                    {t("withoutContribution")}
                  </label>
                </div>
              </div>
            </div>

            {/* موافقة العميد والبديل */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <InputFieldForm
                label={t("deanApproval")}
                name="deanApproval"
                value={formData.deanApproval}
                onChange={handleInputChange}
                placeholder={t("placeholders.deanApproval")}
              />
              <InputFieldForm
                label={t("substituteWorker")}
                name="substituteWorker"
                value={formData.substituteWorker}
                onChange={handleInputChange}
                placeholder={t("placeholders.substituteWorker")}
              />
            </div>
          </FormSection>
          <FormSection title={t("attachments.title")}>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-[12px] mb-6 text-sm text-blue-900">
              <h3 className="font-bold mb-2">{t("attachments.req_title")}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("attachments.req1")}</li>
                <li>{t("attachments.req2")}</li>
                <li>{t("attachments.req3")}</li>
                <li>{t("attachments.req4")}</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploader label={t("attachments.upload1")} />
              <FileUploader label={t("attachments.upload2")} />
              <FileUploader label={t("attachments.upload3")} />
              <FileUploader label={t("attachments.upload4")} />
            </div>
          </FormSection>
          <KnowledgeBase participationType={formData.participation} />
          {/* زر الحفظ */}
          <div className="pt-2">
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
          </div>
        </form>
      </div>
    </ResponsiveLayoutProvider>
  );
}
