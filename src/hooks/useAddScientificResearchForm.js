import { useRef, useState } from "react";
import { saveScientificResearch } from "../services/scientificResearchService";
import { useNavigate } from "react-router-dom";

export function useAddScientificResearchForm(t) {
  const navigate = useNavigate();

  // Refs for date pickers
  const publishDateRef = useRef(null);
  const acceptanceDateRef = useRef(null);

  // State
  const [researchType, setResearchType] = useState("manual"); // manual or doi
  const [researchTitle, setResearchTitle] = useState("");
  const [doi, setDoi] = useState("");
  const [doiFetched, setDoiFetched] = useState(false);
  const [journalOrConference, setJournalOrConference] = useState("");
  const [publisherType, setPublisherType] = useState(""); // journal / conference
  const [publicationType, setPublicationType] = useState(""); // local / international
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [researchLink, setResearchLink] = useState("");
  const [relatedResearchLink, setRelatedResearchLink] = useState("");
  const [abstract, setAbstract] = useState("");
  const [basedOn, setBasedOn] = useState(""); // Master / PhD / Other
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [errors, setErrors] = useState({});

  // Open date picker
  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!journalOrConference.trim())
      newErrors.journalOrConference =
        t("journalOrConference") + " " + t("isRequired");

    if (!publisherType)
      newErrors.publisherType = t("publisherType") + " " + t("isRequired");
    if (!publicationType)
      newErrors.publicationType = t("publicationType") + " " + t("isRequired");

    if (!basedOn) newErrors.basedOn = t("basedOn") + " " + t("isRequired");

    if (researchType === "doi") {
      if (!doi.trim()) newErrors.doi = t("doiRequired");
      else if (!doiFetched) newErrors.doi = t("fetchDOIError");
    } else if (researchType === "manual") {
      if (!researchTitle.trim())
        newErrors.researchTitle = t("researchTitle") + " " + t("isRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      doi: researchType === "doi" ? doi : null,
      title: researchType === "manual" ? researchTitle : null,
      journalOrConfernce: journalOrConference || null,
      publisherType: publisherType || null,
      publicationType: publicationType || null,
      publisher: publisher || null,
      year: year || null,
      issue: issue || null,
      noOfPages: pages || null,
      researchLink: researchLink || null,
      relatedResearchLink: relatedResearchLink || null,
      abstract: abstract || null,
      source: "Internal",
      researchDerivedFrom: basedOn || null,
      contributions: participants.map((p) => ({
        memberAcademicName: p.name || null,
        contributorType: p.internal ? "FromUniverstity" : "External",
        isTheMajorResearcher: !!p.main,
      })),
    };

    try {
      setLoading(true);
      await saveScientificResearch(payload);
      navigate("/scientific-researches");
    } catch (error) {
      console.error(error);
      setSaveError(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    researchType,
    setResearchType,
    researchTitle,
    setResearchTitle,
    doi,
    setDoi,
    doiFetched,
    setDoiFetched,
    journalOrConference,
    setJournalOrConference,
    publisherType,
    setPublisherType,
    publicationType,
    setPublicationType,
    publisher,
    setPublisher,
    year,
    setYear,
    issue,
    setIssue,
    pages,
    setPages,
    researchLink,
    setResearchLink,
    relatedResearchLink,
    setRelatedResearchLink,
    abstract,
    setAbstract,
    basedOn,
    setBasedOn,
    participants,
    setParticipants,
    errors,
    setErrors,
    loading,
    saveError,
    handleSave,
    openDatePicker,
  };
}
