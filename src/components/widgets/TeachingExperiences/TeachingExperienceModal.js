import ModalWrapper from "../../ui/ModalWrapper";
import TeachingExperienceDeleteModal from "./TeachingExperienceDeleteModal";
import TeachingExperienceDetailsModal from "./TeachingExperienceDetailsModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";

export default function TeachingExperienceModal({
  showDelete,
  showDetails,
  showCustomize, // 👈 جديد
  selectedItem,
  setShowDelete,
  setShowDetails,
  setShowCustomize, // 👈 جديد
  onDelete,
  onApplyFilters, // 👈 جديد
  deleteError,
  isArabic,
  currentSort,
  handleResetFilters,
  sortOptions = [],
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
  currentFilters,
}) {
  return (
    <>
      {/* Delete Modal */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <TeachingExperienceDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <TeachingExperienceDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}

      {/* Customize Results Modal */}
      {showCustomize && (
        <ModalWrapper onClose={() => setShowCustomize(false)}>
          <CustomizeResultsModal
            onClose={() => setShowCustomize(false)}
            onApply={onApplyFilters}
          />
        </ModalWrapper>
      )}
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
