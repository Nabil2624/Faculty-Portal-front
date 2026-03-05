import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  addThesis,
  updateThesis,
  getAcademicGrades,
  getAcademicQualifications,
  getEmploymentDegrees,
  getUniversities,
  searchResearchByTitle,
  uploadThesisAttachments,
} from "../services/theses.services";

export function useThesisForm({
  mode = "add",
  thesisData = null,
  thesisId = null,
  t,
  setModalMessage,
  setIsModalOpen,
  isArabic,
}) {
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

  const [initialMembers, setInitialMembers] = useState([]);

  useEffect(() => {
    if (mode === "edit" && thesisData) {
      setInitialMembers(
        (thesisData.comitteeMembers || []).map((s) => ({
          id: s.id,
          memberId: s.memberId,
          role: s.role,
          name: s.name,
          jobLevelId: s.jobLevelId,
          authority: s.authority,
        })),
      );
    }
  }, [mode, thesisData]);
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

    // FIXED COMMITTEE MEMBERS MAPPING
    setMembers(
      (thesisData.comitteeMembers || []).map((s) => {
        let roleValue = 3;

        if (typeof s.role === "string") {
          const r = s.role.toLowerCase();
          if (r === "administration" || r === "adminstration") roleValue = 1;
          else if (r === "reviewing") roleValue = 2;
        } else if (typeof s.role === "number") {
          roleValue = s.role;
        }

        return {
          id: s.id, // ✅ VERY IMPORTANT
          memberId: s.memberId, // ✅ VERY IMPORTANT
          role: roleValue,
          name: s.name || "",
          jobTitle: s.jobLevelId || null,
          organization: s.authority || null,
        };
      }),
    );
  }, [mode, thesisData]);

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
    if (!degreeId) newErrors.degreeId = `${t("degree")} ${t("required")}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE =================
  const handleSave = async (attachments = [], initialAttachments = []) => {
    if (!validate()) return;

    setLoading(true);

    try {
      // ================= CURRENT MEMBERS =================
      const currentMembers = members
        .filter((m) => m.name && m.jobTitle)
        .map((m) => ({
          id: m.id || 0,
          memberId: m.memberId || null,
          role: m.role,
          name: m.name,
          jobLevelId: m.jobTitle,
          authority: m.organization || "",
          thesesId: thesisId,
        }));

      // ================= RESEARCHES =================
      const currentResearches = researches.map((r) => ({
        ...r,
        contributions: r.contributions || [],
        attachments: r.attachments || [],
      }));

      let payload;

      if (mode === "edit") {
        const supervisorsToAdd = currentMembers.filter((cm) => !cm.id);
        const supervisorsToUpdate = currentMembers
          .filter((cm) => cm.id)
          .map((cm) => ({
            id: cm.id,
            data: {
              memberId: cm.memberId,
              role: cm.role,
              name: cm.name,
              jobLevelId: cm.jobLevelId,
              authority: cm.authority,
              thesesId: cm.thesesId,
            },
          }));
        const supervisorsToDelete = initialMembers.filter(
          (im) => !currentMembers.some((cm) => cm.id === im.id),
        );

        const researchesToAdd = currentResearches.filter((r) => !r.id);
        const researchesToUpdate = currentResearches
          .filter((r) => r.id)
          .map((r) => ({ id: r.id, data: r }));
        const researchesToDelete = (thesisData?.researches || []).filter(
          (r) => !currentResearches.some((cr) => cr.id === r.id),
        );

        payload = {
          type: thesisType,
          title: thesisTitle,
          gradeId: degreeId,
          enrollmentDate,
          registrationDate,
          internalGradeDate: internalDegreeDate || null,
          supervisionConfirmationDate: jointSupervisionDate || null,
          supervisorsToAdd,
          supervisorsToUpdate,
          supervisorsToDelete,
          researchesToAdd,
          researchesToUpdate,
          researchesToDelete,
          attachmentsToAdd: [], // handle attachments if needed
          attachmentsToDelete: [], // handle deletions if needed
        };
      } else {
        // Add mode
        payload = {
          type: thesisType,
          title: thesisTitle,
          gradeId: degreeId,
          enrollmentDate,
          registrationDate,
          internalGradeDate: internalDegreeDate || null,
          supervisionConfirmationDate: jointSupervisionDate || null,
          comitteeMembers: currentMembers,
          researches: currentResearches,
        };
      }

      // ================= SEND =================
      if (mode === "edit") {
        // ================= ATTACHMENTS LOGIC =================

        // الملفات اللي اتمسحت
        const attachmentsToDelete = initialAttachments.filter(
          (initial) =>
            !attachments.some((current) => current.id === initial.id),
        );

        //  الملفات الجديدة (ملهاش id)
        const attachmentsToAdd = attachments.filter((file) => !file.id);

        //  DELETE
        for (const file of attachmentsToDelete) {
          await axiosInstance.delete(
            `/Attachments/${thesisId}/${file.id}?context=2`,
          );
        }

        //  ADD
        if (attachmentsToAdd.length > 0) {
          await uploadThesisAttachments(thesisId, attachmentsToAdd);
        }
      } else {
        const response = await addThesis(payload);

        // extract entityId
        const entityId = response?.data?.id || response?.data || response?.id;

        if (!entityId) {
          throw new Error("Entity ID not returned from backend");
        }

        // upload attachments if exists
        if (attachments && attachments.length > 0) {
          await uploadThesisAttachments(entityId, attachments);
        }
      }

      navigate("/theses");
    } catch (err) {
      if (err.response?.status === 403) {
        setModalMessage(
          isArabic
            ? "لا يمكنك تعديل أو إزالة بيانات هذا العضو لأنه مؤكد كمشرف على هذه الرسالة."
            : "You can't edit or remove this committee member data because they are already confirmed supervising this thesis.",
        );
        setIsModalOpen(true);
      } else {
        console.error(err);
      }
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
