import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { Briefcase } from "lucide-react";
import useAdminPosition from "../hooks/useAdminPosition";
import { deleteAdminPosition } from "../services/adminstrativePosition.service";

import AdminPositionCard from "../components/widgets/AdminPosition/AdminPositionCard";
import AdminPositionModal from "../components/widgets/AdminPosition/AdminPositionModal";
import AdministrativePositionsTable from "../components/widgets/AdminPosition/AdministrativePositionsTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { useNavigate } from "react-router-dom";
export default function AdminstrativePosition() {
  const { t, i18n } = useTranslation("AdministrativePositions");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [sortValue, setSortValue] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
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
    sortValue,
  );
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
  const handleEditNavigate = (item) => {
    navigate("/edit-admin-position", { state: { item } });
  };
  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction
          title={t("administrativePositions")}
          icon={Briefcase}
        />

        {!loading && error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}
        <div className=" flex-1 overflow-hidden">
          <AdministrativePositionsTable
            data={jobRanks}
            onEdit={handleEditNavigate}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onAdd={() => navigate("/add-admin-position")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
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
