import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

// UI & Widgets (SAME AS ADD)
import InputFieldArea from "../components/ui/InputFieldArea";
import RadioGroup from "../components/widgets/AddScientificResearch/RadioGroup";
import ParticipantList from "../components/widgets/AddScientificResearch/ParticipantList";
import TextareaField from "../components/ui/TextAreaField";
import AttachmentUploader from "../components/widgets/AddScientificResearch/AttachmentUploader";
import DOIInput from "../components/widgets/AddScientificResearch/DOIInput";

export default function EditScientificResearch() {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // Placeholder data (mock existing research)
  const [researchType, setResearchType] = useState("manual");
  const [publisherType, setPublisherType] = useState("journal");
  const [publicationType, setPublicationType] = useState("international");

  const [researchTitle, setResearchTitle] = useState(
    "Artificial Intelligence in Healthcare Systems",
  );
  const [journalOrConference, setJournalOrConference] = useState(
    "International Journal of Computer Science",
  );
  const [issue, setIssue] = useState("Vol. 12");
  const [pages, setPages] = useState("120 - 135");
  const [year, setYear] = useState("2024");
  const [publisher, setPublisher] = useState("Springer");
  const [relatedResearchLink, setRelatedResearchLink] = useState(
    "https://example.com/research",
  );
  const [abstract, setAbstract] = useState(
    "This research explores the impact of artificial intelligence in modern healthcare systems, focusing on predictive analytics and clinical decision support systems.",
  );
  const [participants, setParticipants] = useState([
    "Dr. Ahmed Hassan",
    "Dr. Mona Ali",
  ]);
  const [doi, setDoi] = useState("10.1000/xyz123");

  const handleSave = () => {
    console.log("Edited Research Saved");
  };

  const handleCancel = () => {
    navigate("/scientific-researches");
  };

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
                <RadioGroup
                  label={t("publisherType")}
                  options={[
                    { label: t("journal"), value: "journal" },
                    { label: t("conference"), value: "conference" },
                  ]}
                  name="publisherType"
                  value={publisherType}
                  onChange={setPublisherType}
                />

                <RadioGroup
                  label={t("publicationType")}
                  options={[
                    { label: t("local"), value: "local" },
                    { label: t("international"), value: "international" },
                  ]}
                  name="publicationType"
                  value={publicationType}
                  onChange={setPublicationType}
                />
              </div>

              <InputFieldArea
                label={t("journalOrConference")}
                value={journalOrConference}
                setValue={setJournalOrConference}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputFieldArea
                  label={t("issue")}
                  value={issue}
                  setValue={setIssue}
                />
                <InputFieldArea
                  label={t("pages")}
                  value={pages}
                  setValue={setPages}
                />
              </div>

              <InputFieldArea
                label={t("researchLink")}
                value={relatedResearchLink}
                setValue={setRelatedResearchLink}
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
              />

              <InputFieldArea
                label={t("publisher")}
                value={publisher}
                setValue={setPublisher}
              />

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
