// Template 4 — Professional (navy sidebar + white main content)
import React from "react";
import { getVal, fmtShort as fmt, buildSections } from "./CVShared";

const NAVY = "#19355a";
const GOLD = "#b38e19";

function SidebarSection({ title, children }) {
  return (
    <div style={{ marginBottom: "clamp(12px,1.4vw,24px)" }}>
      <div
        style={{
          color: GOLD,
          fontWeight: 700,
          fontSize: "clamp(0.6rem,0.78vw,0.82rem)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          borderBottom: `1px solid rgba(255,255,255,0.15)`,
          paddingBottom: "clamp(3px,0.3vw,6px)",
          marginBottom: "clamp(6px,0.7vw,12px)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SidebarText({ children }) {
  return (
    <div
      style={{
        color: "#cbd5e1",
        fontSize: "clamp(0.6rem,0.78vw,0.84rem)",
        marginBottom: 4,
        wordBreak: "break-word",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

function MainSectionTitle({ children }) {
  return (
    <div
      style={{
        color: NAVY,
        fontWeight: 800,
        fontSize: "clamp(0.7rem,0.95vw,1rem)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: "clamp(14px,1.8vw,28px)",
        marginBottom: "clamp(6px,0.8vw,14px)",
        paddingBottom: "clamp(4px,0.4vw,8px)",
        borderBottom: `2px solid ${NAVY}`,
      }}
    >
      {children}
    </div>
  );
}

function EntryItem({ title, meta }) {
  return (
    <div
      style={{
        marginBottom: "clamp(6px,0.8vw,14px)",
        paddingBottom: "clamp(6px,0.8vw,14px)",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "clamp(0.65rem,0.85vw,0.92rem)",
          color: "#1e293b",
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      {meta && (
        <div
          style={{
            color: "#64748b",
            fontSize: "clamp(0.58rem,0.75vw,0.82rem)",
          }}
        >
          {meta}
        </div>
      )}
    </div>
  );
}

const SOCIAL_ENTRIES = [
  { label: "LinkedIn", key: "linkedIn" },
  { label: "Scholar", key: "googleScholar" },
  { label: "Scopus", key: "scopus" },
  { key: "personalWebsite" },
  { label: "Instagram", key: "instagram" },
  { label: "Facebook", key: "facebook" },
  { label: "X", key: "x" },
  { label: "YouTube", key: "youTube" },
];

export default function CVTemplate4({ data, isArabic, t }) {
  if (!data) return null;
  const dir = isArabic ? "rtl" : "ltr";

  const sections = buildSections(data, isArabic, t, fmt);

  const socialLinks = SOCIAL_ENTRIES.map((l) => ({
    label: l.label || "",
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
        maxWidth: 980,
        margin: "0 auto",
        display: "flex",
        boxShadow: "0 4px 32px rgba(25,53,90,0.12)",
        borderRadius: 8,
        overflow: "hidden",
        minHeight: 600,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          background: NAVY,
          flex: "0 0 clamp(180px,28%,300px)",
          padding: "clamp(20px,2.5vw,40px) clamp(14px,1.8vw,28px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: "clamp(60px,7vw,100px)",
            height: "clamp(60px,7vw,100px)",
            borderRadius: "50%",
            background: "rgba(179,142,25,0.3)",
            border: `3px solid ${GOLD}`,
            marginBottom: "clamp(12px,1.5vw,24px)",
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: GOLD,
              fontWeight: 900,
              fontSize: "clamp(1.2rem,2vw,2.2rem)",
            }}
          >
            {data.name?.charAt(0) || "?"}
          </span>
        </div>

        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "clamp(0.85rem,1.3vw,1.4rem)",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {data.name}
        </div>
        {getVal(data.title, isArabic) && (
          <div
            style={{
              color: GOLD,
              fontWeight: 600,
              fontSize: "clamp(0.65rem,0.85vw,0.9rem)",
              textAlign: "center",
              marginBottom: "clamp(12px,1.5vw,24px)",
            }}
          >
            {getVal(data.title, isArabic)}
          </div>
        )}

        <div style={{ flex: 1, overflow: "visible" }}>
          {(data.officialEmail || data.mainPhoneNumber || data.workPhoneNumber || data.faxNumber) && (
            <SidebarSection title={t("sections.contactInfo")}>
              {data.officialEmail && <SidebarText>{data.officialEmail}</SidebarText>}
              {data.mainPhoneNumber && (
                <SidebarText>{t("contact.phone")}: {data.mainPhoneNumber}</SidebarText>
              )}
              {data.workPhoneNumber && (
                <SidebarText>{t("contact.workPhone")}: {data.workPhoneNumber}</SidebarText>
              )}
              {data.faxNumber && (
                <SidebarText>{t("contact.fax")}: {data.faxNumber}</SidebarText>
              )}
            </SidebarSection>
          )}

          {data.birthDate && (
            <SidebarSection title={t("fields.date")}>
              <SidebarText>{fmt(data.birthDate, isArabic)}</SidebarText>
            </SidebarSection>
          )}

          {data.skills?.length > 0 && (
            <SidebarSection title={t("sections.skills")}>
              {data.skills.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "inline-block",
                    background: "rgba(179,142,25,0.18)",
                    color: GOLD,
                    borderRadius: 99,
                    padding: "2px 10px",
                    fontSize: "clamp(0.55rem,0.7vw,0.76rem)",
                    fontWeight: 600,
                    border: `1px solid rgba(179,142,25,0.5)`,
                    margin: "2px 2px",
                  }}
                >
                  {s}
                </div>
              ))}
            </SidebarSection>
          )}

          {socialLinks.length > 0 && (
            <SidebarSection title={t("sections.socialMedia")}>
              {socialLinks.map((l, i) => (
                <SidebarText key={i}>
                  {l.label ? `${l.label}: ` : ""}{l.val}
                </SidebarText>
              ))}
            </SidebarSection>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "clamp(20px,2.5vw,40px)",
          overflowY: "auto",
        }}
      >
        {(getVal(data.department, isArabic) || getVal(data.university, isArabic)) && (
          <div
            style={{
              background: "#f0f4f8",
              borderRadius: 6,
              padding: "clamp(8px,1vw,16px)",
              marginBottom: "clamp(10px,1.2vw,20px)",
              fontSize: "clamp(0.62rem,0.8vw,0.88rem)",
              color: "#334155",
            }}
          >
            {[
              getVal(data.department, isArabic),
              getVal(data.university, isArabic),
              getVal(data.authority, isArabic),
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}

        {data.bioSummary && (
          <div style={{ marginBottom: "clamp(10px,1.2vw,20px)" }}>
            <MainSectionTitle>{t("sections.bio")}</MainSectionTitle>
            <p
              style={{
                fontSize: "clamp(0.65rem,0.85vw,0.92rem)",
                color: "#374151",
                lineHeight: 1.75,
              }}
            >
              {data.bioSummary}
            </p>
          </div>
        )}

        {sections.map((sec) => (
          <React.Fragment key={sec.key}>
            <MainSectionTitle>{t(sec.titleKey)}</MainSectionTitle>
            {sec.items.map((item, i) => (
              <EntryItem
                key={i}
                title={sec.getTitle(item)}
                meta={sec.getMeta(item)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}