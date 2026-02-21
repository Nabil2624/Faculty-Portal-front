import ModalWrapper from "../../ui/ModalWrapper";
import UniversityContributionForm from "./UniversityContributionForm";
import UniversityContributionDeleteModal from "./UniversityContributionDeleteModal";
import UniversityContributionDetailsModal from "./UniversityContributionDetailsModal";
import CustomizeResultsModal from "../../ui/CustomizeResultsPopup";

export default function UniversityContributionModal({
  mode,
  showForm,
  showDelete,
  showDetails,
  selectedItem,
  currentSort,
  currentFilters,
  handleResetFilters,
  formData,
  errors,
  types = [],
  loadingTypes,
  loading,
  isArabic,

  handleChange,
  submitForm,
  onDelete,

  deleteError,
  setShowForm,
  setShowDelete,
  setShowDetails,

  // Props جديدة للفلتر
  showFilterModal,
  setShowFilterModal,
  filtersConfig = [],
  handleApplyFilters,
}) {
  const formTitle =
    mode === "add"
      ? isArabic
        ? "إضافة مساهمة جامعية"
        : "Add University Contribution"
      : isArabic
        ? "تعديل المساهمة الجامعية"
        : "Edit University Contribution";

  return (
    <>
      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <ModalWrapper onClose={() => setShowForm(false)}>
          <UniversityContributionForm
            key={mode} // مهم للـReact unmount/mount عند تغير الوضع
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
          <UniversityContributionDeleteModal
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
          <UniversityContributionDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}

      {/* ================= FILTER MODAL ================= */}
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
            translationNamespace="university-contribution"
          />
        </ModalWrapper>
      )}
    </>
  );
}
