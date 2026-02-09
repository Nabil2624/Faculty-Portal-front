import { useRef, useState } from "react";

export function useAddThesisForm(t) {
  const registrationDateRef = useRef(null);
  const enrollmentDateRef = useRef(null);
  const internalDegreeDateRef = useRef(null);
  const jointSupervisionDateRef = useRef(null);

  const [registrationDate, setRegistrationDate] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [internalDegreeDate, setInternalDegreeDate] = useState("");
  const [jointSupervisionDate, setJointSupervisionDate] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");

  const [researches, setResearches] = useState([""]);
  const [members, setMembers] = useState([
    { role: "", name: "", jobTitle: "", organization: "" },
  ]);

  const [errors, setErrors] = useState({});

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
      console.log("Form data", {
        registrationDate,
        enrollmentDate,
        internalDegreeDate,
        jointSupervisionDate,
        thesisTitle,
        researches,
        members,
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
    },
    setters: {
      setRegistrationDate,
      setEnrollmentDate,
      setInternalDegreeDate,
      setJointSupervisionDate,
      setThesisTitle,
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
