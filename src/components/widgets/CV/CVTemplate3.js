// Template 3 — Academic (gold top bar, split header, navy table-style sections)
import React from "react";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT_GOLD = "#fdf8ec";
const LINE = "#e2e8f0";

const getVal = (obj, isArabic) =>
  obj ? (isArabic ? obj.valueAr : obj.valueEn) || "" : "";

const fmt = (d, isArabic) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
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

export default function CVTemplate3({ data, isArabic, t }) {
  if (!data) return null;
  const dir = isArabic ? "rtl" : "ltr";

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
        {/* Academic Qualifications */}
        {data.academicQualifications?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.academicQualifications")}
            </SectionTitle>
            {data.academicQualifications.map((aq, i) => (
              <EntryCard key={i}>
                <EntryTitle>
                  {getVal(aq.qualification, isArabic)}
                  {aq.specialization ? ` — ${aq.specialization}` : ""}
                </EntryTitle>
                <TableRow
                  label={t("fields.grade")}
                  value={getVal(aq.grade, isArabic)}
                />
                <TableRow
                  label={t("fields.dispatchType")}
                  value={getVal(aq.dispatchType, isArabic)}
                />
                <TableRow
                  label={t("fields.universityOrFaculty")}
                  value={aq.universityOrFaculty}
                />
                <TableRow
                  label={t("fields.countryOrCity")}
                  value={aq.countryOrCity}
                />
                <TableRow
                  label={t("fields.dateObtained")}
                  value={fmt(aq.dateOfObtainingTheQualification, isArabic)}
                />
              </EntryCard>
            ))}
          </>
        )}

        {/* Job Ranks */}
        {data.jobRanks?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.jobRanks")}
            </SectionTitle>
            {data.jobRanks.map((jr, i) => (
              <EntryCard key={i}>
                <EntryTitle>{getVal(jr.jobRank, isArabic)}</EntryTitle>
                <Meta>{fmt(jr.dateOfJobRank, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Administrative Positions */}
        {data.administrativePositions?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.administrativePositions")}
            </SectionTitle>
            {data.administrativePositions.map((ap, i) => (
              <EntryCard key={i}>
                <EntryTitle>{ap.position}</EntryTitle>
                <Meta>{dateRange(ap.startDate, ap.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Experiences */}
        {data.generalExperiences?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.generalExperiences")}
            </SectionTitle>
            {data.generalExperiences.map((ge, i) => (
              <EntryCard key={i}>
                <EntryTitle>{ge.experienceTitle}</EntryTitle>
                <TableRow label={t("fields.authority")} value={ge.authority} />
                <TableRow
                  label={t("fields.countryOrCity")}
                  value={ge.countryOrCity}
                />
                <Meta>{dateRange(ge.startDate, ge.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Teaching Experiences */}
        {data.teachingExperiences?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.teachingExperiences")}
            </SectionTitle>
            {data.teachingExperiences.map((te, i) => (
              <EntryCard key={i}>
                <EntryTitle>{te.courseName}</EntryTitle>
                <TableRow
                  label={t("fields.academicLevel")}
                  value={te.academicLevel}
                />
                <TableRow
                  label={t("fields.universityOrFaculty")}
                  value={te.universityOrFaculty}
                />
                <Meta>{dateRange(te.startDate, te.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Scientific Missions */}
        {data.scientificMissions?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.scientificMissions")}
            </SectionTitle>
            {data.scientificMissions.map((sm, i) => (
              <EntryCard key={i}>
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
              </EntryCard>
            ))}
          </>
        )}

        {/* Conferences */}
        {data.conferencesAndSeminars?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.conferencesAndSeminars")}
            </SectionTitle>
            {data.conferencesAndSeminars.map((cs, i) => (
              <EntryCard key={i}>
                <EntryTitle>{cs.name}</EntryTitle>
                <TableRow
                  label={t("fields.role")}
                  value={getVal(cs.roleOfParticipation, isArabic)}
                />
                <TableRow
                  label={t("fields.authority")}
                  value={cs.organizingAuthority}
                />
                <TableRow label={t("fields.venue")} value={cs.venue} />
                <Meta>{dateRange(cs.startDate, cs.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Training Programs */}
        {data.trainingPrograms?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.trainingPrograms")}
            </SectionTitle>
            {data.trainingPrograms.map((tp, i) => (
              <EntryCard key={i}>
                <EntryTitle>{tp.trainingProgramName}</EntryTitle>
                <Meta>
                  {[tp.venue, dateRange(tp.startDate, tp.endDate, isArabic)]
                    .filter(Boolean)
                    .join(" · ")}
                </Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.projects")}
            </SectionTitle>
            {data.projects.map((p, i) => (
              <EntryCard key={i}>
                <EntryTitle>{p.nameOfProject}</EntryTitle>
                <TableRow
                  label={t("fields.type")}
                  value={getVal(p.typeOfProject, isArabic)}
                />
                <TableRow
                  label={t("fields.role")}
                  value={getVal(p.participationRole, isArabic)}
                />
                <TableRow
                  label={t("fields.financing")}
                  value={p.financingAuthority}
                />
                <Meta>{dateRange(p.startDate, p.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Scientific Writings */}
        {data.scientificWritings?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.scientificWritings")}
            </SectionTitle>
            {data.scientificWritings.map((sw, i) => (
              <EntryCard key={i}>
                <EntryTitle>{sw.title}</EntryTitle>
                <TableRow
                  label={t("fields.role")}
                  value={getVal(sw.authorRole, isArabic)}
                />
                <TableRow
                  label={t("fields.publishingHouse")}
                  value={sw.publishingHouse}
                />
                <TableRow label={t("fields.isbn")} value={sw.isbn} />
                <Meta>{fmt(sw.publishingDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Patents */}
        {data.patents?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.patents")}
            </SectionTitle>
            {data.patents.map((p, i) => (
              <EntryCard key={i}>
                <EntryTitle>{p.nameOfPatent}</EntryTitle>
                <Meta>
                  {[
                    p.accreditingAuthorityOrCountry,
                    fmt(p.accreditationDate, isArabic),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Committees */}
        {data.committeesAndAssociations?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.committeesAndAssociations")}
            </SectionTitle>
            {data.committeesAndAssociations.map((ca, i) => (
              <EntryCard key={i}>
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
              </EntryCard>
            ))}
          </>
        )}

        {/* Prizes & Rewards */}
        {data.prizesAndRewards?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.prizesAndRewards")}
            </SectionTitle>
            {data.prizesAndRewards.map((pr, i) => (
              <EntryCard key={i}>
                <EntryTitle>{getVal(pr.prize, isArabic)}</EntryTitle>
                <Meta>
                  {[pr.awardingAuthority, fmt(pr.dateReceived, isArabic)]
                    .filter(Boolean)
                    .join(" · ")}
                </Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Manifestations */}
        {data.manifestationsOfScientificAppreciation?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.manifestationsOfScientificAppreciation")}
            </SectionTitle>
            {data.manifestationsOfScientificAppreciation.map((m, i) => (
              <EntryCard key={i}>
                <EntryTitle>{m.titleOfAppreciation}</EntryTitle>
                <Meta>
                  {[m.issuingAuthority, fmt(m.dateOfAppreciation, isArabic)]
                    .filter(Boolean)
                    .join(" · ")}
                </Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Contributions */}
        {data.contributionsToCommunityService?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.contributionsToCommunityService")}
            </SectionTitle>
            {data.contributionsToCommunityService.map((c, i) => (
              <EntryCard key={i}>
                <EntryTitle>{c.contributionTitle}</EntryTitle>
                <Meta>{fmt(c.dateOfContribution, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}
        {data.contributionsToUniversity?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.contributionsToUniversity")}
            </SectionTitle>
            {data.contributionsToUniversity.map((c, i) => (
              <EntryCard key={i}>
                <EntryTitle>{c.contributionTitle}</EntryTitle>
                <Meta>
                  {[
                    getVal(c.typeOfContribution, isArabic),
                    fmt(c.dateOfContribution, isArabic),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Meta>
              </EntryCard>
            ))}
          </>
        )}

        {/* Quality Work */}
        {data.participationInQualityWork?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.participationInQualityWork")}
            </SectionTitle>
            {data.participationInQualityWork.map((pq, i) => (
              <EntryCard key={i}>
                <EntryTitle>{pq.participationTitle}</EntryTitle>
                <Meta>{dateRange(pq.startDate, pq.endDate, isArabic)}</Meta>
              </EntryCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
