import ModalWrapper from "../../ui/ModalWrapper";
import JobGradeForm from "./JobGradeForm";
import EditJobGrade from "./EditJobGrade";
import JobGradeDeleteModal from "./JobGradeDeleteModal";
import JobGradeDetailsModal from "./JobGradeDetailsModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";
export default function JobGradeModal({
  showAdd,
  showEdit,
  showDelete,
  showDetails,
  selectedItem,
  setShowAdd,
  setShowEdit,
  setShowDelete,
  setShowDetails,
  onSuccessAdd,
  onSuccessEdit,
  onDelete,
  t,
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
      {showAdd && (
        <ModalWrapper onClose={() => setShowAdd(false)}>
          <JobGradeForm
            onCancel={() => setShowAdd(false)}
            onSuccess={onSuccessAdd}
          />
        </ModalWrapper>
      )}

      {showEdit && selectedItem && (
        <ModalWrapper onClose={() => setShowEdit(false)}>
          <EditJobGrade
            data={selectedItem}
            onCancel={() => setShowEdit(false)}
            onSuccess={onSuccessEdit}
          />
        </ModalWrapper>
      )}

      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <JobGradeDeleteModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <JobGradeDetailsModal
            item={selectedItem}
            isArabic={isArabic}
            t={t}
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
