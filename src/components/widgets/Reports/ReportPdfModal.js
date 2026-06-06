// ─── ReportPdfModal ───────────────────────────────────────────────────────────
// A notes-entry modal that triggers a PDF download for server-side reports.
// Mirrors the pattern used in DetailedDashboardPage.
// Props:
//   open         – boolean
//   onClose      – callback()
//   reportType   – string key from REPORT_TYPES (only SERVER_SIDE_TYPES)
//   serverParams – current filter/sort params to pass to PDF endpoint
//   t            – i18next translation function (Reports namespace)
//   isArabic     – boolean
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Printer, RefreshCw, X } from "lucide-react";
import {
  downloadDetailedFacultyReportPdf,
  downloadBiannualResearchReportPdf,
  downloadSeminarsReportPdf,
} from "../../../services/reports.service";

const PDF_DOWNLOADERS = {
  DETAILED_FACULTY: downloadDetailedFacultyReportPdf,
  BIANNUAL_RESEARCH: downloadBiannualResearchReportPdf,
  SEMINARS_STATS: downloadSeminarsReportPdf,
};

const FILE_NAMES = {
  DETAILED_FACULTY: "faculty-members-report.pdf",
  BIANNUAL_RESEARCH: "researches-per-year-report.pdf",
  SEMINARS_STATS: "conferences-seminars-report.pdf",
};

export function ReportPdfModal({ open, onClose, reportType, serverParams, t, isArabic }) {
  const [notes, setNotes] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!open) return null;

  const handleClose = () => {
    setNotes("");
    setDownloadError(null);
    onClose();
  };

  const handleDownload = async () => {
    const downloader = PDF_DOWNLOADERS[reportType];
    if (!downloader) return;

    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await downloader({ ...serverParams, notes });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = FILE_NAMES[reportType] ?? "report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      handleClose();
    } catch {
      setDownloadError(
        isArabic
          ? "تعذّر تحميل الملف. يرجى المحاولة مرة أخرى."
          : "Failed to download the file. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#19355A] flex items-center justify-center">
              <Printer size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-[#19355A] text-base leading-none">
                {t(`categories.${reportType}`)}
              </h2>
              <p className="text-[10px] text-[#B38E19] font-bold tracking-widest uppercase mt-0.5">
                {isArabic ? "تحميل تقرير PDF" : "Download PDF Report"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold text-[#19355A] uppercase tracking-widest"
            >
              {isArabic ? "ملاحظات التقرير" : "Report Notes"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isArabic
                  ? "اكتب ملاحظاتك هنا… (اختياري)"
                  : "Write your notes here… (optional)"
              }
              rows={4}
              className="w-full rounded-xl border border-slate-200 outline-none resize-none text-slate-700 bg-[#f8fafc] focus:border-[#B38E19] transition"
              style={{
                padding: "clamp(0.5rem,0.8vw,0.75rem) clamp(0.75rem,1vw,1rem)",
                fontSize: "clamp(0.8rem,1vw,0.95rem)",
              }}
            />
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
            onClick={handleClose}
            className="rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
            style={{
              padding: "clamp(0.45rem,0.7vw,0.65rem) clamp(1.2rem,1.8vw,1.8rem)",
              fontSize: "clamp(0.75rem,1vw,0.9rem)",
            }}
          >
            {isArabic ? "إغلاق" : "Close"}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-[#B38E19] text-white font-black hover:bg-[#cfa82a] transition disabled:opacity-50 active:scale-95 shadow-md"
            style={{
              padding: "clamp(0.45rem,0.7vw,0.65rem) clamp(1.5rem,2vw,2.5rem)",
              fontSize: "clamp(0.8rem,1.1vw,1rem)",
            }}
          >
            {downloading ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <Printer size={15} />
            )}
            {downloading
              ? isArabic ? "جاري التحميل…" : "Downloading…"
              : isArabic ? "تحميل PDF" : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
