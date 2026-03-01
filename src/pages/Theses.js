import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import ThesesCard from "../components/widgets/Theses/ThesesCard";
import DeleteThesisModal from "../components/widgets/Theses/DeleteThesisModal";

import useTheses from "../hooks/useTheses";
import { deleteThesis } from "../services/theses.services";
import useAcademicGradesLookups from "../hooks/useAcademicGradesLookups";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";

export default function Theses() {
  const { t, i18n } = useTranslation("Theses");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [page, setPage] = useState(1); // backend starts from 1
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [gradeIds, setGradeIds] = useState([]);
  const [type, setType] = useState([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const { items, totalPages, loading, error, loadData } = useTheses(
    page,
    4,
    debouncedSearch,
    sortValue,
    gradeIds,
    type,
  );

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteError(null);

    try {
      await deleteThesis(selectedItem.id);
      setShowDelete(false);
      loadData();
    } catch (err) {
      setDeleteError(t("errors.deleteFailed"));
    }
  };

  const { types, loadingTypes } = useAcademicGradesLookups();

  const mappedType =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const sortOptions = [
    { value: 1, label: "EnrollmentDateASC" },
    { value: 2, label: "EnrollmentDateDESC" },
    { value: 3, label: "RegisterationDateASC" },
    { value: 4, label: "RegisterationDateDESC" },
    { value: 5, label: "titleAsc" },
    { value: 6, label: "titleDesc" },
  ];

  const mappedTypes = [
    { value: 1, label: "Master" },
    { value: 2, label: "PhD" },
  ];
  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "Type",
          title: "dependOnType",
          options: mappedTypes,
        },
        {
          key: "GradeIds",
          title: "dependAcademicGrade",
          options: mappedType,
        },
      ]
    : [];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    setType(filters?.Type || []);
    setGradeIds(filters?.GradeIds || []);

    setPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setType([]);
    setGradeIds([]);
    setFiltersState({});
    setPage(1);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-thesis")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic
          onFilterClick={() => setShowFilterModal(true)}
        />

        {/* رسالة الخطأ */}
        {/* {error && (
    <div className="text-center text-red-500 mt-4">
      {t("fetchError")}
    </div>
  )} */}
        <div className="flex-1">
          {error ? (
            <div className="text-center text-red-500 mt-4 text-lg">
              {t("fetchError")}
            </div>
          ) : items.length ? (
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {items.map((item) => (
                <ThesesCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onClick={(item) => navigate(`/theses-details/${item.id}`)}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) =>
                    navigate("/edit-thesis", {
                      state: { thesis: item },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 text-xl">
              {t("empty")}
            </div>
          )}

          <div className="fixed bottom-12 left-0 w-full flex justify-center z-50">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              t={t}
              isArabic={isArabic}
            />
          </div>
        </div>

        {showDelete && (
          <DeleteThesisModal
            item={selectedItem}
            t={t}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
      </div>

      {showFilterModal && (
        <ModalWrapper onClose={() => setShowFilterModal(false)}>
          <CustomizeResultsModal
            onClose={() => setShowFilterModal(false)}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            currentSort={sortValue}
            currentFilters={filtersState}
            filtersConfig={filtersConfig}
            translationNamespace="filter-sort"
            sortOptions={sortOptions}
          />
        </ModalWrapper>
      )}
    </ResponsiveLayoutProvider>
  );
}
