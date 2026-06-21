import ModalWrapper from "../../ui/ModalWrapper";
import ScientificWritingDeleteModal from "./ScientificWritingDeleteModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function ScientificWritingModal({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,
  isArabic,

  sortOptions = [],
  currentSort,
  currentFilters,
  handleResetFilters,
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
}) {
  return (
    <>
      {/* Delete Modal */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <ScientificWritingDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
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
