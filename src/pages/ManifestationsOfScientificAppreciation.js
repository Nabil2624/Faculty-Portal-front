import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { Medal } from "lucide-react";
import useManifestations from "../hooks/useManifestations";
import { deleteManifestation } from "../services/manifestationsOfScientificAppreciation";

import ManifestationCard from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationCard";
import ManifestationModal from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationModal";

import ManifestationDeleteModal from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationDeleteModal";
import ManifestationsTable from "../components/widgets/ManifestationsOfScientificAppreciation/ManifestationsTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function ManifestationsOfScientificAppreciation() {
  const { t, i18n } = useTranslation(
    "manifestations-of-scientific-appreciation",
  );

  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
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
  } = useManifestations(currentPage, 9, debouncedSearch, sortValue);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  /* Search Filtering */
  const filteredItems = useMemo(() => {
    const query = (search || "").toLowerCase().trim();
    if (!query) return items;

    return items.filter((item) => {
      const title = item?.titleOfAppreciation || "";
      const authority = item?.issuingAuthority || "";

      return (
        title.toLowerCase().includes(query) ||
        authority.toLowerCase().includes(query)
      );
    });
  }, [search, items]);

  const sortOptions = [
    { value: 4, label: "newestFirst" },
    { value: 3, label: "oldestFirst" },
    { value: 1, label: "nameAsc" },
    { value: 2, label: "nameDec" },
  ];
  const handleApplyFilters = ({ sortValue }) => {
    setSortValue(sortValue);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);

    setFiltersState({});
    setCurrentPage(1);
  };
  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteManifestation(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  /* ✏ Edit */
  const handleEditNavigate = (item) => {
    navigate("/edit-manifestations-of-scientific-appreciation", {
      state: { item },
    });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeaderNoAction
          title={t("title")}
          icon={Medal}
        />

        {/* Error */}
        {!loading && error && (
          <div
            className="text-center text-red-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("errors.loadFailed")}
          </div>
        )}

        <div className=" flex-1 overflow-hidden">
          <ManifestationsTable
            data={items}
            onEdit={handleEditNavigate}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-manifestations-of-scientific-appreciation")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Modals */}
        <ManifestationModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={handleDelete}
          deleteError={deleteError}
          isArabic={isArabic}
          currentFilters={{}}
          handleApplyFilters={handleApplyFilters}
          currentSort={sortValue}
          handleResetFilters={handleResetFilters}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          filtersConfig={{}}
          sortOptions={sortOptions}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
