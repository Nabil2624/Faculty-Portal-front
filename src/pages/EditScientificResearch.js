import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import LoadingSpinner from "../components/LoadingSpinner";

// UI & Widgets
import InputField from "../components/ui/InputField";
import RadioGroup from "../components/widgets/AddScientificResearch/RadioGroup";
import ParticipantList from "../components/widgets/AddScientificResearch/ParticipantList";
import TextareaField from "../components/ui/TextAreaField";
import AttachmentUploader from "../components/widgets/AddScientificResearch/AttachmentUploader";
import DOIInput from "../components/widgets/AddScientificResearch/DOIInput";

import { useEditScientificResearch } from "../hooks/useEditScientificResearch";

export default function EditScientificResearch() {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";

  const {
    loading,
    abstract,
    setAbstract,
    researchTitle,
    setResearchTitle,
    participants,
    setParticipants,
    form,
    handleChange,
    handleSave,
  } = useEditScientificResearch(1); // 🔴 ID from route later

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className="overflow-y-hidden">
        <div
          className={`${isArabic ? "rtl" : "ltr"} p-6 bg-white min-h-screen max-w-[1600px] mx-auto`}
        >
          <PageHeaderNoAction title={t("editPageTitle")} />

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-28 max-w-[1200px] mx-auto mt-16 ${
              isArabic ? "mr-2" : "ml-2"
            }`}
          >
            {/* LEFT */}
            <div className="space-y-8 order-2 md:-mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-72">
                <RadioGroup
                  label={t("publisherType")}
                  options={[
                    { label: t("journal"), value: "journal" },
                    { label: t("conference"), value: "conference" },
                  ]}
                  name="publisherType"
                />

                <RadioGroup
                  label={t("publicationType")}
                  options={[
                    { label: t("local"), value: "local" },
                    { label: t("international"), value: "international" },
                  ]}
                  name="publicationType"
                />
              </div>

              <InputField
                label={t("journalOrConference")}
                value={form.journalOrConference}
                onChange={(e) =>
                  handleChange("journalOrConference", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label={t("issue")}
                  value={form.issue}
                  onChange={(e) => handleChange("issue", e.target.value)}
                />
                <InputField
                  label={t("pages")}
                  value={form.pages}
                  onChange={(e) => handleChange("pages", e.target.value)}
                />
              </div>

              <InputField
                label={t("researchLink")}
                value={form.researchLink}
                onChange={(e) => handleChange("researchLink", e.target.value)}
              />

              <InputField
                label={t("year")}
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
              />

              <ParticipantList
                label={t("participants")}
                participants={participants}
                setParticipants={setParticipants}
              />

              <AttachmentUploader
                label={t("attachments")}
                note={t("attachmentsNote")}
                buttonLabel={t("editAttachments")}
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-6 order-1 -mt-9">
              <RadioGroup
                label={t("researchType")}
                options={[
                  { label: t("manual"), value: "manual" },
                  { label: "DOI", value: "doi" },
                ]}
                name="researchType"
              />

              <DOIInput />

              <TextareaField
                label={t("researchTitle")}
                value={researchTitle}
                setValue={setResearchTitle}
                required
                height="h-[167px]"
                className="border-2 border-[#B38E19]"
              />

              <div className="mb-2">
                <InputField
                  label={t("publisher")}
                  placeholder={t("publisherPlaceholder")}
                />
              </div>

              <div className="pt-2">
                <InputField
                  label={t("relatedResearch")}
                  value={form.relatedResearch}
                  onChange={(e) =>
                    handleChange("relatedResearch", e.target.value)
                  }
                />
              </div>

              <RadioGroup
                label={t("basedOn")}
                options={[
                  { label: t("master"), value: "master" },
                  { label: t("phd"), value: "phd" },
                  { label: t("other"), value: "other" },
                ]}
                name="basedOn"
              />

              <TextareaField
                label={t("abstract")}
                value={abstract}
                setValue={setAbstract}
                height="h-[160px]"
                className={isArabic ? "text-right" : "text-left"}
                isAbstract
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-16 w-full px-6 justify-center md:justify-end">
            <button
              onClick={handleSave}
              className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            >
              {t("save")}
            </button>
            <button className="bg-[#D9D9D9] text-black px-10 py-1.5 rounded-md">
              {t("back")}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
