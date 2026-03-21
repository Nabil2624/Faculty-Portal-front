import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Newspaper } from "lucide-react";
// Components
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ThesesTable from "../components/widgets/Theses/ThesesTable";
import DeleteThesisModal from "../components/widgets/Theses/DeleteThesisModal";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

// Hooks & Services
import useTheses from "../hooks/useTheses";
import { deleteThesis } from "../services/theses.services";
import useAcademicGradesLookups from "../hooks/useAcademicGradesLookups";

export default function Theses() {
  const { t, i18n } = useTranslation("Theses");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [allTheses, setAllTheses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // تحويل الحالة لمصفوفة
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [gradeIds, setGradeIds] = useState([]);
  const [type, setType] = useState([]);

  // --- Search Debounce ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // --- Fetch Data Hook ---
  const { items, totalPages, loading, error, loadData } = useTheses(
    page,
    10,
    debouncedSearch,
    sortValue,
    gradeIds,
    type,
  );

  // دمج البيانات الجديدة مع القديمة ومنع التكرار
  useEffect(() => {
    if (items) {
      if (page === 1) {
        setAllTheses(items);
      } else {
        setAllTheses((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newUniqueItems = items.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...newUniqueItems];
        });
      }
    }
  }, [items, page]);

  // تصفير الإعدادات عند تغيير البحث أو اللغة
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, [debouncedSearch, sortValue, gradeIds, type, i18n.language]);

  // العنصر الأول المختار (يستخدم للتعديل)
  const firstSelectedItem = useMemo(
    () => allTheses.find((i) => i.id === selectedIds[0]),
    [selectedIds, allTheses],
  );

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      if (prev) setSelectedIds([]); // تصفير الاختيارات عند إغلاق الوضع
      return !prev;
    });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleteError(null);
    try {
      // حذف العناصر المختارة واحداً تلو الآخر (أو حسب دعم الـ API للـ Bulk Delete)
      await Promise.all(selectedIds.map((id) => deleteThesis(id)));

      setShowDelete(false);
      setSelectedIds([]);
      setPage(1);
      loadData();
    } catch (err) {
      setDeleteError(t("errors.deleteFailed"));
    }
  };

  const { types } = useAcademicGradesLookups();
  const mappedGradeOptions = useMemo(
    () =>
      types?.map((item) => ({
        value: item.id,
        label: isArabic ? item.valueAr : item.valueEn,
      })) || [],
    [types, isArabic],
  );

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setType(filters?.Type || []);
    setGradeIds(filters?.GradeIds || []);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setType([]);
    setGradeIds([]);
    setFiltersState({});
    setShowFilterModal(false);
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction title={t("title")} icon={Newspaper} />

        <ThesesTable
          items={allTheses}
          loading={loading}
          isArabic={isArabic}
          t={t}
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={toggleSelectionMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleEditAction={() =>
            navigate("/edit-thesis", { state: { thesis: firstSelectedItem } })
          }
          setShowDeleteModal={setShowDelete}
          setShowFilterModal={setShowFilterModal}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleAddAction={() => navigate("/add-thesis")}
          searchTerm={search}
          setSearchTerm={setSearch}
        />

        {error && (
          <div className="text-center text-red-500 mt-10">
            {t("fetchError")}
          </div>
        )}

        {showDelete && (
          <DeleteThesisModal
            item={firstSelectedItem}
            count={selectedIds.length} // نمرر عدد العناصر للمودال
            t={t}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
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
                  key: "Type",
                  title: "dependOnType",
                  options: [
                    { value: 1, label: "Master" },
                    { value: 2, label: "PhD" },
                  ],
                },
                {
                  key: "GradeIds",
                  title: "dependAcademicGrade",
                  options: mappedGradeOptions,
                },
              ]}
              translationNamespace="filter-sort"
              sortOptions={[
                { value: 1, label: "EnrollmentDateASC" },
                { value: 2, label: "EnrollmentDateDESC" },
                { value: 3, label: "RegisterationDateASC" },
                { value: 4, label: "RegisterationDateDESC" },
                { value: 5, label: "TitleASC" },
                { value: 6, label: "TitleDESC" },
              ]}
            />
          </ModalWrapper>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
