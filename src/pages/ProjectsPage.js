import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import ProjectCard from "../components/widgets/Projects/ProjectCard";
import ProjectsModals from "../components/widgets/Projects/ProjectsModals";
import useProjects from "../hooks/useProjects";
import Pagination from "../components/ui/Pagination";
import { deleteProject } from "../services/projects.service";
import PageHeader from "../components/ui/PageHeader";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("Projects");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const { projects, totalPages, loading, error, loadData } = useProjects(
    currentPage,
    9,
  );

  // حماية لو الصفحة خرجت بره الرينج
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteProject(selectedItem.id);
      setShowDelete(false);
      setSelectedItem(null);
      setDeleteError(false);
      loadData();
    } catch (err) {
      console.error(err);
      setDeleteError(true);
    }
  };

  const handleEditNavigate = (project) => {
    navigate("/edit-project", { state: { item: project } });
  };


  return (
    <ResponsiveLayoutProvider>
      <div
        className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col min-h-[90vh]`}
      >
        {/* Header */}
        <PageHeader
          title={t("pageTitle")}
          addLabel={t("add")}
          onAdd={() => navigate("/add-project")}
          onFilter={() => console.log("Filter clicked")}
          isArabic={isArabic}
        />

        {/* Fetch Error */}
        <div className="items-center justify-center">
          {!loading && error && (
            <div className="text-red-500 text-lg text-center">
              {t("errors.loadFailed")}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-gray-500 text-xl text-center">
              {t("empty")}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {!loading && !error && projects.length && (
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isArabic={isArabic}
                  onDelete={(p) => {
                    setSelectedItem(p);
                    setShowDelete(true);
                    setDeleteError(false);
                  }}
                  onDetails={(p) => {
                    setSelectedItem(p);
                    setShowDetails(true);
                  }}
                  onEditNavigate={handleEditNavigate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          t={t}
          isArabic={isArabic}
        />

        {/* Modals */}
        <ProjectsModals
          showDelete={showDelete}
          showDetails={showDetails}
          selectedItem={selectedItem}
          setShowDelete={setShowDelete}
          setShowDetails={setShowDetails}
          onDelete={handleDelete}
          deleteError={deleteError}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
