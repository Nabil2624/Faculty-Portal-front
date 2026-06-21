import ModalWrapper from "../../ui/ModalWrapper";
import DeleteProjectModal from "./DeleteProjectModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function ProjectsModals({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,
  t,
  isArabic,
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
  sortOptions = [],
  currentSort,
  currentFilters,
  handleResetFilters,
}) {
  return (
    <>
      {/* Delete Modal */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <DeleteProjectModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
            deleteError={deleteError}
          />
        </ModalWrapper>
      )}


      {/* ================= FILTER MODAL ================= */}
      {showFilterModal && (
        <ModalWrapper onClose={() => setShowFilterModal(false)}>
          <CustomizeResultsModal
            onClose={() => setShowFilterModal(false)}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            currentSort={currentSort}
            currentFilters={currentFilters}
            filtersConfig={filtersConfig}
            translationNamespace="filter-sort"
            sortOptions={sortOptions}
          />
        </ModalWrapper>
      )}
    </>
  );
}
