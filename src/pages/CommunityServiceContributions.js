import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { HandHeart } from "lucide-react";
import useCommunityServiceContribution from "../hooks/useCommunityServiceContribution";
import useCommunityServiceContributionForm from "../hooks/useCommunityServiceContributionForm";

import CommunityServiceContributionsCard from "../components/widgets/CommunityServiceContributions/CommunityServiceContributionsCard";
import CommunityServiceContributionsModal from "../components/widgets/CommunityServiceContributions/CommunityServiceContributionsModal";

import { deleteCommunityServiceContribution } from "../services/communityServiceContribution.service";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import CommunityServiceContributionsTable from "../components/widgets/CommunityServiceContributions/CommunityServiceContributionsTable";
import { useNavigate } from "react-router-dom";
export default function CommunityServiceContributions() {
  const { t, i18n } = useTranslation("university-contribution");
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [deleteError, setDeleteError] = useState(false);
  const [filtersState, setFiltersState] = useState({});
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();
  /* ================= DATA ================= */
  const {
    items: contributions = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useCommunityServiceContribution(
    currentPage,
    9,
    search,
    sortValue,
    
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  /* ================= FORM HOOK ================= */
  // const {
  //   formData,
  //   errors,
  //   loading: formLoading,
  //   handleChange,
  //   submitForm,
  // } = useCommunityServiceContributionForm({
  //   mode,
  //   selectedItem,
  //   onSuccess: () => {
  //     setShowForm(false);
  //     loadData();
  //   },
  // });

  /* ================= SEARCH ================= */
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
  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteCommunityServiceContribution(id);
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
    navigate("/edit-community-contribution", { state: { item } });
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    navigate("/add-community-contribution");
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeaderNoAction
          title={t("contributionTitle")}
          addLabel={t("add")}
          onAdd={handleAdd}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
          icon={HandHeart}
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

        <div className="flex-1 overflow-hidden">
          <CommunityServiceContributionsTable
            data={contributions}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* ================= MODALS ================= */}
        <CommunityServiceContributionsModal
          mode={mode}
          showForm={showForm}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          deleteError={deleteError}
          onDelete={handleDelete}
          setShowForm={setShowForm}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
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
