// Template 2 — Classic (single-column, minimal, traditional academic look)
import React from "react";

const DARK = "#1a1a2e";
const GRAY = "#64748b";
const LINE = "#e2e8f0";

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

export default function CVTemplate2({ data, isArabic, t }) {
  if (!data) return null;
  const dir = isArabic ? "rtl" : "ltr";

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

      {/* Academic Qualifications */}
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

      {/* Job Ranks */}
      {data.jobRanks?.length > 0 && (
        <>
          <SectionTitle>{t("sections.jobRanks")}</SectionTitle>
          {data.jobRanks.map((jr, i) => (
            <Row key={i}>
              <Strong>{getVal(jr.jobRank, isArabic)}</Strong>
              <InfoLine>{fmt(jr.dateOfJobRank, isArabic)}</InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Administrative Positions */}
      {data.administrativePositions?.length > 0 && (
        <>
          <SectionTitle>{t("sections.administrativePositions")}</SectionTitle>
          {data.administrativePositions.map((ap, i) => (
            <Row key={i}>
              <Strong>{ap.position}</Strong>
              <InfoLine>
                {dateRange(ap.startDate, ap.endDate, isArabic)}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* General Experiences */}
      {data.generalExperiences?.length > 0 && (
        <>
          <SectionTitle>{t("sections.generalExperiences")}</SectionTitle>
          {data.generalExperiences.map((ge, i) => (
            <Row key={i}>
              <Strong>{ge.experienceTitle}</Strong>
              <InfoLine>
                {[
                  ge.authority,
                  ge.countryOrCity,
                  dateRange(ge.startDate, ge.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Teaching Experiences */}
      {data.teachingExperiences?.length > 0 && (
        <>
          <SectionTitle>{t("sections.teachingExperiences")}</SectionTitle>
          {data.teachingExperiences.map((te, i) => (
            <Row key={i}>
              <Strong>{te.courseName}</Strong>
              <InfoLine>
                {[
                  te.academicLevel,
                  te.universityOrFaculty,
                  dateRange(te.startDate, te.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Scientific Missions */}
      {data.scientificMissions?.length > 0 && (
        <>
          <SectionTitle>{t("sections.scientificMissions")}</SectionTitle>
          {data.scientificMissions.map((sm, i) => (
            <Row key={i}>
              <Strong>{sm.missionName}</Strong>
              <InfoLine>
                {[
                  sm.universityOrFaculty,
                  sm.countryOrCity,
                  dateRange(sm.startDate, sm.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Conferences */}
      {data.conferencesAndSeminars?.length > 0 && (
        <>
          <SectionTitle>{t("sections.conferencesAndSeminars")}</SectionTitle>
          {data.conferencesAndSeminars.map((cs, i) => (
            <Row key={i}>
              <Strong>{cs.name}</Strong>
              <InfoLine>
                {[
                  getVal(cs.roleOfParticipation, isArabic),
                  cs.organizingAuthority,
                  cs.venue,
                  dateRange(cs.startDate, cs.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Training Programs */}
      {data.trainingPrograms?.length > 0 && (
        <>
          <SectionTitle>{t("sections.trainingPrograms")}</SectionTitle>
          {data.trainingPrograms.map((tp, i) => (
            <Row key={i}>
              <Strong>{tp.trainingProgramName}</Strong>
              <InfoLine>
                {[tp.venue, dateRange(tp.startDate, tp.endDate, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <>
          <SectionTitle>{t("sections.projects")}</SectionTitle>
          {data.projects.map((p, i) => (
            <Row key={i}>
              <Strong>{p.nameOfProject}</Strong>
              <InfoLine>
                {[
                  getVal(p.typeOfProject, isArabic),
                  p.financingAuthority,
                  dateRange(p.startDate, p.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Scientific Writings */}
      {data.scientificWritings?.length > 0 && (
        <>
          <SectionTitle>{t("sections.scientificWritings")}</SectionTitle>
          {data.scientificWritings.map((sw, i) => (
            <Row key={i}>
              <Strong>{sw.title}</Strong>
              <InfoLine>
                {[sw.publishingHouse, sw.isbn, fmt(sw.publishingDate, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Patents */}
      {data.patents?.length > 0 && (
        <>
          <SectionTitle>{t("sections.patents")}</SectionTitle>
          {data.patents.map((p, i) => (
            <Row key={i}>
              <Strong>{p.nameOfPatent}</Strong>
              <InfoLine>
                {[
                  p.accreditingAuthorityOrCountry,
                  fmt(p.accreditationDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Committees */}
      {data.committeesAndAssociations?.length > 0 && (
        <>
          <SectionTitle>{t("sections.committeesAndAssociations")}</SectionTitle>
          {data.committeesAndAssociations.map((ca, i) => (
            <Row key={i}>
              <Strong>{ca.nameOfCommitteeOrAssociation}</Strong>
              <InfoLine>
                {[
                  getVal(ca.typeOfCommitteeOrAssociation, isArabic),
                  getVal(ca.degreeOfSubscription, isArabic),
                  dateRange(ca.startDate, ca.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Prizes & Rewards */}
      {data.prizesAndRewards?.length > 0 && (
        <>
          <SectionTitle>{t("sections.prizesAndRewards")}</SectionTitle>
          {data.prizesAndRewards.map((pr, i) => (
            <Row key={i}>
              <Strong>{getVal(pr.prize, isArabic)}</Strong>
              <InfoLine>
                {[pr.awardingAuthority, fmt(pr.dateReceived, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Manifestations */}
      {data.manifestationsOfScientificAppreciation?.length > 0 && (
        <>
          <SectionTitle>
            {t("sections.manifestationsOfScientificAppreciation")}
          </SectionTitle>
          {data.manifestationsOfScientificAppreciation.map((m, i) => (
            <Row key={i}>
              <Strong>{m.titleOfAppreciation}</Strong>
              <InfoLine>
                {[m.issuingAuthority, fmt(m.dateOfAppreciation, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Community & University Contributions */}
      {(data.contributionsToCommunityService?.length > 0 ||
        data.contributionsToUniversity?.length > 0) && (
        <>
          <SectionTitle>
            {t("sections.contributionsToCommunityService")}
          </SectionTitle>
          {data.contributionsToCommunityService?.map((c, i) => (
            <Row key={i}>
              <Strong>{c.contributionTitle}</Strong>
              <InfoLine>{fmt(c.dateOfContribution, isArabic)}</InfoLine>
            </Row>
          ))}
          {data.contributionsToUniversity?.map((c, i) => (
            <Row key={`u${i}`}>
              <Strong>{c.contributionTitle}</Strong>
              <InfoLine>
                {[
                  getVal(c.typeOfContribution, isArabic),
                  fmt(c.dateOfContribution, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </InfoLine>
            </Row>
          ))}
        </>
      )}

      {/* Quality Work */}
      {data.participationInQualityWork?.length > 0 && (
        <>
          <SectionTitle>
            {t("sections.participationInQualityWork")}
          </SectionTitle>
          {data.participationInQualityWork.map((pq, i) => (
            <Row key={i}>
              <Strong>{pq.participationTitle}</Strong>
              <InfoLine>
                {dateRange(pq.startDate, pq.endDate, isArabic)}
              </InfoLine>
            </Row>
          ))}
        </>
      )}
    </div>
  );
}
