// hooks/useEditScientificResearch.js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getResearchDetails,
  updateScientificResearch,
  fetchDOIData,
  fetchContributorByORCID,
} from "../services/scientificResearchService";

export default function useEditScientificResearch(researchId) {
  const { t, i18n } = useTranslation("AddScientificResearch");
  const isArabic = i18n.language === "ar";

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
  const [volume, setVolume] = useState("");
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
    async function load() {
      try {
        const data = await getResearchDetails(researchId);

        setDoi(data.doi || "");
        setResearchTitle(data.title || "");
        setPublisher(data.publisher || "");
        setJournalOrConference(data.journalOrConfernce || "");
        setYear(data.pubYear || "");
        setIssue(data.issue || "");
        setVolume(data.volume || "");
        setPages(data.noOfPages || "");
        setPubDate(data.pubDate || "");
        setResearchLink(data.researchLink || "");
        setRelatedResearchLink(data.relatedResearchLink || "");
        setAbstract(data.abstract || "");

        setPublisherType(Number(data.publisherType) || 0);
        setPublicationType(Number(data.publicationType) || 0);
        setBasedOn(Number(data.researchDerivedFrom) || 0);

        const mapped =
          data.contributions?.map((c) => ({
            id: c.id,
            name: c.memberAcademicName,
            internal: c.contributorType === 1,
            main: c.isTheMajorResearcher,
            contributorId: c.contributorId,
          })) || [];

        setParticipants(mapped);
        setOriginalParticipants(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (researchId) load();
  }, [researchId]);

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
        issue: issue || "",
        volume: volume || "",
        noOfPages: pages || "",
        pubYear: year || "",
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
  };
}
