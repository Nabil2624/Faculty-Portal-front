import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useUniversityContribution from "../hooks/useUniversityContribution";
import useUniversityContributionForm from "../hooks/useUniversityContributionForm";
import useAddUniversityContributionForm from "../hooks/useAddUniversityContributionForm";
import useContributionTypeLookups from "../hooks/useContributionTypeLookups";

import UniversityContributionCard from "../components/widgets/University Contribution/UniversityContributionCard";
import UniversityContributionModal from "../components/widgets/University Contribution/UniversityContributionModal";

import { deleteUniversityContribution } from "../services/universityContribution.service";

export default function UniversityContributions() {
  const { t, i18n } = useTranslation("university-contribution");
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [typeOfContributionIds, setTypeOfContributionIds] = useState([]);

  const [deleteError, setDeleteError] = useState(false);

  const [filtersState, setFiltersState] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  /* ================= DATA ================= */
  const {
    items: contributions = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useUniversityContribution(
    currentPage,
    9,
    debouncedSearch,
    sortValue,
    typeOfContributionIds,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  /* ================= LOOKUPS ================= */
  const { types, loadingTypes } = useContributionTypeLookups();

  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "contributionTypeIds",
          title: "dependOnContributionType",
          options: mappedTypes,
        },
      ]
    : [];
  const sortOptions = [
    { value: 4, label: "newestFirst" },
    { value: 3, label: "oldestFirst" },
    { value: 1, label: "nameAsc" },
    { value: 2, label: "nameDec" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    const ids = filters?.contributionTypeIds || [];
    setTypeOfContributionIds(ids);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setTypeOfContributionIds([]);
    setFiltersState({});
    setCurrentPage(1);
  };

  /* ================= FORM HOOKS ================= */
  const addForm = useAddUniversityContributionForm({
    onSuccess: () => {
      setShowForm(false);
      loadData();
    },
  });

  const editForm = useUniversityContributionForm({
    selectedItem,
    onSuccess: () => {
      setShowForm(false);
      loadData();
    },
  });

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteUniversityContribution(id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setMode("edit");
    setSelectedItem(item);
    setShowForm(true);
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setMode("add");
    setSelectedItem(null);
    setShowForm(true);
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
          onAdd={handleAdd}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />
        {/* Error / Empty */}
        {!loading && error && (
          <div
            className="text-center text-red-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("errors.loadFailed")}
          </div>
        )}

        {!loading && !error && contributions.length === 0 && (
          <div
            className="text-center text-gray-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("empty")}
          </div>
        )}
        {/* Grid */}
        {!loading && !error && contributions.length > 0 && (
          <div className="overflow-y-auto pr-2 mb-4 flex-1">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                isArabic ? "text-right" : "text-left"
              }`}
              style={{ gap: "clamp(0.5rem, 0.8vw, 2rem)" }}
            >
              {contributions.map((item) => (
                <UniversityContributionCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() => handleEdit(item)}
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

        {/* ================= MODALS ================= */}
        <UniversityContributionModal
          mode={mode}
          showForm={showForm}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          formData={mode === "add" ? addForm.formData : editForm.formData}
          errors={mode === "add" ? addForm.errors : editForm.errors}
          handleChange={
            mode === "add" ? addForm.handleChange : editForm.handleChange
          }
          submitForm={mode === "add" ? addForm.submitForm : editForm.submitForm}
          loading={mode === "add" ? addForm.loading : editForm.loading}
          types={types}
          loadingTypes={loadingTypes}
          deleteError={deleteError}
          onDelete={handleDelete}
          setShowForm={setShowForm}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          isArabic={isArabic}
          handleApplyFilters={handleApplyFilters}
          currentSort={sortValue}
          currentFilters={filtersState}
          handleResetFilters={handleResetFilters}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          filtersConfig={filtersConfig}
          sortOptions={sortOptions}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
