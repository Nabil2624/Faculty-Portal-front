import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useParticipationInQuallityWorks from "../hooks/useParticipationInQuallityWorks";
import useParticipationForm from "../hooks/useParticipationForm";

import ParticipationInQualityWorkCard from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkCard";
import ParticipationInQualityWorkModal from "../components/widgets/ParticipationinQualityWork/ParticipationInQualityWorkModal";

import { deleteParticipation } from "../services/participationInQualityWork.service";

export default function ParticipationInQualityWorks() {
  const { t, i18n } = useTranslation("participation-quality-work");
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [deleteError, setDeleteError] = useState(false);

  /* ================= DATA ================= */
  const {
    items: participations = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useParticipationInQuallityWorks(currentPage, 9);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  /* ================= FORM HOOK ================= */
  const {
    formData,
    errors,
    loading: formLoading,
    handleChange,
    submitForm,
  } = useParticipationForm({
    mode,
    selectedItem,
    onSuccess: () => {
      setShowForm(false);
      loadData();
    },
  });

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const query = (search || "").toLowerCase().trim();
    if (!query) return participations;

    return participations.filter((item) => {
      const title = item?.participationName || "";
      const desc = item?.description || "";

      return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    });
  }, [search, participations]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteParticipation(id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setMode("edit");
    setSelectedItem(item);
    setShowForm(true);
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setMode("add");
    setSelectedItem(null);
    setShowForm(true);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}>
        {/* Header */}
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={handleAdd}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
        />

        {/* Error / Empty */}
        {!loading && error && (
          <div
            className="text-center text-red-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("errors.loadFailed")}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div
            className="text-center text-gray-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("empty")}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="overflow-y-auto pr-2 mb-4 flex-1"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                isArabic ? "text-right" : "text-left"
              }`}
              style={{ gap: "clamp(0.5rem, 0.8vw, 2rem)" }}
            >
              {filtered.map((item) => (
                <ParticipationInQualityWorkCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => {
                    setSelectedItem(item);
                    setShowDelete(true);
                    setDeleteError(false);
                  }}
                  onDetails={() => {
                    setSelectedItem(item);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            t={t}
            isArabic={isArabic}
          />
        </div>

        {/* ================= MODALS ================= */}
        <ParticipationInQualityWorkModal
          mode={mode}
          showForm={showForm}
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}

          formData={formData}
          errors={errors}
          handleChange={handleChange}
          submitForm={submitForm}
          loading={formLoading}

          deleteError={deleteError}
          onDelete={handleDelete}
          setShowForm={setShowForm}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
