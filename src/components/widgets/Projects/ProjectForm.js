import React, { useState, useEffect } from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import { projectValidationService } from "../../../services/projectValidationService";
import RadioGroup from "../../ui/RadioGroup";

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
}) {
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

  /* ================= sync initial data (EDIT MODE) ================= */
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

  /* ================= UI ================= */
  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-col bg-white min-h-[90vh]">
      <div className="flex-1 px-[clamp(16px,1vw,80px)]">
        <h2 className="font-semibold mb-[clamp(20px,3vw,70px)] text-[clamp(20px,2.2vw,60px)] text-start">
          {t("title")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(20px,20vw,600px)]">
          {/* LEFT */}
          <div className="space-y-[clamp(18px,2.2vw,60px)]">
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
              error={error.projectName || apiError.projectName || apiError.submit}
            />

            {/* PROJECT TYPE */}
            <div>
              <label className="block mb-2 text-lg font-medium">
                {t("fields.projectType")} <span className="text-[#B38E19]">*</span>
              </label>
              <CustomDropdown
                value={projectType}
                onChange={setProjectType}
                options={projectTypeOptions}
                placeholder={t("placeholders.projectType")}
                error={error.projectType || apiError.projectType || apiError.submit}
                isArabic={isArabic}
                disabled={loading}
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="block mb-2 text-lg font-medium">
                {t("fields.role")} <span className="text-[#B38E19]">*</span>
              </label>
              <CustomDropdown
                value={role}
                onChange={setRole}
                options={roleOptions}
                placeholder={t("placeholders.role")}
                error={error.role || apiError.role || apiError.submit}
                isArabic={isArabic}
                disabled={loading}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateField
                label={t("fields.startDate")}
                value={startDate}
                onChange={setStartDate}
                required
                disabled={loading}
                error={error.startDate || apiError.startDate || apiError.submit}
                placeholder={t("placeholders.startDate")}
                isArabic={isArabic}
              />

              <DateField
                label={t("fields.endDate")}
                value={endDate}
                onChange={setEndDate}
                disabled={loading}
                error={error.endDate || apiError.endDate || apiError.submit}
                placeholder={t("placeholders.endDate")}
                isArabic={isArabic}
              />
            </div>

            <InputField
              label={t("fields.funding")}
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value)}
              placeholder={t("placeholders.funding")}
              required
              disabled={loading}
              error={error.fundingSource || apiError.fundingSource || apiError.submit}
            />

            <InputField
              label={t("fields.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("placeholders.description")}
              textarea
              disabled={loading}
              error={apiError.description || apiError.submit}
            />
          </div>
        </form>
      </div>

      <div
        className="sticky bottom-0 bg-white flex gap-3 p-4"
        style={{ flexDirection: isArabic ? "row-reverse" : "row" }}
      >
        <FormButton variant="primary" onClick={handleSubmit} disabled={loading}>
          {t("buttons.save")}
        </FormButton>

        <FormButton variant="secondary" onClick={onCancel} disabled={loading}>
          {t("buttons.cancel")}
        </FormButton>
      </div>
    </div>
  );
}
