import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
// Components
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import DeleteSupervisionModal from "../components/widgets/SupervisionThesis/DeleteSupervisionModal";
import SupervisionThesisTable from "../components/widgets/SupervisionThesis/SupervisionThesisTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

// Hooks & Services
import useAcademicGradesLookups from "../hooks/useAcademicGradesLookups";
import useSupervisionThesis from "../hooks/useSupervisionThesis";
import { deleteSupervisionThesis } from "../services/supervisionThesis.service";

export default function SupervisionThesis() {
  const { t, i18n } = useTranslation(["SupervisionThesis", "filter-sort"]);
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // --- States الفلترة والترتيب والبحث ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [gradeIds, setGradeIds] = useState([]);
  const [type, setType] = useState([]);
  const [role, setRole] = useState([]);

  // --- States التحكم في القائمة والـ Pagination والاختيار ---
  const [allSupervisions, setAllSupervisions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // التعديل هنا لمصفوفة
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const lastProcessedDataRef = useRef(null);

  // Search Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // جلب البيانات
  const { items, totalPages, loading, error, loadData } = useSupervisionThesis(
    currentPage,
    10,
    debouncedSearch,
    sortValue,
    gradeIds,
    role,
    type,
  );

  // دمج البيانات (Infinite Scroll / Show More)
  useEffect(() => {
    if (items) {
      if (currentPage === 1) {
        setAllSupervisions(items);
      } else if (items !== lastProcessedDataRef.current) {
        setAllSupervisions((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newUniqueItems = items.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...newUniqueItems];
        });
      }
      lastProcessedDataRef.current = items;
    }
  }, [items, currentPage]);

  // إعادة ضبط الحالة عند تغيير المعايير
  useEffect(() => {
    setAllSupervisions([]);
    setCurrentPage(1);
    lastProcessedDataRef.current = null;
    setSelectedIds([]); // تصفير الاختيارات
    setIsSelectionMode(false);
  }, [i18n.language, debouncedSearch, sortValue, gradeIds, role, type]);

  // الحصول على أول عنصر مختار (للتعديل أو العرض البسيط)
  const firstSelectedItem = useMemo(
    () => allSupervisions.find((i) => i.id === selectedIds[0]),
    [selectedIds, allSupervisions],
  );

  // Lookups
  const { types } = useAcademicGradesLookups();
  const mappedGrades = useMemo(
    () =>
      types?.map((item) => ({
        value: item.id,
        label: isArabic ? item.valueAr : item.valueEn,
      })) || [],
    [types, isArabic],
  );

  // Handlers
  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setRole(filters?.Role || []);
    setGradeIds(filters?.GradeIds || []);
    setType(filters?.Type || []);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setFiltersState({});
    setRole([]);
    setGradeIds([]);
    setType([]);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const handleDelete = async () => {
    try {
      // تنفيذ عملية الحذف لكل العناصر المختارة
      for (const id of selectedIds) {
        await deleteSupervisionThesis(id);
      }
      setShowDelete(false);
      setSelectedIds([]);
      setCurrentPage(1);
      loadData();
    } catch (err) {
      setDeleteError(err?.response?.data?.errorMessage || t("deleteFailed"));
    }
  };

  const handleEditAction = () => {
    if (selectedIds.length !== 1 || !firstSelectedItem) return;
    const roleMap = { Adminstrator: 1, Reviewer: 2 };
    let roleValue = roleMap[firstSelectedItem.facultyMemberRole] || 3;

    navigate("/edit-supervision", {
      state: { ...firstSelectedItem, facultyMemberRole: roleValue },
    });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction title={t("title")} icon={Users} />

        <SupervisionThesisTable
          items={allSupervisions}
          loading={loading}
          isArabic={isArabic}
          t={t}
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={() => {
            if (isSelectionMode) setSelectedIds([]);
            setIsSelectionMode(!isSelectionMode);
          }}
          selectedIds={selectedIds} // تمرير المصفوفة
          setSelectedIds={setSelectedIds} // تمرير الدالة
          searchTerm={search}
          setSearchTerm={setSearch}
          page={currentPage}
          totalPages={totalPages}
          setPage={setCurrentPage}
          setShowFilterModal={setShowFilterModal}
          setShowDeleteModal={setShowDelete}
          handleAddAction={() => navigate("/add-supervision")}
          handleEditAction={handleEditAction}
        />

        {showDelete && (
          <DeleteSupervisionModal
            item={firstSelectedItem}
            count={selectedIds.length} // يمكنك تعديل المودال ليعرض "حذف X عنصر"
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
              filtersConfig={[
                {
                  key: "GradeIds",
                  title: "dependAcademicGrade",
                  options: mappedGrades,
                },
                {
                  key: "Type",
                  title: "dependOnType",
                  options: [
                    { value: 1, label: "PhD" },
                    { value: 2, label: "Master" },
                  ],
                },
                {
                  key: "Role",
                  title: "dependOnRole",
                  options: [
                    { value: 1, label: "Administrator" },
                    { value: 2, label: "Reviewer" },
                    { value: 3, label: "AdministratorAndReviewer" },
                  ],
                },
              ]}
              translationNamespace="filter-sort"
              sortOptions={[
                { value: 1, label: "TitleASC" },
                { value: 2, label: "TitleDESC" },
                { value: 3, label: "StudentNameASC" },
                { value: 4, label: "StudentNameDESC" },
                { value: 5, label: "RegistrationDateASC" },
                { value: 6, label: "RegistrationDateDESC" },
              ]}
            />
          </ModalWrapper>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
