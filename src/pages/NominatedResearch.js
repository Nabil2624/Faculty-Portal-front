import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/ui/Pagination";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";
import NominatedResearchCard from "../components/widgets/NominatedResearch/NominatedResearchCard";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import useNominatedScientificResearch from "../hooks/useNominatedScientificResearch";
import useResearcherProfile from "../hooks/useResearcherProfile";

export default function NominatedScientificResearch() {
  const navigate = useNavigate();
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [source, setSource] = useState([]);
  const [derivedFrom, setDerivedFrom] = useState([]);
  const [publisherType, setPublisherType] = useState([]);
  const [PublicationType, setPublicationType] = useState([]);

  // Nominated researches
  const {
    t,
    isArabic,
    items,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    handleApprove,
    handleReject,
    reload,
  } = useNominatedScientificResearch(
    sortValue,
    publisherType,
    PublicationType,
    source,
    derivedFrom,
  );

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
  // Researcher profile logic
  const {
    researcher,
    loading: profileLoading,
    waiting,
    missingScholar,
    nationalNumber,
  } = useResearcherProfile();

  const [hasScraped, setHasScraped] = useState(false);

  useEffect(() => {
    if (!waiting && researcher && !hasScraped) {
      reload();
      setHasScraped(true);
    }
  }, [waiting]);
  // ================= LOADING =================
  // if (loading || profileLoading) return <LoadingSpinner />;

  // ================= WAITING (Scraping) =================
  if (items.length === 0 && waiting) {
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold">
          {isArabic
            ? "برجاء الانتظار يتم جلب الابحاث"
            : "Please wait, working on getting your researches"}
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  // ================= MISSING SCHOLAR =================
  if (items.length === 0 && missingScholar) {
    return (
      <ResponsiveLayoutProvider>
        <div className="p-6">
          <MissingScholarCard
            onSave={async (data) => {
              await axios.post(
                "http://127.0.0.1:8000/api/fetch-research-using-scholar-profile-link/",
                {
                  researcherNationalNumber: nationalNumber,
                  ORCID: data.orcid,
                  scholarProfileLink: data.scholarLink,
                },
              );
              window.location.reload();
            }}
          />
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  // ================= NO NOMINATED BUT PROFILE EXISTS =================
  if (items.length === 0 && researcher) {
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center text-gray-500 mt-20 text-lg">
          {t("empty")}
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  // ================= NORMAL RENDER =================
  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderWithFilter
          title={t("title")}
          onFilter={() => setShowFilterModal(true)}
        />

        <div className="grid grid-cols-1 gap-6 max-w-5xl">
          {items.map((item) => (
            <NominatedResearchCard
              key={item.id}
              item={item}
              isArabic={isArabic}
              onAccept={(item) => handleApprove(item)}
              onReject={(item) => {
                setSelectedResearch(item);
                setIsRejectModalOpen(true);
              }}
              onView={(item) => {
                navigate(`/scientific-research-details`, {
                  state: { research: item },
                });
              }}
            />
          ))}
        </div>

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
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {isArabic
                ? "هل أنت متأكد من رفض هذا البحث؟"
                : "Are you sure you want to reject this research?"}
            </h2>

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSelectedResearch(null);
                }}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={async () => {
                  await handleReject(selectedResearch);
                  setIsRejectModalOpen(false);
                  setSelectedResearch(null);
                }}
              >
                {isArabic ? "تأكيد الرفض" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
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
    </ResponsiveLayoutProvider>
  );
}
