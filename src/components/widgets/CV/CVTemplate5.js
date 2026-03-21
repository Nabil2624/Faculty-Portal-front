// Template 5 — Timeline (vertical timeline with gold dots and navy line)
import React from "react";

const NAVY = "#19355a";
const GOLD = "#b38e19";
const LIGHT = "#f8fafc";

const getVal = (obj, isArabic) =>
  obj ? (isArabic ? obj.valueAr : obj.valueEn) || "" : "";

const fmt = (d, isArabic) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
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
            {getVal(data.department, isArabic) && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "clamp(4px,0.5vw,8px) clamp(10px,1.2vw,18px)",
                  color: "#e2e8f0",
                  fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
                }}
              >
                {getVal(data.department, isArabic)}
              </div>
            )}
            {getVal(data.university, isArabic) && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "clamp(4px,0.5vw,8px) clamp(10px,1.2vw,18px)",
                  color: "#e2e8f0",
                  fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
                }}
              >
                {getVal(data.university, isArabic)}
              </div>
            )}
            {data.officialEmail && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "clamp(4px,0.5vw,8px) clamp(10px,1.2vw,18px)",
                  color: "#e2e8f0",
                  fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
                }}
              >
                {data.officialEmail}
              </div>
            )}
            {data.mainPhoneNumber && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "clamp(4px,0.5vw,8px) clamp(10px,1.2vw,18px)",
                  color: "#e2e8f0",
                  fontSize: "clamp(0.6rem,0.78vw,0.85rem)",
                }}
              >
                {data.mainPhoneNumber}
              </div>
            )}
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

        {/* Skills + Social */}
        {(data.skills?.length > 0 || data.linkedIn || data.googleScholar) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(10px,1.2vw,20px)",
              marginBottom: "clamp(10px,1.2vw,20px)",
            }}
          >
            {data.skills?.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "clamp(8px,1vw,16px)",
                  flex: "1 1 200px",
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
          </div>
        )}

        {/* Academic Qualifications timeline */}
        {data.academicQualifications?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.academicQualifications")}
            </SectionTitle>
            {data.academicQualifications.map((aq, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(aq.dateOfObtainingTheQualification, isArabic)}
                title={`${getVal(aq.qualification, isArabic)}${aq.specialization ? ` — ${aq.specialization}` : ""}`}
                meta={[
                  getVal(aq.grade, isArabic),
                  aq.universityOrFaculty,
                  aq.countryOrCity,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(jr.dateOfJobRank, isArabic)}
                title={getVal(jr.jobRank, isArabic)}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(ap.startDate, ap.endDate, isArabic)}
                title={ap.position}
              />
            ))}
          </>
        )}

        {/* General & Teaching Experiences */}
        {data.generalExperiences?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.generalExperiences")}
            </SectionTitle>
            {data.generalExperiences.map((ge, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(ge.startDate, ge.endDate, isArabic)}
                title={ge.experienceTitle}
                meta={[ge.authority, ge.countryOrCity]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {data.teachingExperiences?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.teachingExperiences")}
            </SectionTitle>
            {data.teachingExperiences.map((te, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(te.startDate, te.endDate, isArabic)}
                title={te.courseName}
                meta={[te.academicLevel, te.universityOrFaculty]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(sm.startDate, sm.endDate, isArabic)}
                title={sm.missionName}
                meta={[sm.universityOrFaculty, sm.countryOrCity]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(cs.startDate, cs.endDate, isArabic)}
                title={cs.name}
                meta={[
                  getVal(cs.roleOfParticipation, isArabic),
                  cs.organizingAuthority,
                  cs.venue,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(tp.startDate, tp.endDate, isArabic)}
                title={tp.trainingProgramName}
                meta={tp.venue}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(p.startDate, p.endDate, isArabic)}
                title={p.nameOfProject}
                meta={[getVal(p.typeOfProject, isArabic), p.financingAuthority]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(sw.publishingDate, isArabic)}
                title={sw.title}
                meta={[
                  getVal(sw.authorRole, isArabic),
                  sw.publishingHouse,
                  sw.isbn,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(p.accreditationDate, isArabic)}
                title={p.nameOfPatent}
                meta={p.accreditingAuthorityOrCountry}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(ca.startDate, ca.endDate, isArabic)}
                title={ca.nameOfCommitteeOrAssociation}
                meta={[
                  getVal(ca.typeOfCommitteeOrAssociation, isArabic),
                  getVal(ca.degreeOfSubscription, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Prizes & Manifestations */}
        {data.prizesAndRewards?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.prizesAndRewards")}
            </SectionTitle>
            {data.prizesAndRewards.map((pr, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(pr.dateReceived, isArabic)}
                title={getVal(pr.prize, isArabic)}
                meta={pr.awardingAuthority}
              />
            ))}
          </>
        )}

        {data.manifestationsOfScientificAppreciation?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.manifestationsOfScientificAppreciation")}
            </SectionTitle>
            {data.manifestationsOfScientificAppreciation.map((m, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(m.dateOfAppreciation, isArabic)}
                title={m.titleOfAppreciation}
                meta={m.issuingAuthority}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(c.dateOfContribution, isArabic)}
                title={c.contributionTitle}
              />
            ))}
          </>
        )}
        {data.contributionsToUniversity?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.contributionsToUniversity")}
            </SectionTitle>
            {data.contributionsToUniversity.map((c, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(c.dateOfContribution, isArabic)}
                title={c.contributionTitle}
                meta={getVal(c.typeOfContribution, isArabic)}
              />
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
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={dateRange(pq.startDate, pq.endDate, isArabic)}
                title={pq.participationTitle}
              />
            ))}
          </>
        )}

        {/* Magazines & Articles */}
        {data.participationInMagazines?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.participationInMagazines")}
            </SectionTitle>
            {data.participationInMagazines.map((pm, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr=""
                title={pm.nameOfMagazine}
                meta={getVal(pm.typeOfParticipation, isArabic)}
              />
            ))}
          </>
        )}
        {data.reviewingArticles?.length > 0 && (
          <>
            <SectionTitle isArabic={isArabic}>
              {t("sections.reviewingArticles")}
            </SectionTitle>
            {data.reviewingArticles.map((ra, i) => (
              <TimelineItem
                key={i}
                isArabic={isArabic}
                dateStr={fmt(ra.reviewingDate, isArabic)}
                title={ra.titleOfArticle}
                meta={ra.authority}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
