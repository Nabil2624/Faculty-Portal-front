import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import DateInput from "../components/ui/DateInput";
import SelectWithIcon from "../components/ui/SelectWithIcon";
import InputField from "../components/ui/InputField";
import TextareaField from "../components/ui/TextAreaField";
import { useEffect } from "react";
import useEditSupervision from "../hooks/useEditSupervision";

export default function EditSupervisionOrJudgment() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { state } = useLocation(); // receives item from SupervisionThesisCard
  const thesesId = state?.id;

  const {
    formData,
    handleChange,
    submitEdit,
    loading,
    error,
    success,
    setFormData,
  } = useEditSupervision();

  // pre-fill data when page loads
  useEffect(() => {
    if (state) {
      setFormData({
        type: state.type,
        title: state.title,
        facultyMemberRole: state.facultyMemberRole,
        studentName: state.studentName,
        specialization: state.specialization,
        gradeId: state.gradeId,
        registrationDate: state.registrationDate,
        supervisionFormationDate: state.supervisionFormationDate,
        discussionDate: state.discussionDate,
        grantingDate: state.grantingDate,
        universityOrFaculty: state.universityOrFaculty,
        facultyMemberId: state.facultyMemberId,
      });
    }
  }, [state, setFormData]);

  const input =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600";

  const handleSubmit = () => {
    if (!thesesId) return;
    submitEdit(thesesId);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="overflow-x-hidden">
        <div
          className={`${isArabic ? "rtl" : "ltr"} bg-white max-w-[1700px] mx-auto p-6`}
        >
          <PageHeaderNoAction title={t("editPageTitle")} />

          {/* --- MAIN FORM (KEEP DESIGN EXACTLY SAME) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 mt-12 max-w-[1500px] mx-auto">
            {/* LEFT COLUMN */}
            <div
              className={`space-y-9 md:col-start-2 md:row-start-1 max-w-full md:max-w-[600px] md:pl-24 ${
                isArabic ? "md:translate-x-20" : "md:-translate-x-24"
              }`}
            >
              {/* FACULTY ROLE */}
              <div>
                <label className="block mb-3 font-medium text-lg">
                  {t("facultyRole")}
                </label>
                <div className="flex gap-8 text-sm text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="facultyRole"
                      checked={formData.facultyMemberRole === 1}
                      onChange={() => handleChange("facultyMemberRole", 1)}
                      className="accent-[#B38E19]"
                    />
                    {t("supervisor")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="facultyRole"
                      checked={formData.facultyMemberRole === 2}
                      onChange={() => handleChange("facultyMemberRole", 2)}
                      className="accent-[#B38E19]"
                    />
                    {t("examiner")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="facultyRole"
                      checked={formData.facultyMemberRole === 3}
                      onChange={() => handleChange("facultyMemberRole", 3)}
                      className="accent-[#B38E19]"
                    />
                    {t("supervisorAndExaminer")}
                  </label>
                </div>
              </div>

              {/* DEGREE */}
              <div>
                <label className="block mb-4 font-medium text-lg">
                  {t("degree")}
                </label>
                <SelectWithIcon
                  className={input}
                  isArabic={isArabic}
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="">{t("chooseDegree")}</option>
                  <option value="MASTER">{t("master")}</option>
                  <option value="PHD">{t("phd")}</option>
                </SelectWithIcon>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label={t("registrationDate")}
                  placeholder={t("registrationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.registrationDate}
                  onChange={(v) => handleChange("registrationDate", v)}
                />
                <DateInput
                  label={t("formationDate")}
                  placeholder={t("formationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.supervisionFormationDate}
                  onChange={(v) => handleChange("supervisionFormationDate", v)}
                />
                <DateInput
                  label={t("defenseDate")}
                  placeholder={t("defenseDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.discussionDate}
                  onChange={(v) => handleChange("discussionDate", v)}
                />
                <DateInput
                  label={t("grantDate")}
                  placeholder={t("grantDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.grantingDate}
                  onChange={(v) => handleChange("grantingDate", v)}
                />
              </div>

              {/* UNIVERSITY */}
              <InputField
                label={t("university")}
                placeholder={t("universityPlaceholder")}
                value={formData.universityOrFaculty}
                onChange={(e) =>
                  handleChange("universityOrFaculty", e.target.value)
                }
              />
            </div>

            {/* RIGHT COLUMN */}
            <div
              className={`space-y-8 md:col-start-1 md:row-start-1 md:pl-12 ${
                isArabic ? "md:translate-x-9" : "md:-translate-x-24"
              }`}
            >
              {/* THESIS TYPE */}
              <div>
                <label className="block mb-2 font-medium text-lg">
                  {t("thesisType")}
                </label>
                <div className="flex gap-6 text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="thesisType"
                      value="PHD"
                      checked={formData.type === "PHD"}
                      onChange={(e) => handleChange("type", e.target.value)}
                    />
                    {t("phdThesis")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="thesisType"
                      value="MASTER"
                      checked={formData.type === "MASTER"}
                      onChange={(e) => handleChange("type", e.target.value)}
                    />
                    {t("masterThesis")}
                  </label>
                </div>
              </div>

              {/* THESIS TITLE */}
              <div className="space-y-6 md:col-start-1 md:row-start-1 md:pl-12">
                <TextareaField
                  label={t("thesisTitle")}
                  placeholder={t("thesisTitlePlaceholder")}
                  required
                  height="h-[160px]"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="border-2 border-[#B38E19] focus:border-[#B38E19]"
                />

                <InputField
                  label={t("studentName")}
                  placeholder={t("studentNamePlaceholder")}
                  required
                  value={formData.studentName}
                  onChange={(e) => handleChange("studentName", e.target.value)}
                  className="-mt-1.5"
                />

                {/* SPECIALIZATION */}
                <div className="translate-y-1">
                  <InputField
                    label={t("specialization")}
                    placeholder={t("specializationPlaceholder")}
                    value={formData.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ERROR / SUCCESS */}
          {(error || success) && (
            <div className="text-center mt-6 text-sm">
              {error && <div className="text-red-600">{error}</div>}
              {success && (
                <div className="text-green-600">Saved successfully!</div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-16 justify-center md:mt-36 md:justify-end px-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            >
              {loading ? "Saving..." : t("save")}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-[#D9D9D9] text-black px-10 py-1.5 rounded-md"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
