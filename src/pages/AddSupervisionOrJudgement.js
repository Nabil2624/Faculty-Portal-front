import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

// UI Components
import InputField from "../components/ui/InputField";
import FormButton from "../components/ui/FormButton";
import RadioGroup from "../components/ui/RadioGroup";
import DateField from "../components/ui/DateField";
import CustomDropdown from "../components/ui/CustomDropdown"; // المكون الجديد
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";

// Hook
import useSupervisionForm from "../hooks/useSupervisionForm";

export default function AddSupervisionOrJudgement() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const dir = isArabic ? "rtl" : "ltr";

  const {
    thesisType,
    setThesisType,
    facultyRole,
    setFacultyRole,
    studentName,
    setStudentName,
    thesisTitle,
    setThesisTitle,
    specialization,
    setSpecialization,
    degreeId,
    setDegreeId,
    grades,
    universityOrFaculty,
    setUniversityOrFaculty,
    registrationDate,
    setRegistrationDate,
    formationDate,
    setFormationDate,
    discussionDate,
    setDiscussionDate,
    grantingDate,
    setGrantingDate,
    loading,
    errors,
    handleSubmit,
  } = useSupervisionForm(navigate);

  // تحضير الخيارات للـ CustomDropdown بناءً على اللغة
  const degreeOptions = useMemo(() => {
    return grades.map((grade) => ({
      id: grade.id,
      label: isArabic ? grade.valueAr : grade.valueEn,
    }));
  }, [grades, isArabic]);

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] min-h-screen ${dir}`}>
        {/* هيدر الصفحة */}
        <PageHeaderNoAction title={t("pageTitle")} icon={Users} />

        <main className="flex-1 p-[clamp(0.5rem,1.5vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[1500px] bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col overflow-visible">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 p-[clamp(1.5rem,3vw,4rem)]">
              
              {/* --- القسم الأيسر: بيانات الرسالة --- */}
              <div className="flex flex-col gap-6">
                <RadioGroup
                  label={t("thesisType")}
                  options={[
                    { label: t("PHD"), value: 1 },
                    { label: t("MASTER"), value: 2 },
                  ]}
                  value={thesisType}
                  onChange={(val) => setThesisType(Number(val))}
                  error={errors.thesisType ? t("thesisTypeRequired") : ""}
                />

                <InputField
                  label={t("thesisTitle")}
                  placeholder={t("thesisTitlePlaceholder")}
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  required
                  textarea
                  error={errors.thesisTitle ? t(errors.thesisTitle) : ""}
                  className="min-h-[120px]"
                />

                <InputField
                  label={t("studentName")}
                  placeholder={t("studentNamePlaceholder")}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  error={errors.studentName ? t(errors.studentName) : ""}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label={t("specialization")}
                    placeholder={t("specializationPlaceholder")}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                  
                  {/* استخدام CustomDropdown الجديد هنا */}
                  <CustomDropdown
                    label={t("degree")}
                    placeholder={t("chooseDegree")}
                    options={degreeOptions}
                    value={degreeId}
                    onChange={(val) => setDegreeId(val)}
                    isArabic={isArabic}
                    error={errors.degreeId ? t(errors.degreeId) : ""}
                  />
                </div>

                <InputField
                  label={t("university")}
                  placeholder={t("universityPlaceholder")}
                  value={universityOrFaculty}
                  onChange={(e) => setUniversityOrFaculty(e.target.value)}
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
                  value={facultyRole}
                  onChange={(val) => setFacultyRole(Number(val))}
                  error={errors.facultyRole ? t("facultyRoleRequired") : ""}
                />

                {/* حاوية التواريخ المنظمة */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                  <h3 className="text-gray-800 font-bold mb-6 border-b pb-2 border-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#B38E19] rounded-full"></span>
                    {isArabic ? "المواعيد والتواريخ" : "Dates & Timeline"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateField
                      label={t("registrationDate")}
                      placeholder={t("registrationDatePlaceholder")}
                      isArabic={isArabic}
                      value={registrationDate}
                      onChange={setRegistrationDate}
                    />
                    <DateField
                      label={t("formationDate")}
                      placeholder={t("formationDatePlaceholder")}
                      isArabic={isArabic}
                      value={formationDate}
                      onChange={setFormationDate}
                    />
                    <DateField
                      label={t("defenseDate")}
                      placeholder={t("defenseDatePlaceholder")}
                      isArabic={isArabic}
                      value={discussionDate}
                      onChange={setDiscussionDate}
                    />
                    <DateField
                      label={t("grantDate")}
                      placeholder={t("grantDatePlaceholder")}
                      isArabic={isArabic}
                      value={grantingDate}
                      onChange={setGrantingDate}
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
                  className="w-44 h-14 !text-lg shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? t("loading") : t("save")}
                </FormButton>
                <FormButton
                  variant="secondary"
                  onClick={() => navigate("/supervision-thesis")}
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