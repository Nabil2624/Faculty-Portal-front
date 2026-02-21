import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useAdminPosition from "../hooks/useAdminPosition";
import { deleteAdminPosition } from "../services/adminstrativePosition.service";

import AdminPositionCard from "../components/widgets/AdminPosition/AdminPositionCard";
import AdminPositionModal from "../components/widgets/AdminPosition/AdminPositionModal";

export default function AdminstrativePosition() {
  const { t, i18n } = useTranslation("AdministrativePositions");
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);
  const { jobRanks, totalPages, loading, error, loadData } = useAdminPosition(
    currentPage,
    9,
    debouncedSearch,
  );

  // ======================
  // Delete
  // ======================
  const handleDelete = async (id) => {
    try {
      await deleteAdminPosition(id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      setDeleteError(t("deleteError"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("administrativePositions")}
          addLabel={t("add")}
          onAdd={() => setShowAdd(true)}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {!loading && !error && jobRanks.length === 0 && (
          <div className="text-center text-gray-500 mb-4">{t("empty")}</div>
        )}

        {!loading && jobRanks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobRanks.map((item) => (
              <AdminPositionCard
                key={item.id}
                item={item}
                isArabic={isArabic}
                onEdit={(itm) => {
                  setSelectedItem(itm);
                  setShowEdit(true);
                }}
                onDelete={(itm) => {
                  setSelectedItem(itm);
                  setShowDelete(true);
                }}
                onDetails={(itm) => {
                  setSelectedItem(itm);
                  setShowDetails(true);
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex justify-center items-center gap-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            t={t}
            isArabic={isArabic}
          />
        </div>

        <AdminPositionModal
          showAdd={showAdd}
          showEdit={showEdit}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onSuccessAdd={() => {
            setShowAdd(false);
            loadData();
          }}
          onSuccessEdit={() => {
            setShowEdit(false);
            loadData();
          }}
          onDelete={() => handleDelete(selectedItem.id)}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
