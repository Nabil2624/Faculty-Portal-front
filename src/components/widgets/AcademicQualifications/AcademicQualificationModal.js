import ModalWrapper from "../../ui/ModalWrapper";
import AcademicQualificationDeleteModal from "./AcademicQualificationDeleteModal";
import AcademicQualificationDetailsModal from "./AcademicQualificationDetailsModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function AcademicQualificationModal({
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
          <AcademicQualificationDeleteModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <AcademicQualificationDetailsModal
            item={selectedItem}
            isArabic={isArabic}
            t={t}
            onClose={() => setShowDetails(false)}
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
