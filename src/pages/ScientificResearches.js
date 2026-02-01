import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import ScientificResearchCard from "../components/widgets/ScientificResearches/ScientificResearchCard";
import DeleteResearchModal from "../components/widgets/ScientificResearches/DeleteResearchModal";

const MOCK_RESEARCHES = [
  {
    id: 1,
    researchTitle: "AI in Healthcare",
    journalName: "International Journal of AI",
    publishYear: 2022,
  },
  {
    id: 2,
    researchTitle: "Blockchain Security Models",
    journalName: "Computer Science Review",
    publishYear: 2021,
  },
  {
    id: 3,
    researchTitle: "IoT and Smart Cities",
    journalName: "Engineering Today",
    publishYear: 2023,
  },
  {
    id: 4,
    researchTitle:
      "IoT and Smart Cities and scanning the modern trends in technology",
    journalName: "Engineering Today",
    publishYear: 2023,
  },
  {
    id: 6,
    researchTitle:
      "IoT and Smart Cities and scanning the modern trends in technology",
    journalName: "Engineering Today",
    publishYear: 2023,
  },
  {
    id: 7,
    researchTitle:
      "IoT and Smart Cities and scanning the modern trends in technology",
    journalName: "Engineering Today",
    publishYear: 2023,
  },
];

export default function ScientificResearches() {
  const { t, i18n } = useTranslation("ScientificResearches");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [researches, setResearches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 4;

  const fetchResearches = async () => {
    setLoading(true);
    setError(null);

    try {
      setResearches(MOCK_RESEARCHES);
      setTotalPages(Math.ceil(MOCK_RESEARCHES.length / pageSize));
    } catch (err) {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches();
    // eslint-disable-next-line
  }, []);

  const handleDelete = () => {
    setResearches((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setShowDelete(false);
  };

  if (loading) return <LoadingSpinner />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResearches = researches.slice(startIndex, endIndex);

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-scientific-research")}
        />

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {!loading && researches.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {researches.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {paginatedResearches.map((item) => (
                <ScientificResearchCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
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

        {showDelete && (
          <DeleteResearchModal
            item={selectedItem}
            t={t}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
