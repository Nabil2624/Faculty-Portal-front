import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import AddJournalForm from "./AddJournalForm";
import EditJournalForm from "./EditJournalForm";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ParticipationInJournals() {
  const { t, i18n } = useTranslation("ParticipationJournals");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [journalParticipations, setJournalParticipations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestedPageSize = 9;

  // Fetch journals from API
  const fetchJournals = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/ProjectsAndCommittees/ParticipationInMagazines",
        {
          params: { pageIndex: page, pageSize: requestedPageSize },
          skipGlobalErrorHandler: true,
        }
      );

      // expect response.data = { data: [...], totalCount: N }
      const { data, totalCount } = response.data || {};
      const pages = Math.max(
        1,
        Math.ceil((totalCount || 0) / requestedPageSize)
      );
      setTotalPages(pages);

      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setJournalParticipations(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch journals:", err);
      setError(t("fetchError") || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, t]);

  // Delete handling
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;

    try {
      setLoading(true);
      setError(null);

      await axiosInstance.delete(
        `/ProjectsAndCommittees/DeleteParticipationInMagazine/${selectedItem.id}`,
        { skipGlobalErrorHandler: true }
      );

      setJournalParticipations((prev) =>
        prev.filter((it) => it.id !== selectedItem.id)
      );

      setShowModal(false);
      setSelectedItem(null);

      // if the last item on the page was deleted and we are beyond page 1, go back a page
      if (journalParticipations.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // refresh current page
        fetchJournals(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete journal:", err);
      setError(t("deleteError") || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-4 md:p-6`}>
        {/* Header (sticky so it stays when scrolling cards) */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2 pb-3">
          <div>
            <h2 className="text-2xl font-bold">
              {t("title")}
              <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19]">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Empty State */}
        {!loading && journalParticipations.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500 text-lg">
            {t("empty")}
          </div>
        )}

        {/* Cards container: set max height and allow vertical scroll */}
        {journalParticipations.length > 0 && (
          <>
            <div className="max-h-[68vh] overflow-y-auto pr-2 mb-4 relative">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {journalParticipations.map((item, idx) => (
                  <article
                    key={item.id || idx}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetails(true);
                    }}
                    className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer  ${
                      isArabic ? "border-r-[19px]" : "border-l-[19px]"
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSelectedItem(item);
                        setShowDetails(true);
                      }
                    }}
                  >
                    {/* actions */}
                    <div
                      className={`absolute top-3 ${
                        isArabic ? "left-3" : "right-3"
                      } flex gap-3`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditForm(true);
                        }}
                        aria-label={t("edit")}
                      >
                        <Pencil className="text-[#b38e19] w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(item)}>
                        <Trash2 className="text-[#E53935] w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1 break-words">
                      {item.nameOfMagazine}
                    </h3>

                    <a
                      href={item.websiteOfMagazine || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#b38e19] font-semibold underline break-words"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.websiteOfMagazine}
                    </a>

                    <p className="text-sm text-gray-400 mt-2">
                      {isArabic
                        ? item.typeOfParticipation?.valueAr
                        : item.typeOfParticipation?.valueEn}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Pagination (kept outside scroll area) */}
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="flex justify-center items-center gap-3 mt-2"
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`px-4 py-2 rounded-md border border-gray-400 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                {t("previous")}
              </button>
              <span className="text-sm text-gray-600">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={`px-4 py-2 rounded-md border border-gray-400 ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                {t("next")}
              </button>
            </div>
          </>
        )}
        {/* Bottom small buttons for mobile (fixed at bottom on small screens) */}
        <div
          className={`sticky bottom-0 flex flex-col sm:flex-row gap-3 mt-16 justify-${
            isArabic ? "end" : "start"
          } w-full  mx-auto bg-white pt-4`}
        >
          <button
            onClick={() => setShowAddForm(true)}
            className={`bg-[#b38e19] text-white sm:w-24 h-10 rounded-md text-sm`}
          >
            {t("add")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black sm:w-24 h-10 rounded-md text-sm"
          >
            {t("back")}
          </button>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="rounded-lg p-0 w-full max-w-lg mx-4">
              <AddJournalForm
                onCancel={() => setShowAddForm(false)}
                onSuccess={() => {
                  setShowAddForm(false);
                  setCurrentPage(1);
                  fetchJournals(1);
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditForm && selectedItem && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="rounded-lg p-0 w-full max-w-lg mx-4">
              <EditJournalForm
                data={selectedItem}
                onCancel={() => setShowEditForm(false)}
                onSuccess={() => {
                  setShowEditForm(false);
                  fetchJournals(currentPage);
                }}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center mx-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                {t("confirmDelete")}
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                {selectedItem.nameOfMagazine}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
                >
                  {t("delete")}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border-2 border-[#b38e19]"
            >
              <button
                onClick={() => setShowDetails(false)}
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
                } text-gray-500`}
                aria-label={t("close")}
              >
                <X size={22} />
              </button>

              <div className="space-y-3 text-gray-700">
                <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedItem.nameOfMagazine}
                  </h2>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("journalWebsite")}</span>
                  <a
                    href={selectedItem.websiteOfMagazine}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b38e19] font-semibold underline"
                  >
                    {selectedItem.websiteOfMagazine}
                  </a>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("type")}</span>
                  <span>
                    {isArabic
                      ? selectedItem.typeOfParticipation?.valueAr
                      : selectedItem.typeOfParticipation?.valueEn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
