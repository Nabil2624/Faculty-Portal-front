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
      await deleteSupervisionThesis(selectedItem.id);

      // Close the modal
      setShowDelete(false);

      // Reload the list automatically
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadData();
      }
    } catch (err) {
      // Show translated error inside modal
      setDeleteError(err?.response?.data?.errorMessage || t("deleteFailed"));
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
                  onClick={(item) => {
                    navigate("/supervision-info", {
                      state: {
                        ...item, // preserve all original fields
                      },
                    });
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) => {
                    // Map role string to numeric value
                    let roleValue;
                    switch (item.facultyMemberRole) {
                      case "Adminstrator":
                        roleValue = 1; // Supervisor
                        break;
                      case "Reviewer":
                        roleValue = 2; // Examiner
                        break;
                      case "AdminstratorAndReviewer":
                      case "ReviewerAndAdminstrator": // whatever your API returns for both
                        roleValue = 3; // Supervisor + Examiner
                        break;
                      default:
                        roleValue = 1; // default fallback
                    }

                    navigate("/edit-supervision", {
                      state: {
                        ...item,
                        facultyMemberRole: roleValue,
                      },
                    });
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
