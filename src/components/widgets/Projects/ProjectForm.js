import React, { useState, useEffect } from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import RadioGroup from "../../ui/RadioGroup";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { Layers } from "lucide-react";
import { projectValidationService } from "../../../services/projectValidationService";

export default function ProjectForm({
  t,
  isArabic,
  projectTypes = [],
  projectRoles = [],
  initialData = {},
  onSave,
  onCancel,
  error: apiError = {},
  loading = false,
  formTitle,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  /* ================= options ================= */
  const projectTypeOptions = projectTypes.map((p) => ({
    id: p.id,
    label: isArabic ? p.valueAr : p.valueEn,
  }));

  const roleOptions = projectRoles.map((r) => ({
    id: r.id,
    label: isArabic ? r.valueAr : r.valueEn,
  }));

  /* ================= state ================= */
  const [nationality, setNationality] = useState(
    initialData.localOrInternational === "Local" ? "محلي" : "دولي"
  );
  const [projectName, setProjectName] = useState(initialData.nameOfProject || "");
  const [projectType, setProjectType] = useState("");
  const [role, setRole] = useState("");
  const [fundingSource, setFundingSource] = useState(initialData.financingAuthority || "");
  const [startDate, setStartDate] = useState(initialData.startDate || "");
  const [endDate, setEndDate] = useState(initialData.endDate || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [error, setError] = useState({});

  /* ================= sync initial data ================= */
  useEffect(() => {
    setProjectType(initialData.typeOfProject?.id || "");
    setRole(initialData.participationRole?.id || "");
  }, [initialData]);

  /* ================= submit ================= */
  const handleSubmit = () => {
    const payload = {
      localOrInternational: nationality === "دولي" ? "International" : "Local",
      nameOfProject: projectName.trim(),
      typeOfProjectId: projectType,
      participationRoleId: role,
      financingAuthority: fundingSource.trim(),
      startDate,
      endDate: endDate || null,
      description: description?.trim() || null,
    };

    const newError = projectValidationService(payload, t);
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({});
    onSave(payload);
  };

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      {/* 1. Header */}
      <PageHeaderNoAction title={formTitle || t("title")} icon={Layers} />

      {/* 2. Main Container */}
      <main className="flex-1 p-[clamp(0.5rem,0.6vw,2.5rem)] flex items-center justify-center">
        {/* شيلنا الـ overflow-hidden خالص عشان الدروب داون تطير براحتها */}
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          {/* الفورم هنا ملوش overflow عشان ميحبسش الدروب داون جواه */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
            
            {/* القسـم الأيسـر */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              <RadioGroup
                label={t("fields.nationality")}
                value={nationality}
                onChange={setNationality}
                disabled={loading}
                options={[
                  { value: "دولي", label: t("options.international") },
                  { value: "محلي", label: t("options.local") },
                ]}
              />

              <InputField
                label={t("fields.projectName")}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={t("placeholders.projectName")}
                required
                disabled={loading}
                error={error.projectName || apiError.projectName}
              />

              {/* الـ z-index هنا عالي جداً لضمان تخطي الفوتر */}
              <div className="grid grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)] items-start relative z-[100]">
                <CustomDropdown
                  label={t("fields.projectType")}
                  value={projectType}
                  onChange={setProjectType}
                  options={projectTypeOptions}
                  placeholder={t("placeholders.projectType")}
                  isArabic={isArabic}
                  required
                  disabled={loading}
                  error={error.projectType || apiError.projectType}
                />

                <CustomDropdown
                  label={t("fields.role")}
                  value={role}
                  onChange={setRole}
                  options={roleOptions}
                  placeholder={t("placeholders.role")}
                  isArabic={isArabic}
                  required
                  disabled={loading}
                  error={error.role || apiError.role}
                />
              </div>

              <InputField
                label={t("fields.funding")}
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                placeholder={t("placeholders.funding")}
                required
                disabled={loading}
                error={error.fundingSource || apiError.fundingSource}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholders.description")}
                  textarea
                  disabled={loading}
                  className="h-full min-h-[clamp(150px,12vh,250px)]"
                  error={apiError.description}
                />
              </div>
            </div>
          </form>

          {/* 3. Footer */}
          {/* الـ z-index هنا 0 عشان يفضل تحت القوائم */}
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