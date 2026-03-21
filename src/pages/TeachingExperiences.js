import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { Presentation } from "lucide-react";
import useTeachingExperiences from "../hooks/useTeachingExperiences";
import { deleteTeachingExperience } from "../services/teachingExperiences.service";
import TeachingExperienceCard from "../components/widgets/TeachingExperiences/TeachingExperienceCard";
import TeachingExperienceModal from "../components/widgets/TeachingExperiences/TeachingExperienceModal";
import TeachingExperiencesTable from "../components/widgets/TeachingExperiences/TeachingExperiencesTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function TeachingExperiences() {
  const { t, i18n } = useTranslation("teaching-experiences");
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
    items: experiences = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useTeachingExperiences(currentPage, 9, debouncedSearch, sortValue);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);
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
      await deleteTeachingExperience(selectedItem.id);
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
    navigate("/edit-teaching-experiences", { state: { item } });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeaderNoAction title={t("title")} icon={Presentation} />

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
          <TeachingExperiencesTable
            data={experiences}
            onEdit={handleEditNavigate}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-Teaching-experiences")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Modals */}
        <TeachingExperienceModal
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
