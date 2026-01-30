import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import SupervisionThesisCard from "../components/widgets/SupervisionThesis/SupervisionThesisCard";
import DeleteSupervisionModal from "../components/widgets/SupervisionThesis/DeleteSupervisionModal";

const MOCK_SUPERVISION = [
  {
    id: 1,
    title: "أثر التحول الرقمي على كفاءة المؤسسات التعليمية",
    type: "رسالة دكتوراة - مشرف و محكم",
    student: "الطالب : احمد ايمن عبدالعاطي",
  },
  {
    id: 2,
    title:
      "Optic Disc Detection from Normalized Digital Fundus Images by means of a Vessels' Direction Matched Filter",
    type: "رسالة ماجستير - محكم",
    student: "الطالب : احمد ايمن عبد العاطي",
  },
  {
    id: 3,
    title: "تحليل نظم التعلم عن بعد وتأثيرها على الطلاب",
    type: "رسالة ماجستير - مشرف",
    student: "الطالب : محمد علي محمد",
  },
  {
    id: 4,
    title: "AI Models for Predictive Maintenance in Industry 4.0",
    type: "رسالة دكتوراة - مشرف و محكم",
    student: "الطالب : Sara Ahmed",
  },
  {
    id: 5,
    title: "AI Models for Predictive Maintenance in Industry 4.0",
    type: "رسالة دكتوراة - مشرف و محكم",
    student: "الطالب : Sara Ahmed",
  },
];

export default function SupervisionThesis() {
  const { t, i18n } = useTranslation("SupervisionThesis");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 4;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(MOCK_SUPERVISION);
      setTotalPages(Math.ceil(MOCK_SUPERVISION.length / pageSize));
    } catch (err) {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDelete = () => {
    setItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setShowDelete(false);
  };

  if (loading) return <LoadingSpinner />;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-supervision")}
        />

        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {!loading && items.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-xl">
            {t("empty")}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 max-w-5xl">
              {paginatedItems.map((item) => (
                <SupervisionThesisCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onEdit={(item) => {
                    console.log("Edit clicked", item);
                  }}
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
          <DeleteSupervisionModal
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
