import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/ui/Pagination";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";
import NominatedResearchCard from "../components/widgets/NominatedResearch/NominatedResearchCard";
import { useState } from "react";
import useNominatedScientificResearch from "../hooks/useNominatedScientificResearch";

import useResearcherProfile from "../hooks/useResearcherProfile";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";

import { useNavigate } from "react-router-dom";

export default function NominatedScientificResearch() {
  const navigate = useNavigate();
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

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
  } = useNominatedScientificResearch();

  const { researcher, loading: profileLoading } = useResearcherProfile();

  if (loading || profileLoading) return <LoadingSpinner />;

  if (!researcher?.scholarProfileLink?.trim()) {
    return (
      <ResponsiveLayoutProvider>
        <div className="p-6">
          <MissingScholarCard
            onSave={(data) => {
              console.log("Profile data to send:", data);
            }}
          />
        </div>
      </ResponsiveLayoutProvider>
    );
  }

  const handleView = (item) => {
    // Navigate to the same scientific research details page
    navigate(`/scientific-research-details/${item.id}`, {
      state: { research: item },
    });
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderWithFilter
          title={t("title")}
          onFilter={() => console.log("Filter clicked")}
        />
        {items.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            {error || t("empty")}
          </p>
        )}

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
                navigate(`/scientific-research-details/${item.id}`, {
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
    </ResponsiveLayoutProvider>
  );
}
