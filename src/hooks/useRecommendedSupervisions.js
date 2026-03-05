import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchRecommendedSupervisions,
  approveRecommendedSupervision,
  rejectRecommendedSupervision,
} from "../services/recomendedSupervision.service";

export default function useRecommendedSupervisions() {
  const { t, i18n } = useTranslation("RecommendedSupervisions");
  const isArabic = i18n.language === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 4;

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchRecommendedSupervisions(
        currentPage,
        pageSize,
      );

      const result = response.data;

      const mapped =
        result?.data?.map((item) => ({
          id: item.id,
          title: item.title,
          studentName: item.studentName,

          //  translate Master / PHD
          degreeType: t(item.type) || item.type,

          registrationDate: item.registrationDate,
          supervisionFormationDate: item.supervisionFormationDate,
          discussionDate: item.discussionDate,
          grantingDate: item.grantingDate,

          facultyMemberRole:
            t(item.facultyMemberRole) || item.facultyMemberRole,
          specialization: item.specialization,
          universityOrFaculty: item.universityOrFaculty,

          grade: item.grade,

          discussionDate: item.discussionDate,
          grantingDate: item.grantingDate,
        })) || [];
      setItems(mapped);

      const calculatedTotalPages = Math.max(
        1,
        Math.ceil((result?.totalCount || 0) / pageSize),
      );

      setTotalPages(calculatedTotalPages);

      if (mapped.length === 0) {
        setError(t("empty"));
      }
    } catch (err) {
      setItems([]);
      setError(err?.response?.data?.errorMessage || t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, i18n.language]);

  const handleApprove = async (item) => {
    await approveRecommendedSupervision(item.id);
    loadData();
  };

  const handleReject = async (item) => {
    await rejectRecommendedSupervision(item.id);
    loadData();
  };

  return {
    t,
    isArabic,
    items,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    handleApprove,
    handleReject,
  };
}
