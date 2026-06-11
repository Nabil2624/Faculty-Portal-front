// ─── useReportFilters ─────────────────────────────────────────────────────────
// Owns all client-side filter state, reset logic, and filtered-data derivation.
// The page and the filter-bar component both consume this hook's return value.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function useReportFilters(
  selectedCategory,
  reportData,
  isArabic,
) {
  const [searchName, setSearchName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [seminarType, setSeminarType] = useState("");
  const [publicationRole, setPublicationRole] = useState("");
  const [participationType, setParticipationType] = useState("");
  const [patentScope, setPatentScope] = useState("");

  const resetFilters = () => {
    setSearchName("");
    setProjectType("");
    setSeminarType("");
    setPublicationRole("");
    setParticipationType("");
    setPatentScope("");
  };

  const filteredData = reportData.filter((row) => {
    if (searchName.trim()) {
      const haystack = isArabic
        ? (row.name_ar || row.faculty_ar || "").toLowerCase()
        : (row.name_en || row.faculty_en || "").toLowerCase();
      if (!haystack.includes(searchName.trim().toLowerCase())) return false;
    }
    if (selectedCategory === "PROJECTS_STATS" && projectType) {
      if (row.projectType_en !== projectType) return false;
    }
    if (selectedCategory === "SEMINARS_STATS" && seminarType) {
      if (row.seminarType_en !== seminarType) return false;
    }
    if (selectedCategory === "PUBLICATIONS_STATS" && publicationRole) {
      if (row.publicationRole_en !== publicationRole) return false;
    }
    if (selectedCategory === "JOURNALS_STATS" && participationType) {
      if (row.participationType_en !== participationType) return false;
    }
    if (selectedCategory === "PATENTS_STATS" && patentScope) {
      if (row.patentScope_en !== patentScope) return false;
    }
    return true;
  });

  return {
    searchName,
    setSearchName,
    projectType,
    setProjectType,
    seminarType,
    setSeminarType,
    publicationRole,
    setPublicationRole,
    participationType,
    setParticipationType,
    patentScope,
    setPatentScope,
    filteredData,
    resetFilters,
  };
}
