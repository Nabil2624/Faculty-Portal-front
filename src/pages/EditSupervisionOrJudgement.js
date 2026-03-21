import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

// UI Components
import InputField from "../components/ui/InputField";
import FormButton from "../components/ui/FormButton";
import RadioGroup from "../components/ui/RadioGroup";
import DateField from "../components/ui/DateField";
import CustomDropdown from "../components/ui/CustomDropdown";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";

// Services & Hooks
import useEditSupervision from "../hooks/useEditSupervision";
import { getAcademicGrades } from "../services/lookup.service";

export default function EditSupervisionOrJudgment() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { state } = useLocation();
  const dir = isArabic ? "rtl" : "ltr";
  const thesesId = state?.id;

  const {
    formData,
    handleChange,
    submitEdit,
    loading,
    errors,
    setFormData,
  } = useEditSupervision(navigate);

  const [grades, setGrades] = useState([]);

  /* ---------------- LOAD LOOKUPS ---------------- */
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

  /* ---------------- PREFILL DATA ---------------- */
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

  /* ---------------- FORMAT GRADES FOR DROPDOWN ---------------- */
  const degreeOptions = useMemo(() => {
    return grades.map((grade) => ({
      id: grade.id,
      label: isArabic ? grade.valueAr : grade.valueEn,
    }));
  }, [grades, isArabic]);

  const handleSubmit = () => {
    if (!thesesId) return;
    submitEdit(thesesId);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] min-h-screen ${dir}`}>
        <PageHeaderNoAction title={t("editPageTitle")} icon={Users} />

        <main className="flex-1 p-[clamp(0.5rem,1.5vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[1500px] bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col overflow-visible">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 p-[clamp(1.5rem,3vw,4rem)]">
              
              {/* --- القسم الأيسر: بيانات الرسالة --- */}
              <div className="flex flex-col gap-6">
                <RadioGroup
                  label={t("thesisType")}
                  options={[
                    { label: t("PHD"), value: "PHD" },
                    { label: t("MASTER"), value: "MASTER" },
                  ]}
                  value={formData.type}
                  onChange={(val) => handleChange("type", val)}
                  error={errors.type ? t("thesisTypeRequired") : ""}
                />

                <InputField
                  label={t("thesisTitle")}
                  placeholder={t("thesisTitlePlaceholder")}
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  textarea
                  error={errors.title ? t(errors.title) : ""}
                  className="min-h-[120px]"
                />

                <InputField
                  label={t("studentName")}
                  placeholder={t("studentNamePlaceholder")}
                  value={formData.studentName}
                  onChange={(e) => handleChange("studentName", e.target.value)}
                  required
                  error={errors.studentName ? t(errors.studentName) : ""}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label={t("specialization")}
                    placeholder={t("specializationPlaceholder")}
                    value={formData.specialization}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                  />
                  
                  <CustomDropdown
                    label={t("degree")}
                    placeholder={t("chooseDegree")}
                    options={degreeOptions}
                    value={formData.gradeId}
                    onChange={(val) => handleChange("gradeId", val)}
                    isArabic={isArabic}
                    error={errors.gradeId ? t(errors.gradeId) : ""}
                  />
                </div>

                <InputField
                  label={t("university")}
                  placeholder={t("universityPlaceholder")}
                  value={formData.universityOrFaculty}
                  onChange={(e) => handleChange("universityOrFaculty", e.target.value)}
                />
              </div>

              {/* --- القسم الأيمن: الدور والتواريخ --- */}
              <div className="flex flex-col gap-8 lg:border-s lg:ps-[clamp(2rem,4vw,5rem)] border-gray-100">
                
                <RadioGroup
                  label={t("facultyRole")}
                  options={[
                    { label: t("supervisor"), value: 1 },
                    { label: t("examiner"), value: 2 },
                    { label: t("both"), value: 3 },
                  ]}
                  value={formData.facultyMemberRole}
                  onChange={(val) => handleChange("facultyMemberRole", val)}
                  error={errors.facultyMemberRole ? t("facultyRoleRequired") : ""}
                />

                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                  <h3 className="text-gray-800 font-bold mb-6 border-b pb-2 border-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#B38E19] rounded-full"></span>
                    {isArabic ? "المواعيد والتواريخ" : "Dates & Timeline"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateField
                      label={t("registrationDate")}
                      isArabic={isArabic}
                      value={formData.registrationDate}
                      onChange={(val) => handleChange("registrationDate", val)}
                    />
                    <DateField
                      label={t("formationDate")}
                      isArabic={isArabic}
                      value={formData.supervisionFormationDate}
                      onChange={(val) => handleChange("supervisionFormationDate", val)}
                    />
                    <DateField
                      label={t("defenseDate")}
                      isArabic={isArabic}
                      value={formData.discussionDate}
                      onChange={(val) => handleChange("discussionDate", val)}
                    />
                    <DateField
                      label={t("grantDate")}
                      isArabic={isArabic}
                      value={formData.grantingDate}
                      onChange={(val) => handleChange("grantingDate", val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- تذييل الصفحة (الأزرار) --- */}
            <footer className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 px-12 py-8 rounded-b-[2rem]">
              <div className="flex items-center justify-end gap-6">
                <FormButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-44 h-14 !text-lg shadow-md"
                >
                  {loading ? t("loading") : t("save")}
                </FormButton>
                <FormButton
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="w-44 h-14 !text-lg"
                >
                  {t("back")}
                </FormButton>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </ResponsiveLayoutProvider>
  );
}