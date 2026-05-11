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
    { key: "title", tKey: "researchTitle", width: "8rem" },
    { key: "publicationType", tKey: "publicationType", width: "9rem" },
    { key: "year", tKey: "publicationYear", width: "7rem" },
  ],
  [REPORT_TYPES.RESEARCH_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "6rem" },
    {
      key: "internationalResearches",
      tKey: "internationalResearches",
      width: "10rem",
    },
    { key: "localResearches", tKey: "localResearches", width: "9rem" },
  ],

  [REPORT_TYPES.SEMINARS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "4rem" },
    { key: "seminarType", tKey: "seminarType", width: "10rem" },
    { key: "seminarCount", tKey: "seminarCount", width: "8rem" },
  ],
  [REPORT_TYPES.EXPERIENCES_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "2rem" },
    { key: "experienceType", tKey: "experienceType", width: "10rem" },
    { key: "experiencesCount", tKey: "experiencesCount", width: "8rem" },
  ],
  [REPORT_TYPES.PUBLICATIONS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "2rem" },
    { key: "publicationRole", tKey: "publicationRole", width: "10rem" },
    { key: "publicationsCount", tKey: "publicationsCount", width: "8rem" },
  ],
  [REPORT_TYPES.CV_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "faculty", tKey: "faculty", width: "auto" },
    { key: "cvCount", tKey: "cvCount", width: "10rem" },
  ],
  [REPORT_TYPES.FACULTY_COUNT_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "faculty", tKey: "faculty", width: "auto" },
    { key: "memberCount", tKey: "memberCount", width: "10rem" },
  ],
  [REPORT_TYPES.TOTAL_RESEARCH_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "faculty", tKey: "faculty", width: "auto" },
    { key: "researchCount", tKey: "researchCount", width: "10rem" },
  ],
  [REPORT_TYPES.JOURNALS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "8rem" },
    { key: "participationType", tKey: "participationType", width: "10rem" },
    { key: "journalCount", tKey: "journalCount", width: "8rem" },
  ],
  [REPORT_TYPES.ARTICLE_REVIEWS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "auto" },
    { key: "articleCount", tKey: "articleCount", width: "10rem" },
  ],
  [REPORT_TYPES.PATENTS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "8rem" },
    { key: "patentScope", tKey: "patentScope", width: "10rem" },
    { key: "patentCount", tKey: "patentCount", width: "8rem" },
  ],
  [REPORT_TYPES.PROJECTS_STATS]: [
    { key: "index", tKey: "no", width: "3rem" },
    { key: "name", tKey: "memberName", width: "8rem" },
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
