import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Newspaper } from "lucide-react";

// UI Components
import InputField from "../components/ui/InputField";
import FormButton from "../components/ui/FormButton";
import RadioGroup from "../components/ui/RadioGroup"; // تأكد من استخدام المسار الجديد للـ RadioGroup المصلح
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import AttachmentUploader from "../components/ui/AttachmentUploader";
import DOIInput from "../components/widgets/AddScientificResearch/DOIInput";
import ParticipantList from "../components/widgets/AddScientificResearch/ParticipantList";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";

// Hook
import useEditScientificResearch from "../hooks/useEditScientificResearch";

export default function EditScientificResearch() {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const research = location.state?.research;

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

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
    pages,
    setPages,
    researchLink,
    setResearchLink,
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
    handleSave: saveHook,
  } = useEditScientificResearch(research, attachments);

  const researchType = doi ? "doi" : "manual";
  const dir = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    if (!research) return;
    const mapped = (research.attachments || []).map((att) => ({
      id: att.id,
      fileName: att.fileName,
      contentType: att.contentType,
      size: att.size,
      name: att.fileName,
    }));
    setAttachments(mapped);
  }, [research]);

  const handleCancel = () => navigate("/ResearchesPage");

  const clearError = (field) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleSave = async () => {
    await saveHook(navigate);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] min-h-screen ${dir}`}>
        <PageHeaderNoAction title={t("editPageTitle")} icon={Newspaper} />

        <main className="flex-1 p-[clamp(0.5rem,1.5vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[1500px] bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 p-[clamp(1.5rem,3vw,4rem)]">
              
              {/* القسم الأيسر (Left Column) */}
              <div className="flex flex-col gap-6">
                <RadioGroup
                  label={t("researchType")}
                  options={[
                    { label: t("manual"), value: "manual" },
                    { label: "DOI", value: "doi" },
                  ]}
                  value={researchType}
                  onChange={() => {}} // Disabled in Edit
                  disabled
                />

                <DOIInput
                  value={doi}
                  setValue={setDoi}
                  disabled // Disabled in Edit
                />

                <InputField
                  label={t("researchTitle")}
                  placeholder={t("researchTitlePlaceholder")}
                  value={researchTitle}
                  onChange={(e) => {
                    setResearchTitle(e.target.value);
                    clearError("researchTitle");
                  }}
                  required
                  textarea
                  disabled={researchType === "doi"}
                  error={errors.researchTitle}
                  className="min-h-[100px]"
                />

                <InputField
                  label={t("journalOrConference")}
                  placeholder={t("journalOrConferencePlaceholder")}
                  value={JournalOrConference}
                  onChange={(e) => {
                    setJournalOrConference(e.target.value);
                    clearError("JournalOrConference");
                  }}
                  required
                  error={errors.JournalOrConference}
                />

                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    label={t("year")}
                    value={year}
                    onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
                    placeholder="2026"
                  />
                  <InputField
                    label={t("issue")}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="1"
                  />
                  <InputField
                    label={t("pages")}
                    value={pages} // تأكد أنها pages وليست noOfPages حسب الـ hook في التعديل
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="10-20"
                  />
                </div>

                <div className="mt-2">
                  <AttachmentUploader
                    label={t("attachments")}
                    note={t("attachmentsNote")}
                    buttonLabel={t("editAttachments")}
                    files={attachments}
                    setFiles={setAttachments}
                  />
                </div>
              </div>

              {/* القسم الأيمن (Right Column) */}
              <div className="flex flex-col gap-8 lg:border-s lg:ps-[clamp(2rem,4vw,5rem)] border-gray-100">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <RadioGroup
                    label={t("publisherType")}
                    options={[
                      { label: t("journal"), value: 1 },
                      { label: t("conference"), value: 2 },
                    ]}
                    value={publisherType}
                    onChange={(val) => setPublisherType(Number(val))}
                  />
                  <RadioGroup
                    label={t("publicationType")}
                    options={[
                      { label: t("local"), value: 1 },
                      { label: t("international"), value: 2 },
                    ]}
                    value={publicationType}
                    onChange={(val) => setPublicationType(Number(val))}
                  />
                </div>

                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  <ParticipantList
                    label={t("participants")}
                    participants={participants}
                    setParticipants={setParticipants}
                    t={t}
                    isArabic={isArabic}
                    setParentError={(msg) =>
                      setErrors((prev) => ({ ...prev, participants: msg }))
                    }
                  />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label={t("publisher")}
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      placeholder={t("publisherPlaceholder")}
                    />
                    <InputField
                      label={t("researchLink")}
                      value={researchLink}
                      onChange={(e) => setResearchLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <RadioGroup
                    label={t("basedOn")}
                    options={[
                      { label: t("master"), value: 1 },
                      { label: t("phd"), value: 2 },
                      { label: t("other"), value: 3 },
                    ]}
                    value={basedOn}
                    onChange={(val) => setBasedOn(Number(val))}
                  />

                  <InputField
                    label={t("abstract")}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder={t("abstractPlaceholder")}
                    textarea
                    className="min-h-[140px]"
                  />
                </div>
              </div>
            </div>

            {/* Footer الثابت والموحد */}
            <footer className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 px-12 py-8 rounded-b-[2rem]">
              <div className="flex items-end justify-end gap-6">
                <FormButton
                  variant="primary"
                  onClick={handleSave}
                  disabled={loading}
                  className="w-44 h-14 !text-lg"
                >
                  {loading ? t("loading") : t("save")}
                </FormButton>
                <FormButton
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
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