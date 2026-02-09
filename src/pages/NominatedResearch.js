import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/ui/Pagination";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";
import NominatedResearchCard from "../components/widgets/NominatedResearch/NominatedResearchCard";

import useNominatedScientificResearch from "../hooks/useNominatedScientificResearch";

export default function NominatedScientificResearch() {
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

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderWithFilter
          title={t("title")}
          onFilter={() => console.log("Filter clicked")}
        />

        {error && items.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {items.map((item) => (
                <NominatedResearchCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onAccept={(item) => handleApprove(item)}
                  onReject={(item) => console.log("Rejected", item)}
                  onView={(item) => console.log("View", item)}
                />
              ))}
            </div>

            <div className="fixed bottom-10 left-0 w-full flex justify-center z-50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                t={t}
                isArabic={isArabic}
              />
            </div>
          </>
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
