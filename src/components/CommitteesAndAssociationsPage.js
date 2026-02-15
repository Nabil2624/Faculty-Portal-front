import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";
import CommitteeCard from "./widgets/Committee And Association/CommitteeCard";
import Pagination from "./ui/Pagination";
import PageHeader from "./ui/PageHeader";

import useCommitteesAndAssociations from "../hooks/useCommitteesAndAssociations";

export default function CommitteesAndAssociationsPage() {
  const { t, i18n } = useTranslation("CommitteesAssociations");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const {
    committees,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    deleteItem,
  } = useCommitteesAndAssociations({ t });

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;

    await deleteItem(selectedItem.id);
    setShowModal(false);
    setSelectedItem(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() =>navigate("/add-committee-associations") }
          onFilter={() => console.log("Filter clicked")}
        />
        {/* Error */}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Empty */}
        {!error && committees.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {/* Cards */}
        {committees.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.map((item, idx) => (
                <CommitteeCard
                  key={item.id ?? idx}
                  item={item}
                  isArabic={isArabic}
                  onDelete={handleDeleteClick}
                  onDetails={(selected) => {
                    setSelectedItem(selected);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              isArabic={isArabic}
              t={t}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[360px] text-center">
            <h3 className="text-lg font-semibold mb-3">
              {t("areYouSureDelete")}
            </h3>

            <p className="text-gray-600 mb-5">
              {selectedItem.nameOfCommitteeOrAssociation ??
                selectedItem.committeeName}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="bg-white rounded-2xl w-[520px] max-w-[90%] p-8 relative border-2 border-[#b38e19]"
          >
            <button
              onClick={() => setShowDetails(false)}
              className={`absolute top-4 ${isArabic ? "left-4" : "right-4"}`}
            >
              <X size={22} />
            </button>
            <div className="text-center border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold mb-4">
                {selectedItem.nameOfCommitteeOrAssociation ??
                  selectedItem.committeeName}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>{t("type")}</span>
                <span>
                  {isArabic
                    ? selectedItem.typeOfCommitteeOrAssociation?.valueAr
                    : selectedItem.typeOfCommitteeOrAssociation?.valueEn}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t("participationLevel")}</span>
                <span>
                  {isArabic
                    ? selectedItem.degreeOfSubscription?.valueAr
                    : selectedItem.degreeOfSubscription?.valueEn}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t("startDate")}</span>
                <span>{selectedItem.startDate ?? "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>{t("endDate")}</span>
                <span>{selectedItem.endDate ?? "-"}</span>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                {selectedItem.notes ?? "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayoutProvider>
  );
}
