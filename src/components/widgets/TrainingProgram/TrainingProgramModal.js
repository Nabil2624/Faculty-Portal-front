import ModalWrapper from "../../ui/ModalWrapper";

import TrainingProgramDeleteModal from "./TrainingProgramDeleteModal";
import TrainingProgramDetailsModal from "./TrainingProgramDetailsModal";

export default function UniversityContributionModal({
  mode,

  showDelete,
  showDetails,
  selectedItem,


  isArabic,


  onDelete,

  deleteError,
  setShowForm,
  setShowDelete,
  setShowDetails,
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


      {/* ================= DELETE MODAL ================= */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <TrainingProgramDeleteModal
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
          <TrainingProgramDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}