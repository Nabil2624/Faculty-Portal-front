import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import ScientificResearchCard from "../components/widgets/ScientificResearches/ScientificResearchCard";
import DeleteResearchModal from "../components/widgets/ScientificResearches/DeleteResearchModal";
import ModalWrapper from "../components/ui/ModalWrapper";
import useScientificResearches from "../hooks/useScientificResearches";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import { deleteScientificResearch } from "../services/scientificResearchService";
export default function ScientificResearches() {
  const { t, i18n } = useTranslation("ScientificResearches");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [source, setSource] = useState([]);
  const [derivedFrom, setDerivedFrom] = useState([]);
  const [publisherType, setPublisherType] = useState([]);
  const [PublicationType, setPublicationType] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  const {
    researches,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchResearches,
  } = useScientificResearches(
    4,
    debouncedSearch,
    sortValue,
    publisherType,
    PublicationType,
    source,
    derivedFrom,
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const sortOptions = [
    { value: 1, label: "titleAsc" },
    { value: 2, label: "titleDesc" },
    { value: 3, label: "journalAsc" },
    { value: 4, label: "journalDesc" },
    { value: 5, label: "pubYearAsc" },
    { value: 6, label: "pubYearDesc" },
  ];
  const mapTypes = [
    { value: 1, label: "Internal" },
    { value: 2, label: "External" },
  ];
  const mappedTypes = [
    { value: 1, label: "Master" },
    { value: 2, label: "PhD" },
    { value: 3, label: "Other" },
  ];
  const mappedRadio = [
    { value: 1, label: "Journal" },
    { value: 2, label: "Conference" },
    { value: 3, label: "Unspecified" },
  ];
  const mappingTypes = [
    { value: 1, label: "local" },
    { value: 2, label: "international" },
    { value: 3, label: "Unspecified" },
  ];
  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "Source",
          title: "dependOnSource",
          options: mappedTypes,
        },
        {
          key: "DerivedFrom",
          title: "dependOnDerivedFrom",
          options: mapTypes,
        },
        {
          key: "PublisherType",
          title: "dependOnPublisherType",
          options: mappedRadio,
        },
        {
          key: "PublicationType",
          title: "dependLocalOrInternational",
          options: mappingTypes,
        },
      ]
    : [];
  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    setSource(filters?.Source || []);
    setDerivedFrom(filters?.DerivedFrom || []);
    setPublisherType(filters?.PublisherType || []);
    setPublicationType(filters?.PublicationType || []);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setSource([]);
    setDerivedFrom([]);
    setPublisherType([]);
    setPublicationType([]);
    setFiltersState({});
    setCurrentPage(1);
  };
  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteScientificResearch(selectedItem.id);

      if (researches.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchResearches(currentPage);
      }

      setShowDelete(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);

      const apiMessage =
        err?.response?.data?.errorMessage || err?.response?.data?.message;

      alert(apiMessage || t("deleteError"));
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-scientific-research")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {!loading && researches.length === 0 && !error && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {/* Cards */}
        {researches.length > 0 && (
          <div className="grid grid-cols-1 gap-6 max-w-5xl">
            {researches.map((item) => (
              <ScientificResearchCard
                key={item.id}
                item={item}
                isArabic={isArabic}
                onClick={() =>
                  item.source === "Internal"
                    ? navigate("/scientific-research-full-details", {
                        state: { research: item },
                      })
                    : navigate("/scientific-research-details", {
                        state: { research: item },
                      })
                }
                onDelete={(item) => {
                  setSelectedItem(item);
                  setShowDelete(true);
                }}
                onEdit={(item) => {
                  if (item.source === "Internal") {
                    navigate("/edit-scientific-research", {
                      state: { research: item },
                    });
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination – ALWAYS visible */}
        <div className="fixed bottom-10 left-0 w-full flex justify-center z-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            t={t}
            isArabic={isArabic}
          />
        </div>

        {showDelete && (
          <DeleteResearchModal
            item={selectedItem}
            t={t}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
        {showFilterModal && (
          <ModalWrapper onClose={() => setShowFilterModal(false)}>
            <CustomizeResultsModal
              onClose={() => setShowFilterModal(false)}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              currentSort={sortValue}
              currentFilters={filtersState}
              filtersConfig={filtersConfig}
              translationNamespace="filter-sort"
              sortOptions={sortOptions}
            />
          </ModalWrapper>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
