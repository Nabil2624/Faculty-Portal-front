// ─── Reports Constants ────────────────────────────────────────────────────────
// Central place for report type keys, category config, and table column defs.
// When adding a new report type:
//   1. Add a key to REPORT_TYPES
//   2. Add it to REPORT_CATEGORIES with icon + translation key
//   3. Add its column definition to REPORT_COLUMNS
// ─────────────────────────────────────────────────────────────────────────────

import {
  Users,
  BookOpen,
  BarChart2,
  Mic2,
  Briefcase,
  PenTool,
  FileText,
  UserCheck,
  TrendingUp,
  BookMarked,
  CheckSquare,
  Lightbulb,
  FolderKanban,
} from "lucide-react";

// ─── Report type keys ─────────────────────────────────────────────────────────
export const REPORT_TYPES = {
  DETAILED_FACULTY: "DETAILED_FACULTY",
  BIANNUAL_RESEARCH: "BIANNUAL_RESEARCH",
  RESEARCH_STATS: "RESEARCH_STATS",
  SEMINARS_STATS: "SEMINARS_STATS",
  EXPERIENCES_STATS: "EXPERIENCES_STATS",
  PUBLICATIONS_STATS: "PUBLICATIONS_STATS",
  CV_STATS: "CV_STATS",
  FACULTY_COUNT_STATS: "FACULTY_COUNT_STATS",
  TOTAL_RESEARCH_STATS: "TOTAL_RESEARCH_STATS",
  JOURNALS_STATS: "JOURNALS_STATS",
  ARTICLE_REVIEWS_STATS: "ARTICLE_REVIEWS_STATS",
  PATENTS_STATS: "PATENTS_STATS",
  PROJECTS_STATS: "PROJECTS_STATS",
};

// ─── Category list (order = display order in the sidebar panel) ───────────────
export const REPORT_CATEGORIES = [
  { key: REPORT_TYPES.DETAILED_FACULTY, icon: Users },
  { key: REPORT_TYPES.BIANNUAL_RESEARCH, icon: BookOpen },
  { key: REPORT_TYPES.RESEARCH_STATS, icon: BarChart2 },
  { key: REPORT_TYPES.SEMINARS_STATS, icon: Mic2 },
  { key: REPORT_TYPES.EXPERIENCES_STATS, icon: Briefcase },
  { key: REPORT_TYPES.PUBLICATIONS_STATS, icon: PenTool },
  { key: REPORT_TYPES.CV_STATS, icon: FileText },
  { key: REPORT_TYPES.FACULTY_COUNT_STATS, icon: UserCheck },
  { key: REPORT_TYPES.TOTAL_RESEARCH_STATS, icon: TrendingUp },
  { key: REPORT_TYPES.JOURNALS_STATS, icon: BookMarked },
  { key: REPORT_TYPES.ARTICLE_REVIEWS_STATS, icon: CheckSquare },
  { key: REPORT_TYPES.PATENTS_STATS, icon: Lightbulb },
  { key: REPORT_TYPES.PROJECTS_STATS, icon: FolderKanban },
];

// ─── Column definitions per report type ──────────────────────────────────────
// Each column: { key, tKey (translation key), width }
// "tKey" maps to  t(`table.columns.<key>`)  in the Reports namespace.
export const REPORT_COLUMNS = {
  [REPORT_TYPES.DETAILED_FACULTY]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "12rem" },
    { key: "department", tKey: "department", width: "10rem" },
    { key: "email", tKey: "email", width: "12rem" },
    { key: "phone", tKey: "phone", width: "9rem" },
    {
      key: "internationalResearches",
      tKey: "internationalResearches",
      width: "8rem",
    },
    { key: "localResearches", tKey: "localResearches", width: "7rem" },
    { key: "patents", tKey: "patents", width: "6rem" },
    { key: "awards", tKey: "awards", width: "6rem" },
  ],
  [REPORT_TYPES.BIANNUAL_RESEARCH]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "title", tKey: "researchTitle", width: "auto" },
    { key: "publicationType", tKey: "publicationType", width: "9rem" },
    { key: "year", tKey: "publicationYear", width: "7rem" },
  ],
  [REPORT_TYPES.RESEARCH_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "auto" },
    {
      key: "internationalResearches",
      tKey: "internationalResearches",
      width: "10rem",
    },
    { key: "localResearches", tKey: "localResearches", width: "9rem" },
  ],

  // TODO: Define columns for remaining report types when backend data is ready.
  // Follow the same pattern: array of { key, tKey, width }
  [REPORT_TYPES.SEMINARS_STATS]: [],
  [REPORT_TYPES.EXPERIENCES_STATS]: [],
  [REPORT_TYPES.PUBLICATIONS_STATS]: [],
  [REPORT_TYPES.CV_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "faculty", tKey: "faculty", width: "auto" },
    { key: "cvCount", tKey: "cvCount", width: "10rem" },
  ],
  [REPORT_TYPES.FACULTY_COUNT_STATS]: [],
  [REPORT_TYPES.TOTAL_RESEARCH_STATS]: [],
  [REPORT_TYPES.JOURNALS_STATS]: [],
  [REPORT_TYPES.ARTICLE_REVIEWS_STATS]: [],
  [REPORT_TYPES.PATENTS_STATS]: [],
  [REPORT_TYPES.PROJECTS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "auto" },
    { key: "projectType", tKey: "projectType", width: "10rem" },
    { key: "projectCount", tKey: "projectCount", width: "8rem" },
  ],
};

// ─── Which report types support row-click details popup ───────────────────────
export const SUPPORTS_ROW_DETAILS = new Set([REPORT_TYPES.DETAILED_FACULTY]);

// ─── Theme colors (matches rest of the system) ────────────────────────────────
export const COLORS = {
  primary: "#19355a",
  gold: "#b38e19",
  primaryLight: "#e8eef5",
  goldLight: "#fdf8ec",
};
