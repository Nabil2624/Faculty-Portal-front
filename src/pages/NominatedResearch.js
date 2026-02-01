import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/ui/Pagination";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";

import NominatedResearchCard from "../components/widgets/NominatedResearch/NominatedResearchCard";

const MOCK_NOMINATED = [
  {
    id: 1,
    title: "AI in Medical Diagnosis",
    journal: "Journal of AI Research",
    year: 2024,
  },
  {
    id: 2,
    title: "Blockchain in Secure Voting Systems",
    journal: "Computer Science Review",
    year: 2023,
  },
];

export default function NominatedScientificResearch() {
  const { t, i18n } = useTranslation("NominatedResearch");
  const isArabic = i18n.language === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(items.length / pageSize);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(MOCK_NOMINATED);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <LoadingSpinner />;

  const paginated = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderWithFilter
          title={t("title")}
          onFilter={() => console.log("Filter clicked")}
        />

        <div className="grid grid-cols-1 gap-6 max-w-5xl">
          {paginated.map((item) => (
            <NominatedResearchCard
              key={item.id}
              item={item}
              isArabic={isArabic}
              onAccept={(item) => console.log("Accepted", item)}
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
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            t={t}
            isArabic={isArabic}
          />
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
