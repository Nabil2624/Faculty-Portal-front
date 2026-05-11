// ─── ReportTable ──────────────────────────────────────────────────────────────
// Flexible table that renders any report type based on column definitions.
// Props:
//   reportType   – string key from REPORT_TYPES
//   data         – array of row objects
//   totalCount   – number (for footer display)
//   loading      – boolean
//   error        – Error | null
//   onRetry      – callback()
//   onRowClick   – callback(row) – only for types that SUPPORTS_ROW_DETAILS
//   t            – i18next translation function (Reports namespace)
//   isArabic     – boolean
//   onPrint      – callback() – triggers window.print on the table area
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { Printer, RefreshCw, XCircle, FileSearch } from "lucide-react";
import { REPORT_COLUMNS, SUPPORTS_ROW_DETAILS } from "./reportsConstants";

// ─── Cell value resolver ──────────────────────────────────────────────────────
function resolveCell(row, colKey, isArabic, index) {
  if (colKey === "index") return index + 1;
  if (colKey === "name") return isArabic ? row.name_ar : row.name_en;
  if (colKey === "department")
    return isArabic ? row.department_ar : row.department_en;
  if (colKey === "title") return isArabic ? row.title_ar : row.title_en;
  if (colKey === "faculty") return isArabic ? row.faculty_ar : row.faculty_en;
  if (colKey === "seminarType")
    return isArabic ? row.seminarType_ar : row.seminarType_en;
  if (colKey === "experienceType")
    return isArabic ? row.experienceType_ar : row.experienceType_en;
  if (colKey === "publicationRole")
    return isArabic ? row.publicationRole_ar : row.publicationRole_en;
  if (colKey === "projectType")
    return isArabic ? row.projectType_ar : row.projectType_en;
  if (colKey === "participationType")
    return isArabic ? row.participationType_ar : row.participationType_en;
  if (colKey === "journalCount") return row.journalCount ?? "-";
  if (colKey === "researchCount") return row.researchCount ?? "-";
  if (colKey === "articleCount") return row.articleCount ?? "-";
  if (colKey === "patentScope")
    return isArabic ? row.patentScope_ar : row.patentScope_en;
  if (colKey === "patentCount") return row.patentCount ?? "-";
  if (colKey === "publicationType")
    return isArabic ? row.publicationType_ar : row.publicationType_en;
  if (colKey === "year") return row.year;
  if (colKey === "email") return row.email;
  if (colKey === "phone") return row.phone;
  if (colKey === "internationalResearches")
    return row.internationalResearches ?? "-";
  if (colKey === "localResearches") return row.localResearches ?? "-";
  if (colKey === "patents") return row.patents ?? "-";
  if (colKey === "awards") return row.awards ?? "-";
  // Fallback: try direct key access
  return row[colKey] ?? "-";
}

