import ModalWrapper from "../../ui/ModalWrapper";
import PatentDeleteModal from "./PatentDeleteModal";
import PatentDetailsModal from "./PatentDetailsModal";

export default function PatentModal({
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
      {/* Delete */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <PatentDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {/* Details */}
      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <PatentDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
