// Template 1 — Modern (navy header, two-column body)
import React from "react";
import { getVal, fmt, buildSections, applyVisibility } from "./CVShared";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT = "#f0f4f8";

function SectionTitle({ children, isArabic }) {
  return (
    <div
      style={{
        borderLeft: isArabic ? "none" : `4px solid ${GOLD}`,
        borderRight: isArabic ? `4px solid ${GOLD}` : "none",
        paddingLeft: isArabic ? 0 : "clamp(6px,0.6vw,14px)",
        paddingRight: isArabic ? "clamp(6px,0.6vw,14px)" : 0,
        marginBottom: "clamp(6px,0.7vw,14px)",
        marginTop: "clamp(12px,1.4vw,28px)",
      }}
    >
      <span
        style={{
          color: NAVY,
          fontWeight: 700,
          fontSize: "clamp(0.75rem,1vw,1.1rem)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Entry({ children }) {
  return (
    <div
      style={{
        borderBottom: `1px solid #e2e8f0`,
        paddingBottom: "clamp(6px,0.6vw,12px)",
        marginBottom: "clamp(6px,0.6vw,12px)",
        fontSize: "clamp(0.65rem,0.85vw,0.9rem)",
        color: "#1e293b",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

function EntryTitle({ children }) {
  return (
    <div style={{ fontWeight: 700, color: NAVY, marginBottom: 2 }}>
      {children}
    </div>
  );
}

function Meta({ children }) {
  return (
    <div style={{ color: "#64748b", fontSize: "clamp(0.6rem,0.75vw,0.8rem)" }}>
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: LIGHT,
        color: NAVY,
        borderRadius: 9999,
        padding: "2px clamp(8px,0.7vw,14px)",
        fontSize: "clamp(0.6rem,0.75vw,0.82rem)",
        fontWeight: 600,
        margin: "2px 3px",
        border: `1px solid #c9d8e8`,
      }}
    >
      {children}
    </span>
  );
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", key: "linkedIn" },
  { label: "Google Scholar", key: "googleScholar" },
  { label: "Scopus", key: "scopus" },
  { key: "personalWebsite", labelKey: "fields.website" },
  { label: "Instagram", key: "instagram" },
  { label: "Facebook", key: "facebook" },
  { label: "X", key: "x" },
  { label: "YouTube", key: "youTube" },
];

const CONTACT_FIELDS = [
  { key: "officialEmail", labelKey: "contact.email" },
  { key: "mainPhoneNumber", labelKey: "contact.phone" },
  { key: "workPhoneNumber", labelKey: "contact.workPhone" },
  { key: "faxNumber", labelKey: "contact.fax" },
];

export default function CVTemplate1({
  data: rawData,
  isArabic,
  t,
  visibility,
}) {
  if (!rawData) return null;
  const data = applyVisibility(rawData, visibility);

  const dir = isArabic ? "rtl" : "ltr";
  const titleVal = getVal(data.title, isArabic);
  const uniVal = getVal(data.university, isArabic);
  const deptVal = getVal(data.department, isArabic);
  const authVal = getVal(data.authority, isArabic);

  const sections = buildSections(data, isArabic, t);

  const socialLinks = SOCIAL_LINKS.map((l) => ({
    label: l.label || t(l.labelKey),
    val: data[l.key],
  })).filter((l) => l.val);

  return (
    <div
      id="cv-print-area"
      dir={dir}
      style={{
        fontFamily: isArabic
          ? "'Cairo', 'Segoe UI', sans-serif"
          : "'Inter', 'Segoe UI', sans-serif",
        background: "#fff",
        maxWidth: 960,
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
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1.3rem,2.5vw,2.6rem)",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          {data.name}
        </div>
        {titleVal && (
          <div
            style={{
              color: GOLD,
              fontWeight: 600,
              fontSize: "clamp(0.85rem,1.2vw,1.3rem)",
              marginBottom: 8,
            }}
          >
            {titleVal}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(4px,0.5vw,10px)",
            fontSize: "clamp(0.65rem,0.85vw,0.95rem)",
            color: "#cbd5e1",
          }}
        >
          {deptVal && <span>{deptVal}</span>}
          {deptVal && uniVal && <span>·</span>}
          {uniVal && <span>{uniVal}</span>}
          {authVal && <span>·</span>}
          {authVal && <span>{authVal}</span>}
          {data.birthDate && (
            <>
              {(deptVal || uniVal || authVal) && <span>·</span>}
              <span>
                {t("fields.date")}: {fmt(data.birthDate, isArabic)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
        {/* Left: main content */}
        <div
          style={{
            flex: "1 1 60%",
            minWidth: 280,
            padding: "clamp(14px,2vw,32px)",
            borderRight: isArabic ? "none" : `1px solid #e2e8f0`,
            borderLeft: isArabic ? `1px solid #e2e8f0` : "none",
          }}
        >
          {data.bioSummary && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.bio")}
              </SectionTitle>
              <p
                style={{
                  fontSize: "clamp(0.65rem,0.85vw,0.9rem)",
                  color: "#374151",
                  lineHeight: 1.7,
                  marginBottom: "clamp(8px,1vw,16px)",
                }}
              >
                {data.bioSummary}
              </p>
            </div>
          )}

          {sections.map((sec) => (
            <div key={sec.key}>
              <SectionTitle isArabic={isArabic}>{t(sec.titleKey)}</SectionTitle>
              {sec.items.map((item, i) => (
                <Entry key={i}>
                  <EntryTitle>{sec.getTitle(item)}</EntryTitle>
                  <Meta>{sec.getMeta(item)}</Meta>
                </Entry>
              ))}
            </div>
          ))}
        </div>

        {/* Right: sidebar */}
        <div
          style={{
            flex: "0 0 clamp(200px,32%,340px)",
            background: LIGHT,
            padding: "clamp(14px,2vw,32px)",
          }}
        >
          {CONTACT_FIELDS.some((f) => data[f.key]) && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.contactInfo")}
              </SectionTitle>
              {CONTACT_FIELDS.filter((f) => data[f.key]).map((f) => (
                <div
                  key={f.key}
                  style={{
                    fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#64748b" }}>{t(f.labelKey)}: </span>
                  {data[f.key]}
                </div>
              ))}
            </div>
          )}

          {data.skills?.length > 0 && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.skills")}
              </SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {data.skills.map((s, i) => (
                  <Pill key={i}>{s}</Pill>
                ))}
              </div>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.socialMedia")}
              </SectionTitle>
              {socialLinks.map((l, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "clamp(0.6rem,0.75vw,0.82rem)",
                    marginBottom: 4,
                    wordBreak: "break-all",
                  }}
                >
                  <span style={{ color: GOLD, fontWeight: 700 }}>
                    {l.label}:{" "}
                  </span>
                  <span style={{ color: "#334155" }}>{l.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
