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
  const [selectedYears, setSelectedYears] = useState([]);
  const [projectType, setProjectType] = useState("");
  const [seminarType, setSeminarType] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [publicationRole, setPublicationRole] = useState("");
  const [participationType, setParticipationType] = useState("");
  const [patentScope, setPatentScope] = useState("");

  const resetFilters = () => {
    setSearchName("");
    setSelectedYears([]);
    setProjectType("");
    setSeminarType("");
    setExperienceType("");
    setPublicationRole("");
    setParticipationType("");
    setPatentScope("");
  };

  const availableYears =
    selectedCategory === "RESEARCH_STATS"
      ? [
          ...new Set(reportData.map((r) => String(r.year)).filter(Boolean)),
        ].sort()
      : [];

  const filteredData = reportData.filter((row) => {
    if (searchName.trim()) {
      const haystack = isArabic
        ? (row.name_ar || row.faculty_ar || "").toLowerCase()
        : (row.name_en || row.faculty_en || "").toLowerCase();
      if (!haystack.includes(searchName.trim().toLowerCase())) return false;
    }
    if (selectedCategory === "RESEARCH_STATS" && selectedYears.length > 0) {
      if (!selectedYears.includes(String(row.year))) return false;
    }
    if (selectedCategory === "PROJECTS_STATS" && projectType) {
      if (row.projectType_en !== projectType) return false;
    }
    if (selectedCategory === "SEMINARS_STATS" && seminarType) {
      if (row.seminarType_en !== seminarType) return false;
    }
    if (selectedCategory === "EXPERIENCES_STATS" && experienceType) {
      if (row.experienceType_en !== experienceType) return false;
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
    selectedYears,
    setSelectedYears,
    availableYears,
    projectType,
    setProjectType,
    seminarType,
    setSeminarType,
    experienceType,
    setExperienceType,
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
