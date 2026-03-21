import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import useJobGradeLookups from "../hooks/useJobGradeLookups";
import useJobGrades from "../hooks/useJobGrades";
import { deleteJobRank } from "../services/jobGrade.service";
import JobGradeCard from "../components/widgets/JobGrade/JobGradeCard";
import JobGradeModal from "../components/widgets/JobGrade/JobGradeModal";
import JobRanksTable from "../components/widgets/JobGrade/JobRanksTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { Milestone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobGrade() {
  const { t, i18n } = useTranslation("JobRanks");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [jobGrade, setJobGrade] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);
  const { jobRanks, totalPages, loading, error, loadData } = useJobGrades(
    currentPage,
    9,
    debouncedSearch,
    sortValue,
    jobGrade,
  );
  const { items, loadingTypes } = useJobGradeLookups();

  const mappedTypes =
    items?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "JobRankIds",
          title: "dependOnJobRank",
          options: mappedTypes,
        },
      ]
    : [];
  const sortOptions = [
    { value: 2, label: "newestFirst" },
    { value: 1, label: "oldestFirst" },
  ];
  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    const ids = filters?.JobRankIds || [];
    setJobGrade(ids);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setJobGrade([]);
    setFiltersState({});
    setCurrentPage(1);
  };
  // ======================
  // Delete
  // ======================
  const handleDelete = async (id) => {
    try {
      await deleteJobRank(id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      setDeleteError(t("deleteError"));
    }
  };
  const handleEditNavigate = (item) => {
    navigate("/edit-job-grade", { state: { item } });
  };
  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction title={t("pageTitle")} icon={Milestone} />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        <div className=" flex-1 overflow-hidden">
          <JobRanksTable
            data={jobRanks}
            onEdit={handleEditNavigate}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-job-grade")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>

        <JobGradeModal
          showAdd={showAdd}
          showEdit={showEdit}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onSuccessAdd={() => {
            setShowAdd(false);
            loadData();
          }}
          onSuccessEdit={() => {
            setShowEdit(false);
            loadData();
          }}
          onDelete={() => handleDelete(selectedItem.id)}
          t={t}
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
