import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import LoadingSpinner from "../components/LoadingSpinner";

// UI & Widgets (SAME AS ADD)
import InputFieldArea from "../components/ui/InputFieldArea";
import RadioGroup from "../components/widgets/AddScientificResearch/RadioGroup";
import ParticipantList from "../components/widgets/AddScientificResearch/ParticipantList";
import TextareaField from "../components/ui/TextAreaField";
import AttachmentUploader from "../components/widgets/AddScientificResearch/AttachmentUploader";
import DOIInput from "../components/widgets/AddScientificResearch/DOIInput";

// ✅ Hook
import useEditScientificResearch from "../hooks/useEditScientificResearch";

export default function EditScientificResearch() {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    loading,
    doi,
    setDoi,
    researchTitle,
    setResearchTitle,
    publisher,
    setPublisher,
    JournalOrConference,
    setJournalOrConference,
    year,
    setYear,
    issue,
    setIssue,
    volume,
    setVolume,
    pages,
    setPages,
    pubDate,
    setPubDate,
    researchLink,
    setResearchLink,
    relatedResearchLink,
    setRelatedResearchLink,
    abstract,
    setAbstract,
    publisherType,
    setPublisherType,
    publicationType,
    setPublicationType,
    basedOn,
    setBasedOn,
    participants,
    setParticipants,
    handleSave,
  } = useEditScientificResearch(id);

  const [researchType, setResearchType] = useState("manual");

  const handleCancel = () => {
    navigate("/scientific-researches");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className="overflow-y-hidden">
        <div
          className={`${isArabic ? "rtl" : "ltr"} p-6 bg-white max-w-[1600px] mx-auto`}
        >
          <PageHeaderNoAction title={t("editPageTitle")} />

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-28 max-w-[1200px] mx-auto mt-16 ${
              isArabic ? "mr-2" : "ml-2"
            }`}
          >
            {/* LEFT COLUMN */}
            <div className="space-y-8 order-2 md:-mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-72">
                {/* ✅ Numbers not strings */}
                <RadioGroup
                  label={t("publisherType")}
                  options={[
                    { label: t("journal"), value: 1 },
                    { label: t("conference"), value: 2 },
                  ]}
                  name="publisherType"
                  value={publisherType}
                  onChange={(val) => setPublisherType(Number(val))}
                />

                <RadioGroup
                  label={t("publicationType")}
                  options={[
                    { label: t("local"), value: 1 },
                    { label: t("international"), value: 2 },
                  ]}
                  name="publicationType"
                  value={publicationType}
                  onChange={(val) => setPublicationType(Number(val))}
                />
              </div>

              <InputFieldArea
                label={t("journalOrConference")}
                value={JournalOrConference}
                setValue={setJournalOrConference}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputFieldArea
                  label={t("issue")}
                  value={issue}
                  setValue={setIssue}
                />

                <InputFieldArea
                  label={t("volume")}
                  value={volume}
                  setValue={setVolume}
                />
              </div>

              <InputFieldArea
                label={t("researchLink")}
                value={researchLink}
                setValue={setResearchLink}
              />

              <InputFieldArea
                label={t("year")}
                value={year}
                setValue={setYear}
              />

              <ParticipantList
                label={t("participants")}
                participants={participants}
                setParticipants={setParticipants}
                t={t}
              />

              <AttachmentUploader
                label={t("attachments")}
                note={t("attachmentsNote")}
                buttonLabel={t("editAttachments")}
              />
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
                onChange={setResearchType}
              />

              <DOIInput value={doi} setValue={setDoi} />

              <TextareaField
                label={t("researchTitle")}
                value={researchTitle}
                setValue={setResearchTitle}
                height="h-[167px]"
                className="border-2 border-[#B38E19] focus:border-[#B38E19] focus:ring-0"
                disabled={researchType === "doi"}
              />

              <InputFieldArea
                label={t("publisher")}
                value={publisher}
                setValue={setPublisher}
              />

              {/* ✅ Numbers not strings */}
              <RadioGroup
                label={t("basedOn")}
                options={[
                  { label: t("master"), value: 1 },
                  { label: t("phd"), value: 2 },
                  { label: t("other"), value: 3 },
                ]}
                name="basedOn"
                value={basedOn}
                onChange={(val) => setBasedOn(Number(val))}
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
              onClick={() => handleSave(navigate)}
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
