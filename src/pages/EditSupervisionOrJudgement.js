import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import DateInput from "../components/ui/DateInput";
import SelectWithIcon from "../components/ui/SelectWithIcon";
import InputFieldArea from "../components/ui/InputFieldArea";
import TextareaField from "../components/ui/TextAreaField";
import { useEffect, useState } from "react";
import useEditSupervision from "../hooks/useEditSupervision";
import { getAcademicGrades } from "../services/lookup.service";

export default function EditSupervisionOrJudgment() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { state } = useLocation();
  const thesesId = state?.id;
  const {
    formData,
    handleChange,
    submitEdit,
    loading,
    errors,
    serverError,
    setFormData,
  } = useEditSupervision(navigate);

  const [grades, setGrades] = useState([]);

  /* ---------------- LOAD GRADES ---------------- */
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await getAcademicGrades();
        setGrades(res.data || []);
      } catch (err) {
        console.error("Failed to fetch grades", err);
      }
    };
    fetchGrades();
  }, []);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (!state) return;

    const mappedType = state.type === "PHD" ? "PHD" : "MASTER";

    let mappedRole = 1;
    if (state.facultyMemberRole === "Adminstrator") mappedRole = 1;
    else if (state.facultyMemberRole === "Reviewer") mappedRole = 2;
    else if (
      state.facultyMemberRole === "AdminstratorAndReviewer" ||
      state.facultyMemberRole === "ReviewerAndAdminstrator"
    )
      mappedRole = 3;

    setFormData({
      type: mappedType,
      facultyMemberRole: mappedRole,
      gradeId: state.gradeId || state.grade?.id || "",
      registrationDate: state.registrationDate || "",
      supervisionFormationDate: state.supervisionFormationDate || "",
      discussionDate: state.discussionDate || "",
      grantingDate: state.grantingDate || "",
      universityOrFaculty: state.universityOrFaculty || "",
      title: state.title || "",
      studentName: state.studentName || "",
      specialization: state.specialization || "",
    });
  }, [state, setFormData]);

  /* ---------------- MATCH ADD BEHAVIOR ---------------- */

  const setThesisType = (value) => handleChange("type", value);
  const setFacultyRole = (value) => handleChange("facultyMemberRole", value);
  const setDegreeId = (value) => handleChange("gradeId", value);
  const setRegistrationDate = (value) =>
    handleChange("registrationDate", value);
  const setFormationDate = (value) =>
    handleChange("supervisionFormationDate", value);
  const setDiscussionDate = (value) => handleChange("discussionDate", value);
  const setGrantingDate = (value) => handleChange("grantingDate", value);
  const setUniversityOrFaculty = (value) =>
    handleChange("universityOrFaculty", value);
  const setTitle = (value) => handleChange("title", value);
  const setStudentName = (value) => handleChange("studentName", value);
  const setSpecialization = (value) => handleChange("specialization", value);

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
                  {[1, 2, 3].map((val) => (
                    <label
                      key={val}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="facultyRole"
                        checked={formData.facultyMemberRole === val}
                        onChange={() => setFacultyRole(val)}
                        className="accent-[#B38E19]"
                      />
                      {val === 1
                        ? t("supervisor")
                        : val === 2
                          ? t("examiner")
                          : t("supervisorAndExaminer")}
                    </label>
                  ))}
                </div>
                {errors.facultyMemberRole && (
                  <p className="text-red-600 text-sm mt-2">
                    {t("facultyRoleRequired")}
                  </p>
                )}
              </div>

              {/* DEGREE */}
              <div>
                <label className="block mb-4 font-medium text-lg">
                  {t("degree")}
                </label>
                <SelectWithIcon
                  className={input}
                  isArabic={isArabic}
                  value={formData.gradeId || ""}
                  onChange={(e) => setDegreeId(e.target.value)}
                >
                  <option value="">{t("chooseDegree")}</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {isArabic ? grade.valueAr : grade.valueEn}
                    </option>
                  ))}
                </SelectWithIcon>

                {errors.gradeId && (
                  <p className="text-red-600 text-sm mt-2">
                    {t(errors.gradeId)}
                  </p>
                )}
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label={t("registrationDate")}
                  placeholder={t("registrationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.registrationDate}
                  onChange={setRegistrationDate}
                />
                <DateInput
                  label={t("formationDate")}
                  placeholder={t("formationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.supervisionFormationDate}
                  onChange={setFormationDate}
                />
                <DateInput
                  label={t("defenseDate")}
                  placeholder={t("defenseDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.discussionDate}
                  onChange={setDiscussionDate}
                />
                <DateInput
                  label={t("grantDate")}
                  placeholder={t("grantDate")}
                  inputClass={input}
                  isArabic={isArabic}
                  value={formData.grantingDate}
                  onChange={setGrantingDate}
                />
              </div>

              {/* UNIVERSITY */}
              <InputFieldArea
                label={t("university")}
                placeholder={t("universityPlaceholder")}
                value={formData.universityOrFaculty}
                onChange={(e) => setUniversityOrFaculty(e.target.value)}
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
                  {["PHD", "MASTER"].map((val) => (
                    <label key={val} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="thesisType"
                        value={val}
                        checked={formData.type === val}
                        onChange={() => setThesisType(val)}
                      />
                      {val === "PHD" ? t("phdThesis") : t("masterThesis")}
                    </label>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-600 text-sm mt-2">
                    {t("thesisTypeRequired")}
                  </p>
                )}
              </div>

              {/* TITLE + STUDENT + SPECIALIZATION */}
              <div className="space-y-6 md:col-start-1 md:row-start-1 md:pl-12">
                <TextareaField
                  label={t("thesisTitle")}
                  placeholder={t("thesisTitlePlaceholder")}
                  required
                  height="h-[160px]"
                  value={formData.title}
                  onChange={setTitle}
                  className="border-2 border-[#B38E19] focus:border-[#B38E19]"
                  error={errors.title ? t(errors.title) : ""}
                />

                <InputFieldArea
                  label={t("studentName")}
                  placeholder={t("studentNamePlaceholder")}
                  required
                  value={formData.studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="-mt-1.5"
                  error={errors.studentName ? t(errors.studentName) : ""}
                />

                <div className="translate-y-1">
                  <InputFieldArea
                    label={t("specialization")}
                    placeholder={t("specializationPlaceholder")}
                    value={formData.specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* {(error || success) && (
            <div className="text-center mt-6 text-sm">
              {error && <div className="text-red-600">{error}</div>}
              {success && (
                <div className="text-green-600">Saved successfully!</div>
              )}
            </div>
          )} */}

          <div className="flex gap-4 mt-16 justify-center md:mt-36 md:justify-end px-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            >
              {t("save")}
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
