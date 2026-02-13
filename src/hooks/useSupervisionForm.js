import { useState } from "react";
import { addSupervisionThesis } from "../services/supervisionThesis.service";

export default function useSupervisionForm(navigate) {
  const [thesisType, setThesisType] = useState(""); // PHD or MASTER
  const [facultyRole, setFacultyRole] = useState(""); // default
  const [studentName, setStudentName] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [universityOrFaculty, setUniversityOrFaculty] = useState("");

  const [registrationDate, setRegistrationDate] = useState("");
  const [formationDate, setFormationDate] = useState("");
  const [discussionDate, setDiscussionDate] = useState("");
  const [grantingDate, setGrantingDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};
    if (!thesisTitle.trim()) newErrors.thesisTitle = "Thesis title is required";
    if (!studentName.trim()) newErrors.studentName = "Student name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addSupervisionThesis({
        type: thesisType || "PHD",
        title: thesisTitle,
        facultyMemberRole: facultyRole,
        studentName,
        specialization,
        gradeId: degreeId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        registrationDate,
        supervisionFormationDate: formationDate,
        discussionDate,
        grantingDate,
        universityOrFaculty,
      });

      alert("Thesis supervision added successfully!");
      navigate("/supervision-list");
    } catch (error) {
      console.error("Failed to add supervision:", error);
      alert("Failed to add supervision. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
