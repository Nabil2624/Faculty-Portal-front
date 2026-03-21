import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import usePrizesAndRewards from "../hooks/usePrizesAndRewards";
import { deletePrizeOrReward } from "../services/prizesAndRewards.service";
import usePrizesAndRewardsLookups from "../hooks/usePrizesAndRewardsLookups";
import PrizeCard from "../components/widgets/PrizesAndRewards/PrizesCard";
import PrizesAndRewardsModal from "../components/widgets/PrizesAndRewards/PrizesAndRewardsModal";
import PrizesRewardsTable from "../components/widgets/PrizesAndRewards/PrizesRewardsTable";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import { Award } from "lucide-react";
export default function PrizesAndRewards() {
  const { t, i18n } = useTranslation("prizes-and-rewards");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const [filtersState, setFiltersState] = useState({});
  const [prizeIds, setPrizeIds] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const {
    items = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = usePrizesAndRewards(currentPage, 9, debouncedSearch, sortValue, prizeIds);
  const { types, loadingTypes } = usePrizesAndRewardsLookups();

  const mappedTypes =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "prizeIds",
          title: "dependprizeType",
          options: mappedTypes,
        },
      ]
    : [];
  const sortOptions = [
    { value: 2, label: "newestFirst" },
    { value: 1, label: "oldestFirst" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    const ids = filters?.prizeIds || [];
    setPrizeIds(ids);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setPrizeIds([]);
    setFiltersState({});
    setCurrentPage(1);
  };
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const filteredItems = useMemo(() => {
    const query = (search || "").toLowerCase().trim();
    if (!query) return items;

    return items.filter(
      (item) =>
        (item.prize?.valueEn || "").toLowerCase().includes(query) ||
        (item.awardingAuthority || "").toLowerCase().includes(query),
    );
  }, [search, items]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deletePrizeOrReward(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  const handleEditNavigate = (item) => {
    navigate("/edit-prizes-and-rewards", { state: { item } });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeaderNoAction
          title={t("title")}
          icon={Award}
        />

        {!loading && error && (
          <div className="text-center text-red-500">
            {t("errors.loadFailed")}
          </div>
        )}

        <div className=" flex-1 overflow-hidden">
          <PrizesRewardsTable
            data={items}
            onDelete={(item) => {
              setSelectedItem(item);
              setShowDelete(true);
              setDeleteError(false);
            }}
            onEdit={(item) =>
              navigate("/edit-prizes-and-rewards", { state: { item } })
            }
            onAdd={() => navigate("/add-prizes-and-rewards")}
            onFilterClick={() => setShowFilterModal(true)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={search}
            onSearchChange={setSearch}
            t={t}
          />
        </div>

        <PrizesAndRewardsModal
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={handleDelete}
          deleteError={deleteError}
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
      </div>
    </ResponsiveLayoutProvider>
  );
}
