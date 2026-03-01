import ModalWrapper from "../../ui/ModalWrapper";
import ParticipationInQualityWorkDeleteModal from "./ParticipationInQualityWorkDeleteModal";
import ParticipationInQualityWorkDetailsModal from "./ParticipationInQualityWorkDetailsModal";
import ParticipationInQualityWorkForm from "./ParticipationInQualityWorkForm";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";

export default function ParticipationInQualityWorkModal({
  mode,
  showForm,
  showDelete,
  showDetails,
  selectedItem,

  formData,
  errors = {},
  types = [],
  loadingTypes,
  loading,
  isArabic,

  currentSort,
  handleResetFilters,
  sortOptions = [],
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
  currentFilters,

  handleChange,
  submitForm,
  onDelete,

  deleteError,
  setShowForm,
  setShowDelete,
  setShowDetails,
}) {
  const formTitle =
    mode === "add"
      ? isArabic
        ? "إضافة مشاركة في اعمال الجودة"
        : "Add Participation In Quality Work"
      : isArabic
        ? "تعديل مشاركة في اعمال الجودة"
        : "Edit Participation In Quality Work";

  return (
    <>
      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <ModalWrapper onClose={() => setShowForm(false)}>
          <ParticipationInQualityWorkForm
            title={formTitle}
            types={types}
            loadingTypes={loadingTypes}
            isArabic={isArabic}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            submitForm={submitForm}
            loading={loading}
          />
        </ModalWrapper>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <ParticipationInQualityWorkDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={() => onDelete(selectedItem.id)}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <ParticipationInQualityWorkDetailsModal
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
