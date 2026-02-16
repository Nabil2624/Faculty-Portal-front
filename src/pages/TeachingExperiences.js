import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";

import useTeachingExperiences from "../hooks/useTeachingExperiences";
import { deleteTeachingExperience } from "../services/teachingExperiences.service";
import TeachingExperienceCard from "../components/widgets/TeachingExperiences/TeachingExperienceCard";

import TeachingExperienceModal from "../components/widgets/TeachingExperiences/TeachingExperienceModal";

export default function TeachingExperiences() {
  const { t, i18n } = useTranslation("teaching-experiences");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [filtersList, setFiltersList] = useState([]);

  const {
    items: experiences = [],
    totalPages = 1,
    loading,
    error,
    loadData,
  } = useTeachingExperiences(currentPage, 9);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const filteredExperiences = useMemo(() => {
    const query = (search || "").toLowerCase().trim();
    if (!query) return experiences;

    return experiences.filter((exp) => {
      const title = exp?.experienceTitle || "";
      const authority = exp?.authority || "";
      const location = exp?.countryOrCity || "";

      return (
        title.toLowerCase().includes(query) ||
        authority.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
      );
    });
  }, [search, experiences]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteTeachingExperience(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  const handleEditNavigate = (item) => {
    navigate("/edit-teaching-experiences", { state: { item } });
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeader
          title={t("title")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-Teaching-experiences")}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search")}
          isArabic={isArabic}
          onFilterClick={() => setShowCustomize(true)} // 👈 ده المهم
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

        {!loading && !error && filteredExperiences.length === 0 && (
          <div
            className="text-center text-gray-500"
            style={{ fontSize: "clamp(1rem, 2vw, 2.8rem)" }}
          >
            {t("empty")}
          </div>
        )}

        {/* Grid with fixed scroll area */}
        {!loading && !error && filteredExperiences.length > 0 && (
          <div
            className="overflow-y-auto pr-2 mb-4 flex-1"
            style={{ maxHeight: "calc(90vh - 200px)" }} // adjust 200px حسب حجم الـ header + pagination
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                isArabic ? "text-right" : "text-left"
              }`}
              style={{ gap: "clamp(0.5rem, 0.8vw, 2rem)" }}
            >
              {filteredExperiences.map((item) => (
                <TeachingExperienceCard
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  onEdit={() => handleEditNavigate(item)}
                  onDelete={(p) => {
                    setSelectedItem(p);
                    setShowDelete(true);
                    setDeleteError(false);
                  }}
                  onDetails={(p) => {
                    setSelectedItem(p);
                    setShowDetails(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination ثابت تحت */}
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

        {/* Modals */}
        <TeachingExperienceModal
          showDelete={showDelete}
          showDetails={showDetails}
          showCustomize={showCustomize} // 👈 جديد
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          setShowCustomize={setShowCustomize} // 👈 جديد
          onDelete={handleDelete}
          onApplyFilters={(data) => {
            setSortValue(data.sortValue);
            setFiltersList(data.filtersList);
            setShowCustomize(false);

            console.log("Sort:", data.sortValue);
            console.log("Filters:", data.filtersList);
          }}
          deleteError={deleteError}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
