import ModalWrapper from "../../ui/ModalWrapper";
import ManifestationDeleteModal from "./ManifestationDeleteModal";
import ManifestationDetailsModal from "./ManifestationDetailsModal";

export default function ManifestationModal({
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
          <ManifestationDeleteModal
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
          <ManifestationDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
