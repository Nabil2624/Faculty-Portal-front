import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import ArticleCard from "../components/widgets/ArticleReview/ArticleCard";
import Pagination from "../components/ui/Pagination";
import ArticlesModals from "../components/widgets/ArticleReview/ArticlesModals";

import useArticleReviews from "../hooks/useArticleReviews";
import { deleteArticleReview } from "../services/articleReviews.service";
import { Gavel } from "lucide-react";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { useNavigate } from "react-router-dom";
import ArticleReviewTable from "../components/widgets/ArticleReview/ArticleReviewTable";
export default function ArticleReviewsPage() {
  const { t, i18n } = useTranslation("article-reviews");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
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
        <PageHeaderNoAction
          title={t("pageTitle")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-article")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
          icon={Gavel}
        />

        {!loading && error && (
          <div className="text-red-500 text-lg text-center">
            {t("errors.loadFailed")}
          </div>
        )}

        <div className=" flex-1 overflow-hidden">
          <ArticleReviewTable
            data={items}
            onEdit={(item) => {
              navigate("/edit-article", { state: { item } });
            }}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-article")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>

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
