import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import LoadingSpinner from "../components/LoadingSpinner";

import { useNavigate } from "react-router-dom";
// UI & Widgets
import InputField from "../components/ui/InputField";
import RadioGroup from "../../src/components/widgets/AddScientificResearch/RadioGroup";
import ParticipantList from "../../src/components/widgets/AddScientificResearch/ParticipantList";
import TextareaField from "../components/ui/TextAreaField";
import AttachmentUploader from "../../src/components/widgets/AddScientificResearch/AttachmentUploader";
import DOIInput from "../../src/components/widgets/AddScientificResearch/DOIInput";

// Hook
import useAddScientificResearch from "../hooks/useAddScientificResearch";
import { useState } from "react";

export default function AddScientificResearch() {
  const {
    t,
    isArabic,
    loading,
    abstract,
    setAbstract,
    participants,
    setParticipants,
    doi,
    setDoi,
    doiError,
    researchTitle,
    setResearchTitle,
    publisher,
    setPublisher,
    journalOrConference,
    setJournalOrConference,
    year,
    setYear,
    issue,
    setIssue,
    pages,
    setPages,
    relatedResearchLink,
    setRelatedResearchLink,
    handleSave: saveHook,
    handleFetchDOI,
    handleFetchContributor,
    doiFetched,
    setDoiFetched,
  } = useAddScientificResearch();

  const [errors, setErrors] = useState({});
  const [researchType, setResearchType] = useState("manual");

  const [publisherType, setPublisherType] = useState(""); // جهة النشر
  const [publicationType, setPublicationType] = useState(""); // نوع النشر

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/scientific-researches");
  };

  if (loading) return <LoadingSpinner />;

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!journalOrConference.trim())
      newErrors.journalOrConference =
        t("journalOrConference") + " " + t("isRequired");

    if (researchType === "manual" && !researchTitle.trim()) {
      newErrors.researchTitle = t("researchTitle") + " " + t("isRequired");
    }

    if (!abstract.trim())
      newErrors.abstract = t("abstract") + " " + t("isRequired");

    if (!participants.length)
      newErrors.participants = t("participants") + " " + t("isRequired");

    if (researchType === "doi") {
      if (!doi.trim()) {
        newErrors.doi = "DOI " + t("isRequired");
      } else if (!doiFetched) {
        newErrors.doi = t("fetchDOIError"); // invalid DOI
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await saveHook();
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="overflow-y-hidden">
        <div
          className={`${isArabic ? "rtl" : "ltr"} p-6 bg-white max-w-[1600px] mx-auto overflow-hidden`}
        >
          <PageHeaderNoAction title={t("PageTitle")} />

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-28 max-w-[1200px] mx-auto mt-16 ${isArabic ? "mr-2" : "ml-2"}`}
          >
            {/* LEFT COLUMN */}
            <div className="space-y-8 order-2 md:-mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-72">
                <RadioGroup
                  label={t("publisherType")}
                  options={[
                    { label: t("journal"), value: "journal" },
                    { label: t("conference"), value: "conference" },
                  ]}
                  name="publisherType"
                  value={publisherType}
                  onChange={(val) => setPublisherType(val)}
                />

                <RadioGroup
                  label={t("publicationType")}
                  options={[
                    { label: t("local"), value: "local" },
                    { label: t("international"), value: "international" },
                  ]}
                  name="publicationType"
                  value={publicationType}
                  onChange={(val) => setPublicationType(val)}
                />
              </div>

              <InputField
                label={t("journalOrConference")}
                placeholder={t("journalOrConferencePlaceholder")}
                value={journalOrConference}
                setValue={(val) => {
                  setJournalOrConference(val);
                  clearError("journalOrConference");
                }}
                required
                error={errors.journalOrConference}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label={t("issue")}
                  placeholder={t("issuePlaceholder")}
                  value={issue}
                  setValue={setIssue}
                />
                <InputField
                  label={t("pages")}
                  placeholder={t("pagesPlaceholder")}
                  value={pages}
                  setValue={setPages}
                />
              </div>

              <InputField
                label={t("researchLink")}
                placeholder={t("researchLinkPlaceholder")}
                value={relatedResearchLink}
                setValue={setRelatedResearchLink}
              />
              <InputField
                label={t("year")}
                placeholder={t("yearPlaceholder")}
                value={year}
                setValue={setYear}
              />

              <ParticipantList
                label={t("participants")}
                participants={participants}
                setParticipants={setParticipants}
                placeholder={t("participantsPlaceholder")}
                handleFetchContributor={handleFetchContributor}
                error={errors.participants}
                setParentError={(msg) =>
                  setErrors((prev) => ({ ...prev, participants: msg }))
                }
                t={t}
              />

              <div className="pt-16 ">
                <AttachmentUploader
                  label={t("attachments")}
                  note={t("attachmentsNote")}
                  buttonLabel={t("uploadAttachments")}
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6 order-1 -mt-9">
              <RadioGroup
                label={t("researchType")}
                options={[
                  { label: t("manual"), value: "manual" },
                  { label: "DOI", value: "doi" },
                ]}
                name="researchType"
                value={researchType}
                onChange={(val) => {
                  setResearchType(val);

                  setErrors((prev) => {
                    const copy = { ...prev };

                    if (val === "doi") {
                      delete copy.researchTitle; // clear title error
                    }

                    return copy;
                  });

                  if (val === "manual") {
                    setDoi("");
                    setDoiFetched(false);
                  }
                }}
              />

              <div className="md:translate-y-3">
                <DOIInput
                  placeholder={t("doiPlaceholder")}
                  value={doi}
                  setValue={(val) => {
                    setDoi(val);
                    setDoiFetched(false); // reset validity
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.doi;
                      return copy;
                    });
                  }}
                  onSearch={handleFetchDOI}
                  error={errors.doi || doiError}
                  disabled={researchType === "manual"}
                />
              </div>

              <div className="md:translate-y-4">
                <TextareaField
                  label={t("researchTitle")}
                  placeholder={t("researchTitlePlaceholder")}
                  value={researchTitle}
                  setValue={(val) => {
                    setResearchTitle(val);
                    clearError("researchTitle");
                  }}
                  required
                  height="h-[167px]"
                  className="border-2 border-[#B38E19] focus:border-[#B38E19] focus:ring-0"
                  error={errors.researchTitle}
                  disabled={researchType === "doi"} // DOI selected
                />
              </div>

              <div className="mb-2 md:translate-y-3">
                <InputField
                  label={t("publisher")}
                  placeholder={t("publisherPlaceholder")}
                  value={publisher}
                  setValue={setPublisher}
                />
              </div>

              <div className="pt-1 md:translate-y-2">
                <InputField
                  label={t("relatedResearch")}
                  placeholder={t("relatedResearchPlaceholder")}
                  value={relatedResearchLink}
                  setValue={setRelatedResearchLink}
                />
              </div>

              <div className="pt-2">
                <RadioGroup
                  label={t("basedOn")}
                  options={[
                    { label: t("master"), value: "master" },
                    { label: t("phd"), value: "phd" },
                    { label: t("other"), value: "other" },
                  ]}
                  name="basedOn"
                />
              </div>

              <div className="pt-1">
                <TextareaField
                  label={t("abstract")}
                  placeholder={t("abstractPlaceholder")}
                  value={abstract}
                  setValue={setAbstract}
                  height="h-[160px]"
                  className={`${isArabic ? "text-right" : "text-left"}`}
                  isAbstract={true}
                  error={errors.abstract}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM BUTTONS */}
          <div className="flex gap-4 mt-16 w-full px-6 justify-center md:justify-end">
            <button
              onClick={handleSave}
              className="bg-[#B38E19] text-white px-10 py-1.5 rounded-md"
            >
              {t("save")}
            </button>

            <button
              onClick={handleCancel}
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
