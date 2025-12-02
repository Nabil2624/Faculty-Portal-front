import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Projects() {
  const { t, i18n } = useTranslation("Projects");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const pageSize = 9;

  // Fetch projects from API
  const fetchProjects = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/ProjectsAndCommittees/Projects", {
        params: { pageIndex: page, pageSize },
        skipGlobalErrorHandler: true,
      });
      const { data, totalCount } = response.data || {};
      setProjects(data || []);
      setTotalPages(Math.max(1, Math.ceil((totalCount || 0) / pageSize)));
      if (page > totalPages && totalPages > 0) setCurrentPage(totalPages);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(t("fetchError") || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, t]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/ProjectsAndCommittees/DeleteProject/${selectedItem.id}`, {
        skipGlobalErrorHandler: true,
      });
      setProjects((prev) => prev.filter((p) => p.id !== selectedItem.id));
      setShowDeleteModal(false);
      setSelectedItem(null);
      if (projects.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
      else fetchProjects(currentPage);
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError(t("deleteError") || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} flex flex-col min-h-[calc(85vh-4rem)] p-4 md:p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2 pb-3">
          <h2 className="text-2xl font-bold">
            {t("pageTitle")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19]">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Projects Container */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4">
          {projects.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isArabic ? "text-right" : "text-left"}`}>
              {projects.map((item) => (
                <article
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setShowDetails(true); }}
                  className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer ${isArabic ? "border-r-[19px]" : "border-l-[19px]"}`}
                  role="button"
                  tabIndex={0}
                >
                  {/* Actions */}
                  <div className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} flex gap-3`} onClick={(e) => e.stopPropagation()}>
                    <Pencil
                      className="text-[#b38e19] w-5 h-5 cursor-pointer"
                      onClick={() => setShowDetails(true)}
                    />
                    <Trash2
                      className="text-[#E53935] w-5 h-5 cursor-pointer"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1 break-words">{item.nameOfProject}</h3>
                  <p className="text-sm text-gray-700">{item.startDate} - {item.endDate}</p>
                  <p className="text-sm text-gray-400">{isArabic ? item.typeOfProject.valueAr : item.typeOfProject.valueEn}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-lg">{t("empty")}</div>
          )}
        </div>

        {/* Pagination */}
        {projects.length > 0 && (
          <div dir={isArabic ? "rtl" : "ltr"} className="flex justify-center items-center gap-3 mt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-4 py-2 rounded-md border border-gray-400 ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
              {t("previous")}
            </button>
            <span className="text-sm text-gray-600">{t("page")} {currentPage} {t("of")} {totalPages}</span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-4 py-2 rounded-md border border-gray-400 ${currentPage === totalPages || totalPages === 0 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
              {t("next")}
            </button>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 mt-4 justify-${isArabic ? "end" : "start"}`}>
          <button onClick={() => navigate("/add-project")} className="bg-[#b38e19] text-white sm:w-24 h-10 rounded-md text-sm">{t("add")}</button>
          <button onClick={() => navigate(-1)} className="bg-gray-300 text-black sm:w-24 h-10 rounded-md text-sm">{t("back")}</button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && selectedItem && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center mx-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">{t("confirmDelete")}</h3>
              <p className="text-sm text-gray-600 mb-5">{selectedItem.nameOfProject}</p>
              <div className="flex justify-center gap-4">
                <button onClick={confirmDelete} className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600 transition">{t("delete")}</button>
                <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400 transition">{t("cancel")}</button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div dir={isArabic ? "rtl" : "ltr"} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border-2 border-[#b38e19]">
              <button onClick={() => setShowDetails(false)} className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-500`}>
                <X size={22} />
              </button>
              <div className="space-y-3 text-gray-700">
                <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
                  <h2 className="text-2xl font-bold">{selectedItem.nameOfProject}</h2>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("localInternational")}</span>
                  <span>{selectedItem.localOrInternational}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("fundingAuthority")}</span>
                  <span>{selectedItem.financingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("participationRole")}</span>
                  <span>{isArabic ? selectedItem.participationRole.valueAr : selectedItem.participationRole.valueEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("projectType")}</span>
                  <span>{isArabic ? selectedItem.typeOfProject.valueAr : selectedItem.typeOfProject.valueEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("startDate")}</span>
                  <span>{selectedItem.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("endDate")}</span>
                  <span>{selectedItem.endDate}</span>
                </div>
                <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">{selectedItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
