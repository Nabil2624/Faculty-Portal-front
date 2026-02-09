import { useRef, useState } from "react";

export function useAddScientificResearchForm(t) {
  const publishDateRef = useRef(null);
  const acceptanceDateRef = useRef(null);

  const [researchTitle, setResearchTitle] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [acceptanceDate, setAcceptanceDate] = useState("");
  const [degree, setDegree] = useState("");

  const [relatedResearches, setRelatedResearches] = useState([""]);
  const [committeeMembers, setCommitteeMembers] = useState([
    { role: "", name: "", jobTitle: "", organization: "" },
  ]);

  const [errors, setErrors] = useState({});

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  const addResearch = () => setRelatedResearches([...relatedResearches, ""]);

  const updateResearch = (index, value) => {
    const copy = [...relatedResearches];
    copy[index] = value;
    setRelatedResearches(copy);
  };

  const addMember = () =>
    setCommitteeMembers([
      ...committeeMembers,
      { role: "", name: "", jobTitle: "", organization: "" },
    ]);

  const updateMember = (index, field, value) => {
    const copy = [...committeeMembers];
    copy[index][field] = value;
    setCommitteeMembers(copy);
  };

  const handleSave = () => {
    const newErrors = {};

    if (!researchTitle)
      newErrors.researchTitle = `${t("researchTitle")} ${t("required")}`;

    if (!publishDate)
      newErrors.publishDate = `${t("publishDate")} ${t("required")}`;

    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      console.log("Scientific Research Data", {
        researchTitle,
        publishDate,
        acceptanceDate,
        degree,
        relatedResearches,
        committeeMembers,
      });
    }
  };

  return {
    refs: {
      publishDateRef,
      acceptanceDateRef,
    },
    values: {
      researchTitle,
      publishDate,
      acceptanceDate,
      degree,
      relatedResearches,
      committeeMembers,
    },
    setters: {
      setResearchTitle,
      setPublishDate,
      setAcceptanceDate,
      setDegree,
    },
    helpers: {
      openDatePicker,
      addResearch,
      updateResearch,
      addMember,
      updateMember,
      handleSave,
    },
    errors,
  };
}
