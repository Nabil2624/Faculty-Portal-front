import ModalWrapper from "../../ui/ModalWrapper";
import AcademicQualificationDeleteModal from "./AcademicQualificationDeleteModal";
import AcademicQualificationDetailsModal from "./AcademicQualificationDetailsModal";

export default function AcademicQualificationModal({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  t,
  isArabic,
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
    </>
  );
}
