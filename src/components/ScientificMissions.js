import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ScientificMissions() {
  const { t, i18n } = useTranslation("ScientificMissions");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const requestedPageSize = 9;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======================================
  // Fetch Missions
  // ======================================
  const fetchMissions = async (page = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/Missions/ScientificMissions", {
        params: { pageIndex: page, pageSize: requestedPageSize },
        skipGlobalErrorHandler: true,
      });

      const { data, totalCount } = response.data;
      const pages = Math.ceil(totalCount / requestedPageSize);
      setTotalPages(pages);

      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setMissions(
          (data || []).map((item) => ({
            id: item.id,
            missionName: item.missionName || "",
            startDate: item.startDate || "",
            endDate: item.endDate || "",
            universityOrFaculty: item.universityOrFaculty || "",
            countryOrCity: item.countryOrCity || "",
            notes: item.notes || "", // <-- keep consistent with backend
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch missions:", err);
      setError(t("fetchError") || "Failed to fetch missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions(currentPage);
  }, [currentPage, t]);

  // ======================================
  // Delete Mission
  // ======================================
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
        `/Missions/DeleteScientificMission/${selectedItem.id}`,
        { skipGlobalErrorHandler: true }
      );

      setMissions((prev) => prev.filter((m) => m.id !== selectedItem.id));
      setShowModal(false);
      setSelectedItem(null);

      if (missions.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchMissions(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete mission:", err);
      setError(t("deleteError") || "Failed to delete mission");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-4 sm:p-6`}>
        {/* Header */}
        <div className="flex sm:flex-row justify-between items-start mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-start">
            {t("scientificMissions")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          <div className="flex items-end gap-3">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19]">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>

            <button
              onClick={() => navigate("/add-scientific-task")}
              className="bg-[#b38e19] text-white px-4 py-2 rounded-md font-semibold"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Empty state */}
        {!loading && missions.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {/* Missions Grid */}
        {missions.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {missions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setShowDetails(true);
                }}
                className={`relative bg-gray-100 rounded-lg shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition ${
                  isArabic ? "border-r-[19px]" : "border-l-[19px]"
                }`}
              >
                {/* Edit + Delete Icons */}
                <div
                  className={`absolute top-4 ${
                    isArabic ? "left-4" : "right-4"
                  } flex gap-3`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil
                    className="text-[#b38e19] cursor-pointer w-5 h-5 hover:scale-110"
                    onClick={() => {
                      navigate("/edit-scientific-task", {
                        state: { taskData: item },
                      });
                    }}
                  />
                  <Trash2
                    className="text-[#E53935] cursor-pointer w-5 h-5 hover:scale-110"
                    onClick={() => handleDeleteClick(item)}
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1 truncate">
                  {item.missionName}
                </h3>
                <p className="text-base text-gray-700 truncate">
                  {item.startDate} - {item.endDate}
                </p>
                <p className="text-sm text-gray-700 truncate">
                  {item.universityOrFaculty}
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {item.countryOrCity}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="flex justify-center items-center gap-3 mt-8"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
            }`}
          >
            {isArabic ? "السابق" : "Previous"}
          </button>

          <span className="text-sm text-gray-600">
            {isArabic
              ? `الصفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : ""
            }`}
          >
            {isArabic ? "التالي" : "Next"}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold mb-3">
              {t("areYouSureDelete")}
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              {selectedItem?.missionName}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-[#E53935] text-white px-5 py-2 rounded-md"
              >
                {t("delete")}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-5 py-2 rounded-md"
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
              } text-gray-500`}
            >
              <X size={22} />
            </button>

            <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold">{selectedItem.missionName}</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">{t("location")}</span>
                <span>{selectedItem.countryOrCity}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("institution")}</span>
                <span>{selectedItem.universityOrFaculty}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("startDate")}</span>
                <span>{selectedItem.startDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("endDate")}</span>
                <span>{selectedItem.endDate}</span>
              </div>

              <div className="mt-5 bg-gray-100 p-4 rounded-lg border">
                <p className="leading-relaxed">{selectedItem.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayoutProvider>
  );
}
