import { Info, AlertTriangle, XCircle, Skull } from "lucide-react";

// Display name override: backend uses "Critical", UI shows "Fatal"
export const LEVEL_DISPLAY = { Critical: "Fatal" };
export const getLevelLabel = (level) => LEVEL_DISPLAY[level] || level;

export const PAGE_SIZE = 15;

export const LEVEL_CONFIG = {
  Information: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#3b82f6",
    statBg: "#eff6ff",
    icon: Info,
  },
  Warning: {
    bg: "#fef3c7",
    text: "#b45309",
    border: "#f59e0b",
    statBg: "#fffbeb",
    icon: AlertTriangle,
  },
  Error: {
    bg: "#fee2e2",
    text: "#b91c1c",
    border: "#ef4444",
    statBg: "#fef2f2",
    icon: XCircle,
  },
  Critical: {
    bg: "#450a0a",
    text: "#fecaca",
    border: "#7f1d1d",
    statBg: "#fff1f2",
    icon: Skull,
  },
};

export const CODE_CONFIG = {
  1001: { bg: "#f3e8ff", text: "#7c3aed", border: "#a855f7" },
  2001: { bg: "#e0e7ff", text: "#4338ca", border: "#6366f1" },
  3001: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
};

export const EMPTY_FILTERS = {
  levels: [],
  categories: [],
  categoryActions: [],
  codes: [],
  dateFrom: "",
  dateTo: "",
};

export const COL_COUNT = 10;
