import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import DateInput from "../components/ui/DateInput";
import SelectWithIcon from "../components/ui/SelectWithIcon";
import InputField from "../components/ui/InputField";
import TextareaField from "../components/ui/TextAreaField";

export default function AddSupervisionOrJudgement() {
  const { t, i18n } = useTranslation("AddSupervision");
  const isArabic = i18n.language === "ar";

  const input =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600";

  return (
    <ResponsiveLayoutProvider>
      {/* Prevent horizontal scrollbar */}
      <div className="overflow-x-hidden">
        <div
          className={`${isArabic ? "rtl" : "ltr"} bg-white max-w-[1700px] mx-auto p-6`}
        >
          {/* PAGE HEADER */}
          <PageHeaderNoAction title={t("pageTitle")} />

          {/* MAIN GRID */}
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
                    <input type="radio" name="facultyRole" />
                    {t("supervisor")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="facultyRole" />
                    {t("examiner")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="facultyRole" />
                    {t("supervisorAndExaminer")}
                  </label>
                </div>
              </div>

              {/* DEGREE */}
              <div>
                <label className="block mb-4 font-medium text-lg">
                  {t("degree")}
                </label>
                <SelectWithIcon className={input} isArabic={isArabic}>
                  <option>{t("chooseDegree")}</option>
                  <option>{t("master")}</option>
                  <option>{t("phd")}</option>
                </SelectWithIcon>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label={t("registrationDate")}
                  placeholder={t("registrationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                />
                <DateInput
                  label={t("formationDate")}
                  placeholder={t("formationDate")}
                  inputClass={input}
                  isArabic={isArabic}
                />
                <DateInput
                  label={t("defenseDate")}
                  placeholder={t("defenseDate")}
                  inputClass={input}
                  isArabic={isArabic}
                />
                <DateInput
                  label={t("grantDate")}
                  placeholder={t("grantDate")}
                  inputClass={input}
                  isArabic={isArabic}
                />
              </div>

              {/* UNIVERSITY */}
              <InputField
                label={t("university")}
                placeholder={t("universityPlaceholder")}
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
                    <input type="radio" name="thesisType" />
                    {t("phdThesis")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="thesisType" />
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
                  className="border-2 border-[#B38E19] focus:border-[#B38E19]"
                />

                <InputField
                  label={t("studentName")}
                  placeholder={t("studentNamePlaceholder")}
                  required
                  className="-mt-1.5"
                />

                {/* SPECIALIZATION */}
                <div className="translate-y-1">
                  <InputField
                    label={t("specialization")}
                    placeholder={t("specializationPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
        </div>

        <div className="flex gap-4 mt-16 justify-center md:mt-36 md:justify-end px-4">
          <button className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md">
            {t("save")}
          </button>
          <button className="bg-[#D9D9D9] text-black px-10 py-1.5 rounded-md">
            {t("back")}
          </button>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
