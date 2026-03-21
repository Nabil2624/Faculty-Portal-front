import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useParticipationInQuallityWorks from "../hooks/useParticipationInQuallityWorks";
import useParticipationForm from "../hooks/useParticipationForm";

import ParticipationInQualityWorkCard from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkCard";
import ParticipationInQualityWorkModal from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkModal";

import { deleteParticipation } from "../services/participationInQualityWork.service";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import ParticipationInQualityWorkTable from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkTable";
import { useNavigate } from "react-router-dom";
export default function ParticipationInQualityWorks() {
  const { t, i18n } = useTranslation("participation-quality-work");
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
  const navigate = useNavigate();
  /* ================= DATA ================= */
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const {
    items: participations = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useParticipationInQuallityWorks(
    currentPage,
    9,
    debouncedSearch,
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
  // } = useParticipationForm({
  //   mode,
  //   selectedItem,
  //   onSuccess: () => {
  //     setShowForm(false);
  //     loadData();
  //   },
  // });
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
      await deleteParticipation(id);
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
    navigate("edit-participation-quality-work", { state: { item } });
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    navigate("/add-participation-quality-work");
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeaderNoAction
          title={t("title")}
          addLabel={t("add")}
          onAdd={handleAdd}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
          icon={ShieldCheck}
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
          <ParticipationInQualityWorkTable
            data={participations}
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
            t={t}
          />
        </div>

        {/* ================= MODALS ================= */}
        <ParticipationInQualityWorkModal
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
