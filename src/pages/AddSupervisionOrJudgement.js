import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import InputFieldArea from "../components/ui/InputFieldArea";
import TextareaField from "../components/ui/TextAreaField";
import SelectWithIcon from "../components/ui/SelectWithIcon";
import DateInput from "../components/ui/DateInput";
import LoadingSpinner from "../components/LoadingSpinner";

import useSupervisionForm from "../hooks/useSupervisionForm";

export default function AddSupervisionOrJudgement() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [degrees, setDegrees] = useState([]);
  const [degreesLoading, setDegreesLoading] = useState(false);

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

  // const registrationRef = useRef(null);
  // const formationRef = useRef(null);
  // const discussionRef = useRef(null);
  // const grantingRef = useRef(null);

  // const openPicker = (ref) => {
  //   if (!ref.current) return;
  //   try {
  //     ref.current.showPicker?.();
  //   } catch {
  //     ref.current.focus();
  //   }
  // };

  const inputBase =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600";

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} bg-white max-w-[1700px] mx-auto p-6`}
      >
        <PageHeaderNoAction title={t("pageTitle")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 mt-12 max-w-[1500px] mx-auto">
          {/* LEFT COLUMN */}
          <div
            className={`space-y-6 max-w-full md:max-w-[600px] ${
              isArabic ? "md:col-start-2 md:pl-24" : "md:col-start-1 md:pl-0 "
            } md:row-start-1`}
          >
            {/* Faculty Role */}
            {/* Faculty Role */}
            <div>
              <label className="block mb-3 font-medium text-lg">
                {t("facultyRole")}
              </label>

              <div className="flex gap-8 text-sm text-gray-700">
                {[
                  { label: t("supervisor"), value: 1 },
                  { label: t("examiner"), value: 2 },
                  { label: t("both"), value: 3 },
                ].map((role) => (
                  <label
                    key={role.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="facultyRole"
                      value={role.value}
                      checked={facultyRole === role.value}
                      onChange={(e) => setFacultyRole(Number(e.target.value))}
                    />
                    {role.label}
                  </label>
                ))}
              </div>

              {/* ERROR MESSAGE */}
              {errors.facultyRole && (
                <p className="text-red-600 text-sm mt-2">
                  {t("facultyRoleRequired")}
                </p>
              )}
            </div>

            {/* Degree */}
            <div>
              <label className="block mb-4 font-medium text-lg">
                {t("degree")}
              </label>
              <SelectWithIcon
                value={degreeId}
                onChange={(e) => setDegreeId(e.target.value)}
                className={inputBase}
                isArabic={isArabic}
              >
                <option value="">{t("chooseDegree")}</option>

                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {isArabic ? grade.valueAr : grade.valueEn}
                  </option>
                ))}
              </SelectWithIcon>

              {errors.degreeId && (
                <p className="text-red-600 text-sm mt-2">
                  {t(errors.degreeId)}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label={t("registrationDate")}
                placeholder={t("registrationDatePlaceholder")}
                inputClass={inputBase}
                isArabic={isArabic}
                value={registrationDate}
                onChange={setRegistrationDate}
              />
              <DateInput
                label={t("formationDate")}
                placeholder={t("formationDatePlaceholder")}
                inputClass={inputBase}
                isArabic={isArabic}
                value={formationDate}
                onChange={setFormationDate}
              />
              <DateInput
                label={t("defenseDate")}
                placeholder={t("defenseDatePlaceholder")}
                inputClass={inputBase}
                isArabic={isArabic}
                value={discussionDate}
                onChange={setDiscussionDate}
              />
              <DateInput
                label={t("grantDate")}
                placeholder={t("grantDatePlaceholder")}
                inputClass={inputBase}
                isArabic={isArabic}
                value={grantingDate}
                onChange={setGrantingDate}
              />
            </div>

            {/* University */}
            <InputFieldArea
              label={t("university")}
              placeholder={t("universityPlaceholder")}
              value={universityOrFaculty}
              onChange={(e) => setUniversityOrFaculty(e.target.value)}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div
            className={`space-y-6 ${
              isArabic
                ? "md:col-start-1 md:pl-12"
                : "md:col-start-2 md:pl-24 md:-translate-x-28"
            } md:row-start-1`}
          >
            {/* Thesis Type */}
            <div>
              <label className="block mb-2 font-medium text-lg">
                {t("thesisType")}
              </label>

              <div className="flex gap-6 text-sm text-gray-700">
                {[
                  { label: t("PHD"), value: 1 },
                  { label: t("MASTER"), value: 2 },
                ].map((type) => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="thesisType"
                      value={type.value}
                      checked={thesisType === type.value}
                      onChange={(e) => setThesisType(Number(e.target.value))}
                    />
                    {type.label}
                  </label>
                ))}
              </div>

              {/* ERROR MESSAGE */}
              {errors.thesisType && (
                <p className="text-red-600 text-sm mt-2">
                  {t("thesisTypeRequired")}
                </p>
              )}
            </div>

            {/* Thesis Title */}
            <TextareaField
              label={t("thesisTitle")}
              placeholder={t("thesisTitlePlaceholder")}
              value={thesisTitle}
              onChange={setThesisTitle}
              required
              height="h-[160px]"
              className="border-2 border-[#B38E19]"
              error={errors.thesisTitle ? t(errors.thesisTitle) : ""}
            />

            {/* Student Name */}
            <div className="md:-translate-y-5">
              <InputFieldArea
                label={t("studentName")}
                placeholder={t("studentNamePlaceholder")}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="-mt-1.5"
                error={errors.studentName ? t(errors.studentName) : ""}
              />
            </div>

            {/* Specialization */}
            <div className="md:-translate-y-5">
              <InputFieldArea
                label={t("specialization")}
                placeholder={t("specializationPlaceholder")}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-16 justify-center md:mt-36 md:justify-end px-4">
          <button
            className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            onClick={handleSubmit}
            disabled={loading} // just prevents double submit
          >
            {t("save")}
          </button>

          <button
            className="bg-[#D9D9D9] text-black px-10 py-1.5 rounded-md"
            onClick={() => navigate("/supervision-thesis")}
          >
            {t("back")}
          </button>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
