import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import usePrizesAndRewards from "../hooks/usePrizesAndRewards";
import { deletePrizeOrReward } from "../services/prizesAndRewards.service";

import PrizeCard from "../components/widgets/PrizesAndRewards/PrizesCard";
import PrizesAndRewardsModal from "../components/widgets/PrizesAndRewards/PrizesAndRewardsModal";

export default function PrizesAndRewards() {
  const { t, i18n } = useTranslation("prizes-and-rewards");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const {
    items = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = usePrizesAndRewards(currentPage, 9);

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
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-prizes-and-rewards")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        {!loading && error && (
          <div className="text-center text-red-500">
            {t("errors.loadFailed")}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center text-gray-500">{t("empty")}</div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="overflow-y-auto pr-2 mb-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <PrizeCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onDelete={(p) => {
                    setSelectedItem(p);
                    setShowDelete(true);
                    setDeleteError(false);
                  }}
                  onDetails={(p) => {
                    setSelectedItem(p);
                    setShowDetails(true);
                  }}
                  onEdit={handleEditNavigate}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            t={t}
            isArabic={isArabic}
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
          t={t} // pass translation function
          isArabic={isArabic} // pass current language
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
