import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import ArticleCard from "../components/widgets/ArticleReview/ArticleCard";
import Pagination from "../components/ui/Pagination";
import ArticlesModals from "../components/widgets/ArticleReview/ArticlesModals";

import useArticleReviews from "../hooks/useArticleReviews";
import { deleteArticleReview } from "../services/articleReviews.service";

export default function ArticleReviewsPage() {
  const { t, i18n } = useTranslation("article-reviews");
  const isArabic = i18n.language === "ar";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { items, totalPages, loading, error, loadData } = useArticleReviews(
    page,
    9,
    debouncedSearch,
    sortValue,
  );

  const sortOptions = [
    { value: 1, label: "oldestFirst" },
    { value: 2, label: "newestFirst" },
    { value: 3, label: "nameAsc" },
    { value: 4, label: "nameDec" },
  ];

  const handleApplyFilters = ({ sortValue }) => {
    setSortValue(sortValue);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setFiltersState({});
    setPage(1);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteError(null);

    try {
      await deleteArticleReview(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);

      // إعادة تحميل البيانات بعد الحذف
      loadData(page);
    } catch (err) {
      setDeleteError(t("errors.deleteFailed"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("pageTitle")}
          addLabel={t("add")}
          onAdd={() => setShowAdd(true)}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />

        {!loading && error && (
          <div className="text-red-500 text-lg text-center">
            {t("errors.loadFailed")}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-gray-500 text-xl text-center">
            {t("empty")}
          </div>
        )}

        <div className="flex-1">
          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ArticleCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() => {
                    setSelectedItem(item);
                    setShowEdit(true);
                  }}
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
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          t={t}
          isArabic={isArabic}
        />

        <ArticlesModals
          showAdd={showAdd}
          showEdit={showEdit}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          deleteError={deleteError}
          onDelete={handleDelete}
          onSuccessAdd={() => {
            setShowAdd(false);
            setPage(1);
            loadData(1); 
          }}
          onSuccessEdit={() => {
            setShowEdit(false);
            loadData(page);
          }}
          t={t}
          isArabic={isArabic}
          currentFilters={{}}
          handleApplyFilters={handleApplyFilters}
          currentSort={sortValue}
          handleResetFilters={handleResetFilters}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          filtersConfig={{}}
          sortOptions={sortOptions}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}