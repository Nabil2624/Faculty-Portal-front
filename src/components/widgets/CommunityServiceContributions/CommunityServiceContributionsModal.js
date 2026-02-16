import ModalWrapper from "../../ui/ModalWrapper";
import CommunityServiceContributionsDeleleModal from "./CommunityServiceContributionsDeleleModal";
import CommunityServiceContributionsDetailsModal from "./CommunityServiceContributionsDetailsModal";
import CommunityServiceContributionsForm from "./CommunityServiceContributionsForm";

export default function CommunityServiceContributionsModal({
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
        ? "إضافة مساهمة لخدمة المجتمع"
        : "Add Community Service Contribution"
      : isArabic
        ? "تعديل مساهمة لخدمة المجتمع"
        : "Edit Community Service Contribution";

  return (
    <>
      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <ModalWrapper onClose={() => setShowForm(false)}>
          <CommunityServiceContributionsForm
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
          <CommunityServiceContributionsDeleleModal
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
          <CommunityServiceContributionsDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
