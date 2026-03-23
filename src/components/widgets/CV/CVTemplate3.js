// Template 3 — Academic (gold top bar, split header, navy table-style sections)
import React from "react";
import { getVal, fmt, dateRange, buildSections } from "./CVShared";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT_GOLD = "#fdf8ec";
const LINE = "#e2e8f0";

function SectionTitle({ children, isArabic }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: "clamp(14px,1.8vw,28px)",
        marginBottom: "clamp(8px,0.9vw,16px)",
      }}
    >
      <div
        style={{ width: "clamp(20px,2.5vw,40px)", height: 3, background: GOLD }}
      />
      <span
        style={{
          color: NAVY,
          fontWeight: 800,
          fontSize: "clamp(0.72rem,0.95vw,1rem)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: LINE }} />
    </div>
  );
}

function TableRow({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(8px,1vw,16px)",
        fontSize: "clamp(0.62rem,0.82vw,0.88rem)",
        padding: "clamp(3px,0.35vw,6px) 0",
        borderBottom: `1px solid ${LINE}`,
      }}
    >
      <span
        style={{
          color: GOLD,
          fontWeight: 700,
          minWidth: "clamp(80px,8vw,140px)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ color: "#1e293b", lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

function EntryCard({ children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        padding: "clamp(8px,1vw,16px)",
        marginBottom: "clamp(6px,0.7vw,12px)",
        borderLeft: `3px solid ${GOLD}`,
      }}
    >
      {children}
    </div>
  );
}

function EntryTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 700,
        color: NAVY,
        fontSize: "clamp(0.68rem,0.9vw,0.95rem)",
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}

