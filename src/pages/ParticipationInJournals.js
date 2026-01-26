import { useState } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/widgets/ParticipationJournals/PageHeader";
import JournalCard from "../components/widgets/ParticipationJournals/JournalCard";
import Pagination from "../components/ui/Pagination";
import JournalsModals from "../components/widgets/ParticipationJournals/JournalsModals";

import useJournals from "../hooks/useJournals";
import { deleteParticipationJournal } from "../services/participationJournals.service";

export default function ParticipationInJournals() {
  const { t, i18n } = useTranslation("ParticipationJournals");
  const isArabic = i18n.language === "ar";

  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { items, totalPages, loading, loadData } = useJournals(page, 9);

  const handleDelete = async () => {
    if (!selectedItem) return;
    await deleteParticipationJournal(selectedItem.id);
    setShowDelete(false);
    loadData();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => setShowAdd(true)}
          onFilter={() => console.log("Filter clicked")}
        />

        <div className="flex-1">
          {items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <JournalCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setShowEdit(true);
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setShowDelete(true);
                  }}
                  onDetails={(item) => {
                    setSelectedItem(item);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xl">
              {t("empty")}
            </div>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          t={t}
          isArabic={isArabic}
        />

        <JournalsModals
          showAdd={showAdd}
          showEdit={showEdit}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onSuccessAdd={() => {
            setShowAdd(false);
            setPage(1);
            loadData();
          }}
          onSuccessEdit={() => {
            setShowEdit(false);
            loadData();
          }}
          onDelete={handleDelete}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
