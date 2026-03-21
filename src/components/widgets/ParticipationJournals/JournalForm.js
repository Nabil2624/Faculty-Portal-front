import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookOpen, Newspaper, Pen } from "lucide-react";
import InputField from "../../ui/InputField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";
import { useJournalForm } from "../../../hooks/useJournalForm";
import CustomDropdown from "../../ui/CustomDropdown";

export default function JournalForm({ item, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("journal-forms");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const isEdit = !!item;

  const { addJournal, updateJournal, loading, types, loadingTypes } = useJournalForm();

  // --- States منفصلة لكل حقل ---
  const [nameOfMagazine, setNameOfMagazine] = useState("");
  const [websiteOfMagazine, setWebsiteOfMagazine] = useState("");
  const [typeOfParticipationId, setTypeOfParticipationId] = useState("");
  const [errors, setErrors] = useState({});

  // ملء البيانات عند التعديل
  useEffect(() => {
    if (item) {
      setNameOfMagazine(item.nameOfMagazine || "");
      setWebsiteOfMagazine(item.websiteOfMagazine || "");
      // تأكد من الوصول للـ id بشكل صحيح حسب هيكلة الـ object عندك
      setTypeOfParticipationId(item.typeOfParticipation?.id || "");
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};
    if (!nameOfMagazine.trim()) newErrors.nameOfMagazine = t("required_journal_name");
    if (!typeOfParticipationId) newErrors.typeOfParticipationId = t("required_participation_type");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const payload = {
      nameOfMagazine,
      websiteOfMagazine,
      typeOfParticipationId,
    };

    try {
      if (isEdit) {
        await updateJournal(item.id, payload);
      } else {
        await addJournal(payload);
      }
      onSuccess?.();
      navigate("/journals"); 
    } catch (err) {
      setErrors({ submit: t("submit_error") });
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${i18n.dir()}`}>
        <PageHeaderNoAction
          title={isEdit ? t("edit_journal") : t("add_journal")}
          icon={Newspaper}
        />

        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="w-full max-w-[1500px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              
              {/* الحقل الأول: اسم المجلة */}
              <div className="space-y-6">
                <InputField
                  label={t("journal_name")}
                  value={nameOfMagazine}
                  onChange={(e) => setNameOfMagazine(e.target.value)}
                  placeholder={t("enter_journal_name")}
                  required
                  error={errors.nameOfMagazine}
                />
                
                {/* الحقل الثاني: الموقع الإلكتروني */}
                <InputField
                  label={t("journal_website")}
                  value={websiteOfMagazine}
                  onChange={(e) => setWebsiteOfMagazine(e.target.value)}
                  placeholder={t("enter_journal_website")}
                />
              </div>

              {/* الحقل الثالث: نوع المشاركة */}
              <div className="space-y-6 lg:border-s lg:ps-8 border-gray-100">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("participation_type")} <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    value={typeOfParticipationId}
                    onChange={(val) => setTypeOfParticipationId(val)}
                    options={types}
                    placeholder={t("select_participation_type")}
                    disabled={loadingTypes}
                    error={errors.typeOfParticipationId}
                  />
                </div>
              </div>
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
              <div className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {loading ? t("loading") : (isEdit ? t("save") : t("add"))}
                  </FormButton>
                </div>
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="secondary"
                    onClick={onCancel || (() => navigate(-1))}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {t("cancel")}
                  </FormButton>
                </div>
              </div>
              {errors.submit && <p className="text-red-500 text-center mt-2">{errors.submit}</p>}
            </footer>
          </div>
        </main>
      </div>
    </ResponsiveLayoutProvider>
  );
}