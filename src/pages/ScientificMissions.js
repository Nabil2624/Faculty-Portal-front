// ScientificMissions.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlaneTakeoff } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useScientificMissions from "../hooks/useScientificMissions";
import { deleteScientificMission } from "../services/scientificMission.service";
import ScientificMissionsTable from "../components/widgets/ScientificMissions/ScientificMissionsTable";
import ScientificMissionsModal from "../components/widgets/ScientificMissions/ScientificMissionsModal";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

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
  const [filtersState, setFiltersState] = useState({});
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { missions, totalPages, loading, error, loadData } =
    useScientificMissions(currentPage, 9, debouncedSearch, sortValue);

  const sortOptions = [
    { value: 2, label: "newestFirst" },
    { value: 1, label: "oldestFirst" },
    { value: 3, label: "nameAsc" },
    { value: 4, label: "nameDec" },
  ];
  const handleApplyFilters = ({ sortValue }) => {
    setSortValue(sortValue);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);

    setFiltersState({});
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteScientificMission(id);
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
        <PageHeaderNoAction title={t("scientificMissions")} icon={PlaneTakeoff} />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        <div className=" flex-1 overflow-hidden">
          <ScientificMissionsTable
            data={missions}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onEdit={(item) =>
              navigate("/edit-scientific-task", { state: { item } })
            }
            onAdd={() => navigate("/add-scientific-task")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
            t={t}
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
