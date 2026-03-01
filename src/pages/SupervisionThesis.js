import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import useAcademicGradesLookups from "../hooks/useAcademicGradesLookups";
import SupervisionThesisCard from "../components/widgets/SupervisionThesis/SupervisionThesisCard";
import DeleteSupervisionModal from "../components/widgets/SupervisionThesis/DeleteSupervisionModal";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import useSupervisionThesis from "../hooks/useSupervisionThesis";

import { deleteSupervisionThesis } from "../services/supervisionThesis.service";

export default function SupervisionThesis() {
  const { t, i18n } = useTranslation("SupervisionThesis");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [filtersState, setFiltersState] = useState({});
  const [gradeIds, setGradeIds] = useState([]);
  const [type, setType] = useState([]);
  const [role, setRole] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const { items, totalPages, loading, error, loadData } = useSupervisionThesis(
    currentPage,
    4,
    debouncedSearch,
    sortValue,
    gradeIds,
    role,
    type,
  );

  const [deleteError, setDeleteError] = useState(null);
  const { types, loadingTypes } = useAcademicGradesLookups();
  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const mapTypes = [
    { value: 1, label: "PhD" },
    { value: 2, label: "Master" },
  ];
  const mappingTypes = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "Reviewer" },
    { value: 3, label: "AdministratorAndReviewer" },
  ];
  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "GradeIds",
          title: "dependAcademicGrade",
          options: mappedTypes,
        },
        {
          key: "Type",
          title: "dependOnType",
          options: mapTypes,
        },
        {
          key: "Role",
          title: "dependOnRole",
          options: mappingTypes,
        },
      ]
    : [];
  const sortOptions = [
    { value: 1, label: "TitleASC" },
    { value: 2, label: "TitleDESC" },
    { value: 3, label: "StudentNameASC" },
    { value: 4, label: "StudentNameDESC" },
    { value: 5, label: "RegistrationDateASC" },
    { value: 6, label: "RegistrationDateDESC" },
    { value: 7, label: "SupervisionFormationDateASC" },
    { value: 8, label: "SupervisionFormationDateDESC" },
    { value: 9, label: "DiscussionDateASC" },
    { value: 10, label: "DiscussionDateDESC" },
    { value: 11, label: "GrantingDateASC" },
    { value: 12, label: "GrantingDateDESC" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setRole(filters?.Role || []);
    setGradeIds(filters?.GradeIds || []);
    setType(filters?.Type || []);
    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setGradeIds([]);
    setType([]);
    setRole([]);
    setFiltersState({});
    setCurrentPage(1);
  };
  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteError(null);

    try {
      await deleteSupervisionThesis(selectedItem.id);

      // Close the modal
      setShowDelete(false);

      // Reload the list automatically
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadData();
      }
    } catch (err) {
      // Show translated error inside modal
      setDeleteError(err?.response?.data?.errorMessage || t("deleteFailed"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-supervision")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />
        {/* Error Massage*/}
        {error && (
          <div className="text-center text-red-500 mt-4">{t("fetchError")}</div>
        )}
        <div className="flex-1">
          {items.length ? (
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {items.map((item) => (
                <SupervisionThesisCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onClick={(item) => {
                    navigate("/supervision-info", {
                      state: {
                        ...item, // preserve all original fields
                      },
                    });
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) => {
                    // Map role string to numeric value
                    let roleValue;
                    switch (item.facultyMemberRole) {
                      case "Adminstrator":
                        roleValue = 1; // Supervisor
                        break;
                      case "Reviewer":
                        roleValue = 2; // Examiner
                        break;
                      case "AdminstratorAndReviewer":
                      case "ReviewerAndAdminstrator": // whatever your API returns for both
                        roleValue = 3; // Supervisor + Examiner
                        break;
                      default:
                        roleValue = 1; // default fallback
                    }

                    navigate("/edit-supervision", {
                      state: {
                        ...item,
                        facultyMemberRole: roleValue,
                      },
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 text-xl">
              {t("empty")}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
          t={t}
          isArabic={isArabic}
        />

        {showDelete && (
          <DeleteSupervisionModal
            item={selectedItem}
            t={t}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            error={deleteError}
          />
        )}
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
      </div>
    </ResponsiveLayoutProvider>
  );
}
