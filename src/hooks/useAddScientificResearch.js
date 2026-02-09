import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  saveScientificResearch,
  fetchDOIData,
  fetchContributorByORCID,
} from "../services/scientificResearchService";

export default function useAddScientificResearch() {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";

  const [loading, setLoading] = useState(false);
  const [abstract, setAbstract] = useState("");
  const [participants, setParticipants] = useState([]);
  const [doi, setDoi] = useState("");
  const [doiError, setDoiError] = useState("");
  const [orcidError, setOrcidError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [journalOrConference, setJournalOrConference] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [relatedResearchLink, setRelatedResearchLink] = useState("");

  // Save research
  const handleSave = async () => {
    setLoading(true);
    setSaveError("");
    try {
      const data = {
        abstract,
        participants,
        doi,
        researchTitle,
        publisher,
        journalOrConference,
        year,
        issue,
        pages,
        relatedResearchLink,
      };
      await saveScientificResearch(data);
      // Success can be handled in UI with a message instead of alert
    } catch (error) {
      console.error(error);
      setSaveError(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch DOI data
  const handleFetchDOI = async (doiValue) => {
    if (!doiValue.trim()) {
      setDoiError(t("doiRequired"));
      return;
    }

    setLoading(true);
    setDoiError("");
    try {
      const data = await fetchDOIData(doiValue);
      if (!data || Object.keys(data).length === 0) {
        setDoiError(t("fetchDOIError"));
        return;
      }

      setDoi(data.doi || "");
      setResearchTitle(data.title || "");
      setPublisher(data.publisher || "");
      setJournalOrConference(data.journal ?? "");
      setYear(data.year ?? "");
      setIssue(data.issue ?? "");
      setPages(data.pages ?? "");
      setRelatedResearchLink(data.relatedResearchLink ?? data.url ?? "");
      setAbstract(data.abstract ?? "");

      if (Array.isArray(data.authors)) {
        const mappedParticipants = data.authors.map((author) => ({
          name:
            author.name ||
            `${author.given || ""} ${author.family || ""}`.trim(),
          orcid: author.orcid || "",
          main: false,
          internal: true,
        }));
        setParticipants(mappedParticipants);
      }
    } catch (error) {
      console.error(error);
      setDoiError(t("fetchDOIError"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch contributor by ORCID
  const handleFetchContributor = async (orcid) => {
    if (!orcid.trim()) {
      setOrcidError(t("orcidRequired"));
      return null;
    }

    setLoading(true);
    setOrcidError("");
    try {
      const data = await fetchContributorByORCID(orcid);
      if (!data) {
        setOrcidError(t("contributorNotFound"));
        return null;
      }

      return {
        name: data.name || "",
        orcid: data.orcid || "",
        openAlexId: data.openAlexId || "",
        main: false,
        internal: true,
      };
    } catch (error) {
      console.error(error);
      setOrcidError(t("fetchContributorError"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
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
    orcidError,
    saveError,
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
    handleSave,
    handleFetchDOI,
    handleFetchContributor,
  };
}