export function ReportTable({
  reportType,
  data,
  totalCount,
  loading,
  error,
  onRetry,
  onRowClick,
  t,
  isArabic,
}) {
  const printRef = useRef(null);
  const columns = REPORT_COLUMNS[reportType] || [];
  const supportsDetails = SUPPORTS_ROW_DETAILS.has(reportType);

  // ── Print handler ─────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const title = t(`categories.${reportType}`);
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: ${isArabic ? "rtl" : "ltr"}; margin: 0; padding: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px 10px; font-size: 12px; }
            th { background: #19355a; color: white; }
            tr:nth-child(even) { background: #f5f8fb; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `;

    // Use a hidden iframe so no new tab/page is opened
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove the iframe after the print dialog closes
    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
    };
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Print button */}
      {data.length > 0 && !loading && (
        <div className={`flex ${isArabic ? "justify-start" : "justify-end"}`}>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/85 transition"
            style={{
              padding:
                "clamp(0.4rem, 0.65vw, 0.7rem) clamp(0.8rem, 1.2vw, 1.3rem)",
              fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
            }}
          >
            <Printer
              style={{
                width: "clamp(0.8rem, 1vw, 1.1rem)",
                height: "clamp(0.8rem, 1vw, 1.1rem)",
              }}
            />
            {t("print")}
          </button>
        </div>
      )}

      {/* Table container */}
      <div
        className="rounded-2xl border border-[#19355a]/15 shadow-sm overflow-hidden"
        style={{ background: "white" }}
      >
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <RefreshCw
              className="animate-spin text-[#19355a]"
              style={{
                width: "clamp(1.5rem, 2.5vw, 3rem)",
                height: "clamp(1.5rem, 2.5vw, 3rem)",
              }}
            />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <XCircle
              className="text-red-400"
              style={{
                width: "clamp(2rem, 3vw, 3.5rem)",
                height: "clamp(2rem, 3vw, 3.5rem)",
              }}
            />
            <p
              className="text-gray-600"
              style={{ fontSize: "clamp(0.72rem, 1vw, 1rem)" }}
            >
              {t("table.error")}
            </p>
            <button
              onClick={onRetry}
              className="bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/85 transition"
              style={{
                padding:
                  "clamp(0.35rem, 0.55vw, 0.6rem) clamp(0.8rem, 1.2vw, 1.3rem)",
                fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
              }}
            >
              {t("table.retry")}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <FileSearch
              className="text-gray-300"
              style={{
                width: "clamp(2.5rem, 4vw, 5rem)",
                height: "clamp(2.5rem, 4vw, 5rem)",
              }}
            />
            <p
              className="text-gray-500 font-medium"
              style={{ fontSize: "clamp(0.72rem, 1vw, 1rem)" }}
            >
              {t("table.noData")}
            </p>
            <p
              className="text-gray-400"
              style={{ fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)" }}
            >
              {t("table.noDataHint")}
            </p>
          </div>
        )}

        {/* Actual table (hidden while loading/error) */}
        {!loading && !error && data.length > 0 && columns.length > 0 && (
          <div className="overflow-x-auto" ref={printRef}>
            <table
              className="w-full border-collapse"
              style={{
                minWidth: "clamp(500px, 70vw, 1200px)",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              <thead>
                <tr className="bg-[#19355a] text-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        width: col.width,
                        padding:
                          "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1.1rem)",
                        fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                        fontWeight: 600,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {t(`table.columns.${col.tKey}`)}
                    </th>
                  ))}
                  {/* Extra column for "details" on clickable rows */}
                  {supportsDetails && (
                    <th
                      style={{
                        width: "2rem",
                        padding: "clamp(0.5rem, 0.9vw, 1rem)",
                        fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                        textAlign: "center",
                      }}
                    >
                      {t("table.columns.details")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    className={`transition-colors border-b border-[#19355a]/6
                      ${supportsDetails ? "cursor-pointer hover:bg-[#19355a]/5" : idx % 2 === 0 ? "bg-white" : "bg-[#f5f8fb]"}`}
                    onClick={
                      supportsDetails ? () => onRowClick(row) : undefined
                    }
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding:
                            "clamp(0.5rem, 0.85vw, 0.95rem) clamp(0.6rem, 1vw, 1.1rem)",
                          fontSize: "clamp(0.62rem, 0.85vw, 0.92rem)",
                          color: "#374151",
                          textAlign: "center",
                        }}
                      >
                        {resolveCell(row, col.key, isArabic, idx)}
                      </td>
                    ))}
                    {supportsDetails && (
                      <td
                        style={{
                          textAlign: "center",
                          padding: "clamp(0.5rem, 0.85vw, 0.95rem)",
                        }}
                      >
                        <span
                          className="inline-flex items-center justify-center rounded-lg bg-[#19355a]/10 text-[#19355a] hover:bg-[#19355a] hover:text-white transition"
                          style={{
                            padding:
                              "clamp(0.2rem, 0.35vw, 0.4rem) clamp(0.4rem, 0.7vw, 0.8rem)",
                            fontSize: "clamp(0.55rem, 0.75vw, 0.82rem)",
                            fontWeight: 600,
                          }}
                        >
                          {t("table.view")}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Total count footer */}
      {!loading && !error && data.length > 0 && (
        <div
          className="flex items-center justify-between rounded-xl border border-[#19355a]/10 bg-[#19355a]/5 px-4"
          style={{
            padding:
              "clamp(0.5rem, 0.8vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.3rem)",
            fontSize: "clamp(0.62rem, 0.85vw, 0.92rem)",
          }}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <span className="text-gray-600">{t("table.totalRows")}</span>
          <span
            className="font-bold text-[#19355a]"
            style={{ fontSize: "clamp(0.75rem, 1vw, 1.1rem)" }}
          >
            {totalCount.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
