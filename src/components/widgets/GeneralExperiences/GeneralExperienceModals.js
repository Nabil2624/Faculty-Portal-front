import ModalWrapper from "../../ui/ModalWrapper";
import DeleteGeneralExperienceModal from "./DeleteGeneralExperienceModal";
import GeneralExperienceDetailsModal from "./GeneralExperienceDetailsModal";

export default function GeneralExperienceModals({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,
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
    </>
  );
}
