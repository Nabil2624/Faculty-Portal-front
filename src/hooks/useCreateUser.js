import { useState, useEffect, useCallback } from "react";
import {
  getAllPermissions,
  createUser,
  PERMISSION_TYPES,
} from "../services/users.service";

// ─── Available roles ──────────────────────────────────────────────────────────
export const CREATE_USER_ROLES = [
  { value: "Faculty Member", key: "FacultyMember" },
  { value: "ManagementAdmin", key: "ManagementAdmin" },
  { value: "SupportAdmin", key: "SupportAdmin" },
];

const INITIAL_FORM = {
  userName: "",
  email: "",
  nationalNumber: "",
  password: "",
  confirmPassword: "",
  roles: [], // array of role value strings
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useCreateUser() {
  // ─── Form state ────────────────────────────────────────────────────────────
  const [form, setFormState] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ─── Permissions ───────────────────────────────────────────────────────────
  const [allPermissions, setAllPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(new Set());

  // ─── Permissions search / filter ───────────────────────────────────────────
  const [permSearch, setPermSearch] = useState("");
  const [permTypeFilter, setPermTypeFilter] = useState("");

  // ─── Submission ────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  // ─── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((messageKey, type = "success") => {
    setToast({ messageKey, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Load all permissions ──────────────────────────────────────────────────
  const loadPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionsError(null);
    try {
      const result = await getAllPermissions({});
      setAllPermissions(result.data);
    } catch (err) {
      setPermissionsError(err?.message || "Failed to load permissions.");
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // ─── Clear permissions when only Faculty Member role is selected ─────────────
  const hasAdminRole = form.roles.some(
    (r) => r === "ManagementAdmin" || r === "SupportAdmin",
  );
  useEffect(() => {
    if (!hasAdminRole) {
      setSelectedPermissionIds(new Set());
    }
  }, [hasAdminRole]);

  // ─── Field setter ──────────────────────────────────────────────────────────
  const setField = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  // ─── Toggle a role in/out of the roles array ───────────────────────────────
  const toggleRole = useCallback((roleValue) => {
    setFormState((prev) => {
      const already = prev.roles.includes(roleValue);
      const next = already
        ? prev.roles.filter((r) => r !== roleValue)
        : [...prev.roles, roleValue];
      return { ...prev, roles: next };
    });
    setFormErrors((prev) => ({ ...prev, roles: undefined }));
  }, []);

  // ─── Toggle single permission ──────────────────────────────────────────────
  const togglePermission = useCallback((id) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ─── Toggle all permissions in a type group ────────────────────────────────
  const toggleTypeGroup = useCallback((permsInGroup) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      const allSelected = permsInGroup.every((p) => prev.has(p.id));
      permsInGroup.forEach((p) => {
        if (allSelected) next.delete(p.id);
        else next.add(p.id);
      });
      return next;
    });
  }, []);

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = (f) => {
    const errors = {};
    if (!f.userName.trim()) errors.userName = "userNameRequired";
    else if (/\s/.test(f.userName)) errors.userName = "userNameNoSpaces";
    if (!f.email.trim()) errors.email = "emailRequired";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      errors.email = "emailInvalid";
    if (!f.nationalNumber.trim())
      errors.nationalNumber = "nationalNumberRequired";
    if (!f.password.trim()) errors.password = "passwordRequired";
    else if (f.password.length < 8) errors.password = "passwordTooShort";
    else if (!/[A-Z]/.test(f.password)) errors.password = "passwordNoUppercase";
    else if (!/[0-9]/.test(f.password)) errors.password = "passwordNoDigit";
    else if (!/[^A-Za-z0-9]/.test(f.password)) errors.password = "passwordNoSpecial";
    if (f.password && f.password !== f.confirmPassword)
      errors.confirmPassword = "passwordMismatch";
    if (!f.roles || f.roles.length === 0) errors.roles = "roleRequired";
    return errors;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const submit = useCallback(async () => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    const selectedPerms = allPermissions.filter((p) =>
      selectedPermissionIds.has(p.id),
    );

    setSubmitting(true);
    try {
      await createUser({
        userName: form.userName,
        email: form.email,
        nationalNumber: form.nationalNumber,
        password: form.password,
        permissions: selectedPerms,
        roles: form.roles.map((r) => ({ name: r })),
      });
      setSuccess(true);
      showToast("success", "success");
      return true;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        showToast("conflict", "error");
      } else {
        showToast("error", "error");
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [form, allPermissions, selectedPermissionIds, showToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Reset to initial state ────────────────────────────────────────────────
  const reset = useCallback(() => {
    setFormState(INITIAL_FORM);
    setFormErrors({});
    setSelectedPermissionIds(new Set());
    setSuccess(false);
  }, []);

  // ─── Grouped permissions (filtered) ───────────────────────────────────────
  const groupedPermissions = PERMISSION_TYPES.reduce((acc, type) => {
    if (type === "Tickets") return acc; // tickets are assigned automatically
    if (permTypeFilter && type !== permTypeFilter) return acc;
    const filtered = allPermissions.filter((p) => {
      if (p.type !== type) return false;
      if (!permSearch) return true;
      const q = permSearch.toLowerCase();
      return (
        p.displayName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q)
      );
    });
    if (filtered.length > 0) acc[type] = filtered;
    return acc;
  }, {});

  return {
    // form
    form,
    setField,
    toggleRole,
    hasAdminRole,
    formErrors,
    // permissions data
    allPermissions,
    permissionsLoading,
    permissionsError,
    retryPermissions: loadPermissions,
    // permission selection
    selectedPermissionIds,
    togglePermission,
    toggleTypeGroup,
    // permission search/filter
    permSearch,
    setPermSearch,
    permTypeFilter,
    setPermTypeFilter,
    groupedPermissions,
    totalSelected: selectedPermissionIds.size,
    // submission
    submitting,
    submit,
    reset,
    toast,
    success,
  };
}
