import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Tag,
  Zap,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import {
  getCategories,
  getActions,
  createCategory,
  updateCategory,
  deleteCategory,
  createAction,
  updateAction,
  deleteAction,
} from "../services/logs.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const colors =
    type === "success"
      ? {
          bg: "#f0fdf4",
          border: "#86efac",
          text: "#15803d",
          Icon: CheckCircle2,
        }
      : {
          bg: "#fef2f2",
          border: "#fca5a5",
          text: "#b91c1c",
          Icon: AlertCircle,
        };

  const Icon = colors.Icon;

  return (
    <div
      className="fixed z-[60] flex items-center gap-2 rounded-xl border shadow-lg"
      style={{
        top: "clamp(1rem, 2vw, 1.5rem)",
        right: "clamp(1rem, 2vw, 1.5rem)",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        padding: "clamp(0.6rem, 1vw, 0.9rem) clamp(0.8rem, 1.5vw, 1.2rem)",
        fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
        maxWidth: "clamp(14rem, 28vw, 28rem)",
      }}
    >
      <Icon
        style={{
          width: "clamp(0.9rem, 1.2vw, 1.2rem)",
          height: "clamp(0.9rem, 1.2vw, 1.2rem)",
          flexShrink: 0,
        }}
      />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition"
      >
        <X
          style={{
            width: "clamp(0.75rem, 1vw, 1rem)",
            height: "clamp(0.75rem, 1vw, 1rem)",
          }}
        />
      </button>
    </div>
  );
}

