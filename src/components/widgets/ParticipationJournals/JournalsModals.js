import ModalWrapper from "../../ui/ModalWrapper";
import AddJournalForm from "../ParticipationJournals/AddJournalForm";
import EditJournalForm from "./EditJournalForm";
import DeleteJournalModal from "./DeleteJournalModal";
import JournalDetailsModal from "./JournalDetailsModal";

export default function JournalsModals({
  showAdd,
  showEdit,
  showDelete,
  showDetails,
  selectedItem,
  setShowAdd,
  setShowEdit,
  setShowDelete,
  setShowDetails,
  onSuccessAdd,
  onSuccessEdit,
  onDelete,
  t,
  isArabic,
}) {
  return (
    <>
      {showAdd && (
        <ModalWrapper onClose={() => setShowAdd(false)}>
          <AddJournalForm
            onCancel={() => setShowAdd(false)}
            onSuccess={onSuccessAdd}
          />
        </ModalWrapper>
      )}

      {showEdit && selectedItem && (
        <ModalWrapper onClose={() => setShowEdit(false)}>
          <EditJournalForm
            data={selectedItem}
            onCancel={() => setShowEdit(false)}
            onSuccess={onSuccessEdit}
          />
        </ModalWrapper>
      )}

      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <DeleteJournalModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <JournalDetailsModal
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
