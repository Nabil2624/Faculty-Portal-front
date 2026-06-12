import React, { useState, useCallback, useEffect } from "react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CollegeCard from "../components/widgets/DetailedDashboard/CollegeCard";
import TopResearchersCard from "../components/widgets/DetailedDashboard/TopResearchersCard";
import TopSubjectsCard from "../components/widgets/DetailedDashboard/TopSubjectsCard";
import UniversityTopResearchers from "../components/widgets/DetailedDashboard/UniversityTopResearchers";
import ResearchSourceChart from "../components/widgets/DetailedDashboard/ResearchSourceChart";
import CitationsCurveChart from "../components/widgets/DetailedDashboard/CitationsCurveChart";
import { useTranslation } from "react-i18next";
import { useDetailedDashboard } from "../hooks/useDetailedDashboard";
import { useCollegeDepartmentsAnalysis } from "../hooks/useCollegeDepartmentsAnalysis";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import {
  GraduationCapIcon,
  FileText,
  TrendingUp,
  Printer,
  X,
  RefreshCw,
  Eye,
  ChevronDown,
} from "lucide-react";
import {
  UniversityService,
  getFacultyResearchesAndResearchersReportPreview,
  downloadFacultyResearchesReportPdf,
  getTotalUniversityResearchesReportPreview,
  downloadResearchesReportPdf,
} from "../services/dashboardAndReports.service";
const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 2.5;

