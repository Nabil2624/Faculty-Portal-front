// Template 1 — Modern (navy header, two-column body)
import React from "react";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT = "#f0f4f8";

const getVal = (obj, isArabic) =>
  obj ? (isArabic ? obj.valueAr : obj.valueEn) || "" : "";

const fmt = (d, isArabic) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

const dateRange = (start, end, isArabic) => {
  const s = fmt(start, isArabic);
  const e = end ? fmt(end, isArabic) : "—";
  return s || e ? `${s} – ${e}` : "";
};

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

export default function CVTemplate1({ data, isArabic, t }) {
  if (!data) return null;

  const dir = isArabic ? "rtl" : "ltr";

  const titleVal = getVal(data.title, isArabic);
  const uniVal = getVal(data.university, isArabic);
  const deptVal = getVal(data.department, isArabic);
  const authVal = getVal(data.authority, isArabic);

  // ── Left column sections
  const leftSections = [
    // Academic Qualifications
    data.academicQualifications?.length > 0 && (
      <div key="aq">
        <SectionTitle isArabic={isArabic}>
          {t("sections.academicQualifications")}
        </SectionTitle>
        {data.academicQualifications.map((aq, i) => (
          <Entry key={i}>
            <EntryTitle>
              {getVal(aq.qualification, isArabic)}
              {aq.specialization ? ` — ${aq.specialization}` : ""}
            </EntryTitle>
            <Meta>
              {[
                getVal(aq.grade, isArabic),
                getVal(aq.dispatchType, isArabic),
                aq.universityOrFaculty,
                aq.countryOrCity,
                fmt(aq.dateOfObtainingTheQualification, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Job Ranks
    data.jobRanks?.length > 0 && (
      <div key="jr">
        <SectionTitle isArabic={isArabic}>
          {t("sections.jobRanks")}
        </SectionTitle>
        {data.jobRanks.map((jr, i) => (
          <Entry key={i}>
            <EntryTitle>{getVal(jr.jobRank, isArabic)}</EntryTitle>
            <Meta>{fmt(jr.dateOfJobRank, isArabic)}</Meta>
          </Entry>
        ))}
      </div>
    ),
    // Administrative Positions
    data.administrativePositions?.length > 0 && (
      <div key="ap">
        <SectionTitle isArabic={isArabic}>
          {t("sections.administrativePositions")}
        </SectionTitle>
        {data.administrativePositions.map((ap, i) => (
          <Entry key={i}>
            <EntryTitle>{ap.position}</EntryTitle>
            <Meta>{dateRange(ap.startDate, ap.endDate, isArabic)}</Meta>
          </Entry>
        ))}
      </div>
    ),
    // General Experiences
    data.generalExperiences?.length > 0 && (
      <div key="ge">
        <SectionTitle isArabic={isArabic}>
          {t("sections.generalExperiences")}
        </SectionTitle>
        {data.generalExperiences.map((ge, i) => (
          <Entry key={i}>
            <EntryTitle>{ge.experienceTitle}</EntryTitle>
            <Meta>
              {[
                ge.authority,
                ge.countryOrCity,
                dateRange(ge.startDate, ge.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Teaching Experiences
    data.teachingExperiences?.length > 0 && (
      <div key="te">
        <SectionTitle isArabic={isArabic}>
          {t("sections.teachingExperiences")}
        </SectionTitle>
        {data.teachingExperiences.map((te, i) => (
          <Entry key={i}>
            <EntryTitle>{te.courseName}</EntryTitle>
            <Meta>
              {[
                te.academicLevel,
                te.universityOrFaculty,
                dateRange(te.startDate, te.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Scientific Missions
    data.scientificMissions?.length > 0 && (
      <div key="sm">
        <SectionTitle isArabic={isArabic}>
          {t("sections.scientificMissions")}
        </SectionTitle>
        {data.scientificMissions.map((sm, i) => (
          <Entry key={i}>
            <EntryTitle>{sm.missionName}</EntryTitle>
            <Meta>
              {[
                sm.universityOrFaculty,
                sm.countryOrCity,
                dateRange(sm.startDate, sm.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Conferences & Seminars
    data.conferencesAndSeminars?.length > 0 && (
      <div key="cs">
        <SectionTitle isArabic={isArabic}>
          {t("sections.conferencesAndSeminars")}
        </SectionTitle>
        {data.conferencesAndSeminars.map((cs, i) => (
          <Entry key={i}>
            <EntryTitle>{cs.name}</EntryTitle>
            <Meta>
              {[
                getVal(cs.roleOfParticipation, isArabic),
                cs.organizingAuthority,
                cs.venue,
                dateRange(cs.startDate, cs.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Training Programs
    data.trainingPrograms?.length > 0 && (
      <div key="tp">
        <SectionTitle isArabic={isArabic}>
          {t("sections.trainingPrograms")}
        </SectionTitle>
        {data.trainingPrograms.map((tp, i) => (
          <Entry key={i}>
            <EntryTitle>{tp.trainingProgramName}</EntryTitle>
            <Meta>
              {[tp.venue, dateRange(tp.startDate, tp.endDate, isArabic)]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Projects
    data.projects?.length > 0 && (
      <div key="proj">
        <SectionTitle isArabic={isArabic}>
          {t("sections.projects")}
        </SectionTitle>
        {data.projects.map((p, i) => (
          <Entry key={i}>
            <EntryTitle>{p.nameOfProject}</EntryTitle>
            <Meta>
              {[
                getVal(p.typeOfProject, isArabic),
                getVal(p.participationRole, isArabic),
                p.financingAuthority,
                dateRange(p.startDate, p.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Scientific Writings
    data.scientificWritings?.length > 0 && (
      <div key="sw">
        <SectionTitle isArabic={isArabic}>
          {t("sections.scientificWritings")}
        </SectionTitle>
        {data.scientificWritings.map((sw, i) => (
          <Entry key={i}>
            <EntryTitle>{sw.title}</EntryTitle>
            <Meta>
              {[
                getVal(sw.authorRole, isArabic),
                sw.publishingHouse,
                sw.isbn,
                fmt(sw.publishingDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Patents
    data.patents?.length > 0 && (
      <div key="pat">
        <SectionTitle isArabic={isArabic}>{t("sections.patents")}</SectionTitle>
        {data.patents.map((p, i) => (
          <Entry key={i}>
            <EntryTitle>{p.nameOfPatent}</EntryTitle>
            <Meta>
              {[
                p.accreditingAuthorityOrCountry,
                fmt(p.accreditationDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Committees & Associations
    data.committeesAndAssociations?.length > 0 && (
      <div key="ca">
        <SectionTitle isArabic={isArabic}>
          {t("sections.committeesAndAssociations")}
        </SectionTitle>
        {data.committeesAndAssociations.map((ca, i) => (
          <Entry key={i}>
            <EntryTitle>{ca.nameOfCommitteeOrAssociation}</EntryTitle>
            <Meta>
              {[
                getVal(ca.typeOfCommitteeOrAssociation, isArabic),
                getVal(ca.degreeOfSubscription, isArabic),
                dateRange(ca.startDate, ca.endDate, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Participation in Magazines
    data.participationInMagazines?.length > 0 && (
      <div key="pim">
        <SectionTitle isArabic={isArabic}>
          {t("sections.participationInMagazines")}
        </SectionTitle>
        {data.participationInMagazines.map((pm, i) => (
          <Entry key={i}>
            <EntryTitle>{pm.nameOfMagazine}</EntryTitle>
            <Meta>{getVal(pm.typeOfParticipation, isArabic)}</Meta>
          </Entry>
        ))}
      </div>
    ),
    // Reviewing Articles
    data.reviewingArticles?.length > 0 && (
      <div key="ra">
        <SectionTitle isArabic={isArabic}>
          {t("sections.reviewingArticles")}
        </SectionTitle>
        {data.reviewingArticles.map((ra, i) => (
          <Entry key={i}>
            <EntryTitle>{ra.titleOfArticle}</EntryTitle>
            <Meta>
              {[ra.authority, fmt(ra.reviewingDate, isArabic)]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Prizes & Rewards
    data.prizesAndRewards?.length > 0 && (
      <div key="pr">
        <SectionTitle isArabic={isArabic}>
          {t("sections.prizesAndRewards")}
        </SectionTitle>
        {data.prizesAndRewards.map((pr, i) => (
          <Entry key={i}>
            <EntryTitle>{getVal(pr.prize, isArabic)}</EntryTitle>
            <Meta>
              {[pr.awardingAuthority, fmt(pr.dateReceived, isArabic)]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Manifestations
    data.manifestationsOfScientificAppreciation?.length > 0 && (
      <div key="msa">
        <SectionTitle isArabic={isArabic}>
          {t("sections.manifestationsOfScientificAppreciation")}
        </SectionTitle>
        {data.manifestationsOfScientificAppreciation.map((m, i) => (
          <Entry key={i}>
            <EntryTitle>{m.titleOfAppreciation}</EntryTitle>
            <Meta>
              {[m.issuingAuthority, fmt(m.dateOfAppreciation, isArabic)]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Community Service
    data.contributionsToCommunityService?.length > 0 && (
      <div key="ccs">
        <SectionTitle isArabic={isArabic}>
          {t("sections.contributionsToCommunityService")}
        </SectionTitle>
        {data.contributionsToCommunityService.map((c, i) => (
          <Entry key={i}>
            <EntryTitle>{c.contributionTitle}</EntryTitle>
            <Meta>{fmt(c.dateOfContribution, isArabic)}</Meta>
          </Entry>
        ))}
      </div>
    ),
    // University Contributions
    data.contributionsToUniversity?.length > 0 && (
      <div key="cu">
        <SectionTitle isArabic={isArabic}>
          {t("sections.contributionsToUniversity")}
        </SectionTitle>
        {data.contributionsToUniversity.map((c, i) => (
          <Entry key={i}>
            <EntryTitle>{c.contributionTitle}</EntryTitle>
            <Meta>
              {[
                getVal(c.typeOfContribution, isArabic),
                fmt(c.dateOfContribution, isArabic),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Meta>
          </Entry>
        ))}
      </div>
    ),
    // Quality Work
    data.participationInQualityWork?.length > 0 && (
      <div key="pqw">
        <SectionTitle isArabic={isArabic}>
          {t("sections.participationInQualityWork")}
        </SectionTitle>
        {data.participationInQualityWork.map((pq, i) => (
          <Entry key={i}>
            <EntryTitle>{pq.participationTitle}</EntryTitle>
            <Meta>{dateRange(pq.startDate, pq.endDate, isArabic)}</Meta>
          </Entry>
        ))}
      </div>
    ),
  ].filter(Boolean);

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
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
        }}
      >
        {/* Left: main content 65% */}
        <div
          style={{
            flex: "1 1 60%",
            minWidth: 280,
            padding: "clamp(14px,2vw,32px)",
            borderRight: isArabic ? "none" : `1px solid #e2e8f0`,
            borderLeft: isArabic ? `1px solid #e2e8f0` : "none",
          }}
        >
          {/* Bio */}
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

          {leftSections}
        </div>

        {/* Right: sidebar 35% */}
        <div
          style={{
            flex: "0 0 clamp(200px,32%,340px)",
            background: LIGHT,
            padding: "clamp(14px,2vw,32px)",
          }}
        >
          {/* Contact */}
          {(data.officialEmail ||
            data.mainPhoneNumber ||
            data.workPhoneNumber ||
            data.faxNumber) && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.contactInfo")}
              </SectionTitle>
              {data.officialEmail && (
                <div
                  style={{
                    fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    {t("contact.email")}:{" "}
                  </span>
                  {data.officialEmail}
                </div>
              )}
              {data.mainPhoneNumber && (
                <div
                  style={{
                    fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    {t("contact.phone")}:{" "}
                  </span>
                  {data.mainPhoneNumber}
                </div>
              )}
              {data.workPhoneNumber && (
                <div
                  style={{
                    fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    {t("contact.workPhone")}:{" "}
                  </span>
                  {data.workPhoneNumber}
                </div>
              )}
              {data.faxNumber && (
                <div
                  style={{
                    fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#64748b" }}>{t("contact.fax")}: </span>
                  {data.faxNumber}
                </div>
              )}
            </div>
          )}

          {/* Birth Date */}
          {data.birthDate && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: "clamp(0.6rem,0.8vw,0.85rem)",
                  color: "#64748b",
                }}
              >
                {t("fields.date")}:
              </div>
              <div
                style={{
                  fontSize: "clamp(0.65rem,0.82vw,0.9rem)",
                  color: "#1e293b",
                }}
              >
                {fmt(data.birthDate, isArabic)}
              </div>
            </div>
          )}

          {/* Skills */}
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

          {/* Social Links */}
          {(data.linkedIn ||
            data.googleScholar ||
            data.scopus ||
            data.personalWebsite ||
            data.instagram ||
            data.facebook ||
            data.x ||
            data.youTube) && (
            <div>
              <SectionTitle isArabic={isArabic}>
                {t("sections.socialMedia")}
              </SectionTitle>
              {[
                { label: "LinkedIn", val: data.linkedIn },
                { label: "Google Scholar", val: data.googleScholar },
                { label: "Scopus", val: data.scopus },
                { label: t("fields.website"), val: data.personalWebsite },
                { label: "Instagram", val: data.instagram },
                { label: "Facebook", val: data.facebook },
                { label: "X", val: data.x },
                { label: "YouTube", val: data.youTube },
              ]
                .filter((l) => l.val)
                .map((l, i) => (
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
