// hooks/useEditScientificResearch.js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getResearchDetails,
  updateScientificResearch,
  fetchDOIData,
  fetchContributorByORCID,
  uploadResearchAttachments,
  deleteResearchAttachment,
} from "../services/scientificResearchService";

export default function useEditScientificResearch(researchData, attachments) {
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

  const [originalAttachments, setOriginalAttachments] = useState([]);
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

    // ===== RADIO MAPPING =====
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

    // =========================
    // PARTICIPANTS MAPPING
    // =========================

    if (Array.isArray(researchData.contributions)) {
      const mappedParticipants = researchData.contributions.map((c) => ({
        id: c.id, // مهم عشان diff logic
        name: c.memberAcademicName,
        main: c.isTheMajorResearcher,
        internal:
          c.contributorType === 1 || c.contributorType === "FromUniverstity",
        contributorId: c.contributorId || null,
      }));

      setParticipants(mappedParticipants);
      setOriginalParticipants(mappedParticipants);
    }

    if (Array.isArray(researchData.attachments)) {
      setOriginalAttachments(researchData.attachments);
    }

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
      // =====================
      // ATTACHMENTS DIFF
      // =====================

      // deleted
      const deletedAttachments = originalAttachments.filter(
        (orig) => !attachments.find((a) => a.id === orig.id),
      );

      for (const att of deletedAttachments) {
        await deleteResearchAttachment(researchId, att.id);
      }

      // added
      const newAttachments = attachments.filter((a) => !a.id);

      if (newAttachments.length > 0) {
        await uploadResearchAttachments(researchId, newAttachments);
      }

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
