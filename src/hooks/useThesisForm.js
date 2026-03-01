import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addThesis,
  updateThesis,
  getAcademicGrades,
  getAcademicQualifications,
  getEmploymentDegrees,
  getUniversities,
  searchResearchByTitle,
} from "../services/theses.services";

export function useThesisForm({ mode = "add", thesisData = null, thesisId = null, t }) {
  const navigate = useNavigate();

  // ================= REFS =================
  const registrationDateRef = useRef(null);
  const enrollmentDateRef = useRef(null);
  const internalDegreeDateRef = useRef(null);
  const jointSupervisionDateRef = useRef(null);

  // ================= STATE =================
  const [registrationDate, setRegistrationDate] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [internalDegreeDate, setInternalDegreeDate] = useState("");
  const [jointSupervisionDate, setJointSupervisionDate] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");

  const [researches, setResearches] = useState([]);
  const [members, setMembers] = useState([
    { role: 1, name: "", jobTitle: null, organization: null },
  ]);

  const [degreeId, setDegreeId] = useState("");
  const [thesisType, setThesisType] = useState("PHD");

  const [grades, setGrades] = useState([]);
  const [employmentDegrees, setEmploymentDegrees] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= LOAD LOOKUPS =================
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const { data: gradeData } = await getAcademicGrades();
        setGrades(gradeData || []);

        const { data: empData } = await getEmploymentDegrees();
        setEmploymentDegrees(empData || []);

        const { data: uniData } = await getUniversities();
        setUniversities(uniData || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLookups();
  }, []);

  // ================= INIT EDIT =================
// ================= INIT EDIT =================
useEffect(() => {
  if (mode !== "edit" || !thesisData) return;

  setRegistrationDate(thesisData.registrationDate || "");
  setEnrollmentDate(thesisData.enrollmentDate || "");
  setInternalDegreeDate(thesisData.internalGradeDate || "");
  setJointSupervisionDate(thesisData.supervisionConfirmationDate || "");
  setThesisTitle(thesisData.title || "");
  setDegreeId(thesisData.gradeId || "");
  setThesisType(thesisData.type || "PHD");

  setResearches(thesisData.researches || []);

  setMembers(
    thesisData.comitteeMembers?.map((s) => {
      let roleValue;
      if (typeof s.role === "string") {
        const r = s.role.toLowerCase();
        if (r === "administration") roleValue = 1;
        else if (r === "reviewing") roleValue = 2;
        else roleValue = 3; // both
      } else roleValue = s.role; // number already
      return {
        role: roleValue,
        name: s.name,
        jobTitle: s.jobLevelId,
        organization: s.authority || null,
      };
    }) || []
  );
}, [mode, thesisData]);
;

  // ================= SEARCH =================
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const { data } = await searchResearchByTitle(searchTerm);
        setSearchResults(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const addSelectedResearch = (research) => {
    if (researches.some((r) => r.id === research.id)) return;
    setResearches([...researches, research]);
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeResearch = (id) => {
    setResearches(researches.filter((r) => r.id !== id));
  };

  // ================= MEMBERS =================
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

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};
    if (!registrationDate)
      newErrors.registrationDate = `${t("registrationDate")} ${t("required")}`;
    if (!enrollmentDate)
      newErrors.enrollmentDate = `${t("enrollmentDate")} ${t("required")}`;
    if (!thesisTitle)
      newErrors.thesisTitle = `${t("thesisTitle")} ${t("required")}`;
    if (!degreeId)
      newErrors.degreeId = `${t("degree")} ${t("required")}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      type: thesisType,
      title: thesisTitle,
      gradeId: degreeId,
      enrollmentDate,
      registrationDate,
      internalGradeDate: internalDegreeDate || null,
      supervisionConfirmationDate: jointSupervisionDate || null,

      comitteeMembers: members
        .filter((m) => m.name && m.jobTitle)
        .map((m) => ({
          role: m.role,
          name: m.name,
          jobLevelId: m.jobTitle,
          authority: m.organization || "",
        })),

      researches,
    };

    try {
      if (mode === "edit") {
        await updateThesis(thesisId, { ...payload, id: thesisId });
      } else {
        await addThesis(payload);
      }

      navigate("/theses");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
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
      employmentDegrees,
      universities,
      degreeId,
      thesisType,
      searchTerm,
      searchResults,
      loading,
    },
    setters: {
      setRegistrationDate,
      setEnrollmentDate,
      setInternalDegreeDate,
      setJointSupervisionDate,
      setThesisTitle,
      setDegreeId,
      setThesisType,
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
