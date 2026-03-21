import { useState, useEffect, useCallback, useRef } from "react";
import {
  getUsers,
  getCurrentUserPermissions,
  updateUser,
} from "../services/users.service";

const PAGE_SIZE = 10;

export default function useUsers() {
  // ─── User list ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [roleCounts, setRoleCounts] = useState({
    FacultyMember: 0,
    ManagementAdmin: 0,
    SupportAdmin: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Filters / sorting / pagination ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(0); // 0-based, matches API

  // ─── Selected user for permissions panel ──────────────────────────────────
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ─── Admin own permissions (loaded once at mount) ─────────────────────────
  const [adminPermissions, setAdminPermissions] = useState(null);

  // ─── Permission selector modal ────────────────────────────────────────────
  const [permSelectorOpen, setPermSelectorOpen] = useState(false);
  const [permSelectorTarget, setPermSelectorTarget] = useState(null);

  // ─── Edit modal ───────────────────────────────────────────────────────────
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // ─── Load admin permissions once ─────────────────────────────────────────
  useEffect(() => {
    getCurrentUserPermissions()
      .then(setAdminPermissions)
      .catch(() => setAdminPermissions([]));
  }, []);

  // ─── Load users (server-side filter / sort / page) ───────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = roleFilter ? [roleFilter] : [];
      const result = await getUsers({
        sort,
        search,
        roles,
        pageIndex: page,
        pageSize: PAGE_SIZE,
      });
      setUsers(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [sort, search, roleFilter, page]);

  // ─── Load per-role counts for summary widgets ─────────────────────────────
  const loadRoleCounts = useCallback(async () => {
    try {
      // Fetch all users without a role filter and count locally.
      // The backend role filter is unreliable for names that contain spaces
      // (e.g. "Faculty Member" vs "FacultyMember"), so we count from data.
      const res = await getUsers({ pageSize: 500 });
      const counts = { FacultyMember: 0, ManagementAdmin: 0, SupportAdmin: 0 };
      res.data.forEach((u) => {
        const role = u.role?.name;
        if (role && Object.prototype.hasOwnProperty.call(counts, role)) {
          counts[role]++;
        }
      });
      setRoleCounts(counts);
    } catch {
      // non-critical — widgets show 0 on failure
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadRoleCounts();
  }, [loadRoleCounts]);

  // Reset to page 0 when search / filter / sort changes
  const filtersInitialized = useRef(false);
  useEffect(() => {
    if (!filtersInitialized.current) {
      filtersInitialized.current = true;
      return;
    }
    setPage(0);
  }, [search, roleFilter, sort]);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ─── Edit flow: show permission-based selector modal ─────────────────────
  const openEditFlow = useCallback((user) => {
    setPermSelectorTarget(user);
    setPermSelectorOpen(true);
  }, []);

  const closePermSelector = useCallback(() => {
    setPermSelectorOpen(false);
    setPermSelectorTarget(null);
  }, []);

  // ─── Edit modal ───────────────────────────────────────────────────────────
  const openEditModal = useCallback((user) => {
    setEditTarget(user);
    setEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditTarget(null);
  }, []);

  const saveUser = useCallback(
    async ({ email, username, nationalNumber, password }) => {
      if (!editTarget) return;
      setSaving(true);
      try {
        const updated = await updateUser(editTarget.id, {
          email,
          username,
          nationalNumber,
          password,
        });
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== editTarget.id) return u;
            return updated ?? { ...u, email, username: username };
          }),
        );
        closeEditModal();
        closePermSelector();
        showToast("updateSuccess", "success");
      } catch {
        showToast("updateError", "error");
      } finally {
        setSaving(false);
      }
    },
    [editTarget, closeEditModal, closePermSelector, showToast],
  );

  // ─── Remove individual permission ─────────────────────────────────────────
  const removePermission = useCallback(
    async (userId, permissionId) => {
      setActionLoading(true);
      try {
        // TODO: call real API endpoint when documented
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u;
            const newPerms = u.permissions.filter((p) => p.id !== permissionId);
            return { ...u, permissions: newPerms, extraPermissions: newPerms };
          }),
        );
        showToast("removePermissionSuccess", "success");
      } catch {
        showToast("removePermissionError", "error");
      } finally {
        setActionLoading(false);
      }
    },
    [showToast],
  );

  return {
    // Data
    users,
    totalCount,
    roleCounts,
    selectedUser,
    // Loading / saving
    loading,
    saving,
    actionLoading,
    // Error / toast
    error,
    toast,
    dismissToast,
    // Filters
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sort,
    setSort,
    // Pagination
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    // User selection
    selectedUserId,
    setSelectedUserId,
    // Admin permissions
    adminPermissions,
    // Permission selector modal
    permSelectorOpen,
    permSelectorTarget,
    openEditFlow,
    closePermSelector,
    // Edit modal
    editModalOpen,
    editTarget,
    openEditModal,
    closeEditModal,
    saveUser,
    // Permissions
    removePermission,
    // Reload
    reload: loadUsers,
  };
}
