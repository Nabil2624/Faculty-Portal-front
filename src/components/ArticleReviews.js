import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddArticleForm from "./AddArticleForm";
import EditArticleForm from "./EditArticleForm";

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

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.title);
    // API delete here
    setShowModal(false);
    setSelectedItem(null);
  };

  // Dummy Data
  const articleReviews = [
    {
      title: "تحكيم مقال حول إدارة المؤسسات",
      reviewDate: "5 مايو 2024",
      organization: "مجلة العلوم الإدارية",
      description:
        "تم تحكيم المقال وفق معايير الجودة البحثية الأكاديمية واعتماد مستوى الجدة في الطرح العلمي.",
    },
    {
      title: "تحكيم بحث التسويق السياحي",
      reviewDate: "10 فبراير 2023",
      organization: "مجلة السياحة الدولية",
      description: "تقييم شامل لمحتوى الدراسة وتحليل البيانات الميدانية.",
    },
  ];

  // Pagination Logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(articleReviews.length / itemsPerPage);
  const paginatedData = articleReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              key={idx}
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

              {/* Card Content */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">
                {item.title}
              </h3>
              <p className="text-lg text-gray-700">{item.reviewDate}</p>
              <p className="text-sm text-gray-400">{item.organization}</p>
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            {t("next")}
          </button>
        </div>

        {/* Bottom Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("add")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer text-sm"
          >
            {t("back")}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
              {t("confirmDelete")}
            </h3>
            <p className="text-sm text-gray-600 mb-5">{selectedItem?.title}</p>
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

            <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold ">{selectedItem.title}</h2>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("organization")}</span>
              <span>{selectedItem.organization}</span>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">{t("reviewDate")}</span>
                <span>{selectedItem.reviewDate}</span>
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

      {/* Add Form */}
      {showAddForm && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="rounded-lg shadow-none p-0 w-[480px] relative">
        <AddArticleForm onCancel={() => setShowAddForm(false)} />
      </div>
    </div>
  )}

      {/* Edit Form */}
      {showEditForm && selectedItem && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="rounded-lg shadow-none p-0 w-[480px] relative">
        <EditArticleForm
          data={selectedItem}
          onCancel={() => setShowEditForm(false)}
        />
      </div>
    </div>
  )}
    </Layout>
  );
}
