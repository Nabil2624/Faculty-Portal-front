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

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [doiError, setDoiError] = useState("");
  const [orcidError, setOrcidError] = useState("");
  const [saveError, setSaveError] = useState("");

  // Research fields
  const [abstract, setAbstract] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [JournalOrConference, setJournalOrConference] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");

  // const [pages, setPages] = useState("");
  const [relatedResearchLink, setRelatedResearchLink] = useState("");
  const [researchLink, setResearchLink] = useState("");

  // Publication & type states

  // Additional optional fields
  // const [volume, setVolume] = useState(""); // add a field if you have volume input
  const [pubDate, setPubDate] = useState(""); // add a field if you have pubDate input
  const [publisherType, setPublisherType] = useState(0);
  const [publicationType, setPublicationType] = useState(0);
  const [basedOn, setBasedOn] = useState(0);
  const [noOfPages, setNoOfPages] = useState("");
  // DOI
  const [doi, setDoi] = useState("");
  const [doiFetched, setDoiFetched] = useState(false);

  // Participants
  const [participants, setParticipants] = useState([]);

  // Save research
  // const handleSave = async () => {
  //   setLoading(true);
  //   setSaveError("");
  //   try {
  //     // Map frontend values to backend DTO
  //     const data = {
  //       doi: doi || "",
  //       title: researchTitle || "",
  //       relatedResearchLink: relatedResearchLink || null,
  //       publisher: publisher || null,
  //       researchLink: researchLink || null,
  //       journalOrConfernce: JournalOrConference || "",
  //       publisherType:
  //         publisherType === "journal"
  //           ? 1
  //           : publisherType === "conference"
  //             ? 2
  //             : 0,
  //       publicationType:
  //         publicationType === "local"
  //           ? 1
  //           : publicationType === "international"
  //             ? 2
  //             : 0,

  //       noOfPages: pages || null,
  //       pubYear: year || null,
  //       pubDate: pubDate || null, // add a field if you have pubDate input
  //       volume: volume || null,
  //       researchDerivedFrom:
  //         basedOn === "master"
  //           ? 1
  //           : basedOn === "phd"
  //             ? 2
  //             : basedOn === "other"
  //               ? 3
  //               : 0,
  //       abstract: abstract || "",
  //       noOfCititations: 0,
  //       contributions: participants.map((p) => ({
  //         memberAcademicName: p.name,
  //         contributorType: p.internal ? 1 : 2, // adjust if backend expects different
  //         isTheMajorResearcher: p.main || false,
  //       })),
  //     };

  //     await saveScientificResearch(data);
  //     // Success message handling
  //   } catch (error) {
  //     console.error(error);
  //     setSaveError(t("saveFailed"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async (navigate) => {
    // accept navigate
    setLoading(true);
    setSaveError("");
    try {
      const data = {
        doi: doi || "",
        title: researchTitle || "",
        relatedResearchLink: relatedResearchLink || null,
        publisher: publisher || null,
        researchLink: researchLink || null,
        journalOrConfernce: JournalOrConference || "",
        publisherType: Number(publisherType) || 0,
        publicationType: Number(publicationType) || 0,
        noOfPages: noOfPages || null,
        pubYear: year || null,
        // pubDate: pubDate || null,
        issue: issue || null,
        // volume: volume || null,
        researchDerivedFrom: Number(basedOn) || 0,
        abstract: abstract || "",
        noOfCititations: 0,
        contributions: participants.map((p) => ({
          memberAcademicName: p.name,
          contributorType: p.internal ? 1 : 2,
          isTheMajorResearcher: p.main || false,
        })),
      };

      await saveScientificResearch(data);

      // Navigate after successful save
      if (navigate) navigate("/scientific-researches");
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

      // Basic Info
      setDoi(data.doi || "");
      setResearchTitle(data.title || "");
      setJournalOrConference(data.journal || "");
      setPublisher(data.publisher || "");
      setYear(data.year ? String(data.year) : "");
      // setVolume(data.volume || "");
      setNoOfPages(data.noOfPages || "");
      setAbstract(data.abstract || "");
      setRelatedResearchLink(data.relatedResearchLink || "");

      // Auto-detect publisher type from DOI type
      if (data.type === "journal-article") {
        setPublisherType(1);
      } else {
        setPublisherType(2);
      }

      setDoiFetched(true);

      // Authors
      if (Array.isArray(data.authors)) {
        const mappedParticipants = data.authors.map((author) => ({
          name:
            author.name ||
            `${author.given || ""} ${author.family || ""}`.trim(),
          orcid: author.orcid
            ? author.orcid.replace("https://orcid.org/", "")
            : "",
          main: false,
          internal: true,
        }));

        setParticipants(mappedParticipants);
      }
    } catch (error) {
      setDoiFetched(false);
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
    researchTitle,
    setResearchTitle,
    publisher,
    setPublisher,
    JournalOrConference,
    setJournalOrConference,
    year,
    setYear,
    noOfPages,
    setNoOfPages,
    // pages,
    // setPages,
    relatedResearchLink,
    setRelatedResearchLink,
    researchLink,
    setResearchLink,
    publisherType,
    setPublisherType,
    publicationType,
    setPublicationType,
    basedOn,
    setBasedOn,
    doi,
    setDoi,
    doiError,
    doiFetched,
    setDoiFetched,
    participants,
    setParticipants,
    orcidError,
    saveError,
    handleSave,
    handleFetchDOI,
    handleFetchContributor,
    issue,
    setIssue,
    // volume,
    // setVolume,
    pubDate,
    setPubDate,
  };
}
