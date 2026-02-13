import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import SupervisionThesisCard from "../components/widgets/SupervisionThesis/SupervisionThesisCard";
import DeleteSupervisionModal from "../components/widgets/SupervisionThesis/DeleteSupervisionModal";

import useSupervisionThesis from "../hooks/useSupervisionThesis";

import { deleteSupervisionThesis } from "../services/supervisionThesis.service";

export default function SupervisionThesis() {
  const { t, i18n } = useTranslation("SupervisionThesis");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const { items, totalPages, loading, error, loadData } = useSupervisionThesis(
    currentPage,
    4,
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteError(null);

    try {
      const res = await deleteSupervisionThesis(selectedItem.id);

      // Backend returns statusCode
      if (res.data.statusCode !== 200 && res.data.statusCode !== 0) {
        throw new Error(res.data.errorMessage || "Delete failed");
      }

      setShowDelete(false);

      // If deleting last item on last page  go back one page
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadData();
      }
    } catch (err) {
      setDeleteError(
        err?.response?.data?.errorMessage || err.message || t("fetchError"),
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">{t("fetchError")}</div>
    );
  }

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-6 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-supervision")}
        />

        <div className="flex-1">
          {items.length ? (
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {items.map((item) => (
                <SupervisionThesisCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onClick={(item) =>
                    navigate("/supervision-info", { state: item })
                  }
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) => {
                    navigate("/edit-supervision", { state: item });
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

        {/* doesnt hide prev and next*/}

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
          t={t}
          isArabic={isArabic}
        /> */}

        {items.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => p - 1)}
            onNext={() => setCurrentPage((p) => p + 1)}
            t={t}
            isArabic={isArabic}
          />
        )}

        {showDelete && (
          <DeleteSupervisionModal
            item={selectedItem}
            t={t}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            error={deleteError}
          />
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
