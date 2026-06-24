import ModalWrapper from "../../ui/ModalWrapper";
import DeleteCommitteeModal from "./DeleteCommitteeModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function CommitteesModals({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
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
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <DeleteCommitteeModal
            item={selectedItem}
            t={t}
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