function Meta({ children }) {
  return (
    <div
      style={{
        color: "#64748b",
        fontSize: "clamp(0.6rem,0.75vw,0.82rem)",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

// Sections that use TableRow for their sub-fields (custom rendering)
const DETAILED_KEYS = new Set([
  "academicQualifications",
  "generalExperiences",
  "teachingExperiences",
  "conferencesAndSeminars",
  "projects",
  "scientificWritings",
]);

function renderDetailedCard(sec, item, i, t, isArabic) {
  const k = sec.key;
  if (k === "academicQualifications") {
    return (
      <EntryCard key={i}>
        <EntryTitle>
          {getVal(item.qualification, isArabic)}
          {item.specialization ? ` — ${item.specialization}` : ""}
        </EntryTitle>
        <TableRow label={t("fields.grade")} value={getVal(item.grade, isArabic)} />
        <TableRow label={t("fields.dispatchType")} value={getVal(item.dispatchType, isArabic)} />
        <TableRow label={t("fields.universityOrFaculty")} value={item.universityOrFaculty} />
        <TableRow label={t("fields.countryOrCity")} value={item.countryOrCity} />
        <TableRow label={t("fields.dateObtained")} value={fmt(item.dateOfObtainingTheQualification, isArabic)} />
      </EntryCard>
    );
  }
  if (k === "generalExperiences") {
    return (
      <EntryCard key={i}>
        <EntryTitle>{item.experienceTitle}</EntryTitle>
        <TableRow label={t("fields.authority")} value={item.authority} />
        <TableRow label={t("fields.countryOrCity")} value={item.countryOrCity} />
        <Meta>{dateRange(item.startDate, item.endDate, isArabic)}</Meta>
      </EntryCard>
    );
  }
  if (k === "teachingExperiences") {
    return (
      <EntryCard key={i}>
        <EntryTitle>{item.courseName}</EntryTitle>
        <TableRow label={t("fields.academicLevel")} value={item.academicLevel} />
        <TableRow label={t("fields.universityOrFaculty")} value={item.universityOrFaculty} />
        <Meta>{dateRange(item.startDate, item.endDate, isArabic)}</Meta>
      </EntryCard>
    );
  }
  if (k === "conferencesAndSeminars") {
    return (
      <EntryCard key={i}>
        <EntryTitle>{item.name}</EntryTitle>
        <TableRow label={t("fields.role")} value={getVal(item.roleOfParticipation, isArabic)} />
        <TableRow label={t("fields.authority")} value={item.organizingAuthority} />
        <TableRow label={t("fields.venue")} value={item.venue} />
        <Meta>{dateRange(item.startDate, item.endDate, isArabic)}</Meta>
      </EntryCard>
    );
  }
  if (k === "projects") {
    return (
      <EntryCard key={i}>
        <EntryTitle>{item.nameOfProject}</EntryTitle>
        <TableRow label={t("fields.type")} value={getVal(item.typeOfProject, isArabic)} />
        <TableRow label={t("fields.role")} value={getVal(item.participationRole, isArabic)} />
        <TableRow label={t("fields.financing")} value={item.financingAuthority} />
        <Meta>{dateRange(item.startDate, item.endDate, isArabic)}</Meta>
      </EntryCard>
    );
  }
  if (k === "scientificWritings") {
    return (
      <EntryCard key={i}>
        <EntryTitle>{item.title}</EntryTitle>
        <TableRow label={t("fields.role")} value={getVal(item.authorRole, isArabic)} />
        <TableRow label={t("fields.publishingHouse")} value={item.publishingHouse} />
        <TableRow label={t("fields.isbn")} value={item.isbn} />
        <Meta>{fmt(item.publishingDate, isArabic)}</Meta>
      </EntryCard>
    );
  }
  return null;
}

export default function CVTemplate3({ data, isArabic, t }) {
  if (!data) return null;
  const dir = isArabic ? "rtl" : "ltr";

  const sections = buildSections(data, isArabic, t);

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
      {/* Gold top bar */}
      <div style={{ height: "clamp(6px,0.6vw,12px)", background: GOLD }} />

      {/* Split header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
          background: NAVY,
        }}
      >
        {/* Left: name + title */}
        <div
          style={{
            flex: "1 1 55%",
            padding: "clamp(16px,2.5vw,40px)",
            borderRight: isArabic ? "none" : `1px solid rgba(255,255,255,0.15)`,
            borderLeft: isArabic ? `1px solid rgba(255,255,255,0.15)` : "none",
          }}
        >
          <div
            style={{
              fontSize: "clamp(1.2rem,2.4vw,2.4rem)",
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
                fontSize: "clamp(0.78rem,1.1vw,1.2rem)",
                marginBottom: 8,
              }}
            >
              {getVal(data.title, isArabic)}
            </div>
          )}
          {data.bioSummary && (
            <div
              style={{
                color: "#cbd5e1",
                fontSize: "clamp(0.6rem,0.78vw,0.88rem)",
                lineHeight: 1.6,
                maxWidth: 500,
              }}
            >
              {data.bioSummary}
            </div>
          )}
        </div>
        {/* Right: affiliation + contact */}
        <div
          style={{
            flex: "0 1 42%",
            padding: "clamp(16px,2.5vw,40px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {getVal(data.department, isArabic) && (
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "clamp(0.65rem,0.85vw,0.9rem)",
              }}
            >
              <span style={{ color: GOLD, fontWeight: 700 }}>
                {t("fields.universityOrFaculty")}:{" "}
              </span>
              {getVal(data.department, isArabic)}
            </div>
          )}
          {getVal(data.university, isArabic) && (
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "clamp(0.65rem,0.85vw,0.9rem)",
              }}
            >
              <span style={{ color: GOLD, fontWeight: 700 }}>
                {t("fields.universityOrFaculty")}:{" "}
              </span>
              {getVal(data.university, isArabic)}
            </div>
          )}
          {data.officialEmail && (
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "clamp(0.62rem,0.8vw,0.88rem)",
              }}
            >
              {data.officialEmail}
            </div>
          )}
          {data.mainPhoneNumber && (
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "clamp(0.62rem,0.8vw,0.88rem)",
              }}
            >
              {data.mainPhoneNumber}
            </div>
          )}
          {data.birthDate && (
            <div
              style={{
                color: "#94a3b8",
                fontSize: "clamp(0.6rem,0.75vw,0.82rem)",
              }}
            >
              {fmt(data.birthDate, isArabic)}
            </div>
          )}
          {data.skills?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginTop: 6,
              }}
            >
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(179,142,25,0.2)",
                    color: GOLD,
                    borderRadius: 99,
                    padding: "2px 10px",
                    fontSize: "clamp(0.55rem,0.7vw,0.76rem)",
                    fontWeight: 600,
                    border: `1px solid ${GOLD}`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "clamp(14px,2vw,32px)", background: LIGHT_GOLD }}>
        {sections.map((sec) => (
          <React.Fragment key={sec.key}>
            <SectionTitle isArabic={isArabic}>{t(sec.titleKey)}</SectionTitle>
            {DETAILED_KEYS.has(sec.key)
              ? sec.items.map((item, i) =>
                  renderDetailedCard(sec, item, i, t, isArabic)
                )
              : sec.items.map((item, i) => (
                  <EntryCard key={i}>
                    <EntryTitle>{sec.getTitle(item)}</EntryTitle>
                    <Meta>{sec.getMeta(item)}</Meta>
                  </EntryCard>
                ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}