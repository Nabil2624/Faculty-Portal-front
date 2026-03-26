// Template 2 — Classic (single-column, minimal, traditional academic look)
import React from "react";
import { getVal, fmt, buildSections, applyVisibility } from "./CVShared";

const DARK = "#1a1a2e";
const GRAY = "#64748b";
const LINE = "#e2e8f0";

function SectionTitle({ children }) {
  return (
    <div
      style={{
        marginTop: "clamp(14px,1.8vw,28px)",
        marginBottom: "clamp(6px,0.8vw,12px)",
        paddingBottom: "clamp(4px,0.4vw,8px)",
        borderBottom: `2px solid ${DARK}`,
        fontSize: "clamp(0.7rem,0.95vw,1rem)",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: DARK,
      }}
    >
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${LINE}`,
        paddingBottom: "clamp(6px,0.7vw,12px)",
        marginBottom: "clamp(6px,0.7vw,12px)",
        fontSize: "clamp(0.65rem,0.85vw,0.92rem)",
        color: DARK,
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
}

function Strong({ children }) {
  return <span style={{ fontWeight: 700 }}>{children}</span>;
}

function Muted({ children }) {
  return (
    <span style={{ color: GRAY, fontSize: "clamp(0.6rem,0.78vw,0.84rem)" }}>
      {children}
    </span>
  );
}

function InfoLine({ children }) {
  return (
    <div
      style={{
        fontSize: "clamp(0.6rem,0.78vw,0.84rem)",
        color: GRAY,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

export default function CVTemplate2({
  data: rawData,
  isArabic,
  t,
  visibility,
}) {
  if (!rawData) return null;
  const data = applyVisibility(rawData, visibility);
  const dir = isArabic ? "rtl" : "ltr";

  const sections = buildSections(data, isArabic, t);

  return (
    <div
      id="cv-print-area"
      dir={dir}
      style={{
        fontFamily: isArabic
          ? "'Cairo', 'Segoe UI', sans-serif"
          : "'Georgia', 'Times New Roman', serif",
        background: "#fff",
        maxWidth: 820,
        margin: "0 auto",
        padding: "clamp(24px,4vw,60px)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        borderRadius: 4,
      }}
    >
      {/* Header */}
      <div
        style={{ textAlign: "center", marginBottom: "clamp(16px,2vw,32px)" }}
      >
        <div
          style={{
            fontSize: "clamp(1.5rem,3vw,2.8rem)",
            fontWeight: 900,
            color: DARK,
            letterSpacing: "0.04em",
          }}
        >
          {data.name}
        </div>
        {(getVal(data.title, isArabic) ||
          getVal(data.department, isArabic)) && (
          <div
            style={{
              fontSize: "clamp(0.8rem,1.1vw,1.1rem)",
              color: GRAY,
              marginTop: 6,
              fontStyle: "italic",
            }}
          >
            {[getVal(data.title, isArabic), getVal(data.department, isArabic)]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
        {(getVal(data.university, isArabic) ||
          getVal(data.authority, isArabic)) && (
          <div
            style={{
              fontSize: "clamp(0.7rem,0.9vw,0.95rem)",
              color: GRAY,
              marginTop: 4,
            }}
          >
            {[
              getVal(data.university, isArabic),
              getVal(data.authority, isArabic),
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}

        {/* Contact row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "clamp(6px,0.8vw,14px)",
            marginTop: "clamp(8px,1vw,16px)",
            fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
            color: GRAY,
          }}
        >
          {data.officialEmail && <span>{data.officialEmail}</span>}
          {data.mainPhoneNumber && <span>{data.mainPhoneNumber}</span>}
          {data.linkedIn && <span>{data.linkedIn}</span>}
          {data.personalWebsite && <span>{data.personalWebsite}</span>}
        </div>

        <div
          style={{
            height: 3,
            background: DARK,
            marginTop: "clamp(12px,1.5vw,24px)",
          }}
        />
      </div>

      {/* Bio */}
      {data.bioSummary && (
        <>
          <SectionTitle>{t("sections.bio")}</SectionTitle>
          <p
            style={{
              fontSize: "clamp(0.65rem,0.85vw,0.92rem)",
              color: DARK,
              lineHeight: 1.8,
              marginBottom: "clamp(8px,1vw,16px)",
            }}
          >
            {data.bioSummary}
          </p>
        </>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <>
          <SectionTitle>{t("sections.skills")}</SectionTitle>
          <div style={{ marginBottom: "clamp(8px,1vw,16px)" }}>
            {data.skills.join(" · ")}
          </div>
        </>
      )}

      {/* Academic Qualifications — needs Muted for specialization */}
      {data.academicQualifications?.length > 0 && (
        <>
          <SectionTitle>{t("sections.academicQualifications")}</SectionTitle>
          {data.academicQualifications.map((aq, i) => (
            <Row key={i}>
              <div>
                <Strong>{getVal(aq.qualification, isArabic)}</Strong>
                {aq.specialization && <Muted> — {aq.specialization}</Muted>}
              </div>
              <InfoLine>
                {[
                  getVal(aq.grade, isArabic),
                  aq.universityOrFaculty,
                  aq.countryOrCity,
                  fmt(aq.dateOfObtainingTheQualification, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* All remaining sections via shared config */}
      {sections
        .filter((s) => s.key !== "academicQualifications")
        .map((sec) => (
          <React.Fragment key={sec.key}>
            <SectionTitle>{t(sec.titleKey)}</SectionTitle>
            {sec.items.map((item, i) => (
              <Row key={i}>
                <Strong>{sec.getTitle(item)}</Strong>
                <InfoLine>{sec.getMeta(item)}</InfoLine>
              </Row>
            ))}
          </React.Fragment>
        ))}
    </div>
  );
}
