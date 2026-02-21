import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, X, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function AcademicQualificationsPage() {
  const { t, i18n } = useTranslation("AcademicQualifications");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [qualifications, setQualifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 9;

  const fetchQualifications = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/ScientificProgression/AcademicQualifications",
        {
          params: { pageIndex: page, pageSize },
          skipGlobalErrorHandler: true,
        },
      );

      const { data, totalCount } = response.data;
      const pages = Math.ceil(totalCount / pageSize);
      setTotalPages(pages);

      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setQualifications(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch qualifications:", err);
      setError(t("fetchError") || "Failed to fetch qualifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications(currentPage);
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
        `/ScientificProgression/DeleteAcademicQualification/${selectedItem.id}`,
        { skipGlobalErrorHandler: true },
      );

      setQualifications((prev) => prev.filter((q) => q.id !== selectedItem.id));
      setShowModal(false);
      setSelectedItem(null);

      if (qualifications.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchQualifications(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      setError(t("deleteError") || "Failed to delete");
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
            {t("academicQualifications")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>

            <button
              onClick={() => navigate("/add-academic-qualification")}
              className="bg-[#b38e19] text-white px-4 py-2 rounded-md"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-center mb-6 text-lg">{error}</div>
        )}

        {/* Empty State */}
        {!loading && qualifications.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {qualifications.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {qualifications.map((item) => (
                <div
                  key={item.id}
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
                      className="text-[#b38e19] cursor-pointer w-5 h-5 hover:scale-110 transition"
                      onClick={() =>
                        navigate("/edit-academic-qualification", {
                          state: { item },
                        })
                      }
                    />
                    <Trash2
                      className="text-[#E53935] cursor-pointer w-5 h-5 hover:scale-110 transition"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>

                  <h3 className="text-xl font-semibold mb-1">
                    {isArabic
                      ? item.qualification.valueAr
                      : item.qualification.valueEn}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {item.universityOrFaculty}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isArabic ? item.grade.valueAr : item.grade.valueEn}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isArabic
                      ? item.dispatchType.valueAr
                      : item.dispatchType.valueEn}
                  </p>
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
                onClick={() => setCurrentPage((p) => p + 1)}
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

        {/* Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
              <h3 className="text-lg font-semibold mb-3">
                {t("areYouSureDelete")}
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                {isArabic
                  ? selectedItem?.qualification.valueAr
                  : selectedItem?.qualification.valueEn}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600"
                >
                  {t("delete")}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400"
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
                } text-gray-500 hover:text-[#19355a]`}
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                {isArabic
                  ? selectedItem.qualification.valueAr
                  : selectedItem.qualification.valueEn}
              </h2>

              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{t("degree")}</span>
                  <span>
                    {isArabic
                      ? selectedItem.qualification.valueAr
                      : selectedItem.qualification.valueEn}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("major")}</span>
                  <span>{selectedItem.specialization}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("grade")}</span>
                  <span>
                    {isArabic
                      ? selectedItem.grade.valueAr
                      : selectedItem.grade.valueEn}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("scholarship")}</span>
                  <span>
                    {isArabic
                      ? selectedItem.dispatchType.valueAr
                      : selectedItem.dispatchType.valueEn}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("faculty")}</span>
                  <span>{selectedItem.universityOrFaculty}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("location")}</span>
                  <span>{selectedItem.countryOrCity}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">{t("date")}</span>
                  <span>{selectedItem.dateOfObtainingTheQualification}</span>
                </div>
                {selectedItem.attachments &&
                  selectedItem.attachments.length > 0 && (
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-medium">{t("attachments")}</span>

                      <a
                        href={selectedItem.attachments[0].fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#19355a] underline hover:text-[#b38e19]"
                      >
                        {selectedItem.attachments[0].fileName}
                      </a>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
