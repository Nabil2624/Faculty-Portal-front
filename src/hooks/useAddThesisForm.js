import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addThesis,
  getAcademicGrades,
  getAcademicQualifications,
} from "../services/theses.services";

export function useAddThesisForm(t) {
  const navigate = useNavigate();

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
  const [members, setMembers] = useState([
    { role: "", name: "", jobTitle: "", organization: "" },
  ]);
  const [grades, setGrades] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [degreeId, setDegreeId] = useState(""); // for dropdown
  const [qualificationId, setQualificationId] = useState(""); // optional, only if needed
  const [thesisType, setThesisType] = useState("PHD");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch grades and qualifications
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const { data: gradeData } = await getAcademicGrades();
        setGrades(gradeData || []);
        const { data: qualData } = await getAcademicQualifications();
        setQualifications(qualData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLookups();
  }, []);

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
  };

  const addResearch = () => setResearches([...researches, {}]);
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
    if (!degreeId) newErrors.degreeId = `${t("degree")} ${t("required")}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        type: thesisType,
        link: "",
        title: thesisTitle,
        gradeId: degreeId,
        enrollmentDate,
        registrationDate,
        internalGradeDate: internalDegreeDate,
        supervisionConfirmationDate: jointSupervisionDate,
        facultyMemberId: "",
        supervisors: members.map((m) => ({
          role: m.role,
          name: m.name,
          jobLevelId: m.jobTitle,
          authority: "",
          thesesId: 0,
        })),
        researches: researches.map((r) => ({
          id: 0,
          doi: r.doi || "",
          title: r.title || "",
          relatedResearchLink: r.relatedResearchLink || "",
          publisher: r.publisher || "",
          researchLink: r.researchLink || "",
          journalOrConfernce: r.journalOrConference || "",
          publisherType: r.publisherType || "",
          publicationType: r.publicationType || "",
          issue: r.issue || "",
          volume: r.volume || "",
          noOfPages: r.noOfPages || "",
          pubYear: r.pubYear || "",
          source: "Internal",
          researchDerivedFrom: r.researchDerivedFrom || "",
          abstract: r.abstract || "",
          pubDate: r.pubDate || "",
          noOfCititations: r.noOfCitations || 0,
          cites: r.cites || [],
          contributions: r.contributions || [],
          attachments: r.attachments || [],
        })),
      };
      await addThesis(payload);
      navigate("/theses");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      grades,
      qualifications,
      degreeId,
      qualificationId,
      thesisType,
      loading,
    },
    setters: {
      setRegistrationDate,
      setEnrollmentDate,
      setInternalDegreeDate,
      setJointSupervisionDate,
      setThesisTitle,
      setDegreeId,
      setQualificationId,
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
    setErrors,
  };
}
