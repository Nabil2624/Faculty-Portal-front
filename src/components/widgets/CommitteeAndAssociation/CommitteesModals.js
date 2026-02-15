import ModalWrapper from "../../ui/ModalWrapper";
import DeleteCommitteeModal from "./DeleteCommitteeModal";
import CommitteeDetailsModal from "./CommitteeDetailsModal";

export default function CommitteesModals({
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
          <DeleteCommitteeModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <CommitteeDetailsModal
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
