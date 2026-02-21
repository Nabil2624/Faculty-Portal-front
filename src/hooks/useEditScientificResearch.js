// hooks/useEditScientificResearch.js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getResearchDetails,
  updateScientificResearch,
  fetchDOIData,
  fetchContributorByORCID,
} from "../services/scientificResearchService";

export default function useEditScientificResearch(researchData){
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";
const researchId = researchData?.id;
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");

  // =======================
  // Fields (SAME AS ADD)
  // =======================
  const [doi, setDoi] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [JournalOrConference, setJournalOrConference] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");

  const [pages, setPages] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [researchLink, setResearchLink] = useState("");
  const [relatedResearchLink, setRelatedResearchLink] = useState("");
  const [abstract, setAbstract] = useState("");

  // radio values (NUMBERS)
  const [publisherType, setPublisherType] = useState(0);
  const [publicationType, setPublicationType] = useState(0);
  const [basedOn, setBasedOn] = useState(0);

  const [participants, setParticipants] = useState([]);
  const [originalParticipants, setOriginalParticipants] = useState([]);

  // =======================
  // LOAD DATA
  // =======================
  useEffect(() => {
  if (!researchData) return;

  setDoi(researchData.doi || "");
  setResearchTitle(researchData.title || "");
  setPublisher(researchData.publisher || "");
  setJournalOrConference(researchData.journalOrConfernce || "");
  setYear(researchData.pubYear || "");
  setIssue(researchData.issue || "");
  setPages(researchData.noOfPages || "");
  setPubDate(researchData.pubDate || "");
  setResearchLink(researchData.researchLink || "");
  setRelatedResearchLink(researchData.relatedResearchLink || "");
  setAbstract(researchData.abstract || "");

  // نفس mapping بتاع radio
  const publisherMap = {
    Journal: 1,
    Magazine: 1,
    Conference: 2,
  };

  setPublisherType(publisherMap[researchData.publisherType] || 0);

  const publicationMap = {
    Local: 1,
    International: 2,
  };

  setPublicationType(publicationMap[researchData.publicationType] || 0);

  const basedMap = {
    Master: 1,
    PHD: 2,
    Other: 3,
  };

  setBasedOn(basedMap[researchData.researchDerivedFrom] || 0);

  setLoading(false);
}, [researchData]);

  // =======================
  // SAVE
  // =======================
  const handleSave = async (navigate) => {
    setLoading(true);
    setSaveError("");

    try {
      // ===== CONTRIBUTION DIFF LOGIC =====
      const toDelete = originalParticipants
        .filter((op) => !participants.find((p) => p.id === op.id))
        .map((p) => ({
          id: p.id,
          memberAcademicName: p.name,
          contributorType: p.internal ? 1 : 2,
          isTheMajorResearcher: p.main,
          researchId,
          contributorId: p.contributorId,
        }));

      const toAdd = participants
        .filter((p) => !p.id)
        .map((p) => ({
          memberAcademicName: p.name,
          contributorType: p.internal ? 1 : 2,
          isTheMajorResearcher: p.main,
        }));

      const toUpdate = participants
        .filter((p) => p.id)
        .map((p) => ({
          id: p.id,
          data: {
            memberAcademicName: p.name,
            contributorType: p.internal ? 1 : 2,
            isTheMajorResearcher: p.main,
          },
        }));

      const payload = {
        doi: doi || "",
        title: researchTitle || "",
        relatedResearchLink: relatedResearchLink || "",
        publisher: publisher || "",
        researchLink: researchLink || "",
        journalOrConfernce: JournalOrConference || "",
        publisherType: Number(publisherType) || 0,
        publicationType: Number(publicationType) || 0,
        issue: issue || null,
    
        noOfPages: pages || null,
        pubYear: year || null,
        source: "Internal",
        researchDerivedFrom: Number(basedOn) || 0,
        abstract: abstract || "",
        pubDate: pubDate || "",
        researchContributionsToDelete: toDelete,
        researchContributionsToAdd: toAdd,
        researchContributionsToUpdate: toUpdate,
      };

      await updateScientificResearch(researchId, payload);

      if (navigate) navigate("/scientific-researches");
    } catch (err) {
      console.error(err);
      setSaveError(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    isArabic,
    loading,
    saveError,
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
  };
}
