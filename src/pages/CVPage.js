import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Pencil, Printer, RefreshCw, FileText } from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import useCV from "../hooks/useCV";
import CVTemplate1 from "../components/widgets/CV/CVTemplate1";
import CVTemplate2 from "../components/widgets/CV/CVTemplate2";
import CVTemplate3 from "../components/widgets/CV/CVTemplate3";
import CVTemplate4 from "../components/widgets/CV/CVTemplate4";
import CVTemplate5 from "../components/widgets/CV/CVTemplate5";

const TEMPLATES = [
  { id: 1, key: "modern" },
  { id: 2, key: "classic" },
  { id: 3, key: "academic" },
  { id: 4, key: "professional" },
  { id: 5, key: "timeline" },
];

const TEMPLATE_COMPONENTS = {
  1: CVTemplate1,
  2: CVTemplate2,
  3: CVTemplate3,
  4: CVTemplate4,
  5: CVTemplate5,
};

export default function CVPage() {
  const { t, i18n } = useTranslation("CV");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const { data, loading, error, reload } = useCV();

  const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate];

  const handlePrint = () => {
    const area = document.getElementById("cv-print-area");
    if (!area) return;
    const content = area.outerHTML;
    const win = window.open("", "_blank", "width=960,height=720");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html dir="${isArabic ? "rtl" : "ltr"}">
      <head>
        <meta charset="UTF-8"/>
        <title>CV</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>
          *{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:${isArabic ? "'Cairo'" : "'Inter'"}, sans-serif;background:#fff;padding:clamp(10px,2vw,30px);}
          @media print{body{padding:0;}@page{margin:12mm;}}
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  };

  return (
    <ResponsiveLayoutProvider>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{ padding: "clamp(8px,1vw,24px)" }}
      >
        {/* Page header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 mb-4"
          style={{ marginBottom: "clamp(10px,1.2vw,20px)" }}
        >
          <div className="flex items-center gap-2">
            <FileText
              style={{
                color: "#19355a",
                width: "clamp(20px,1.8vw,32px)",
                height: "clamp(20px,1.8vw,32px)",
              }}
            />
            <h1
              style={{
                fontSize: "clamp(1rem,1.6vw,1.8rem)",
                fontWeight: 800,
                color: "#19355a",
              }}
            >
              {t("pageTitle")}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/manage-cv")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px,0.4vw,8px)",
                padding: "clamp(6px,0.6vw,10px) clamp(12px,1.2vw,20px)",
                fontSize: "clamp(0.65rem,0.85vw,0.95rem)",
                fontWeight: 600,
                background: "#19355a",
                color: "#fff",
                border: "none",
                borderRadius: "clamp(4px,0.4vw,8px)",
                cursor: "pointer",
              }}
            >
              <Pencil
                style={{
                  width: "clamp(14px,1.2vw,20px)",
                  height: "clamp(14px,1.2vw,20px)",
                }}
              />
              {t("editCV")}
            </button>

            <button
              onClick={handlePrint}
              disabled={loading || !!error || !data}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px,0.4vw,8px)",
                padding: "clamp(6px,0.6vw,10px) clamp(12px,1.2vw,20px)",
                fontSize: "clamp(0.65rem,0.85vw,0.95rem)",
                fontWeight: 600,
                background: loading || error || !data ? "#94a3b8" : "#b38e19",
                color: "#fff",
                border: "none",
                borderRadius: "clamp(4px,0.4vw,8px)",
                cursor: loading || error || !data ? "not-allowed" : "pointer",
              }}
            >
              <Printer
                style={{
                  width: "clamp(14px,1.2vw,20px)",
                  height: "clamp(14px,1.2vw,20px)",
                }}
              />
              {t("print")}
            </button>
          </div>
        </div>

        {/* Template selector */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(6px,0.7vw,12px)",
            marginBottom: "clamp(12px,1.5vw,24px)",
            background: "#f8fafc",
            borderRadius: "clamp(6px,0.6vw,12px)",
            padding: "clamp(8px,0.8vw,14px)",
            border: "1px solid #e2e8f0",
          }}
        >
          <span
            style={{
              alignSelf: "center",
              fontSize: "clamp(0.62rem,0.78vw,0.85rem)",
              fontWeight: 700,
              color: "#64748b",
              marginInlineEnd: "clamp(4px,0.4vw,8px)",
            }}
          >
            {t("chooseTemplate")}:
          </span>

          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              style={{
                padding: "clamp(5px,0.55vw,9px) clamp(12px,1.2vw,20px)",
                fontSize: "clamp(0.62rem,0.78vw,0.88rem)",
                fontWeight: 600,
                borderRadius: "clamp(4px,0.4vw,8px)",
                border:
                  selectedTemplate === tpl.id
                    ? "2px solid #19355a"
                    : "2px solid #e2e8f0",
                background: selectedTemplate === tpl.id ? "#19355a" : "#fff",
                color: selectedTemplate === tpl.id ? "#fff" : "#334155",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {tpl.id}. {t(`templates.${tpl.key}`)}
            </button>
          ))}
        </div>

        {/* CV display area */}
        {loading && (
          <div
            className="flex justify-center items-center"
            style={{
              minHeight: "clamp(200px,30vw,400px)",
              fontSize: "clamp(0.75rem,1vw,1rem)",
              color: "#64748b",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                style={{
                  width: "clamp(28px,3vw,48px)",
                  height: "clamp(28px,3vw,48px)",
                  borderRadius: "50%",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#19355a",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span>{t("loading")}</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div
            className="flex justify-center items-center flex-col gap-3"
            style={{ minHeight: "clamp(200px,25vw,300px)" }}
          >
            <p
              style={{
                color: "#b91c1c",
                fontSize: "clamp(0.75rem,1vw,1rem)",
              }}
            >
              {t("error")}
            </p>
            <button
              onClick={reload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "clamp(6px,0.6vw,10px) clamp(14px,1.4vw,22px)",
                background: "#19355a",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "clamp(0.65rem,0.82vw,0.9rem)",
                fontWeight: 600,
              }}
            >
              <RefreshCw
                style={{
                  width: "clamp(14px,1.2vw,18px)",
                  height: "clamp(14px,1.2vw,18px)",
                }}
              />
              {t("retry")}
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <div style={{ overflowX: "auto" }}>
            <TemplateComponent data={data} isArabic={isArabic} t={t} />
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </ResponsiveLayoutProvider>
  );
}
