// ─── ResearchDetailsModal ─────────────────────────────────────────────────────
// Popup shown when a row is clicked on the "Detailed Faculty Report" table.
// Displays the faculty member's research list with print support.
//
// Props:
//   open     – boolean
//   onClose  – callback()
//   member   – row object from getDetailedFacultyReport (with .researches[])
//   t        – i18next translation function (Reports namespace)
//   isArabic – boolean
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { X, Printer } from "lucide-react";

export function ResearchDetailsModal({ open, onClose, member, t, isArabic }) {
  const printRef = useRef(null);

  if (!open || !member) return null;

  const memberName = isArabic ? member.name_ar : member.name_en;
  const researches = member.researches || [];

  // ── Print handler ─────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${memberName}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: ${isArabic ? "rtl" : "ltr"}; padding: 20px; }
            h2 { color: #19355a; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px 12px; font-size: 13px; }
            th { background: #19355a; color: white; }
            tr:nth-child(even) { background: #f5f8fb; }
          </style>
        </head>
        <body>
          <h2>${memberName}</h2>
          ${content}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,25,47,0.5)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "clamp(320px, 55vw, 750px)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#19355a] text-white px-5 py-4 flex-shrink-0">
          <div>
            <p
              className="font-bold"
              style={{ fontSize: "clamp(0.85rem, 1.1vw, 1.15rem)" }}
            >
              {t("detailsModal.title")}
            </p>
            <p
              className="text-white/70 mt-0.5"
              style={{ fontSize: "clamp(0.65rem, 0.85vw, 0.9rem)" }}
            >
              {memberName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:text-[#b38e19] transition-colors rounded-lg p-1"
          >
            <X
              style={{
                width: "clamp(1rem, 1.4vw, 1.5rem)",
                height: "clamp(1rem, 1.4vw, 1.5rem)",
              }}
            />
          </button>
        </div>

        {/* Print button */}
        <div
          className={`flex px-5 pt-4 pb-2 flex-shrink-0 ${isArabic ? "justify-start" : "justify-end"}`}
        >
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/85 transition"
            style={{
              padding:
                "clamp(0.35rem, 0.55vw, 0.6rem) clamp(0.8rem, 1.2vw, 1.3rem)",
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

        {/* Table body */}
        <div className="overflow-y-auto flex-1 px-5 pb-5" ref={printRef}>
          {researches.length === 0 ? (
            <p
              className="text-center text-gray-400 py-10"
              style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
            >
              {t("detailsModal.noResearches")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#19355a]/12">
              <table
                className="w-full border-collapse"
                style={{ minWidth: "clamp(300px, 40vw, 600px)" }}
              >
                <thead>
                  <tr className="bg-[#19355a] text-white">
                    {/* # */}
                    <th
                      style={{
                        width: "3rem",
                        padding: "clamp(0.5rem, 0.8vw, 0.9rem)",
                        fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("table.columns.no")}
                    </th>
                    {/* Research title */}
                    <th
                      style={{
                        padding: "clamp(0.5rem, 0.8vw, 0.9rem)",
                        fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("detailsModal.researchTitle")}
                    </th>
                    {/* Year */}
                    <th
                      style={{
                        width: "7rem",
                        padding: "clamp(0.5rem, 0.8vw, 0.9rem)",
                        fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("detailsModal.publicationYear")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {researches.map((res, idx) => (
                    <tr
                      key={res.id ?? idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#f5f8fb]"}
                      style={{ borderBottom: "1px solid rgba(25,53,90,0.06)" }}
                    >
                      <td
                        style={{
                          padding: "clamp(0.45rem, 0.75vw, 0.85rem)",
                          fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)",
                          color: "#6b7280",
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td
                        style={{
                          padding: "clamp(0.45rem, 0.75vw, 0.85rem)",
                          fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)",
                          color: "#374151",
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        {isArabic ? res.title_ar : res.title_en}
                      </td>
                      <td
                        style={{
                          padding: "clamp(0.45rem, 0.75vw, 0.85rem)",
                          fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)",
                          color: "#374151",
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        {res.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer count */}
        {researches.length > 0 && (
          <div
            className="flex items-center justify-between border-t border-[#19355a]/10 bg-[#19355a]/5 flex-shrink-0"
            style={{
              padding:
                "clamp(0.5rem, 0.8vw, 0.9rem) clamp(0.8rem, 1.2vw, 1.3rem)",
              fontSize: "clamp(0.62rem, 0.85vw, 0.92rem)",
            }}
          >
            <span className="text-gray-600">{t("table.totalRows")}</span>
            <span className="font-bold text-[#19355a]">
              {researches.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
