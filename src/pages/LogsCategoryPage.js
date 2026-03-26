import { useTranslation } from "react-i18next";
import { Tag, Loader2, AlertCircle } from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useLogsCategories from "../hooks/useLogsCategories";
import LogsCategoryToast from "../components/widgets/Logs/LogsCategoryToast";
import LogsCategoryDeleteModal from "../components/widgets/Logs/LogsCategoryDeleteModal";
import LogsCategoryFormModal from "../components/widgets/Logs/LogsCategoryFormModal";
import LogsActionFormModal from "../components/widgets/Logs/LogsActionFormModal";
import LogsCategoryPanel from "../components/widgets/Logs/LogsCategoryPanel";
import LogsActionPanel from "../components/widgets/Logs/LogsActionPanel";

export default function LogsCategoryPage() {
  const { t, i18n } = useTranslation("LogsCategories");
  const isArabic = i18n.language === "ar";

  const {
    categories,
    actions,
    loadingData,
    loadError,
    loadAll,
    toast,
    setToast,
    categoryModal,
    setCategoryModal,
    actionModal,
    setActionModal,
    deleteModal,
    setDeleteModal,
    saving,
    deleting,
    handleSaveCategory,
    handleDeleteCategory,
    handleSaveAction,
    handleDeleteAction,
    actionCountForCategory,
  } = useLogsCategories();

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {toast && (
          <LogsCategoryToast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
            isArabic={isArabic}
          />
        )}

        {/* Page Title */}
        <div
          className="flex items-center gap-3"
          style={{ marginBottom: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          <div
            className="rounded-xl bg-[#19355a] flex items-center justify-center flex-shrink-0"
            style={{
              width: "clamp(2.4rem, 4vw, 4.5rem)",
              height: "clamp(2.4rem, 4vw, 4.5rem)",
            }}
          >
            <Tag
              className="text-[#b38e19]"
              style={{
                width: "clamp(1.1rem, 1.9vw, 2.2rem)",
                height: "clamp(1.1rem, 1.9vw, 2.2rem)",
              }}
            />
          </div>
          <div>
            <h1
              className="font-bold text-gray-800"
              style={{
                fontSize: "clamp(1.2rem, 2.2vw, 2.8rem)",
                lineHeight: 1.1,
              }}
            >
              {t("title")}
            </h1>
            <p
              className="text-gray-500"
              style={{
                fontSize: "clamp(0.65rem, 0.95vw, 1.05rem)",
                marginTop: "2px",
              }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loadingData && (
          <div className="flex items-center justify-center py-24">
            <Loader2
              className="animate-spin text-[#19355a]"
              style={{
                width: "clamp(2rem, 4vw, 4rem)",
                height: "clamp(2rem, 4vw, 4rem)",
              }}
            />
          </div>
        )}

        {/* Error */}
        {!loadingData && loadError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle
              className="text-red-400"
              style={{
                width: "clamp(2rem, 4vw, 4rem)",
                height: "clamp(2rem, 4vw, 4rem)",
              }}
            />
            <p
              className="text-gray-600 font-medium"
              style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.1rem)" }}
            >
              {t("errors.loadFailed")}
            </p>
            <button
              onClick={loadAll}
              className="mt-2 bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/90 transition"
              style={{
                padding:
                  "clamp(0.4rem, 0.7vw, 0.7rem) clamp(1rem, 1.8vw, 1.8rem)",
                fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Two-panel layout */}
        {!loadingData && !loadError && (
          <div
            className="grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(clamp(280px, 40vw, 600px), 1fr))",
              gap: "clamp(1rem, 2.5vw, 2.5rem)",
              alignItems: "start",
            }}
          >
            <LogsCategoryPanel
              categories={categories}
              onAdd={() => setCategoryModal({ mode: "add", item: null })}
              onEdit={(cat) => setCategoryModal({ mode: "edit", item: cat })}
              onDelete={(cat) =>
                setDeleteModal({ type: "category", item: cat })
              }
              actionCountForCategory={actionCountForCategory}
              t={t}
            />
            <LogsActionPanel
              actions={actions}
              categories={categories}
              onAdd={() => setActionModal({ mode: "add", item: null })}
              onEdit={(action) =>
                setActionModal({ mode: "edit", item: action })
              }
              onDelete={(action) =>
                setDeleteModal({ type: "action", item: action })
              }
              t={t}
            />
          </div>
        )}
      </div>

      {categoryModal && (
        <LogsCategoryFormModal
          initial={categoryModal.item}
          onSave={handleSaveCategory}
          onClose={() => setCategoryModal(null)}
          saving={saving}
          t={t}
          isArabic={isArabic}
        />
      )}

      {actionModal && (
        <LogsActionFormModal
          initial={actionModal.item}
          categories={categories}
          onSave={handleSaveAction}
          onClose={() => setActionModal(null)}
          saving={saving}
          t={t}
          isArabic={isArabic}
        />
      )}

      {deleteModal && (
        <LogsCategoryDeleteModal
          message={
            deleteModal.type === "category"
              ? t("categories.deleteConfirm")
              : t("actions.deleteConfirm")
          }
          onConfirm={
            deleteModal.type === "category"
              ? handleDeleteCategory
              : handleDeleteAction
          }
          onCancel={() => setDeleteModal(null)}
          loading={deleting}
          t={t}
        />
      )}
    </ResponsiveLayoutProvider>
  );
}
