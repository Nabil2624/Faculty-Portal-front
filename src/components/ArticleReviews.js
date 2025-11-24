import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import AddArticleForm from "./AddArticleForm";
import EditArticleForm from "./EditArticleForm";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/ProjectsAndCommittees/ReviewingArticles", {
          params: {
            pageIndex: currentPage - 1,
            pageSize: 9,
          },
          skipGlobalErrorHandler: true,
          withCredentials: true,
        });
        const { data } = response.data; // response.data has { pageIndex, pageSize, totalCount, data }
        setArticleReviews(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.titleOfArticle);
    // TODO: call API to delete
    setShowModal(false);
    setSelectedItem(null);
  };

  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(articleReviews.length / itemsPerPage);
  const paginatedData = articleReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("pageTitle")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {paginatedData.map((item, idx) => (
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
              {/* Icons */}
              <div
                className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} flex gap-3`}
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

              {/* Card Content */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">{item.titleOfArticle}</h3>
              <p className="text-lg text-gray-700">{item.reviewingDate}</p>
              <p className="text-sm text-gray-400">{item.authority}</p>
            </div>
          ))}
        </div>

        {/* Pagination buttons */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="flex justify-center items-center gap-3 mt-8"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            {t("prev")}
          </button>

          <span className="text-sm text-gray-600">
            {t("page")} {currentPage} {t("of")} {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            {t("next")}
          </button>
        </div>

        {/* Add/Edit/Details modals here as before */}
      </div>
    </Layout>
  );
}
