import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import AcademicQualificationCard from "../components/widgets/AcademicQualifications/AcademicQualificationCard";
import AcademicQualificationsModal from "../components/widgets/AcademicQualifications/AcademicQualificationModal";

import useAcademicQualifications from "../hooks/useAcademicQualifications";
import { deleteAcademicQualification } from "../services/academicQualifications.service";
import useDelegation from "../hooks/useDelegation";
import useAcademicGrade from "../hooks/useAcademicGrade";
import useDegreeLookup from "../hooks/useDegreeLookup";

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
        className={`${isArabic ? "rtl" : "ltr"} p-4 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("academicQualifications")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-academic-qualification")}
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
        {!loading && !error && qualifications.length === 0 && (
          <div className="text-center text-gray-500 mb-4">{t("empty")}</div>
        )}
        {loading && (
          <div className="text-center text-gray-500 mb-4">Loading...</div>
        )}

        {!loading && qualifications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualifications.map((item) => (
              <AcademicQualificationCard
                key={item.id}
                item={item}
                isArabic={isArabic}
                onEdit={() =>
                  navigate("/edit-academic-qualification", { state: { item } })
                }
                onDelete={() => {
                  setSelectedItem(item);
                  setShowDelete(true);
                }}
                onDetails={() => {
                  setSelectedItem(item);
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
