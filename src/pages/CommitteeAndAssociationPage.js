import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CommitteeCard from "../components/widgets/CommitteeAndAssociation/CommitteeCard";
import Pagination from "../components/ui/Pagination";
import PageHeader from "../components/ui/PageHeader";
import useCommitteeLookups from "../hooks/useCommitteeLookups";
import CommitteesModals from "../components/widgets/CommitteeAndAssociation/CommitteesModals";
import useCommitteesAndAssociations from "../hooks/useCommitteesAndAssociations";
import { UserRound } from "lucide-react";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import CommitteeMasterDetailTable from "../components/widgets/CommitteeAndAssociation/CommitteeMasterDetailTable";
export default function CommitteesAndAssociationsPage() {
  const { t, i18n } = useTranslation("CommitteesAndAssociationsPage");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [typeOfCommitteeOrAssociationIds, setTypeOfCommitteeOrAssociationIds] =
    useState([]);
  const [degreeOfSubscriptionIds, setDegreeOfSubscriptionIds] = useState([]);
  const {
    committees,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    deleteItem,
  } = useCommitteesAndAssociations({
    t,
    search: debouncedSearch,
    sortValue,
    typeOfCommitteeOrAssociationIds,
    degreeOfSubscriptionIds,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, setCurrentPage]);

  const { types, degrees, loadings } = useCommitteeLookups();
  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const mappedDegrees =
    degrees?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "TypeOfCommitteeOrAssociationIds",
          title: "dependOnTypeOfCommitteeOrAssociation",
          options: mappedTypes,
        },
        {
          key: "DegreeOfSubscriptionIds",
          title: "dependOnDegreeOfSubscription",
          options: mappedDegrees,
        },
      ]
    : [];
  const sortOptions = [
    { value: 1, label: "oldestFirst" },
    { value: 2, label: "newestFirst" },
    { value: 3, label: "nameAsc" },
    { value: 4, label: "nameDec" },
  ];
  /* ================= Handlers ================= */
  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    setTypeOfCommitteeOrAssociationIds(
      filters?.TypeOfCommitteeOrAssociationIds || [],
    );
    setDegreeOfSubscriptionIds(filters?.DegreeOfSubscriptionIds || []);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setTypeOfCommitteeOrAssociationIds([]);
    setDegreeOfSubscriptionIds([]);
    setFiltersState({});
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;

    await deleteItem(selectedItem.id);
    setShowDelete(false);
    setSelectedItem(null);
  };

  /* ================= UI ================= */

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeaderNoAction
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-committee-associations")}
          onFilter={() => console.log("Filter clicked")}
          showSearch // 👈 ضيف دي
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
          icon={UserRound}
        />

        {!loading && error && (
          <div className="text-red-500 text-lg text-center">
            {t("fetchError")}
          </div>
        )}
        <div className=" flex-1 overflow-hidden">
          <CommitteeMasterDetailTable
            data={committees}
            onEdit={(item) =>
              navigate("/edit-committee-associations", {
                state: { item },
              })
            }
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
            }}
            onAdd={() => navigate("/add-committee-associations")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
          />
        </div>
      </div>

      {/* Modals */}
      <CommitteesModals
        showDelete={showDelete}
        showDetails={showDetails}
        selectedItem={selectedItem}
        setShowDelete={setShowDelete}
        setShowDetails={setShowDetails}
        onDelete={confirmDelete}
        t={t}
        isArabic={isArabic}
        handleApplyFilters={handleApplyFilters}
        currentSort={sortValue}
        currentFilters={filtersState}
        handleResetFilters={handleResetFilters}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        filtersConfig={filtersConfig}
        sortOptions={sortOptions}
      />
    </ResponsiveLayoutProvider>
  );
}
