// Template 5 — Timeline (vertical timeline with gold dots and navy line)
import React from "react";
import { getVal, fmtShort as fmt, buildSections } from "./CVShared";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT = "#f8fafc";

function SectionTitle({ children, isArabic }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px,1vw,16px)",
        marginTop: "clamp(20px,2.5vw,40px)",
        marginBottom: "clamp(10px,1.2vw,20px)",
      }}
    >
      <div
        style={{
          width: "clamp(10px,1.2vw,18px)",
          height: "clamp(10px,1.2vw,18px)",
          borderRadius: "50%",
          background: GOLD,
          flexShrink: 0,
          boxShadow: `0 0 0 3px rgba(179,142,25,0.25)`,
        }}
      />
      <span
        style={{
          color: NAVY,
          fontWeight: 800,
          fontSize: "clamp(0.78rem,1.05vw,1.1rem)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 2, background: "#e2e8f0" }} />
    </div>
  );
}

function TimelineItem({ dateStr, title, meta, isArabic }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(10px,1.4vw,24px)",
        marginBottom: "clamp(10px,1.2vw,20px)",
        position: "relative",
      }}
    >
      {/* Date column */}
      <div
        style={{
          flex: "0 0 clamp(70px,9vw,140px)",
          textAlign: isArabic ? "left" : "right",
          paddingTop: 2,
        }}
      >
        <span
          style={{
            color: GOLD,
            fontWeight: 700,
            fontSize: "clamp(0.58rem,0.75vw,0.82rem)",
            whiteSpace: "nowrap",
          }}
        >
          {dateStr}
        </span>
      </div>

      {/* Line & dot */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: "0 0 clamp(16px,2vw,28px)",
        }}
      >
        <div
          style={{
            width: "clamp(8px,0.9vw,12px)",
            height: "clamp(8px,0.9vw,12px)",
            borderRadius: "50%",
            background: NAVY,
            border: `2px solid #fff`,
            boxShadow: `0 0 0 2px ${NAVY}`,
            flexShrink: 0,
            marginTop: 3,
          }}
        />
        <div
          style={{
            flex: 1,
            width: 2,
            background: "#e2e8f0",
            marginTop: 2,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: "clamp(6px,0.7vw,12px)" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "clamp(0.67rem,0.88vw,0.95rem)",
            color: "#1e293b",
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        {meta && (
          <div
            style={{
              color: "#64748b",
              fontSize: "clamp(0.6rem,0.75vw,0.82rem)",
              lineHeight: 1.5,
            }}
          >
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CVTemplate5({ data, isArabic, t }) {
  if (!data) return null;
  const dir = isArabic ? "rtl" : "ltr";

  const sections = buildSections(data, isArabic, t, fmt);

  return (
    <div
      id="cv-print-area"
      dir={dir}
      style={{
        fontFamily: isArabic
          ? "'Cairo', 'Segoe UI', sans-serif"
          : "'Inter', 'Segoe UI', sans-serif",
        background: "#fff",
        maxWidth: 900,
        margin: "0 auto",
        boxShadow: "0 4px 32px rgba(25,53,90,0.10)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: NAVY,
          padding: "clamp(20px,3vw,48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: isArabic ? "auto" : -40,
            left: isArabic ? -40 : "auto",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(179,142,25,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: isArabic ? -60 : "auto",
            left: isArabic ? "auto" : -60,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(179,142,25,0.06)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: "clamp(1.4rem,2.8vw,3rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            {data.name}
          </div>
          {getVal(data.title, isArabic) && (
            <div
              style={{
                color: GOLD,
                fontWeight: 600,
                fontSize: "clamp(0.85rem,1.2vw,1.3rem)",
                marginBottom: 12,
              }}
            >
              {getVal(data.title, isArabic)}
            </div>
          )}

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(8px,1.2vw,20px)",
              marginTop: "clamp(8px,1vw,16px)",
            }}
          >
            {[
              getVal(data.department, isArabic),
              getVal(data.university, isArabic),
              data.officialEmail,
              data.mainPhoneNumber,
            ]
              .filter(Boolean)
              .map((val, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "clamp(4px,0.5vw,8px) clamp(10px,1.2vw,18px)",
                    color: "#e2e8f0",
                    fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
                  }}
                >
                  {val}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "clamp(12px,2vw,32px)",
          background: LIGHT,
        }}
      >
        {/* Bio */}
        {data.bioSummary && (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "clamp(10px,1.4vw,22px)",
              marginBottom: "clamp(12px,1.5vw,24px)",
              borderLeft: isArabic ? "none" : `4px solid ${GOLD}`,
              borderRight: isArabic ? `4px solid ${GOLD}` : "none",
              fontSize: "clamp(0.65rem,0.85vw,0.92rem)",
              color: "#374151",
              lineHeight: 1.75,
            }}
          >
            {data.bioSummary}
          </div>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "clamp(8px,1vw,16px)",
              marginBottom: "clamp(10px,1.2vw,20px)",
            }}
          >
            <div
              style={{
                color: NAVY,
                fontWeight: 700,
                fontSize: "clamp(0.65rem,0.82vw,0.88rem)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {t("sections.skills")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: "#f0f4f8",
                    color: NAVY,
                    borderRadius: 99,
                    padding: "2px 10px",
                    fontSize: "clamp(0.58rem,0.72vw,0.78rem)",
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timeline sections */}
        {sections.map((sec) => (
          <React.Fragment key={sec.key}>
            <SectionTitle isArabic={isArabic}>{t(sec.titleKey)}</SectionTitle>
            {sec.items.map((item, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={sec.getDate(item)}
                title={sec.getTitle(item)}
                meta={sec.getTimelineMeta(item) || undefined}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
