import ModalWrapper from "../../ui/ModalWrapper";
import PatentDeleteModal from "./PatentDeleteModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function PatentModal({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,

  handleResetFilters,
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
  sortOptions = [],
  currentSort,
  currentFilters,
}) {
  return (
    <>
      {/* Delete */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <PatentDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={onDelete}
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
