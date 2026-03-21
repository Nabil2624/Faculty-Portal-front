import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";

import usePatents from "../hooks/usePatents";
import { deletePatent } from "../services/patents.service";
import { Lightbulb } from "lucide-react";
// استيراد الجدول الجديد الذي قمنا بإنشائه
import PatentsTable from "../components/widgets/Patents/PatentsTable";
import PatentModal from "../components/widgets/Patents/PatentModal";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function Patents() {
  const { t, i18n } = useTranslation("patents");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [localOrInternational, setLocalOrInternational] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);

  // التحكم في الـ Debounce للبحث
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // جلب البيانات من الـ Hook
  const {
    items: patents = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = usePatents(
    currentPage,
    10, // زيادة العدد قليلاً ليناسب شكل القائمة الجانبية
    debouncedSearch,
    localOrInternational,
    sortValue,
  );

  const mappedTypes = [
    { value: 1, label: "local" },
    { value: 2, label: "international" },
  ];

  const filtersConfig = [
    {
      key: "LocalOrInternational",
      title: "dependLocalOrInternational",
      options: mappedTypes,
    },
  ];

  const sortOptions = [
    { value: 1, label: "nameAsc" },
    { value: 2, label: "nameDec" },
    { value: 3, label: "applyDateAsc" },
    { value: 4, label: "applyDateDesc" },
    { value: 5, label: "accreditationDateAsc" },
    { value: 6, label: "accreditationDateDesc" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setLocalOrInternational(filters?.LocalOrInternational || []);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setLocalOrInternational([]);
    setFiltersState({});
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deletePatent(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(t("errors.deleteFailed"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header - تم الاحتفاظ به لفلتر البحث المتقدم والفلترة */}
        <PageHeaderNoAction title={t("title")} isArabic={isArabic} icon={Lightbulb}/>

        <div className=" flex-1 overflow-hidden">
          <PatentsTable
            data={patents}
            loading={loading}
            onFilterClick={() => setShowFilterModal(true)}
            // Logic التعديل والحذف
            onEdit={(item) => navigate("/edit-patent", { state: { item } })}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
            }}
            onAdd={() => navigate("/add-patent")}
            // منطق البحث (نمرر Input البحث للجدول)
            renderSearch={() => (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b38e19] transition-all"
              />
            )}
            // منطق الصفحات
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Error Handling */}
        {!loading && error && (
          <div className="text-center text-red-500 mt-2">
            {t("errors.loadFailed")}
          </div>
        )}

        {/* Modals - للحذف والفلترة فقط */}
        <PatentModal
          showDelete={showDelete}
          showDetails={false} // لم نعد بحاجة لمودال التفاصيل لأنه يعرض الآن في الـ Side Detail
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          onDelete={handleDelete}
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