const DetailedDashboardPage = () => {
  const { t, i18n } = useTranslation("admin-dashboard");
  const isArabic = i18n.language === "ar";

  // ===========================================
  // 1. فصل الـ States لكل كرت عشان يشتغل لوحده
  // ===========================================
  const [researchersCollegeId, setResearchersCollegeId] = useState(null);
  const [researchesCollegeId, setResearchesCollegeId] = useState(null);

  // ── University researchers report modal state ──────────────────────────
  const [uniReportModalOpen, setUniReportModalOpen] = useState(false);
  const [uniReportNotes, setUniReportNotes] = useState("");
  const [uniReportPreview, setUniReportPreview] = useState(null);
  const [uniPreviewLoading, setUniPreviewLoading] = useState(false);
  const [uniPreviewError, setUniPreviewError] = useState(null);
  const [uniDownloading, setUniDownloading] = useState(false);
  const [uniDownloadError, setUniDownloadError] = useState(null);
  const [uniPreviewZoom, setUniPreviewZoom] = useState(0.75);

  const fetchUniPreview = useCallback(async (notes) => {
    setUniPreviewLoading(true);
    setUniPreviewError(null);
    try {
      const res = await getTotalUniversityResearchesReportPreview(notes);
      setUniReportPreview(res.data);
    } catch {
      setUniPreviewError("تعذّر تحميل المعاينة. يرجى المحاولة مرة أخرى.");
    } finally {
      setUniPreviewLoading(false);
    }
  }, []);

  const openUniReportModal = () => {
    setUniReportModalOpen(true);
    setUniReportNotes("");
    setUniReportPreview(null);
    setUniPreviewError(null);
    setUniDownloadError(null);
    setUniPreviewZoom(0.75);
    fetchUniPreview("");
  };

  const handleUniDownloadPdf = async () => {
    setUniDownloading(true);
    setUniDownloadError(null);
    try {
      const res = await downloadResearchesReportPdf(uniReportNotes);
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "university-researchers-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setUniDownloadError("تعذّر تحميل الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setUniDownloading(false);
    }
  };

  // ── Faculty researchers report modal state ───────────────────────────────
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [facultiesLoading, setFacultiesLoading] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const [reportPreview, setReportPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(0.75);

  // Load faculties once
  useEffect(() => {
    if (!reportModalOpen || faculties.length > 0) return;
    setFacultiesLoading(true);
    UniversityService.getFaculties()
      .then((res) => setFaculties(res.data || []))
      .catch(() => {})
      .finally(() => setFacultiesLoading(false));
  }, [reportModalOpen, faculties.length]);

  const fetchPreview = useCallback(async (facultyId, notes) => {
    if (!facultyId) return;
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await getFacultyResearchesAndResearchersReportPreview(
        facultyId,
        notes,
      );
      setReportPreview(res.data);
    } catch {
      setPreviewError("تعذّر تحميل المعاينة. يرجى المحاولة مرة أخرى.");
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const openReportModal = () => {
    setReportModalOpen(true);
    setSelectedFacultyId("");
    setReportNotes("");
    setReportPreview(null);
    setPreviewError(null);
    setDownloadError(null);
    setPreviewZoom(0.75);
  };

  const handleFacultyChange = (id) => {
    setSelectedFacultyId(id);
    setReportPreview(null);
    setPreviewError(null);
    if (id) fetchPreview(id, reportNotes);
  };

  const handleDownloadPdf = async () => {
    if (!selectedFacultyId) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await downloadFacultyResearchesReportPdf(
        selectedFacultyId,
        reportNotes,
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "faculty-researchers-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setDownloadError("تعذّر تحميل الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setDownloading(false);
    }
  };

  const renderPreviewData = (data) => {
    if (!data) return null;
    if (typeof data === "string") {
      return (
        <div
          className="prose max-w-none text-slate-700"
          style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)" }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      );
    }
    if (typeof data === "object") {
      const entries = Object.entries(data);
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-[#f8fafc] rounded-xl border border-slate-100 px-4 py-3 flex flex-col gap-1"
            >
              <span
                className="text-[#B38E19] font-bold uppercase tracking-wide"
                style={{ fontSize: "clamp(0.6rem, 0.75vw, 0.72rem)" }}
              >
                {key}
              </span>
              <span
                className="text-[#19355A] font-black"
                style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.1rem)" }}
              >
                {Array.isArray(value) ? value.join(", ") : String(value ?? "—")}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  // ─────────────────────────────────────────────────────────────────────────

  // =========================
  // Global dashboard data
  // =========================
  const { researchesDashboard, loading, error } = useDetailedDashboard();

  // ===========================================
  // 2. استدعاء الهوك مرتين (مرة لكل كرت)
  // ===========================================

  // بيانات الكرت الأول (عدد الباحثين)
  const {
    departmentResearchersData,
    topResearchersData, // لو محتاج تربط التوب ريسيرشرز بكرت معين
    error: err1,
  } = useCollegeDepartmentsAnalysis(researchersCollegeId);

  // بيانات الكرت الثاني (عدد الأبحاث)
  const { departmentResearchesData, error: err2 } =
    useCollegeDepartmentsAnalysis(researchesCollegeId);

  // =========================
  // Loading / Error handling
  // =========================
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || err1 || err2)
    return (
      <div className="p-10 text-center text-red-500">Error loading data</div>
    );

  return (
    <>
      <ResponsiveLayoutProvider>
        <div className="min-h-screen px-4 bg-gray-50">
          <div className="max-w-[2000px] mx-auto">
            <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-[3px] border-[#b38e19] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#b38e19]/5 border-2 border-gray-100 flex items-center justify-center text-[#b38e19] shrink-0">
                  <TrendingUp size={24} />
                </div>
                <h2
                  className="text-black font-semibold leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.125rem, 1.2vw + 0.5rem, 3rem)" }}
                >
                  {t("statisticsDetails")}
                </h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={openUniReportModal}
                  className="flex items-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black hover:bg-[#cfa82a] transition-all active:scale-95 shadow-lg"
                  style={{
                    height: "clamp(2.5rem,3.2vw,3rem)",
                    fontSize: "clamp(10px,1.1vw,15px)",
                  }}
                >
                  <Printer size={15} />
                  تقرير باحثي الجامعة
                </button>
                <button
                  onClick={openReportModal}
                  className="flex items-center gap-2 bg-[#19355A] text-white px-5 rounded-xl font-black hover:bg-[#2a4a75] transition-all active:scale-95 shadow-lg"
                  style={{
                    height: "clamp(2.5rem,3.2vw,3rem)",
                    fontSize: "clamp(10px,1.1vw,15px)",
                  }}
                >
                  <Printer size={15} />
                  تقرير باحثي الكليات
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 3xl:gap-12 items-stretch">
              {/* 1. Top Researchers (مرتبط باختيار الكرت الأول مثلاً) */}
              <div className="w-full h-full flex flex-col">
            <TopResearchersCard
              title={t("title")}
              facultyId={researchersCollegeId}
              data={topResearchersData?.slice(0, 5)}
              footerText={t("statisticalInsight")}
              noData={t("noData")}
              subTitle={t("facultyRank")}
            />
              </div>

              {/* 2. University Top Researchers */}
              <div className="w-full h-full flex flex-col">
                <UniversityTopResearchers
                  title={t("title")}
                  subTitle={t("univesityRank")}
                  data={researchesDashboard?.universityTopFiveResearchers}
                  footerText={t("statisticalInsight")}
                  noData={t("noData")}
                />
              </div>

              {/* 3. Research Source Chart */}
              <div className="w-full h-full flex flex-col">
                <ResearchSourceChart
                  international={researchesDashboard?.internationalResearchesNo}
                  local={researchesDashboard?.localResearchesNo}
                  footerText={t("statisticalInsight")}
                />
              </div>

              {/* 4. College Card (الكرت الأول - باحثين) */}
              <div className="w-full h-full flex flex-col">
                <CollegeCard
                  title={t("NumberOfResearchersPerCollege")}
                  selectLabel={t("selectCollegeLabel")}
                  totalLabel={t("total")}
                  loadingText={t("loadingData")}
                  unitText={t("researcher")}
                  footerText={t("statisticalInsight")}
                  emptyText={t("noData")}
                  onSelectionChange={(id) => setResearchersCollegeId(id)}
                  subData={departmentResearchersData}
                  Icon={GraduationCapIcon}
                />
              </div>

              {/* 5. Top Subjects */}
              <div className="w-full h-full flex flex-col lg:col-span-2">
                <TopSubjectsCard
                  data={researchesDashboard?.topFiveResearchersInterestsStats}
                />
              </div>

              {/* 6. Second College Card (الكرت الثاني - أبحاث) */}
              <div className="w-full h-full flex flex-col">
                <CollegeCard
                  title={t("NumberOfResearchesPerCollege")}
                  selectLabel={t("selectCollegeLabel")}
                  totalLabel={t("totalResearches")}
                  loadingText={t("loadingData")}
                  unitText={t("researches")}
                  footerText={t("statisticalInsight")}
                  emptyText={t("noData")}
                  onSelectionChange={(id) => setResearchesCollegeId(id)}
                  subData={departmentResearchesData}
                  Icon={FileText}
                />
              </div>

              {/* 7. Citations Chart */}
              <div className="w-full h-full flex flex-col lg:col-span-2">
                <CitationsCurveChart
                  data={
                    researchesDashboard?.citationsStats?.[0]?.detailedCitesStats
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayoutProvider>

      {/* ── University Researchers Report Modal ─────────────────────────── */}
      {uniReportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setUniReportModalOpen(false);
          }}
        >
          <div
            dir="rtl"
            className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
            style={{ maxWidth: "760px", maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B38E19] flex items-center justify-center">
                  <Printer size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-black text-[#19355A] text-base leading-none">
                    تقرير باحثي الجامعة
                  </h2>
                  <p className="text-[10px] text-[#B38E19] font-bold tracking-widest uppercase mt-0.5">
                    University Researchers Report
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUniReportModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#19355A] uppercase tracking-widest">
                  ملاحظات التقرير
                </label>
                <textarea
                  value={uniReportNotes}
                  onChange={(e) => setUniReportNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك هنا… (اختياري)"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 outline-none resize-none text-slate-700 bg-[#f8fafc] focus:border-[#B38E19] transition"
                  style={{
                    padding:
                      "clamp(0.5rem,0.8vw,0.75rem) clamp(0.75rem,1vw,1rem)",
                    fontSize: "clamp(0.8rem,1vw,0.95rem)",
                  }}
                />
                <button
                  onClick={() => fetchUniPreview(uniReportNotes)}
                  disabled={uniPreviewLoading}
                  className="self-start flex items-center gap-2 rounded-lg border border-[#19355A] text-[#19355A] font-bold hover:bg-[#19355A] hover:text-white transition disabled:opacity-50"
                  style={{
                    padding:
                      "clamp(0.3rem,0.5vw,0.45rem) clamp(0.8rem,1vw,1rem)",
                    fontSize: "clamp(0.7rem,0.9vw,0.85rem)",
                  }}
                >
                  {uniPreviewLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Eye size={13} />
                  )}
                  تحديث المعاينة
                </button>
              </div>

              {/* Divider + zoom */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  معاينة التقرير
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                {!uniPreviewLoading && !uniPreviewError && uniReportPreview && (
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 py-0.5">
                    <button
                      onClick={() =>
                        setUniPreviewZoom((z) =>
                          Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={uniPreviewZoom <= ZOOM_MIN}
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setUniPreviewZoom(1)}
                      className="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-bold text-[#19355A] hover:bg-slate-100 transition tabular-nums"
                    >
                      {Math.round(uniPreviewZoom * 100)}%
                    </button>
                    <button
                      onClick={() =>
                        setUniPreviewZoom((z) =>
                          Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={uniPreviewZoom >= ZOOM_MAX}
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Preview area */}
              <div
                className="min-h-[120px] rounded-xl border border-slate-100 bg-[#f8fafc]"
                style={{ overflow: "auto", maxHeight: "400px" }}
              >
                {uniPreviewLoading && (
                  <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm font-medium">
                      جاري تحميل المعاينة…
                    </span>
                  </div>
                )}
                {uniPreviewError && !uniPreviewLoading && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                    {uniPreviewError}
                  </div>
                )}
                {!uniPreviewLoading && !uniPreviewError && uniReportPreview && (
                  <div
                    style={{
                      zoom: uniPreviewZoom,
                      transition: "zoom 0.15s ease",
                      padding: "1rem",
                      width: "max-content",
                      minWidth: `${(1 / uniPreviewZoom) * 100}%`,
                    }}
                  >
                    {renderPreviewData(uniReportPreview)}
                  </div>
                )}
                {!uniPreviewLoading &&
                  !uniPreviewError &&
                  !uniReportPreview && (
                    <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                      لا توجد بيانات للمعاينة حالياً
                    </div>
                  )}
              </div>

              {uniDownloadError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                  {uniDownloadError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-between items-center gap-3">
              <button
                onClick={() => setUniReportModalOpen(false)}
                className="rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.2rem,1.8vw,1.8rem)",
                  fontSize: "clamp(0.75rem,1vw,0.9rem)",
                }}
              >
                إغلاق
              </button>
              <button
                onClick={handleUniDownloadPdf}
                disabled={uniDownloading}
                className="flex items-center gap-2 rounded-xl bg-[#B38E19] text-white font-black hover:bg-[#cfa82a] transition disabled:opacity-50 active:scale-95 shadow-md"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.5rem,2vw,2.5rem)",
                  fontSize: "clamp(0.8rem,1.1vw,1rem)",
                }}
              >
                {uniDownloading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Printer size={15} />
                )}
                {uniDownloading ? "جاري التحميل…" : "طباعة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Faculty Researchers Report Modal ────────────────────────────── */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setReportModalOpen(false);
          }}
        >
          <div
            dir="rtl"
            className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
            style={{ maxWidth: "760px", maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#19355A] flex items-center justify-center">
                  <Printer size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-black text-[#19355A] text-base leading-none">
                    تقرير باحثي الكليات
                  </h2>
                  <p className="text-[10px] text-[#B38E19] font-bold tracking-widest uppercase mt-0.5">
                    Faculty Researchers Report
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Faculty dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#19355A] uppercase tracking-widest">
                  اختر الكلية
                </label>
                <div className="relative">
                  <select
                    value={selectedFacultyId}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    disabled={facultiesLoading}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-700 outline-none focus:border-[#B38E19] transition pr-4 pl-10 disabled:opacity-50"
                    style={{
                      padding:
                        "clamp(0.5rem,0.8vw,0.75rem) clamp(0.75rem,1vw,1rem)",
                      fontSize: "clamp(0.8rem,1vw,0.95rem)",
                    }}
                  >
                    <option value="">
                      {facultiesLoading ? "جاري التحميل…" : "-- اختر الكلية --"}
                    </option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {isArabic ? f.nameAR : f.nameEN}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#19355A] uppercase tracking-widest">
                  ملاحظات التقرير
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك هنا… (اختياري)"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 outline-none resize-none text-slate-700 bg-[#f8fafc] focus:border-[#B38E19] transition"
                  style={{
                    padding:
                      "clamp(0.5rem,0.8vw,0.75rem) clamp(0.75rem,1vw,1rem)",
                    fontSize: "clamp(0.8rem,1vw,0.95rem)",
                  }}
                />
                <button
                  onClick={() => fetchPreview(selectedFacultyId, reportNotes)}
                  disabled={previewLoading || !selectedFacultyId}
                  className="self-start flex items-center gap-2 rounded-lg border border-[#19355A] text-[#19355A] font-bold hover:bg-[#19355A] hover:text-white transition disabled:opacity-50"
                  style={{
                    padding:
                      "clamp(0.3rem,0.5vw,0.45rem) clamp(0.8rem,1vw,1rem)",
                    fontSize: "clamp(0.7rem,0.9vw,0.85rem)",
                  }}
                >
                  {previewLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Eye size={13} />
                  )}
                  تحديث المعاينة
                </button>
              </div>

              {/* Divider + zoom controls */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  معاينة التقرير
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                {!previewLoading && !previewError && reportPreview && (
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 py-0.5">
                    <button
                      onClick={() =>
                        setPreviewZoom((z) =>
                          Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={previewZoom <= ZOOM_MIN}
                      title="تصغير"
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setPreviewZoom(1)}
                      title="إعادة الحجم الافتراضي"
                      className="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-bold text-[#19355A] hover:bg-slate-100 transition tabular-nums"
                    >
                      {Math.round(previewZoom * 100)}%
                    </button>
                    <button
                      onClick={() =>
                        setPreviewZoom((z) =>
                          Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={previewZoom >= ZOOM_MAX}
                      title="تكبير"
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Preview area */}
              <div
                className="min-h-[120px] rounded-xl border border-slate-100 bg-[#f8fafc]"
                style={{ overflow: "auto", maxHeight: "400px" }}
              >
                {!selectedFacultyId && (
                  <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                    يرجى اختيار الكلية أولاً
                  </div>
                )}
                {selectedFacultyId && previewLoading && (
                  <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm font-medium">
                      جاري تحميل المعاينة…
                    </span>
                  </div>
                )}
                {selectedFacultyId && previewError && !previewLoading && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                    {previewError}
                  </div>
                )}
                {selectedFacultyId &&
                  !previewLoading &&
                  !previewError &&
                  reportPreview && (
                    <div
                      style={{
                        zoom: previewZoom,
                        transition: "zoom 0.15s ease",
                        padding: "1rem",
                        width: "max-content",
                        minWidth: `${(1 / previewZoom) * 100}%`,
                      }}
                    >
                      {renderPreviewData(reportPreview)}
                    </div>
                  )}
                {selectedFacultyId &&
                  !previewLoading &&
                  !previewError &&
                  !reportPreview && (
                    <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                      لا توجد بيانات للمعاينة حالياً
                    </div>
                  )}
              </div>

              {downloadError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                  {downloadError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-between items-center gap-3">
              <button
                onClick={() => setReportModalOpen(false)}
                className="rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.2rem,1.8vw,1.8rem)",
                  fontSize: "clamp(0.75rem,1vw,0.9rem)",
                }}
              >
                إغلاق
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={downloading || !selectedFacultyId}
                className="flex items-center gap-2 rounded-xl bg-[#B38E19] text-white font-black hover:bg-[#cfa82a] transition disabled:opacity-50 active:scale-95 shadow-md"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.5rem,2vw,2.5rem)",
                  fontSize: "clamp(0.8rem,1.1vw,1rem)",
                }}
              >
                {downloading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Printer size={15} />
                )}
                {downloading ? "جاري التحميل…" : "طباعة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailedDashboardPage;
