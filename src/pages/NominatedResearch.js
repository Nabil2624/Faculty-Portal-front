import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/ui/Pagination";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";
import NominatedResearchCard from "../components/widgets/NominatedResearch/NominatedResearchCard";

import useNominatedScientificResearch from "../hooks/useNominatedScientificResearch";

import useResearcherProfile from "../hooks/useResearcherProfile";
import MissingScholarCard from "../components/widgets/ResearcherProfile/MissingScholarCard";

import { useNavigate } from "react-router-dom";

export default function NominatedScientificResearch() {
  const navigate = useNavigate();

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
              onReject={(item) => console.log("Rejected", item)}
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
    </ResponsiveLayoutProvider>
  );
}
