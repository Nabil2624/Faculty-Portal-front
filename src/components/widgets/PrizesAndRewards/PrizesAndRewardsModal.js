import ModalWrapper from "../../ui/ModalWrapper";
import PrizeDeleteModal from "./PrizeDeleteModal";
import PrizeDetailsModal from "./PrizesDetailsModal";

export default function PrizesAndRewardsModal({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,
  t, // added
  isArabic, // added
}) {
  return (
    <>
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <PrizeDeleteModal
            item={selectedItem}
            deleteError={deleteError}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
            t={t} // optional: for translated delete labels
            isArabic={isArabic} // optional
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <PrizeDetailsModal
            item={selectedItem}
            onClose={() => setShowDetails(false)}
            t={t}
            isArabic={isArabic}
          />
        </ModalWrapper>
      )}
    </>
  );
}
