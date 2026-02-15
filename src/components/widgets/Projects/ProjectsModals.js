import ModalWrapper from "../../ui/ModalWrapper";
import DeleteProjectModal from "./DeleteProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";

export default function ProjectsModals({
  showDelete,
  showDetails,
  selectedItem,
  setShowDelete,
  setShowDetails,
  onDelete,
  deleteError,
  t,
  isArabic,
}) {
  return (
    <>
      {/* Delete Modal */}
      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <DeleteProjectModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
            deleteError={deleteError}
          />
        </ModalWrapper>
      )}

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <ProjectDetailsModal
            item={selectedItem}
            t={t}
            isArabic={isArabic}
            onClose={() => setShowDetails(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
