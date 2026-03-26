import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

export default function useLogsCategories() {
  const { t } = useTranslation("LogsCategories");

  const [categories, setCategories] = useState([]);
  const [actions, setActions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  const [categoryModal, setCategoryModal] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const actionCountForCategory = (catId) =>
    actions.filter((a) => a.categoryIds?.includes(catId)).length;

  return {
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
  };
}
