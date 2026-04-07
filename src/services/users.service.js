// ─── Users Service ───────────────────────────────────────────────────────────
import axiosInstance from "../utils/axiosInstance";
import qs from "qs";

// ─── Sort Enums ───────────────────────────────────────────────────────────────

export const USER_SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "UsernameASC", label: "Username A→Z" },
  { value: "UsernameDESC", label: "Username Z→A" },
  { value: "NumberOfAcessedPermissionsASC", label: "Permissions ↑" },
  { value: "NumberOfAcessedPermissionsDESC", label: "Permissions ↓" },
];

export const PERMISSION_TYPES = [
  "UserAccount",
  "FacultyMemberData",
  "FacultyMemberContributionsData",
  "FacultyMemberExperincesData",
  "FacultyMemberHigherStudiesData",
  "FacultyMemberMissionsData",
  "FacultyMemberPrizesData",
  "FacultyMemberProjectsAndComiteesData",
  "FacultyMemberResearchesData",
  "FacultyMemberScientificProgressionData",
  "FacultyMemberWritingsData",
  "Tickets",
];

// ─── Normalize user from API response ─────────────────────────────────────────

// Backend returns roles with spaces ("Faculty Member") — map to camelCase keys
const ROLE_NAME_MAP = {
  "Faculty Member": "FacultyMember",
  "Management Admin": "ManagementAdmin",
  "Support Admin": "SupportAdmin",
};
function normalizeRoleName(r) {
  return ROLE_NAME_MAP[r] || r?.replace(/\s+/g, "") || "";
}

function normalizeUser(raw) {
  if (!raw) return null;
  const roles = (raw.roles || []).map(normalizeRoleName);
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    username: raw.userName,
    nationalId: raw.nationalNumber,
    roles,
    role: { name: roles[0] || "" },
    rolePermissions: raw.rolePermissions || [],
    permissions: raw.permissions || [],
    extraPermissions: raw.permissions || [],
  };
}

// ─── Service Functions ────────────────────────────────────────────────────────

/** Fetch paginated users with server-side sort, search, role filter. */
export async function getUsers({
  sort = "",
  search = "",
  roles = [],
  pageIndex = 0,
  pageSize = 10,
} = {}) {
  const params = {
    pageIndex: pageIndex + 1,
    pageSize,
    ...(sort && { Sort: sort }),
    ...(search && { Search: search }),
    ...(roles.length && { Role: roles }),
  };

  const res = await axiosInstance.get("/Admin/Users", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  const { data, totalCount } = res.data;
  return {
    data: (data || []).map(normalizeUser),
    totalCount: totalCount ?? 0,
  };
}

/** Get the currently logged-in admin's own permissions. */
export async function getCurrentUserPermissions() {
  const res = await axiosInstance.get("/Authentication/CurrentUserPermissions");
  return res.data || [];
}

/**
 * Get the email and id of a user by username.
 * GET /api/Admin/UserIdenitifiers?username=...
 * Returns { email, id }
 */
export async function getUserIdentifiers(username) {
  const res = await axiosInstance.get("/Admin/UserIdenitifiers", {
    params: { username },
  });
  return res.data; // { email, id }
}

/** Fetch available permissions list with sort, search, type filter. */
export async function getAllPermissions({
  sort = "",
  search = "",
  types = [],
} = {}) {
  const params = {
    ...(sort && { Sort: sort }),
    ...(search && { Search: search }),
    ...(types.length && { Type: types }),
  };

  const res = await axiosInstance.get("/Admin/Permissions", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  const data = Array.isArray(res.data) ? res.data : [];
  return { data, totalCount: data.length };
}

/** Create a new user account. */
export async function createUser({
  userName,
  email,
  nationalNumber,
  password,
  permissions,
  roles,
}) {
  const res = await axiosInstance.post("/Admin/User", {
    userName,
    email,
    nationalNumber,
    password,
    permissions: permissions || [],
    roles: roles || [],
  });
  return res.data;
}

/** Grant individual permissions to a user. Returns the updated user or throws (409 = already has permission). */
export async function grantUserPermissions(userId, permissions) {
  const res = await axiosInstance.put(
    `/Admin/UserGrantPermissions/${userId}`,
    permissions,
  );
  return res.data;
}

/** Revoke individual permissions from a user. */
export async function revokeUserPermissions(userId, permissions) {
  const res = await axiosInstance.put(
    `/Admin/UserRevokePermissions/${userId}`,
    permissions,
  );
  return res.data;
}

/** Update a user account credentials (username, email, password). National ID is read-only. */
export async function updateUser(
  id,
  { username, email, nationalNumber, password },
) {
  const body = {
    userName: username,
    email,
    nationalNumber,
    ...(password && { password }),
  };
  const res = await axiosInstance.put(`/Admin/UserCredeintals/${id}`, body);
  return res.data ? normalizeUser(res.data) : null;
}
