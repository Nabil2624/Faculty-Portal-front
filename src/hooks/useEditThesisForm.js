import { useState, useEffect, useRef } from "react";

export function useEditThesisForm(t, thesisData) {
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
  const [thesisType, setThesisType] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize with existing thesis data
    if (thesisData) {
      setRegistrationDate(thesisData.registrationDate || "");
      setEnrollmentDate(thesisData.enrollmentDate || "");
      setInternalDegreeDate(thesisData.internalDegreeDate || "");
      setJointSupervisionDate(thesisData.jointSupervisionDate || "");
      setThesisTitle(thesisData.thesisTitle || "");
      setResearches(thesisData.researches || []);
      setMembers(thesisData.members || []);
      setThesisType(thesisData.thesisType || "");
    }
  }, [thesisData]);

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  const addResearch = () => setResearches([...researches, ""]);

  const updateResearch = (index, value) => {
    const copy = [...researches];
    copy[index] = value;
    setResearches(copy);
  };

  const addMember = () =>
    setMembers([
      ...members,
      { role: "", name: "", jobTitle: "", organization: "" },
    ]);

  const updateMember = (index, field, value) => {
    const copy = [...members];
    copy[index][field] = value;
    setMembers(copy);
  };

  const handleSave = () => {
    const newErrors = {};

    if (!registrationDate)
      newErrors.registrationDate = `${t("registrationDate")} ${t("required")}`;
    if (!enrollmentDate)
      newErrors.enrollmentDate = `${t("enrollmentDate")} ${t("required")}`;
    if (!thesisTitle)
      newErrors.thesisTitle = `${t("thesisTitle")} ${t("required")}`;

    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      console.log("Updated thesis data", {
        registrationDate,
        enrollmentDate,
        internalDegreeDate,
        jointSupervisionDate,
        thesisTitle,
        researches,
        members,
        thesisType,
      });
    }
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
    },
    setters: {
      setRegistrationDate,
      setEnrollmentDate,
      setInternalDegreeDate,
      setJointSupervisionDate,
      setThesisTitle,
      setThesisType,
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
