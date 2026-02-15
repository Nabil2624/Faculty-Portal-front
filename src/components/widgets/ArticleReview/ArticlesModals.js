import ModalWrapper from "../../ui/ModalWrapper";
import DeleteArticleModal from "./DeleteArticleModal";
import ArticleDetailsModal from "./ArticleDetailsModal";
import AddArticleForm from "./AddArticleForm";
import EditArticleForm from "./EditArticleForm";

export default function ArticlesModals({
  showAdd,
  showEdit,
  showDelete,
  showDetails,
  selectedItem,
  setShowAdd,
  setShowEdit,
  setShowDelete,
  setShowDetails,
  onDelete,
  onSuccessAdd,
  onSuccessEdit,
  deleteError,
  t,
  isArabic,
}) {
  return (
    <>
      {showAdd && (
        <ModalWrapper onClose={() => setShowAdd(false)}>
          <AddArticleForm
            t={t}
            isArabic={isArabic}
            onSuccess={() => {
              setShowAdd(false);
              onSuccessAdd();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </ModalWrapper>
      )}

      {showEdit && selectedItem && (
        <ModalWrapper onClose={() => setShowEdit(false)}>
          <EditArticleForm
            item={selectedItem}
            t={t}
            isArabic={isArabic}
            onSuccess={() => {
              setShowEdit(false);
              onSuccessEdit();
            }}
            onCancel={() => setShowEdit(false)}
          />
        </ModalWrapper>
      )}

      {showDelete && selectedItem && (
        <ModalWrapper onClose={() => setShowDelete(false)}>
          <DeleteArticleModal
            item={selectedItem}
            t={t}
            onConfirm={onDelete}
            onCancel={() => setShowDelete(false)}
            deleteError={deleteError}
          />
        </ModalWrapper>
      )}

      {showDetails && selectedItem && (
        <ModalWrapper onClose={() => setShowDetails(false)}>
          <ArticleDetailsModal
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
