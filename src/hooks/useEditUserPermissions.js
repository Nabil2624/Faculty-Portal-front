import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllPermissions,
  grantUserPermissions,
  revokeUserPermissions,
  PERMISSION_TYPES,
} from "../services/users.service";

export default function useEditUserPermissions({
  userId,
  userPermissions = [],
  hideTickets = false,
}) {
  // ── All available permissions from API ──────────────────────────────────────
  const [allPermissions, setAllPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [permsError, setPermsError] = useState(null);

  // ── Local selection state (mirrors what the user currently has + changes) ──
  // We store the IDs of permissions the user currently has as individual perms
  const [grantedIds, setGrantedIds] = useState(
    () => new Set((userPermissions || []).map((p) => p.id)),
  );

  // Sync when the parent passes a fresh userPermissions list
  useEffect(() => {
    setGrantedIds(new Set((userPermissions || []).map((p) => p.id)));
  }, [userPermissions]);

  // ── Search / filter ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // "" = all types

  // ── Action state ─────────────────────────────────────────────────────────────
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // ── Load all available permissions ───────────────────────────────────────────
  const loadPermissions = useCallback(async () => {
    setLoadingPerms(true);
    setPermsError(null);
    try {
      const result = await getAllPermissions({ sort: "TypeASC" });
      setAllPermissions(result.data || []);
    } catch (err) {
      setPermsError(err);
    } finally {
      setLoadingPerms(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // ── Filtered + grouped permissions ───────────────────────────────────────────
  const filteredPermissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPermissions.filter((p) => {
      if (hideTickets && p.type === "Tickets") return false;
      const matchesType = !typeFilter || p.type === typeFilter;
      const matchesSearch =
        !q ||
        p.displayName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [allPermissions, search, typeFilter, hideTickets]);

  const groupedPermissions = useMemo(() => {
    const groups = {};
    PERMISSION_TYPES.forEach((type) => {
      groups[type] = [];
    });
    filteredPermissions.forEach((p) => {
      if (groups[p.type]) {
        groups[p.type].push(p);
      } else {
        // unknown type — put in first bucket
        const first = PERMISSION_TYPES[0];
        if (groups[first]) groups[first].push(p);
      }
    });
    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([, perms]) => perms.length > 0),
    );
  }, [filteredPermissions]);

  // ── Toggle a single permission ────────────────────────────────────────────────
  const togglePermission = useCallback(
    async (permission) => {
      if (!userId || actionLoading) return;
      const isGranted = grantedIds.has(permission.id);

      setActionLoading(true);
      try {
        if (isGranted) {
          await revokeUserPermissions(userId, [permission]);
          setGrantedIds((prev) => {
            const next = new Set(prev);
            next.delete(permission.id);
            return next;
          });
          setToast({ message: "revokeSuccess", type: "success" });
        } else {
          await grantUserPermissions(userId, [permission]);
          setGrantedIds((prev) => new Set([...prev, permission.id]));
          setToast({ message: "grantSuccess", type: "success" });
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 409) {
          setToast({ message: "alreadyHasPermission", type: "error" });
        } else {
          setToast({ message: "grantError", type: "error" });
        }
      } finally {
        setActionLoading(false);
      }
    },
    [userId, grantedIds, actionLoading],
  );

  // ── Toggle all permissions in a group ──────────────────────────────────────
  const toggleGroup = useCallback(
    async (typePerms) => {
      if (!userId || actionLoading || typePerms.length === 0) return;

      const allGranted = typePerms.every((p) => grantedIds.has(p.id));

      setActionLoading(true);
      try {
        if (allGranted) {
          // Revoke all in group
          await revokeUserPermissions(userId, typePerms);
          setGrantedIds((prev) => {
            const next = new Set(prev);
            typePerms.forEach((p) => next.delete(p.id));
            return next;
          });
          setToast({ message: "revokeSuccess", type: "success" });
        } else {
          // Grant the ones not yet granted
          const toGrant = typePerms.filter((p) => !grantedIds.has(p.id));
          await grantUserPermissions(userId, toGrant);
          setGrantedIds(
            (prev) => new Set([...prev, ...toGrant.map((p) => p.id)]),
          );
          setToast({ message: "grantSuccess", type: "success" });
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 409) {
          setToast({ message: "alreadyHasPermission", type: "error" });
        } else {
          setToast({ message: "grantError", type: "error" });
        }
      } finally {
        setActionLoading(false);
      }
    },
    [userId, grantedIds, actionLoading],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  return {
    allPermissions,
    loadingPerms,
    permsError,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    groupedPermissions,
    filteredPermissions,
    grantedIds,
    actionLoading,
    toast,
    dismissToast,
    togglePermission,
    toggleGroup,
    reload: loadPermissions,
  };
}
