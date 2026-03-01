import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useTrainingPrograms from "../hooks/useTrainingPrograms";
import { deleteTrainingProgram } from "../services/trainingPrograms.service";
import TrainingProgramCard from "../components/widgets/TrainingProgram/TrainingProgramCard";
import TrainingProgramModal from "../components/widgets/TrainingProgram/TrainingProgramModal";

export default function TrainingPrograms() {
  const { t, i18n } = useTranslation("TrainingPrograms");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [trainingProgramTypes, setTrainingProgramTypes] = useState([]);
  const [
    trainingProgramParticipationTypes,
    setTrainingProgramParticipationTypes,
  ] = useState([]);
  // =========================
  // Debounce
  // =========================
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const mapTypes = [
    { value: 1, label: "InTheSpecialty" },
    { value: 2, label: "OutTheSpecialty" },
  ];
  const mappedRadio = [
    { value: 1, label: "Listener" },
    { value: 2, label: "Lecturer" },
  ];
  const filtersConfig = mapTypes.length
    ? [
        {
          key: "TrainingProgramTypes",
          title: "dependOnTrainingProgramTypes",
          options: mapTypes,
        },
        {
          key: "TrainingProgramParticipationTypes",
          title: "dependOnTrainingProgramParticipationTypes",
          options: mappedRadio,
        },
      ]
    : [];
  const sortOptions = [
    { value: 2, label: "newestFirst" },
    { value: 1, label: "oldestFirst" },
    { value: 3, label: "nameAsc" },
    { value: 4, label: "nameDec" },
  ];
  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    setTrainingProgramTypes(filters?.TrainingProgramTypes || []);
    setTrainingProgramParticipationTypes(
      filters?.TrainingProgramParticipationTypes || [],
    );

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setTrainingProgramTypes([]);
    setTrainingProgramParticipationTypes([]);

    setFiltersState({});
    setCurrentPage(1);
  };
  // =========================
  // Hook
  // =========================
  const { programs, totalPages, loading, error, loadData } =
    useTrainingPrograms(
      currentPage,
      9,
      debouncedSearch,
      sortValue,
      trainingProgramParticipationTypes,
      trainingProgramTypes,
    );

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    try {
      await deleteTrainingProgram(id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(t("deleteError"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-4 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("trainingPrograms")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-training-program")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {!loading && !error && programs.length === 0 && (
          <div className="text-center text-gray-500 mb-4">{t("empty")}</div>
        )}

        {loading && (
          <div className="text-center text-gray-500 mb-4">Loading...</div>
        )}

        {!loading && programs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((item) => (
              <TrainingProgramCard
                key={item.id}
                item={item}
                isArabic={isArabic}
                onEdit={(itm) =>
                  navigate("/edit-training-program", {
                    state: { programData: itm },
                  })
                }
                onDelete={(itm) => {
                  setSelectedItem(itm);
                  setShowDelete(true);
                }}
                onDetails={(itm) => {
                  setSelectedItem(itm);
                  setShowDetails(true);
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex justify-center items-center gap-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            t={t}
            isArabic={isArabic}
          />
        </div>

        <TrainingProgramModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={() => handleDelete(selectedItem.id)}
          deleteError={deleteError}
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
