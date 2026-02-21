import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useScientificWriting from "../hooks/useScientificWriting";
import { deleteScientificWriting } from "../services/scientific-writing.service";

import ScientificWritingCard from "../components/widgets/ScientificWriting/ScientificWritingCard";
import ScientificWritingModal from "../components/widgets/ScientificWriting/ScientificWritingModal";

export default function ScientificWriting() {
  const { t, i18n } = useTranslation("scientific-writing");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const {
    items = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useScientificWriting(currentPage, 9, debouncedSearch);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteScientificWriting(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  const handleEditNavigate = (item) => {
    navigate("/edit-scientific-writing", { state: { item } });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-scientific-writing")}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-500">
            {t("errors.loadFailed")}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center text-gray-500">{t("empty")}</div>
        )}

        {/* Grid */}
        {!loading && !error && items.length > 0 && (
          <div
            className="overflow-y-auto pr-2 mb-4 flex-1"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                isArabic ? "text-right" : "text-left"
              }`}
              style={{ gap: "clamp(0.5rem, 0.8vw, 2rem)" }}
            >
              {items.map((item) => (
                <ScientificWritingCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() => handleEditNavigate(item)}
                  onDelete={(p) => {
                    setSelectedItem(p);
                    setShowDelete(true);
                    setDeleteError(false);
                  }}
                  onDetails={(p) => {
                    setSelectedItem(p);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            t={t}
            isArabic={isArabic}
          />
        </div>

        {/* Modals */}
        <ScientificWritingModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={handleDelete}
          deleteError={deleteError}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
