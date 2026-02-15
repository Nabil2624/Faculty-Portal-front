import { useState } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { items, totalPages, loading, error, loadData } = useArticleReviews(
    page,
    9,
  );

  const handleDelete = async () => {
    if (!selectedItem) return;
    setDeleteError(null);
    try {
      await deleteArticleReview(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData(page);
    } catch (err) {
      setDeleteError(t("errors.deleteFailed") || "Failed to delete article");
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
          onFilter={() => console.log("Filter clicked")}
          isArabic={isArabic}
        />
        <div className="items-center justify-center">
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
        </div>
        <div className="flex-1">
          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ArticleCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setShowEdit(true);
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onDetails={(item) => {
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
          onSuccessAdd={() => {
            setShowAdd(false);
            setPage(1);
            loadData();
          }}
          onSuccessEdit={() => {
            setShowEdit(false);
            loadData();
          }}
          onDelete={handleDelete}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
