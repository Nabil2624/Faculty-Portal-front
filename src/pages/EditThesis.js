import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import LoadingSpinner from "../components/LoadingSpinner";
import { Info } from "lucide-react";
// import { useEditThesisForm } from "../hooks/useEditThesisForm"; // hook for editing

import DateInput from "../components/ui/DateInput";
// import SelectWithIcon from "../components/ui/SelectWithIcon";
import CommitteeMembersCard from "../components/widgets/AddThesis/CommitteeMembersCard"; // Same component as add
import RelatedResearchCard from "../components/widgets/AddThesis/RelatedResearchCard"; // Same component as add
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import useTheses from "../hooks/useTheses";
import { useThesisForm } from "../hooks/useThesisForm";

export default function EditThesis() {
  const { t, i18n } = useTranslation("EditThesis");
  const isArabic = i18n.language === "ar";
  const location = useLocation();
  const navigate = useNavigate();

  const thesisData = location.state?.thesis;
  useEffect(() => {
    if (!thesisData) {
      navigate("/theses");
    }
  }, [thesisData, navigate]);

  const { refs, values, setters, helpers, errors, loading } = useThesisForm({
    mode: "edit",
    thesisData,
    thesisId: thesisData?.id,
    t,
  });

  const input =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600";

  // const card = "border border-[#B38E19] rounded-[5px] p-4 relative bg-white";

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 bg-white min-h-screen max-w-[1600px] mx-auto`}
      >
        <PageHeaderNoAction title={t("editThesis")} />

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-28 max-w-[1200px] mx-auto mt-16 ${
            isArabic ? "mr-2" : "ml-2"
          }`}
        >
          {/* LEFT COLUMN */}
          <div className="space-y-8 order-2 mt-6 md:mt-20">
            <CommitteeMembersCard
              t={t}
              members={values.members}
              addMember={helpers.addMember}
              updateMember={helpers.updateMember}
              isArabic={isArabic}
              jobLevelOptions={values.employmentDegrees} // <-- use values
              universityOptions={values.universities} // <-- use values
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
              <div className="flex gap-6 text-sm text-gray-600 accent-[#B38E19]">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="thesisType"
                    checked={values.thesisType.toLowerCase() === "phd"}
                    onChange={() => setters.setThesisType("phd")}
                  />
                  {t("phd")}
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="thesisType"
                    checked={values.thesisType.toLowerCase() === "master"}
                    onChange={() => setters.setThesisType("master")}
                  />
                  {t("master")}
                </label>
              </div>
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

            {/* Degree */}
            <div>
              <label className="block mb-2 font-medium text-lg">
                {t("degree")}
              </label>

              <select
                className={input + " appearance-none"}
                value={values.degreeId || ""}
                onChange={(e) => setters.setDegreeId(e.target.value)}
              >
                <option value="">{t("selectDegree")}</option>
                {values.grades.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isArabic ? d.valueAr : d.valueEn}
                  </option>
                ))}
              </select>
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
    </ResponsiveLayoutProvider>
  );
}
