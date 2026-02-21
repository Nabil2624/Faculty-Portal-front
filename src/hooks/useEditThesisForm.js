import { useState, useEffect, useRef } from "react";
import { updateThesis } from "../services/theses.services";

export function useEditThesisForm(t, thesisData, thesisId) {
  const registrationDateRef = useRef(null);
  const enrollmentDateRef = useRef(null);
  const internalDegreeDateRef = useRef(null);
  const jointSupervisionDateRef = useRef(null);

  const [registrationDate, setRegistrationDate] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [internalDegreeDate, setInternalDegreeDate] = useState("");
  const [jointSupervisionDate, setJointSupervisionDate] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");

  const [researches, setResearches] = useState([]);
  const [members, setMembers] = useState([]);
  const [degreeId, setDegreeId] = useState("");
  const [thesisType, setThesisType] = useState("PHD");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);

  // Initialize from backend data
  useEffect(() => {
    if (!thesisData) return;

    setRegistrationDate(thesisData.registrationDate || "");
    setEnrollmentDate(thesisData.enrollmentDate || "");
    setInternalDegreeDate(thesisData.internalGradeDate || "");
    setJointSupervisionDate(thesisData.supervisionConfirmationDate || "");
    setThesisTitle(thesisData.title || "");
    setDegreeId(thesisData.gradeId || "");
    setThesisType(thesisData.type || "PHD");

    // map researches
    setResearches(thesisData.researches || []);

    // map supervisors
    setMembers(
      thesisData.supervisors?.map((s) => ({
        role: s.role,
        name: s.name,
        jobTitle: s.jobLevelId,
        organization: s.authority,
      })) || []
    );
  }, [thesisData]);

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  const addMember = () =>
    setMembers([
      ...members,
      { role: 1, name: "", jobTitle: null, organization: null },
    ]);

  const updateMember = (index, field, value) => {
    if (index === -1 && field === "replace") return setMembers(value);
    const copy = [...members];
    copy[index][field] = value;
    setMembers(copy);
  };

  const validate = () => {
    const newErrors = {};
    if (!registrationDate)
      newErrors.registrationDate = `${t("registrationDate")} ${t("required")}`;
    if (!enrollmentDate)
      newErrors.enrollmentDate = `${t("enrollmentDate")} ${t("required")}`;
    if (!thesisTitle)
      newErrors.thesisTitle = `${t("thesisTitle")} ${t("required")}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        id: thesisId,
        type: thesisType,
        title: thesisTitle,
        gradeId: degreeId,
        enrollmentDate,
        registrationDate,
        internalGradeDate: internalDegreeDate || null,
        supervisionConfirmationDate: jointSupervisionDate || null,

        supervisors: members
          .filter((m) => m.name && m.jobTitle)
          .map((m) => ({
            role: m.role,
            name: m.name,
            jobLevelId: m.jobTitle,
            authority: m.organization || "",
          })),

        researches: researches || [],
      };

      await updateThesis(thesisId, payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSelectedResearch = (research) => {
  if (!researches.find((r) => r.id === research.id)) {
    setResearches([...researches, research]);
  }
  setSearchTerm("");
  setSearchResults([]);
};

const removeResearch = (id) => {
  setResearches(researches.filter((r) => r.id !== id));
};

  return {
    refs: {
      registrationDateRef,
      enrollmentDateRef,
      internalDegreeDateRef,
      jointSupervisionDateRef,
    },
    values: {
      registrationDate,
      enrollmentDate,
      internalDegreeDate,
      jointSupervisionDate,
      thesisTitle,
      researches,
      members,
      thesisType,
      degreeId,
      loading,
      researches,
  searchTerm,
  searchResults,
    },
    setters: {
      setRegistrationDate,
      setEnrollmentDate,
      setInternalDegreeDate,
      setJointSupervisionDate,
      setThesisTitle,
      setThesisType,
      setDegreeId,
      setSearchTerm,

    },
    helpers: {
      openDatePicker,
      addMember,
      updateMember,
      handleSave,
      addSelectedResearch,
removeResearch,

    },
    errors,
  };
}
