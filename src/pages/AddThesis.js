import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import LoadingSpinner from "../components/LoadingSpinner";
import { Info, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useAddThesisForm } from "../hooks/useAddThesisForm";
import { useThesisForm } from "../hooks/useThesisForm";
import DateInput from "../components/ui/DateInput";
import CommitteeMembersCard from "../components/widgets/AddThesis/CommitteeMembersCard";
import RelatedResearchCard from "../components/widgets/AddThesis/RelatedResearchCard";
import axiosInstance from "../utils/axiosInstance";

export default function AddThesis() {
  const { t, i18n } = useTranslation("AddThesis");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { refs, values, setters, helpers, errors, loading } = useThesisForm({
    mode: "add",
    t,
  });
  const [qualificationOptions, setQualificationOptions] = useState([]);
  const [academicGradeOptions, setAcademicGradeOptions] = useState([]);

  const [jobLevelOptions, setJobLevelOptions] = useState([]);
  const input =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600";

  // useEffect(() => {
  //   const fetchAcademicQualifications = async () => {
  //     try {
  //       const { data } = await axiosInstance.get(
  //         "/LookUpItems/AcademicQualifications",
  //       );
  //       setJobLevelOptions(data || []);
  //     } catch (err) {}
  //   };

  //   fetchAcademicQualifications();
  // }, []);

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 bg-white min-h-screen max-w-[1600px] mx-auto`}
      >
        <PageHeaderNoAction title={t("pageTitle")} />

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-28 max-w-[1200px] mx-auto mt-16 ${
            isArabic ? "mr-2" : "ml-2"
          }`}
        >
          {/* LEFT COLUMN */}
          <div className="space-y-8 order-2 mt-6 md:mt-20">
            {/* Committee Members Card */}
            <CommitteeMembersCard
              t={t}
              members={values.members}
              addMember={helpers.addMember}
              updateMember={helpers.updateMember}
              isArabic={isArabic}
              jobLevelOptions={values.employmentDegrees} // Pass job levels
              universityOptions={values.universities}
            />

            {/* Attachments */}
            <div>
              <label className="block mb-2 font-medium text-xl">
                {t("attachments")}
              </label>
              <div className="flex items-center gap-2 text-[11px] text-[#B38E19] mb-4">
                <Info size={14} style={{ color: "#19355A" }} />
                <span>{t("attachmentsNote")}</span>
              </div>
              <button className="bg-[#19355A] text-white w-[190px] h-[32px] rounded-md mr-9 border-2 border-[#B38E19]/50 text-base">
                {t("uploadAttachments")}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 order-1 -mt-11">
            {/* Thesis Type */}
            <div>
              <label className="block mb-2 font-medium text-lg">
                {t("thesisType")}
              </label>
              <div className="flex gap-6 text-sm text-gray-600">
                {["PHD", "Master"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-1 accent-[#B38E19]"
                  >
                    <input
                      type="radio"
                      name="thesisType"
                      value={type}
                      checked={values.thesisType === type}
                      onChange={(e) => setters.setThesisType(e.target.value)}
                    />
                    {t(type.toLowerCase())}
                  </label>
                ))}
              </div>
              {errors.thesisType && (
                <p className="text-red-500 text-xs mt-1">{errors.thesisType}</p>
              )}
            </div>

            {/* Thesis Title */}
            <div>
              <label className="block mb-4 font-medium text-lg">
                {t("thesisTitle")} <span className="text-[#B38E19]">*</span>
              </label>
              <div className="w-full h-[150px] bg-[#E2E2E2] border border-[#B38E19] rounded-md flex items-center shadow-xl">
                <textarea
                  className="w-full h-full bg-transparent text-center text-[12px] resize-none outline-none px-3 py-16 text-black placeholder:text-gray-600"
                  placeholder={t("thesisTitlePlaceholder")}
                  value={values.thesisTitle}
                  onChange={(e) => setters.setThesisTitle(e.target.value)}
                />
              </div>
              {errors.thesisTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.thesisTitle}
                </p>
              )}
            </div>

            {/* Degree Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-lg">
                {t("degree")}
              </label>
              <div className="relative w-full md:max-w-[750px]">
                <select
                  className={input + " appearance-none"}
                  value={values.degreeId}
                  onChange={(e) => setters.setDegreeId(e.target.value)}
                >
                  <option value="">{t("selectDegree")}</option>
                  {values.grades.map((d) => (
                    <option key={d.id} value={d.id}>
                      {isArabic ? d.valueAr : d.valueEn}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={26}
                  className="absolute top-1/2 -translate-y-1/2 text-[#B38E19] pointer-events-none"
                  style={isArabic ? { left: "8px" } : { right: "8px" }}
                />
              </div>
              {errors.degreeId && (
                <p className="text-red-500 text-xs mt-1">{errors.degreeId}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label={t("registrationDate")}
                required
                value={values.registrationDate}
                placeholder={t("registrationDatePlaceholder")}
                error={errors.registrationDate}
                inputClass={input}
                isArabic={isArabic}
                inputRef={refs.registrationDateRef}
                onOpen={() => helpers.openDatePicker(refs.registrationDateRef)}
                onChange={setters.setRegistrationDate}
              />
              <DateInput
                label={t("enrollmentDate")}
                required
                value={values.enrollmentDate}
                placeholder={t("enrollmentDatePlaceholder")}
                error={errors.enrollmentDate}
                inputClass={input}
                isArabic={isArabic}
                inputRef={refs.enrollmentDateRef}
                onOpen={() => helpers.openDatePicker(refs.enrollmentDateRef)}
                onChange={setters.setEnrollmentDate}
              />
              <DateInput
                label={t("internalDegreeDate")}
                value={values.internalDegreeDate}
                placeholder={t("internalDegreeDatePlaceholder")}
                inputClass={input}
                isArabic={isArabic}
                inputRef={refs.internalDegreeDateRef}
                onOpen={() =>
                  helpers.openDatePicker(refs.internalDegreeDateRef)
                }
                onChange={setters.setInternalDegreeDate}
              />
              <DateInput
                label={t("jointSupervisionDate")}
                value={values.jointSupervisionDate}
                placeholder={t("jointSupervisionDatePlaceholder")}
                inputClass={input}
                isArabic={isArabic}
                inputRef={refs.jointSupervisionDateRef}
                onOpen={() =>
                  helpers.openDatePicker(refs.jointSupervisionDateRef)
                }
                onChange={setters.setJointSupervisionDate}
              />
            </div>

            {/* Related Research */}
            <RelatedResearchCard
              t={t}
              researches={values.researches}
              searchTerm={values.searchTerm}
              setSearchTerm={setters.setSearchTerm}
              searchResults={values.searchResults}
              addSelectedResearch={helpers.addSelectedResearch}
              removeResearch={helpers.removeResearch}
              inputClass={input}
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4 mt-16 w-full px-6 justify-center md:justify-end">
          <button
            className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            onClick={helpers.handleSave}
          >
            {t("save")}
          </button>
          <button
            className="bg-[#D9D9D9] text-black px-10 py-1.5 rounded-md"
            onClick={() => navigate("/theses")}
          >
            {t("back")}
          </button>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
