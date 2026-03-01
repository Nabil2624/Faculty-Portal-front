import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import useSeminarsAndConferences from "../hooks/useSeminarsAndConferences";
import SeminarCard from "../components/widgets/SeminarAndConferences/SeminarCard";
import SeminarModal from "../components/widgets/SeminarAndConferences/SeminarModal";
import { useNavigate } from "react-router-dom";
import useSeminarParticipationType from "../hooks/useSeminarParticipationType";


export default function SeminarsAndConferences() {
  const { t, i18n } = useTranslation("SeminarsAndConferences");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [roleOfParticipationIds, setRoleOfParticipationIds] = useState([]);
  const [localOrInternational, setLocalOrInternational] = useState([]);
  const [conferenceOrSeminar, setConferenceOrSeminar] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);
  const {
    seminars = [],
    totalPages,
    loading,
    error,
    loadData,
    handleDelete,
  } = useSeminarsAndConferences(
    currentPage,
    9,
    debouncedSearch,
    sortValue,
    roleOfParticipationIds,
    localOrInternational,
    conferenceOrSeminar,
  );

  // debounce search
  const { items, isLoading } = useSeminarParticipationType();

  const mappedTypes =
    items?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];
  const sortOptions = [
    { value: 2, label: "newestFirst" },
    { value: 1, label: "oldestFirst" },
  ];
  const mapTypes = [
    { value: 1, label: "local" },
    { value: 2, label: "international" },
  ];
  const mappedRadio = [
    { value: 1, label: "Conference" },
    { value: 2, label: "Seminar" },
  ];
  const filtersConfig = mappedTypes.length
    ? [
        {
          key: "RoleOfParticipationIds",
          title: "dependOnRoleOfParticipationIds",
          options: mappedTypes,
        },
        {
          key: "LocalOrInternational",
          title: "dependLocalOrInternational",
          options: mapTypes,
        },
        {
          key: "ConferenceOrSeminar",
          title: "dependOnConferenceOrSeminar",
          options: mappedRadio,
        },
      ]
    : [];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);

    setRoleOfParticipationIds(filters?.RoleOfParticipationIds || []);
    setLocalOrInternational(filters?.LocalOrInternational || []);
    setConferenceOrSeminar(filters?.ConferenceOrSeminar || []);

    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSortValue(null);
    setRoleOfParticipationIds([]);
    setLocalOrInternational([]);
    setConferenceOrSeminar([]);
    setFiltersState({});
    setCurrentPage(1);
  };
  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("seminarsAndConferences")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-conference")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowFilterModal(true)}
        />

        {/* Error / Empty */}
        {!loading && error && (
          <div className="text-center text-red-500">{t(error)}</div>
        )}
        {!loading && !error && seminars.length === 0 && (
          <div className="text-center text-gray-500">{t("empty")}</div>
        )}

        {/* Grid */}
        {!loading && !error && seminars.length > 0 && (
          <div
            className="overflow-y-auto pr-2 mb-4 flex-1"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isArabic ? "text-right" : "text-left"}`}
              style={{ gap: "clamp(0.5rem, 0.8vw, 2rem)" }}
            >
              {seminars.map((item) => (
                <SeminarCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() =>
                    navigate("/edit-conference", {
                      state: { existingData: item },
                    })
                  }
                  onDelete={() => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onDetails={() => {
                    setSelectedItem(item);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
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

        {/* Modal */}
        <SeminarModal
          showForm={showForm}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          onDelete={async () => {
            await handleDelete(selectedItem.id);
            setShowDelete(false);
          }}
          setShowForm={setShowForm}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          mode={mode}
          isArabic={isArabic}
          reloadData={loadData}
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
