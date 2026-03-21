// ─── Dedicated Axios Instance for Logs Service (port 7172) ───────────────────

import axios from "axios";
import qs from "qs";

const logsAxios = axios.create({
  baseURL: "https://localhost:7172/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Level Enum Mapping ───────────────────────────────────────────────────────

export const LOG_LEVEL_ENUM = {
  Information: 1,
  Warning: 2,
  Error: 3,
  Critical: 4,
};

// ─── Static Lookups ───────────────────────────────────────────────────────────

// "Critical" is labelled "Fatal" in the UI per product requirement.
export const LOG_LEVELS = [
  { value: "Information", label: "Information" },
  { value: "Warning", label: "Warning" },
  { value: "Error", label: "Error" },
  { value: "Critical", label: "Fatal" },
];

export const LOG_CODES = [
  { value: "1001", label: "Worker Service" },
  { value: "2001", label: "Core Service" },
  { value: "3001", label: "Research Service" },
];

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch paginated logs with optional filters.
 * Maps page (1-based) → pageIndex (0-based) for the backend.
 */
export async function getLogs({
  page = 1,
  pageSize = 15,
  search = "",
  levels = [],
  categories = [],
  categoryActions = [],
  codes = [],
  dateFrom = "",
  dateTo = "",
} = {}) {
  const params = {
    pageIndex: page - 1,
    pageSize,
    ...(search && { search }),
    ...(levels.length && {
      levels: levels.map((l) => LOG_LEVEL_ENUM[l]).filter(Boolean),
    }),
    ...(categories.length && { categories }),
    ...(categoryActions.length && { categoryActions }),
    ...(codes.length && { codes }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  const res = await logsAxios.get("/Logs", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  const { data, totalCount } = res.data;
  return {
    data: (data || []).map(normalizeLog),
    totalCount: totalCount ?? 0,
  };
}

/**
 * Fetch log count for a specific level.
 * @param {number} levelNumber  1=Information 2=Warning 3=Error 4=Critical
 */
export async function getLogCount(levelNumber) {
  const res = await logsAxios.get("/Logs/Count", {
    params: { loglevel: levelNumber },
  });
  return typeof res.data === "number" ? res.data : (res.data?.count ?? 0);
}

/**
 * Fetch all log categories from the backend.
 * @returns {Promise<{id: number, categoryName: string}[]>}
 */
export async function getCategories() {
  const res = await logsAxios.get("/Logs/Categories");
  return res.data || [];
}

/**
 * Fetch all log actions (with associated category IDs).
 * @returns {Promise<{id: number, actionName: string, categoryIds: number[], categoryNames: string[]}[]>}
 */
export async function getActions() {
  const res = await logsAxios.get("/Logs/Actions");
  return res.data || [];
}

// ─── Category CRUD ────────────────────────────────────────────────────────────

export async function createCategory(categoryName) {
  const res = await logsAxios.post("/Logs/CreateCategory", null, {
    params: { categoryName },
  });
  return res.data;
}

export async function updateCategory(id, categoryName) {
  const res = await logsAxios.put(
    `/Logs/UpdateCategory/${id}`,
    JSON.stringify(categoryName),
  );
  return res.data;
}

export async function deleteCategory(id) {
  await logsAxios.delete(`/Logs/DeleteCategory/${id}`);
}

// ─── Action CRUD ──────────────────────────────────────────────────────────────

export async function createAction(actionName, categoryIds) {
  const res = await logsAxios.post("/Logs/CreateAction", {
    actionName,
    categoryIds,
  });
  return res.data;
}

export async function updateAction(id, actionName, categoryIds) {
  const res = await logsAxios.put(`/Logs/UpdateAction/${id}`, {
    actionName,
    categoryIds,
  });
  return res.data;
}

export async function deleteAction(id) {
  await logsAxios.delete(`/Logs/DeleteAction/${id}`);
}

// ─── Normalizer ───────────────────────────────────────────────────────────────

function normalizeLog(raw) {
  return {
    id: raw.id,
    timestamp: raw.timestamp,
    level: raw.level,
    category: raw.category,
    categoryAction: raw.categoryAction,
    userIp: raw.userIP, // backend: "userIP"
    userName: raw.userName,
    renderedMessage: raw.renderedMessage,
    exception: raw.exception,
    exceptionDetail: raw.exceptionDetail,
    exceptionMessage: raw.exceptionMessage,
    additionalInformation: raw.additionalData, // backend: "additionalData"
    code: raw.code,
  };
}
