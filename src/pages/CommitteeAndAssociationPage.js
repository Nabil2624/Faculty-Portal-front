import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CommitteeCard from "../components/widgets/CommitteeAndAssociation/CommitteeCard";
import Pagination from "../components/ui/Pagination";
import PageHeader from "../components/ui/PageHeader";

import CommitteesModals from "../components/widgets/CommitteeAndAssociation/CommitteesModals";
import useCommitteesAndAssociations from "../hooks/useCommitteesAndAssociations";

export default function CommitteesAndAssociationsPage() {
  const { t, i18n } = useTranslation("CommitteesAssociations");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    committees,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    deleteItem,
  } = useCommitteesAndAssociations({
    t,
    search: debouncedSearch,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, setCurrentPage]);
  /* ================= Handlers ================= */

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const handleDetailsClick = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;

    await deleteItem(selectedItem.id);
    setShowDelete(false);
    setSelectedItem(null);
  };

  /* ================= UI ================= */

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-committee-associations")}
          onFilter={() => console.log("Filter clicked")}
          showSearch // 👈 ضيف دي
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        <div className="items-center justify-center">
          {!loading && error && (
            <div className="text-red-500 text-lg text-center">
              {t("errors.loadFailed")}
            </div>
          )}

          {!loading && !error && committees.length === 0 && (
            <div className="text-gray-500 text-xl text-center">
              {t("empty")}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1">
          {!loading && !error && committees.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.map((item, idx) => (
                <CommitteeCard
                  key={item.id ?? idx}
                  item={item}
                  isArabic={isArabic}
                  onDelete={handleDeleteClick}
                  onDetails={handleDetailsClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination ثابت */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isArabic={isArabic}
          t={t}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>

      {/* Modals */}
      <CommitteesModals
        showDelete={showDelete}
        showDetails={showDetails}
        selectedItem={selectedItem}
        setShowDelete={setShowDelete}
        setShowDetails={setShowDetails}
        onDelete={confirmDelete}
        t={t}
        isArabic={isArabic}
      />
    </ResponsiveLayoutProvider>
  );
}
