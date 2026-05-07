// ─── useReports Hook ──────────────────────────────────────────────────────────
// Manages fetching report data and the university-tree lookup.
//
// TODO (backend integration): The service functions already have the correct
// signatures. Once the API endpoints are ready, just remove the dummy-data
// implementations in reports.service.js and the hook will work automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import {
  getUniversitiesTree,
  getDetailedFacultyReport,
  getBiannualResearchReport,
  getResearchStatisticsReport,
  getSeminarsStatisticsReport,
  getExperiencesStatisticsReport,
  getPublicationsStatisticsReport,
  getCVStatisticsReport,
  getFacultyCountStatisticsReport,
  getTotalResearchCountReport,
  getJournalsStatisticsReport,
  getArticleReviewsStatisticsReport,
  getPatentsStatisticsReport,
  getProjectsStatisticsReport,
} from "../services/reports.service";

// ─── Map: reportType → service function ──────────────────────────────────────
const REPORT_SERVICE_MAP = {
  DETAILED_FACULTY: getDetailedFacultyReport,
  BIANNUAL_RESEARCH: getBiannualResearchReport,
  RESEARCH_STATS: getResearchStatisticsReport,
  SEMINARS_STATS: getSeminarsStatisticsReport,
  EXPERIENCES_STATS: getExperiencesStatisticsReport,
  PUBLICATIONS_STATS: getPublicationsStatisticsReport,
  CV_STATS: getCVStatisticsReport,
  FACULTY_COUNT_STATS: getFacultyCountStatisticsReport,
  TOTAL_RESEARCH_STATS: getTotalResearchCountReport,
  JOURNALS_STATS: getJournalsStatisticsReport,
  ARTICLE_REVIEWS_STATS: getArticleReviewsStatisticsReport,
  PATENTS_STATS: getPatentsStatisticsReport,
  PROJECTS_STATS: getProjectsStatisticsReport,
};

export default function useReports() {
  // ── University tree (for the filter modal) ────────────────────────────────
  const [universitiesTree, setUniversitiesTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState(null);

  // ── Report data ───────────────────────────────────────────────────────────
  const [reportData, setReportData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  // ─── Load the university tree once (called when the filter modal opens) ───
  const loadUniversitiesTree = useCallback(async () => {
    setTreeLoading(true);
    setTreeError(null);
    try {
      const tree = await getUniversitiesTree();
      setUniversitiesTree(tree);
    } catch (err) {
      setTreeError(err);
    } finally {
      setTreeLoading(false);
    }
  }, []);

  // ─── Fetch a specific report ──────────────────────────────────────────────
  // @param reportType  – one of the keys in REPORT_SERVICE_MAP
  // @param departmentIds – array of selected department IDs
  const loadReport = useCallback(async (reportType, departmentIds) => {
    const serviceFn = REPORT_SERVICE_MAP[reportType];
    if (!serviceFn) return;

    setReportLoading(true);
    setReportError(null);
    try {
      const result = await serviceFn({ departmentIds });
      setReportData(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      setReportError(err);
      setReportData([]);
      setTotalCount(0);
    } finally {
      setReportLoading(false);
    }
  }, []);

  // ─── Reset report data (e.g. when category changes) ──────────────────────
  const resetReport = useCallback(() => {
    setReportData([]);
    setTotalCount(0);
    setReportError(null);
  }, []);

  return {
    // University tree
    universitiesTree,
    treeLoading,
    treeError,
    loadUniversitiesTree,

    // Report data
    reportData,
    totalCount,
    reportLoading,
    reportError,
    loadReport,
    resetReport,
  };
}
