import ModalWrapper from "../../ui/ModalWrapper";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
import TrainingProgramDeleteModal from "./TrainingProgramDeleteModal";

export default function UniversityContributionModal({
  mode,

  showDelete,
  showDetails,
  selectedItem,

  isArabic,

  onDelete,

  deleteError,
  setShowForm,
  setShowDelete,
  setShowDetails,

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
      {/* ================= DELETE MODAL ================= */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <TrainingProgramDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={() => onDelete(selectedItem.id)}
            onCancel={() => setShowDelete(false)}
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
