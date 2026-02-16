import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import ThesesCard from "../components/widgets/Theses/ThesesCard";
import DeleteThesisModal from "../components/widgets/Theses/DeleteThesisModal";

import useTheses from "../hooks/useTheses";
import { deleteThesis } from "../services/theses.services";

export default function Theses() {
  const { t, i18n } = useTranslation("Theses");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [page, setPage] = useState(1); // backend starts from 1
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { items, totalPages, loading, error, loadData } = useTheses(page, 4);

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

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {t("errors.loadFailed")}
      </div>
    );
  }

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-thesis")}
          isArabic
        />

        <div className="flex-1">
          {items.length ? (
            <>
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
                    onEdit={(item) => console.log("Edit clicked", item)}
                  />
                ))}
              </div>

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
            </>
          ) : (
            <div className="p-10 text-center text-gray-500 text-xl">
              {t("empty")}
            </div>
          )}
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
    </ResponsiveLayoutProvider>
  );
}
