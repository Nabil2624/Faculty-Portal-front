import { addSupervisionThesis } from "../services/supervisionThesis.service";
import { getAcademicGrades } from "../services/lookup.service";
import { useState, useEffect } from "react";

export default function useSupervisionForm(navigate) {
  const [thesisType, setThesisType] = useState(null);
  const [facultyRole, setFacultyRole] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [universityOrFaculty, setUniversityOrFaculty] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [formationDate, setFormationDate] = useState("");
  const [discussionDate, setDiscussionDate] = useState("");
  const [grantingDate, setGrantingDate] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!thesisTitle.trim()) newErrors.thesisTitle = "thesisTitleRequired";

    if (!studentName.trim()) newErrors.studentName = "studentNameRequired";

    if (!degreeId) newErrors.degreeId = "degreeRequired";

    if (!facultyRole) newErrors.facultyRole = "facultyRoleRequired";

    if (!thesisType) newErrors.thesisType = "thesisTypeRequired";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addSupervisionThesis({
        type: thesisType,
        title: thesisTitle,
        facultyMemberRole: facultyRole,
        studentName,
        specialization,
        gradeId: degreeId,
        registrationDate,
        supervisionFormationDate: formationDate,
        discussionDate,
        grantingDate,
        universityOrFaculty,
      });

      // Navigate to supervision thesis list page after success
      navigate("/supervision-thesis");
    } catch (error) {
      console.error("Failed to add supervision:", error);
    } finally {
      setLoading(false);
    }
  };

  //--------- LOOKUPS ----------------
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await getAcademicGrades();
        setGrades(res.data || []);
      } catch (error) {
        console.error("Failed to fetch academic grades:", error);
      }
    };

    fetchGrades();
  }, []);

  return {
    thesisType,
    setThesisType,
    facultyRole,
    setFacultyRole,
    studentName,
    setStudentName,
    thesisTitle,
    setThesisTitle,
    specialization,
    setSpecialization,
    degreeId,
    setDegreeId,
    grades,
    universityOrFaculty,
    setUniversityOrFaculty,
    registrationDate,
    setRegistrationDate,
    formationDate,
    setFormationDate,
    discussionDate,
    setDiscussionDate,
    grantingDate,
    setGrantingDate,
    loading,
    errors,
    handleSubmit,
  };
}
