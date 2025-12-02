import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CommitteesAndAssociationsPage() {
  const { t, i18n } = useTranslation("CommitteesAssociations");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [committees, setCommittees] = useState([]); // holds current page items
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestedPageSize = 9; // always use this for pagination

  // Fetch committees from API
  const fetchCommittees = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // API expects pageIndex (zero-based in your sample). We convert currentPage (1-based) -> pageIndex = page - 1
      const response = await axiosInstance.get(
        "/ProjectsAndCommittees/CommitteesAndAssociations",
        {
          params: { pageIndex: page, pageSize: requestedPageSize },
          skipGlobalErrorHandler: true,
        }
      );

      // Response sample you gave:
      // { pageIndex, pageSize, totalCount, data: [...] }
      const resp = response.data || {};
      const data = resp.data ?? [];
      const totalCount = resp.totalCount ?? 0;

      const pages = Math.max(1, Math.ceil(totalCount / requestedPageSize));
      setTotalPages(pages);

      // If requested page > pages, switch to last page
      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setCommittees(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch committees:", err);
      setError(t("fetchError") ?? "Failed to load data");
      setCommittees([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        `/ProjectsAndCommittees/DeleteCommitteeOrAssociation/${selectedItem.id}`,
        { skipGlobalErrorHandler: true }
      );

      // Remove item locally
      setCommittees((prev) => prev.filter((it) => it.id !== selectedItem.id));

      // close modal
      setShowModal(false);
      setSelectedItem(null);

      // If after deletion the current page is empty and there are previous pages, go back one page
      if (committees.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        // otherwise refresh current page to get up-to-date data/count
        fetchCommittees(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete committee/association:", err);
      setError(t("deleteError") ?? "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("title")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Empty State */}
        {!loading && committees.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty") ?? "لا توجد بيانات"}
          </div>
        )}

        {/* Cards */}
        {committees.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {committees.map((item, idx) => (
                <div
                  key={item.id ?? idx}
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
                      onClick={() =>
                        navigate("/edit-committee-associations", {
                          state: { item: item },
                        })
                      }
                    />
                    <Trash2
                      className="text-[#E53935] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>

                  {/* Card Content: map fields from API */}
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">
                    {item.nameOfCommitteeOrAssociation ?? item.committeeName}
                  </h3>
                  {/*Start and End date*/ }
                  <p className="text-sm text-gray-800 mt-1">
                    {item.startDate ? item.startDate : "-"}{" "}
                    {item.endDate ? ` - ${item.endDate}` : ""}
                  </p>
                  {/* typeOfCommitteeOrAssociation may be object with valueAr/valueEn */}
                  <p className="text-sm text-gray-400">
                    {isArabic
                      ? item.typeOfCommitteeOrAssociation?.valueAr
                      : item.typeOfCommitteeOrAssociation?.valueEn}
                  </p>

                  {/* degreeOfSubscription */}
                  <p className="text-sm text-gray-400 mt-1">
                    {isArabic
                      ? item.degreeOfSubscription?.valueAr
                      : item.degreeOfSubscription?.valueEn}
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

        {/* Footer Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => navigate("/add-committee-associations")}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("add")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("back")}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
              {t("areYouSureDelete")}
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              {selectedItem?.nameOfCommitteeOrAssociation ??
                selectedItem?.committeeName}
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
                  {selectedItem?.nameOfCommitteeOrAssociation ??
                    selectedItem?.committeeName}
                </h2>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("type")}</span>
                <span>
                  {isArabic
                    ? selectedItem?.typeOfCommitteeOrAssociation?.valueAr
                    : selectedItem?.typeOfCommitteeOrAssociation?.valueEn}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("participationLevel")}</span>
                <span>
                  {isArabic
                    ? selectedItem?.degreeOfSubscription?.valueAr
                    : selectedItem?.degreeOfSubscription?.valueEn}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("startDate")}</span>
                <span>{selectedItem?.startDate ?? "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("endDate")}</span>
                <span>{selectedItem?.endDate ?? "-"}</span>
              </div>

              <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed">
                  {selectedItem?.notes ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