// Confirm delete modal
function DeleteModal({ message, onConfirm, onCancel, loading, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          width: "clamp(280px, 30vw, 440px)",
          padding: "clamp(1.2rem, 2.5vw, 2rem)",
          gap: "clamp(0.9rem, 1.5vw, 1.4rem)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
            style={{
              width: "clamp(2.2rem, 3vw, 3rem)",
              height: "clamp(2.2rem, 3vw, 3rem)",
            }}
          >
            <Trash2
              className="text-red-600"
              style={{
                width: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
              }}
            />
          </div>
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
          >
            {message}
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium flex items-center gap-1"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {loading && (
              <Loader2
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 0.9vw, 1rem)",
                  height: "clamp(0.7rem, 0.9vw, 1rem)",
                }}
              />
            )}
            {loading ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Multi-select checkboxes for categories
function CategoryMultiSelect({ categories, selected, onToggle, t }) {
  const [open, setOpen] = useState(false);
  const selectedNames = categories
    .filter((c) => selected.includes(c.id))
    .map((c) => c.categoryName);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-gray-300 bg-white flex items-center justify-between text-left hover:border-[#b38e19] transition"
        style={{
          padding: "clamp(0.45rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
          fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
        }}
      >
        <span
          className={
            selectedNames.length === 0 ? "text-gray-400" : "text-gray-700"
          }
        >
          {selectedNames.length === 0
            ? t("actions.categoriesPlaceholder")
            : selectedNames.join(", ")}
        </span>
        <ChevronDown
          className="text-gray-400 flex-shrink-0 transition-transform"
          style={{
            width: "clamp(0.8rem, 1.1vw, 1.2rem)",
            height: "clamp(0.8rem, 1.1vw, 1.2rem)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div
          className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto"
          style={{
            top: "calc(100% + 4px)",
            maxHeight: "clamp(10rem, 18vw, 18rem)",
          }}
        >
          {categories.length === 0 ? (
            <p
              className="text-gray-400 text-center py-4"
              style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
            >
              {t("categories.empty")}
            </p>
          ) : (
            categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
                  style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(cat.id)}
                    className="rounded accent-[#b38e19]"
                  />
                  <span className="text-gray-700">{cat.categoryName}</span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── Category Form Modal ──────────────────────────────────────────────────────

function CategoryFormModal({ initial, onSave, onClose, saving, t, isArabic }) {
  const [name, setName] = useState(initial?.categoryName ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t("errors.nameRequired"));
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          width: "clamp(300px, 32vw, 480px)",
          padding: "clamp(1.2rem, 2.5vw, 2rem)",
          gap: "clamp(0.9rem, 1.5vw, 1.4rem)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="font-semibold text-[#19355a]"
            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.35rem)" }}
          >
            {initial ? t("categories.edit") : t("categories.add")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X
              style={{
                width: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
              }}
            />
          </button>
        </div>

        {/* Field */}
        <div>
          <label
            className="block font-medium text-gray-600"
            style={{
              fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
              marginBottom: "0.35rem",
            }}
          >
            {t("categories.name")}
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder={t("categories.namePlaceholder")}
            className="w-full rounded-xl border outline-none transition"
            style={{
              padding: "clamp(0.45rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
              borderColor: error ? "#ef4444" : "#d1d5db",
              boxShadow: "none",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = error ? "#ef4444" : "#b38e19")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = error ? "#ef4444" : "#d1d5db")
            }
          />
          {error && (
            <p
              className="text-red-500 mt-1"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.82rem)" }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-[#19355a] text-white hover:bg-[#19355a]/90 transition flex items-center gap-1"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {saving && (
              <Loader2
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 0.9vw, 1rem)",
                  height: "clamp(0.7rem, 0.9vw, 1rem)",
                }}
              />
            )}
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action Form Modal ────────────────────────────────────────────────────────

function ActionFormModal({
  initial,
  categories,
  onSave,
  onClose,
  saving,
  t,
  isArabic,
}) {
  const [name, setName] = useState(initial?.actionName ?? "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    initial?.categoryIds ?? [],
  );
  const [nameError, setNameError] = useState("");
  const [catError, setCatError] = useState("");

  const handleToggle = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setCatError("");
  };

  const handleSubmit = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError(t("errors.nameRequired"));
      valid = false;
    }
    if (selectedCategoryIds.length === 0) {
      setCatError(t("errors.categoryRequired"));
      valid = false;
    }
    if (!valid) return;
    onSave(name.trim(), selectedCategoryIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          width: "clamp(320px, 36vw, 520px)",
          padding: "clamp(1.2rem, 2.5vw, 2rem)",
          gap: "clamp(0.9rem, 1.5vw, 1.4rem)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="font-semibold text-[#19355a]"
            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.35rem)" }}
          >
            {initial ? t("actions.edit") : t("actions.add")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X
              style={{
                width: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
              }}
            />
          </button>
        </div>

        {/* Action Name field */}
        <div>
          <label
            className="block font-medium text-gray-600"
            style={{
              fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
              marginBottom: "0.35rem",
            }}
          >
            {t("actions.name")}
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            placeholder={t("actions.namePlaceholder")}
            className="w-full rounded-xl border outline-none transition"
            style={{
              padding: "clamp(0.45rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
              borderColor: nameError ? "#ef4444" : "#d1d5db",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = nameError ? "#ef4444" : "#b38e19")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = nameError ? "#ef4444" : "#d1d5db")
            }
          />
          {nameError && (
            <p
              className="text-red-500 mt-1"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.82rem)" }}
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Categories multi-select */}
        <div>
          <label
            className="block font-medium text-gray-600"
            style={{
              fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
              marginBottom: "0.35rem",
            }}
          >
            {t("actions.categories")}
          </label>
          <CategoryMultiSelect
            categories={categories}
            selected={selectedCategoryIds}
            onToggle={handleToggle}
            t={t}
          />
          {catError && (
            <p
              className="text-red-500 mt-1"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.82rem)" }}
            >
              {catError}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-[#19355a] text-white hover:bg-[#19355a]/90 transition flex items-center gap-1"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {saving && (
              <Loader2
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 0.9vw, 1rem)",
                  height: "clamp(0.7rem, 0.9vw, 1rem)",
                }}
              />
            )}
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LogsCategoryPage() {
  const { t, i18n } = useTranslation("LogsCategories");
  const isArabic = i18n.language === "ar";

  // ── Data ─────────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [actions, setActions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // ── Toast ─────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [categoryModal, setCategoryModal] = useState(null); // null | { mode: 'add'|'edit', item }
  const [actionModal, setActionModal] = useState(null); // null | { mode: 'add'|'edit', item }
  const [deleteModal, setDeleteModal] = useState(null); // null | { type: 'category'|'action', item }
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoadingData(true);
    setLoadError(false);
    try {
      const [cats, acts] = await Promise.all([getCategories(), getActions()]);
      setCategories(cats);
      setActions(acts);
    } catch {
      setLoadError(true);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Category handlers ─────────────────────────────────────────────────────────
  const handleSaveCategory = async (name) => {
    setSaving(true);
    try {
      if (categoryModal.mode === "add") {
        await createCategory(name);
        showToast(t("success.created"));
      } else {
        await updateCategory(categoryModal.item.id, name);
        showToast(t("success.updated"));
      }
      setCategoryModal(null);
      loadAll();
    } catch {
      showToast(t("errors.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      await deleteCategory(deleteModal.item.id);
      showToast(t("success.deleted"));
      setDeleteModal(null);
      loadAll();
    } catch {
      showToast(t("errors.deleteFailed"), "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Action handlers ───────────────────────────────────────────────────────────
  const handleSaveAction = async (name, categoryIds) => {
    setSaving(true);
    try {
      if (actionModal.mode === "add") {
        await createAction(name, categoryIds);
        showToast(t("success.created"));
      } else {
        await updateAction(actionModal.item.id, name, categoryIds);
        showToast(t("success.updated"));
      }
      setActionModal(null);
      loadAll();
    } catch {
      showToast(t("errors.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAction = async () => {
    setDeleting(true);
    try {
      await deleteAction(deleteModal.item.id);
      showToast(t("success.deleted"));
      setDeleteModal(null);
      loadAll();
    } catch {
      showToast(t("errors.deleteFailed"), "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Row component helpers ─────────────────────────────────────────────────────
  const actionCountForCategory = (catId) =>
    actions.filter((a) => a.categoryIds?.includes(catId)).length;

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(0.75rem, 2vw, 2.5rem)" }}
      >
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
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

        {/* Loading / Error */}
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
            {/* ═══════════════════════════════════════════════════════ */}
            {/* Categories Panel */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border border-[#19355a]/20 bg-white shadow-sm overflow-hidden">
              {/* Panel header */}
              <div
                className="bg-[#19355a] flex items-center justify-between"
                style={{
                  padding:
                    "clamp(0.7rem, 1.3vw, 1.3rem) clamp(0.9rem, 1.6vw, 1.6rem)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Tag
                    className="text-[#b38e19]"
                    style={{
                      width: "clamp(0.9rem, 1.3vw, 1.4rem)",
                      height: "clamp(0.9rem, 1.3vw, 1.4rem)",
                    }}
                  />
                  <h2
                    className="font-semibold text-white"
                    style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.25rem)" }}
                  >
                    {t("categories.title")}
                  </h2>
                  <span
                    className="bg-white/20 text-white rounded-full font-medium"
                    style={{
                      padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                      fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                    }}
                  >
                    {categories.length}
                  </span>
                </div>
                <button
                  onClick={() => setCategoryModal({ mode: "add", item: null })}
                  className="flex items-center gap-1 bg-[#b38e19] hover:bg-[#b38e19]/90 text-white rounded-lg transition font-medium"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.55vw, 0.55rem) clamp(0.65rem, 1.1vw, 1.1rem)",
                    fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                  }}
                >
                  <Plus
                    style={{
                      width: "clamp(0.7rem, 1vw, 1rem)",
                      height: "clamp(0.7rem, 1vw, 1rem)",
                    }}
                  />
                  {t("categories.add")}
                </button>
              </div>

              {/* Categories list */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "clamp(20rem, 50vw, 55rem)" }}
              >
                {categories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Tag
                      style={{
                        width: "clamp(2rem, 3vw, 3.5rem)",
                        height: "clamp(2rem, 3vw, 3.5rem)",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <p style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}>
                      {t("categories.empty")}
                    </p>
                  </div>
                ) : (
                  categories.map((cat, idx) => {
                    const count = actionCountForCategory(cat.id);
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between group transition-colors hover:bg-[#b38e19]/5"
                        style={{
                          padding:
                            "clamp(0.6rem, 1vw, 1rem) clamp(0.9rem, 1.6vw, 1.6rem)",
                          borderBottom:
                            idx < categories.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="rounded-lg bg-[#19355a]/8 flex items-center justify-center flex-shrink-0"
                            style={{
                              width: "clamp(1.8rem, 2.5vw, 2.8rem)",
                              height: "clamp(1.8rem, 2.5vw, 2.8rem)",
                              backgroundColor: "rgba(25,53,90,0.08)",
                            }}
                          >
                            <Tag
                              className="text-[#19355a]"
                              style={{
                                width: "clamp(0.7rem, 1vw, 1.1rem)",
                                height: "clamp(0.7rem, 1vw, 1.1rem)",
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-gray-800 truncate"
                              style={{
                                fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                              }}
                            >
                              {cat.categoryName}
                            </p>
                            <p
                              className="text-gray-400"
                              style={{
                                fontSize: "clamp(0.55rem, 0.78vw, 0.82rem)",
                              }}
                            >
                              {count} {t("categories.actionsCount")}
                            </p>
                          </div>
                        </div>

                        {/* Row actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setCategoryModal({ mode: "edit", item: cat })
                            }
                            className="rounded-lg p-1 text-gray-400 hover:text-[#19355a] hover:bg-[#19355a]/10 transition"
                            title={t("categories.edit")}
                          >
                            <Pencil
                              style={{
                                width: "clamp(0.75rem, 1vw, 1.1rem)",
                                height: "clamp(0.75rem, 1vw, 1.1rem)",
                              }}
                            />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ type: "category", item: cat })
                            }
                            className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title={t("categories.delete")}
                          >
                            <Trash2
                              style={{
                                width: "clamp(0.75rem, 1vw, 1.1rem)",
                                height: "clamp(0.75rem, 1vw, 1.1rem)",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* Actions Panel */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border border-[#19355a]/20 bg-white shadow-sm overflow-hidden">
              {/* Panel header */}
              <div
                className="bg-[#19355a] flex items-center justify-between"
                style={{
                  padding:
                    "clamp(0.7rem, 1.3vw, 1.3rem) clamp(0.9rem, 1.6vw, 1.6rem)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap
                    className="text-[#b38e19]"
                    style={{
                      width: "clamp(0.9rem, 1.3vw, 1.4rem)",
                      height: "clamp(0.9rem, 1.3vw, 1.4rem)",
                    }}
                  />
                  <h2
                    className="font-semibold text-white"
                    style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.25rem)" }}
                  >
                    {t("actions.title")}
                  </h2>
                  <span
                    className="bg-white/20 text-white rounded-full font-medium"
                    style={{
                      padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
                      fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                    }}
                  >
                    {actions.length}
                  </span>
                </div>
                <button
                  onClick={() => setActionModal({ mode: "add", item: null })}
                  className="flex items-center gap-1 bg-[#b38e19] hover:bg-[#b38e19]/90 text-white rounded-lg transition font-medium"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.55vw, 0.55rem) clamp(0.65rem, 1.1vw, 1.1rem)",
                    fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                  }}
                >
                  <Plus
                    style={{
                      width: "clamp(0.7rem, 1vw, 1rem)",
                      height: "clamp(0.7rem, 1vw, 1rem)",
                    }}
                  />
                  {t("actions.add")}
                </button>
              </div>

              {/* Actions list */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "clamp(20rem, 50vw, 55rem)" }}
              >
                {actions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Zap
                      style={{
                        width: "clamp(2rem, 3vw, 3.5rem)",
                        height: "clamp(2rem, 3vw, 3.5rem)",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <p style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}>
                      {t("actions.empty")}
                    </p>
                  </div>
                ) : (
                  actions.map((action, idx) => {
                    const linkedCategoryNames =
                      action.categoryNames ??
                      categories
                        .filter((c) => action.categoryIds?.includes(c.id))
                        .map((c) => c.categoryName);
                    return (
                      <div
                        key={action.id}
                        className="flex items-center justify-between group transition-colors hover:bg-[#b38e19]/5"
                        style={{
                          padding:
                            "clamp(0.6rem, 1vw, 1rem) clamp(0.9rem, 1.6vw, 1.6rem)",
                          borderBottom:
                            idx < actions.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                        }}
                      >
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <div
                            className="rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              width: "clamp(1.8rem, 2.5vw, 2.8rem)",
                              height: "clamp(1.8rem, 2.5vw, 2.8rem)",
                              backgroundColor: "rgba(179,142,25,0.1)",
                            }}
                          >
                            <Zap
                              className="text-[#b38e19]"
                              style={{
                                width: "clamp(0.7rem, 1vw, 1.1rem)",
                                height: "clamp(0.7rem, 1vw, 1.1rem)",
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="font-medium text-gray-800"
                              style={{
                                fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                              }}
                            >
                              {action.actionName}
                            </p>
                            {/* Category chips */}
                            {linkedCategoryNames.length > 0 && (
                              <div
                                className="flex flex-wrap"
                                style={{
                                  gap: "clamp(0.2rem, 0.4vw, 0.4rem)",
                                  marginTop: "clamp(0.2rem, 0.4vw, 0.4rem)",
                                }}
                              >
                                {linkedCategoryNames.map((name) => (
                                  <span
                                    key={name}
                                    className="inline-flex items-center rounded-full font-medium"
                                    style={{
                                      backgroundColor: "rgba(25,53,90,0.08)",
                                      color: "#19355a",
                                      padding:
                                        "1px clamp(0.3rem, 0.5vw, 0.5rem)",
                                      fontSize: "clamp(0.5rem, 0.7vw, 0.75rem)",
                                    }}
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Row actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() =>
                              setActionModal({ mode: "edit", item: action })
                            }
                            className="rounded-lg p-1 text-gray-400 hover:text-[#19355a] hover:bg-[#19355a]/10 transition"
                            title={t("actions.edit")}
                          >
                            <Pencil
                              style={{
                                width: "clamp(0.75rem, 1vw, 1.1rem)",
                                height: "clamp(0.75rem, 1vw, 1.1rem)",
                              }}
                            />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ type: "action", item: action })
                            }
                            className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title={t("actions.delete")}
                          >
                            <Trash2
                              style={{
                                width: "clamp(0.75rem, 1vw, 1.1rem)",
                                height: "clamp(0.75rem, 1vw, 1.1rem)",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}

      {categoryModal && (
        <CategoryFormModal
          initial={categoryModal.item}
          onSave={handleSaveCategory}
          onClose={() => setCategoryModal(null)}
          saving={saving}
          t={t}
          isArabic={isArabic}
        />
      )}

      {actionModal && (
        <ActionFormModal
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
        <DeleteModal
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
