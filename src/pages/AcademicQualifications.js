import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import AcademicQualificationCard from "../components/widgets/AcademicQualifications/AcademicQualificationCard";
import AcademicQualificationsModal from "../components/widgets/AcademicQualifications/AcademicQualificationModal";
import { GraduationCap } from "lucide-react";
import useAcademicQualifications from "../hooks/useAcademicQualifications";
import { deleteAcademicQualification } from "../services/academicQualifications.service";
import useDelegation from "../hooks/useDelegation";
import useAcademicGrade from "../hooks/useAcademicGrade";
import useDegreeLookup from "../hooks/useDegreeLookup";
import AcademicQualificationsTable from "../components/widgets/AcademicQualifications/AcademicQualificationsTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function AcademicQualificationsPage() {
  const { t, i18n } = useTranslation("AcademicQualifications");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [qualificationIds, setQualificationIds] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [dispatchIds, setDispatchIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { qualifications, totalPages, loading, error, loadData } =
    useAcademicQualifications(
      currentPage,
      9,
      debouncedSearch,
      sortValue,
      qualificationIds,
      gradeIds,
      dispatchIds,
    );

  const { types, loadingTypes } = useDelegation();
  const { items, loadings } = useAcademicGrade();
  const { lookups, isLoading } = useDegreeLookup();

  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const mapTypes =
    items?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const mappedLookups =
    lookups?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "QualificationIds",
          title: "dependOnQualificationIds",
          options: mappedTypes,
        },
        {
          key: "GradeIds",
          title: "dependOnGradeIds",
          options: mapTypes,
        },
        {
          key: "DispatchIds",
          title: "dependOnDispatchIds",
          options: mappedLookups,
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

    setQualificationIds(filters?.QualificationIds || []);
    setGradeIds(filters?.GradeIds || []);
    setDispatchIds(filters?.DispatchIds || []);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setQualificationIds([]);
    setGradeIds([]);
    setDispatchIds([]);
    setFiltersState({});
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAcademicQualification(id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData(currentPage);
    } catch (err) {
      console.error(err);
      setDeleteError(t("deleteError"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction
          title={t("academicQualifications")}
          icon={GraduationCap}
        />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <AcademicQualificationsTable
            data={qualifications}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
              
            }}
            onEdit={(item) =>
              navigate("/edit-academic-qualification", { state: { item } })
            }
            onAdd={() => navigate("/add-academic-qualification")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
            t={t}
          />
        </div>


        <AcademicQualificationsModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={() => handleDelete(selectedItem.id)}
          deleteError={deleteError}
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
