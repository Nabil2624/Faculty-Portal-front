import ModalWrapper from "../../ui/ModalWrapper";
import SeminarDeleteModal from "./SeminarDeleteModal";
import SeminarDetailsModal from "./SeminarDetailsModal";

export default function SeminarModal({
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
          <SeminarDeleteModal
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
          <SeminarDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
