import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function SeminarsAndConferences() {
  const { t, i18n } = useTranslation("SeminarsAndConferences");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const requestedPageSize = 9;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======================================
  // Fetch Seminars & Conferences
  // ======================================
  const fetchEvents = async (page = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/Missions/ConferncesAndSeminars",
        {
          params: { pageIndex: page, pageSize: requestedPageSize },
          skipGlobalErrorHandler: true,
        }
      );

      const { data, totalCount } = response.data;
      const pages = Math.max(1, Math.ceil(totalCount / requestedPageSize));
      setTotalPages(pages);

      if (page > pages && pages > 0) {
        setCurrentPage(pages);
      } else {
        setEvents(
          (data || []).map((item) => ({
            id: item.id,
            type: item.type || "",
            localOrInternational:
              item.localOrInternational || "",
            conferenceName: item.name || item.conferenceName || "",
            participationRole: item.roleOfParticipationId || "",
            organizingAuthority: item.organizingAuthority || "",
            website: item.website || "",
            venue: item.venue || "",
            notes: item.notes || "",
            attachments: item.attachments || null,

            // Keep the ones you used in the UI
            missionName: item.name || item.missionName || "",
            startDate: item.startDate || "",
            endDate: item.endDate || "",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(t("fetchError") || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, t]);

  // ======================================
  // Delete Event
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

      // Call the new delete endpoint
      await axiosInstance.delete(
        `/Missions/DeleteConferncesOrSeminars/${selectedItem.id}`,
        { skipGlobalErrorHandler: true }
      );

      // Update UI after deletion
      setEvents((prev) => prev.filter((m) => m.id !== selectedItem.id));
      setShowModal(false);
      setSelectedItem(null);

      // Handle page adjustment if last item on page was deleted
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchEvents(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(t("deleteError") || "Failed to delete event");
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
            {t("seminarsAndConferences") || "Seminars & Conferences"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          <div className="flex items-end gap-3">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19]">
              <Filter className="w-5 h-5 text-gray-700" />
            </div>

            <button
              onClick={() => navigate("/add-conference")}
              className="bg-[#b38e19] text-white px-4 py-2 rounded-md font-semibold"
            >
              {t("add")}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Empty state */}
        {!loading && events.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty") || "No events found"}
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {events.map((item) => (
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
                {/* Edit + Delete Icons */}
                <div
                  className={`absolute top-4 ${
                    isArabic ? "left-4" : "right-4"
                  } flex gap-3`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil
                    className="text-[#b38e19] cursor-pointer w-5 h-5 hover:scale-110 transition"
                    onClick={() =>
                      navigate("/edit-conference", {
                        state: { existingData: item },
                      })
                    }
                  />
                  <Trash2
                    className="text-[#E53935] cursor-pointer w-5 h-5 hover:scale-110 transition"
                    onClick={() => handleDeleteClick(item)}
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  {item.missionName}
                </h3>
                <p className="text-lg text-gray-700">
                  {item.startDate} - {item.endDate}
                </p>
                <p className="text-sm text-gray-700">
                  {item.organizingAuthority}
                </p>
                <p className="text-xs text-gray-400">{item.venue}</p>
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
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
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
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
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
                className="bg-gray-300 text-black px-5 py-2 rounded-md"
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-8 relative animate-fadeIn"
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
              <h2 className="text-2xl font-bold">{selectedItem.missionName}</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">{t("location")}</span>
                <span>{selectedItem.venue}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{t("organizingAuthority")}</span>
                <span>{selectedItem.organizingAuthority}</span>
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
                <p className="text-gray-800 leading-relaxed">
                  {selectedItem.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayoutProvider>
  );
}
