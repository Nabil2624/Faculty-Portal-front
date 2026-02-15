import ModalWrapper from "../../ui/ModalWrapper";
import UniversityContributionForm from "./UniversityContributionForm";
import UniversityContributionDeleteModal from "./UniversityContributionDeleteModal";
import UniversityContributionDetailsModal from "./UniversityContributionDetailsModal";

export default function UniversityContributionModal({
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
        ? "إضافة مساهمة جديدة"
        : "Add New Contribution"
      : isArabic
      ? "تعديل المساهمة"
      : "Edit Contribution";

  return (
    <>
      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <ModalWrapper onClose={() => setShowForm(false)}>
          <UniversityContributionForm
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
    </>
  );
}
