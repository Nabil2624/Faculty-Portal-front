// ScientificMissions.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useScientificMissions from "../hooks/useScientificMissions";
import { deleteScientificMission } from "../services/scientificMission.service";
import ScientificMissionsCard from "../components/widgets/ScientificMissions/ScientificMissionsCard";
import ScientificMissionsModal from "../components/widgets/ScientificMissions/ScientificMissionsModal";

export default function ScientificMissions() {
  const { t, i18n } = useTranslation("ScientificMissions");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { missions, totalPages, loading, error, loadData } =
    useScientificMissions(currentPage, 9, debouncedSearch);

  const handleDelete = async (id) => {
    try {
      await deleteScientificMission(id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(t("deleteError"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-4 flex flex-col min-h-[90vh]`}>
        <PageHeader
          title={t("scientificMissions")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-scientific-task")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {!loading && !error && missions.length === 0 && (
          <div className="text-center text-gray-500 mb-4">{t("empty")}</div>
        )}

        {loading && (
          <div className="text-center text-gray-500 mb-4">Loading...</div>
        )}

        {!loading && missions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((item) => (
              <ScientificMissionsCard
                key={item.id}
                item={item}
                isArabic={isArabic}
                onEdit={(itm) =>
                  navigate("/edit-scientific-task", {
                    state: { taskData: itm },
                  })
                }
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

       
        <ScientificMissionsModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={() => handleDelete(selectedItem.id)}
          deleteError={deleteError}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}