// ScientificMissions.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";
import PageHeader from "./ui/PageHeader";
import Pagination from "./ui/Pagination";

import useScientificMissions from "../hooks/useScientificMissions";
import { deleteScientificMission } from "../services/scientificMission.service";
import ScientificMissionsCard from "./widgets/ScientificMissions/ScientificMissionsCard";

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
      alert(t("deleteError"));
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

        {/* Delete Modal */}
        {showDelete && selectedItem && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[360px] text-center">
              <h3 className="text-lg font-semibold mb-3">
                {t("areYouSureDelete")}
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                {selectedItem.missionName}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="bg-[#E53935] text-white px-5 py-2 rounded-md"
                >
                  {t("delete")}
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  className="bg-gray-300 px-5 py-2 rounded-md"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-[520px] max-w-[90%] p-8 relative">
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {selectedItem.missionName}
              </h2>

              <p>{selectedItem.notes}</p>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}