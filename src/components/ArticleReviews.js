import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import AddArticleForm from "./AddArticleForm";
import EditArticleForm from "./EditArticleForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function ArticleReviews() {
  const { t, i18n } = useTranslation("article-reviews");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [articleReviews, setArticleReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestedPageSize = 9; // always use this for pagination

  // Fetch articles from API
  const fetchArticles = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/ProjectsAndCommittees/ReviewingArticles",
        {
          params: { pageIndex: page, pageSize: requestedPageSize },
          skipGlobalErrorHandler: true,
        }
      );

      const { data, totalCount } = response.data;
      const pages = Math.ceil(totalCount / requestedPageSize);
      setTotalPages(pages);

      // If current page > totalPages, go back to last page
      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setArticleReviews(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, t]);

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
        `/ProjectsAndCommittees/DeleteReviewingArticle/${selectedItem.id}`,
        { skipGlobalErrorHandler: true }
      );

      // Remove item locally
      setArticleReviews((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );

      setShowModal(false);
      setSelectedItem(null);

      // If current page is now empty, go to previous page if possible
      if (articleReviews.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchArticles(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      setError(t("deleteError") || "Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("pageTitle")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer lg:w-10 lg:h-10">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#b38e19] text-white px-2 py-1 rounded-md lg:px-4 lg:py-2"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Empty State */}
        {!loading && articleReviews.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {/* Article Cards */}
        {articleReviews.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {articleReviews.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDetails(true);
                  }}
                  className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition-transform ${
                    isArabic ? "border-r-[19px]" : "border-l-[19px]"
                  }`}
                >
                  <div
                    className={`absolute top-4 ${
                      isArabic ? "left-4" : "right-4"
                    } flex gap-3`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Pencil
                      className="text-[#b38e19] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowEditForm(true);
                      }}
                    />
                    <Trash2
                      className="text-[#E53935] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">
                    {item.titleOfArticle}
                  </h3>
                  <p className="text-lg text-gray-700">{item.reviewingDate}</p>
                  <p className="text-sm text-gray-400">{item.authority}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="flex justify-center items-center gap-3 mt-8"
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
                {t("prev")}
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


        {/* Add Article Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="rounded-lg shadow-none p-0 w-[480px] relative">
              <AddArticleForm
                onCancel={() => setShowAddForm(false)}
                onSuccess={() => {
                  setShowAddForm(false);
                  setCurrentPage(1); // refresh first page after adding
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Article Modal */}
        {showEditForm && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="rounded-lg shadow-none p-0 w-[480px] relative">
              <EditArticleForm
                data={selectedItem}
                onCancel={() => setShowEditForm(false)}
                onSuccess={() => {
                  setShowEditForm(false);
                  fetchArticles(currentPage); // refresh current page after edit
                }}
              />
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                {t("confirmDelete")}
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                {selectedItem.titleOfArticle}
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-8 relative border-2 border-[#b38e19]"
            >
              <button
                onClick={() => setShowDetails(false)}
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
                } text-gray-500 transition`}
              >
                <X size={22} />
              </button>
              <div className="space-y-3 text-gray-700">
                <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedItem.titleOfArticle}
                  </h2>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("organization")}</span>
                  <span>{selectedItem.authority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("reviewDate")}</span>
                  <span>{selectedItem.reviewingDate}</span>
                </div>
                <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
