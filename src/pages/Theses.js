import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import ThesesCard from "../components/widgets/Theses/ThesesCard";
import DeleteThesisModal from "../components/widgets/Theses/DeleteThesisModal";

// Example data
const MOCK_THESES = [
  {
    id: 1,
    title: "أثر التحول الرقمي على كفاءة المؤسسات التعليمية",
    type: "رسالة دكتوراة",
    registrationDate: "10 مارس 2010",
  },
  {
    id: 2,
    title:
      "Optic Disc Detection from Normalized Digital Fundus Images by means of a Vessels' Direction Matched Filter",
    type: "رسالة ماجستير",
    registrationDate: "10 مارس 2006",
  },
  {
    id: 3,
    title: "تأثير التعلم الإلكتروني على جودة التعليم الجامعي",
    type: "رسالة ماجستير",
    registrationDate: "15 مايو 2012",
  },
  {
    id: 4,
    title: "Advanced AI Techniques for Natural Language Processing",
    type: "رسالة دكتوراة",
    registrationDate: "20 يناير 2018",
  },
];

export default function Theses() {
  const { t, i18n } = useTranslation("Theses");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [theses, setTheses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 4;

  const fetchTheses = async () => {
    setLoading(true);
    setError(null);
    try {
      setTheses(MOCK_THESES);
      setTotalPages(Math.ceil(MOCK_THESES.length / pageSize));
    } catch (err) {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
    // eslint-disable-next-line
  }, []);

  const handleDelete = () => {
    setTheses((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setShowDelete(false);
  };

  if (loading) return <LoadingSpinner />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTheses = theses.slice(startIndex, endIndex);

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-thesis")}
        />

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {!loading && theses.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {theses.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {paginatedTheses.map((item) => (
                <ThesesCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) => console.log("Edit clicked", item)}
                />
              ))}
            </div>

            <div className="fixed bottom-36 left-0 w-full flex justify-center z-50">
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
          <DeleteThesisModal
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
