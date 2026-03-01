import ModalWrapper from "../../ui/ModalWrapper";
import DeleteGeneralExperienceModal from "./DeleteGeneralExperienceModal";
import GeneralExperienceDetailsModal from "./GeneralExperienceDetailsModal";
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

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <GeneralExperienceDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
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
