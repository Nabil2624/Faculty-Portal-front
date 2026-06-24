import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
// استيراد المكون الجديد
import GeneralExperiencesTable from "../components/widgets/GeneralExperiences/GeneralExperiencesTable";
import GeneralExperienceModals from "../components/widgets/GeneralExperiences/GeneralExperienceModals";

import useGeneralExperience from "../hooks/useGeneralExperience";
import { deleteGeneralExperience } from "../services/generalExperience.service";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import ErrorCard from "../components/ui/ErrorCard";

export default function GeneralExperiencesPage() {
  const { t, i18n } = useTranslation("GeneralExperiences");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Logic البحث (Debounce)
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
  } = useGeneralExperience(currentPage, 10, debouncedSearch, sortValue);

  // تصحيح الصفحة الحالية عند تغير النتائج
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteGeneralExperience(selectedItem.id);
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
    navigate("/edit-general-experiences", { state: { item } });
  };

  if (error)
    return (
      <ResponsiveLayoutProvider>
        <div className="flex items-center p-3 justify-center min-h-[80vh] w-full">
          <ErrorCard pageName={t("title")} isAr={isArabic} />
        </div>
      </ResponsiveLayoutProvider>
    );

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* تم إزالة الـ PageHeader القديم أو تعديله لأن البحث الآن داخل الجدول */}
        <PageHeaderNoAction title={t("title")} icon={Globe} />

        {/* {!loading && error && (
          <div className="flex-1 flex items-center justify-center text-red-500 font-bold">
            {t("errors.loadFailed")}
          </div>
        )} */}

        <div className="flex-1 overflow-hidden">
          <GeneralExperiencesTable
            data={experiences}
            onEdit={handleEditNavigate}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-general-experiences")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>
        <GeneralExperienceModals
          showDelete={showDelete}
          showDetails={false} // لم نعد بحاجة لمودال التفاصيل لأنه يعرض داخل الجدول
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={() => {}}
          onDelete={handleDelete}
          deleteError={deleteError}
          t={t}
          isArabic={isArabic}
          handleApplyFilters={handleApplyFilters}
          currentSort={sortValue}
          handleResetFilters={handleResetFilters}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          sortOptions={sortOptions}
          filtersConfig={{}}
          currentFilters={{}}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
