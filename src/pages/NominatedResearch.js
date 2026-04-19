import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileBadge2 } from "lucide-react";
// Components
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";
import NominatedResearchesTable from "../components/widgets/NominatedResearch/NominatedResearchesTable"; 

// Hooks
import useNominatedScientificResearch from "../hooks/useNominatedScientificResearch";
import useResearcherProfile from "../hooks/useResearcherProfile";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

export default function NominatedScientificResearch() {
  const navigate = useNavigate();

  // -- State للجدول والتحديد --
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // -- State للفلترة --
  const [filtersState, setFiltersState] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [source, setSource] = useState([]);
  const [derivedFrom, setDerivedFrom] = useState([]);
  const [publisherType, setPublisherType] = useState([]);
  const [publicationType, setPublicationType] = useState([]);

  // التعديل هنا: استخدام hasMore و loadMore بدل الصفحات
  const {
    t,
    isArabic,
    items,
    loading,
    hasMore,
    loadMore,
    handleApprove,
    handleReject,
    reload,
  } = useNominatedScientificResearch(
    sortValue,
    publisherType,
    publicationType,
    source,
    derivedFrom,
  );

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

  // -- Handlers للجراحة الجماعية (Bulk Actions) --
  const handleBulkApprove = async () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    for (const item of selectedItems) {
      await handleApprove(item);
    }
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleBulkReject = async () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    for (const item of selectedItems) {
      await handleReject(item);
    }
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  // -- Filter Config --
  const sortOptions = [
    { value: 1, label: "titleAsc" },
    { value: 2, label: "titleDesc" },
    { value: 3, label: "journalAsc" },
    { value: 4, label: "journalDesc" },
    { value: 5, label: "pubYearAsc" },
    { value: 6, label: "pubYearDesc" },
    { value: 7, label: "CitesAsc" },
    { value: 8, label: "CitesDesc" },
  ];

  const filtersConfig = [
    {
      key: "Source",
      title: "dependOnSource",
      options: [
        { value: 1, label: "Master" },
        { value: 2, label: "PhD" },
        { value: 3, label: "Other" },
      ],
    },
    {
      key: "DerivedFrom",
      title: "dependOnDerivedFrom",
      options: [
        { value: 1, label: "Internal" },
        { value: 2, label: "External" },
      ],
    },
    {
      key: "PublisherType",
      title: "dependOnPublisherType",
      options: [
        { value: 1, label: "Journal" },
        { value: 2, label: "Conference" },
      ],
    },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setSource(filters?.Source || []);
    setDerivedFrom(filters?.DerivedFrom || []);
    setPublisherType(filters?.PublisherType || []);
    setPublicationType(filters?.PublicationType || []);
    // تم إزالة setCurrentPage(1)
  };

  const handleResetFilters = () => {
    setSortValue(null);
    setSource([]);
    setDerivedFrom([]);
    setPublisherType([]);
    setPublicationType([]);
    setFiltersState({});
    // تم إزالة setCurrentPage(1)
  };

  if (items.length === 0 && waiting) {
    return (
      <ResponsiveLayoutProvider>
        <div className="text-center mt-20 text-xl font-semibold text-[#19355A]">
          {isArabic
            ? "برجاء الانتظار يتم جلب الأبحاث..."
            : "Please wait, fetching your researches..."}
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  if (items.length === 0 && missingScholar) {
    return (
      <ResponsiveLayoutProvider>
        <div className="p-6">
          <MissingScholarCard
            onSave={async (data) => {
              await axios.post(
                "http://172.1.50.98/Researches/api/fetch-research-using-scholar-profile-link/",
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

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}>
        <PageHeaderNoAction
          title={isArabic ? "الأبحاث العلمية المرشحة" : "Nominated Scientific Researches"}
          icon={FileBadge2}
        />

        <NominatedResearchesTable
          researches={filteredItems}
          loading={loading}
          isArabic={isArabic}
          t={t}
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]); 
          }}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleBulkApprove={handleBulkApprove}
          handleBulkReject={handleBulkReject}
          handleApprove={handleApprove}
          handleReject={handleReject}
          setShowFilterModal={setShowFilterModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          // التعديل هنا: تمرير hasMore و loadMore
          hasMore={hasMore}
          loadMore={loadMore}
        />
      </div>

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