import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import usePatents from "../hooks/usePatents";
import { deletePatent } from "../services/patents.service";

import PatentCard from "../components/widgets/Patents/PatentCard";
import PatentModal from "../components/widgets/Patents/PatentModal";

export default function Patents() {
  const { t, i18n } = useTranslation("patents");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
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
    items: patents = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = usePatents(currentPage, 9, debouncedSearch);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const filteredPatents = useMemo(() => {
    const query = (search || "").toLowerCase().trim();
    if (!query) return patents;

    return patents.filter((p) => {
      const name = p?.nameOfPatent || "";
      const authority = p?.accreditingAuthorityOrCountry || "";
      const type = p?.localOrInternational || "";

      return (
        name.toLowerCase().includes(query) ||
        authority.toLowerCase().includes(query) ||
        type.toLowerCase().includes(query)
      );
    });
  }, [search, patents]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deletePatent(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(t("errors.deleteFailed"));
    }
  };

  const handleEditNavigate = (item) => {
    navigate("/edit-patent", { state: { item } });
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
          onAdd={() => navigate("/add-patent")}
          showSearch
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
        {!loading && !error && filteredPatents.length === 0 && (
          <div className="text-center text-gray-500">{t("empty")}</div>
        )}

        {/* Grid */}
        {!loading && !error && filteredPatents.length > 0 && (
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
              {filteredPatents.map((item) => (
                <PatentCard
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
        <PatentModal
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
