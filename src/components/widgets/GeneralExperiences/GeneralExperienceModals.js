import ModalWrapper from "../../ui/ModalWrapper";
import DeleteGeneralExperienceModal from "./DeleteGeneralExperienceModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function GeneralExperienceModals({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,

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
          <DeleteGeneralExperienceModal
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
