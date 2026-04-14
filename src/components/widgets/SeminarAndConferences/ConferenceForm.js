import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Award } from "lucide-react";

// UI Components
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import RadioGroup from "../../ui/RadioGroup";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import AttachmentUploader from "../../ui/AttachmentUploader";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";
import LoadingSpinner from "../../LoadingSpinner";

// Hook
import useConferenceForm from "../../../hooks/useConferenceForm";

export default function ConferenceForm({
  pageTitle,
  pageIcon,
  initialData = null,
  isEdit = false,
}) {
  const { t, i18n } = useTranslation("add-conference");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

const {
  formData,
  setFormData,
  roles,
  loading,
  save,
  attachments,
  setAttachments,
  markAttachmentForDeletion,
} = useConferenceForm(initialData);


  const [errors, setErrors] = useState({});

  // تحويل المرفقات القادمة من الباك إند لشكل يفهمه الـ Uploader
  useEffect(() => {
    if (initialData?.attachments) {
      setAttachments(initialData.attachments.map(file => ({
        id: file.id,
        name: file.fileName,
        size: file.size,
        type: file.contentType,
        isExisting: true, // علامة لتمييزها عن الملفات الجديدة
      })));
    }
  }, [initialData]);

  // منطق الحذف (كلم الباك إند لو الملف موجود فعلاً)
const handleRemoveFile = (file) => {
  markAttachmentForDeletion(file);
};


  const roleOptions = roles.map((r) => ({
    id: r.id,
    label: isArabic ? r.valueAr : r.valueEn,
  }));

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t("errors.conferenceRequired");
    if (!formData.roleOfParticipationId) newErrors.role = t("errors.participationRequired");
    if (!formData.organizingAuthority) newErrors.organizing = t("errors.organizingRequired");

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = t("errors.startBeforeEnd");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSave = async () => {
  if (!validate()) return;

  const success = await save(initialData?.id);
  if (success) navigate("/seminars-and-conferences");
};

  if (loading && roles.length === 0) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
        <PageHeaderNoAction title={pageTitle} icon={pageIcon || Award} />

        <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
            
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
              
              {/* البيانات الأساسية */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
                <div className="grid grid-cols-2 gap-4">
                  <RadioGroup
                    label={t("fields.type")}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                    options={[{ value: 1, label: t("fields.seminar") }, { value: 2, label: t("fields.conference") }]}
                  />
                  <RadioGroup
                    label={t("fields.localOrInternational")}
                    value={formData.localOrInternational}
                    onChange={(val) => setFormData({ ...formData, localOrInternational: val })}
                    options={[{ value: 1, label: t("fields.local") }, { value: 2, label: t("fields.international") }]}
                  />
                </div>

                <InputField
                  label={t("fields.conferenceName")}
                  placeholder={t("placeholders.conferenceName")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />

                <div className="relative z-[100]">
                  <CustomDropdown
                    label={t("fields.participationRole")}
                    placeholder={t("placeholders.participationRole")}
                    value={formData.roleOfParticipationId}
                    options={roleOptions}
                    onChange={(val) => setFormData({ ...formData, roleOfParticipationId: val })}
                    isArabic={isArabic}
                    error={errors.role}
                    required
                  />
                </div>

                <InputField
                  label={t("fields.organizingBody")}
                  placeholder={t("placeholders.organizingBody")}
                  value={formData.organizingAuthority}
                  onChange={(e) => setFormData({ ...formData, organizingAuthority: e.target.value })}
                  error={errors.organizing}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={t("fields.website")} value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                  <InputField label={t("fields.city")} value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                </div>
              </div>

              {/* التاريخ والمرفقات */}
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateField label={t("fields.startDate")} value={formData.startDate} onChange={(val) => setFormData({ ...formData, startDate: val })} isArabic={isArabic} />
                  <DateField label={t("fields.endDate")} value={formData.endDate} onChange={(val) => setFormData({ ...formData, endDate: val })} isArabic={isArabic} error={errors.endDate} />
                </div>

                <InputField 
                  label={t("fields.description")} 
                  value={formData.notes} 
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                  textarea 
                  className="min-h-[100px]" 
                />

                <AttachmentUploader
                  label={t("fields.attachments")}
                  note={t("attachmentsNote")}
                  buttonLabel={t("uploadAttachments")}
                  files={attachments}
                  setFiles={setAttachments}
                  onRemove={handleRemoveFile} // تمرير الدالة هنا للربط مع الباك إند
                  multiple
                />
              </div>
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)]">
              <div className={`flex items-center gap-4 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
                <FormButton variant="primary" onClick={handleSave} disabled={loading} className="min-w-[140px]">
                  {loading ? t("loading") : t("save")}
                </FormButton>
                <FormButton variant="secondary" onClick={() => navigate(-1)} disabled={loading} className="min-w-[140px]">
                  {t("cancel")}
                </FormButton>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </ResponsiveLayoutProvider>
  );
}