import ModalWrapper from "../../ui/ModalWrapper";
import ScientificWritingDeleteModal from "./ScientificWritingDeleteModal";
import ScientificWritingDetailsModal from "./ScientificWritingDetailsModal";

export default function ScientificWritingModal({
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
          <ScientificWritingDeleteModal
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
          <ScientificWritingDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
