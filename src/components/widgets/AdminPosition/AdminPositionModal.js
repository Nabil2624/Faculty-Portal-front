import ModalWrapper from "../../ui/ModalWrapper";
import AddAdminstrativePosition from "./AddAdministrativePosition"
import AdminPositionDeleteModal from "./AdminPositionDeleteModal";
import AdminPositionDetailsModal from "./AdminPositionDetailsModal";
import EditAdminPosition from "./EditAdminPosition"


export default function AdminPositionModal({
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
          <AddAdminstrativePosition
            onCancel={() => setShowAdd(false)}
            onSuccess={onSuccessAdd}
          />
        </ModalWrapper>
      )}

      {showEdit && selectedItem && (
        <ModalWrapper onClose={() => setShowEdit(false)}>
          <EditAdminPosition
            data={selectedItem}
            onCancel={() => setShowEdit(false)}
            onSuccess={onSuccessEdit}
          />
        </ModalWrapper>
      )}

      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <AdminPositionDeleteModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <AdminPositionDetailsModal
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
