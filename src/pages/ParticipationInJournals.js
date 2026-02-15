import { useState } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/ui/PageHeader";
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
  const [deleteError, setDeleteError] = useState(null);

  const { items, totalPages, loading, error, loadData } = useJournals(page, 9);

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteError(null);

    try {
      await deleteParticipationJournal(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      setDeleteError(t("errors.deleteFailed"));
    }
  };



  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} flex flex-col min-h-[90vh]`}
        style={{
          padding: "clamp(6px, 0.5vw, 20px)",
        }}
      >
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => setShowAdd(true)}
          onFilter={() => console.log("Filter clicked")}
          isArabic={isArabic}
        />
        <div className="items-center justify-center">
          {!loading && error && (
            <div className="text-red-500 text-lg text-center">
              {t("errors.loadFailed")}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-gray-500 text-xl text-center">
              {t("empty")}
            </div>
          )}
        </div>
        <div className="flex-1 ">
          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr h-full">
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
          deleteError={deleteError}
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
