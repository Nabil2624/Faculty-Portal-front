import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookType } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";

import useScientificWriting from "../hooks/useScientificWriting";
import { deleteScientificWriting } from "../services/scientific-writing.service";
import useAuthorRoles from "../hooks/useAuthorRoles";

import ScientificWritingTable from "../components/widgets/ScientificWriting/ScientificWritingTable";
import ScientificWritingModal from "../components/widgets/ScientificWriting/ScientificWritingModal";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function ScientificWriting() {
  const { t, i18n } = useTranslation("scientific-writing");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [authorRoleIds, setAuthorRoleIds] = useState([]);
  const [sortValue, setSortValue] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  /* debounce search */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const {
    items = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useScientificWriting(
    currentPage,
    9,
    debouncedSearch,
    authorRoleIds,
    sortValue,
  );

  const { types } = useAuthorRoles();

  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "AuthorRoleIds",
          title: "dependOnAuthorRoles",
          options: mappedTypes,
        },
      ]
    : [];

  const sortOptions = [
    { value: 4, label: "newestFirst" },
    { value: 3, label: "oldestFirst" },
    { value: 1, label: "nameAsc" },
    { value: 2, label: "nameDec" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setAuthorRoleIds(filters?.AuthorRoleIds || []);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setAuthorRoleIds([]);
    setFiltersState({});
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteScientificWriting(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      setDeleteError(true);
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* ✅ Page Header unchanged */}
        <PageHeaderNoAction
          title={t("title")}
          isArabic={isArabic}
          icon={BookType}
        />

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-500 mt-4">
            {t("errors.loadFailed")}
          </div>
        )}

       
          <div className="flex-1 overflow-hidden">
            <ScientificWritingTable
              addLabel={t("add")}
              data={items}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEdit={(item) =>
                navigate("/edit-scientific-writing", { state: { item } })
              }
              onDelete={(item) => {
                setSelectedItem(item);
                setShowDelete(true);
                setDeleteError(false);
              }}
              searchTerm={search}
              onSearchChange={setSearch}
              searchPlaceholder={t("search")}
              value={search}
              onChange={setSearch}
              onAdd={() => navigate("/add-scientific-writing")}
              onFilterClick={() => setShowFilterModal(true)}
            />
          </div>

        {/* ✅ Only Delete + Filter modal remain */}
        <ScientificWritingModal
          showDelete={showDelete}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          onDelete={handleDelete}
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
