// Template 4 — Professional (navy sidebar + white main content)
import React from "react";

const NAVY = "#19355a";
const GOLD = "#b38e19";

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

function MainSectionTitle({ children, isArabic }) {
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

export default function CVTemplate4({ data, isArabic, t }) {
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

        {/* Name */}
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
          {/* Contact */}
          {(data.officialEmail ||
            data.mainPhoneNumber ||
            data.workPhoneNumber ||
            data.faxNumber) && (
            <SidebarSection title={t("sections.contactInfo")}>
              {data.officialEmail && (
                <SidebarText>{data.officialEmail}</SidebarText>
              )}
              {data.mainPhoneNumber && (
                <SidebarText>
                  {t("contact.phone")}: {data.mainPhoneNumber}
                </SidebarText>
              )}
              {data.workPhoneNumber && (
                <SidebarText>
                  {t("contact.workPhone")}: {data.workPhoneNumber}
                </SidebarText>
              )}
              {data.faxNumber && (
                <SidebarText>
                  {t("contact.fax")}: {data.faxNumber}
                </SidebarText>
              )}
            </SidebarSection>
          )}

          {/* Birth date */}
          {data.birthDate && (
            <SidebarSection title={t("fields.date")}>
              <SidebarText>{fmt(data.birthDate, isArabic)}</SidebarText>
            </SidebarSection>
          )}

          {/* Skills */}
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

          {/* Social links */}
          {(data.linkedIn ||
            data.googleScholar ||
            data.scopus ||
            data.personalWebsite ||
            data.instagram ||
            data.facebook ||
            data.x ||
            data.youTube) && (
            <SidebarSection title={t("sections.socialMedia")}>
              {data.linkedIn && (
                <SidebarText>LinkedIn: {data.linkedIn}</SidebarText>
              )}
              {data.googleScholar && (
                <SidebarText>Scholar: {data.googleScholar}</SidebarText>
              )}
              {data.scopus && <SidebarText>Scopus: {data.scopus}</SidebarText>}
              {data.personalWebsite && (
                <SidebarText>{data.personalWebsite}</SidebarText>
              )}
              {data.instagram && (
                <SidebarText>Instagram: {data.instagram}</SidebarText>
              )}
              {data.facebook && (
                <SidebarText>Facebook: {data.facebook}</SidebarText>
              )}
              {data.x && <SidebarText>X: {data.x}</SidebarText>}
              {data.youTube && (
                <SidebarText>YouTube: {data.youTube}</SidebarText>
              )}
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
        {/* Affiliation */}
        {(getVal(data.department, isArabic) ||
          getVal(data.university, isArabic)) && (
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

        {/* Bio */}
        {data.bioSummary && (
          <div style={{ marginBottom: "clamp(10px,1.2vw,20px)" }}>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.bio")}
            </MainSectionTitle>
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

        {/* Academic Qualifications */}
        {data.academicQualifications?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.academicQualifications")}
            </MainSectionTitle>
            {data.academicQualifications.map((aq, i) => (
              <EntryItem
                key={i}
                title={`${getVal(aq.qualification, isArabic)}${aq.specialization ? ` — ${aq.specialization}` : ""}`}
                meta={[
                  getVal(aq.grade, isArabic),
                  aq.universityOrFaculty,
                  aq.countryOrCity,
                  fmt(aq.dateOfObtainingTheQualification, isArabic),
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
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.jobRanks")}
            </MainSectionTitle>
            {data.jobRanks.map((jr, i) => (
              <EntryItem
                key={i}
                title={getVal(jr.jobRank, isArabic)}
                meta={fmt(jr.dateOfJobRank, isArabic)}
              />
            ))}
          </>
        )}

        {/* Administrative Positions */}
        {data.administrativePositions?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.administrativePositions")}
            </MainSectionTitle>
            {data.administrativePositions.map((ap, i) => (
              <EntryItem
                key={i}
                title={ap.position}
                meta={dateRange(ap.startDate, ap.endDate, isArabic)}
              />
            ))}
          </>
        )}

        {/* General Experiences */}
        {data.generalExperiences?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.generalExperiences")}
            </MainSectionTitle>
            {data.generalExperiences.map((ge, i) => (
              <EntryItem
                key={i}
                title={ge.experienceTitle}
                meta={[
                  ge.authority,
                  ge.countryOrCity,
                  dateRange(ge.startDate, ge.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Teaching Experiences */}
        {data.teachingExperiences?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.teachingExperiences")}
            </MainSectionTitle>
            {data.teachingExperiences.map((te, i) => (
              <EntryItem
                key={i}
                title={te.courseName}
                meta={[
                  te.academicLevel,
                  te.universityOrFaculty,
                  dateRange(te.startDate, te.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Scientific Missions */}
        {data.scientificMissions?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.scientificMissions")}
            </MainSectionTitle>
            {data.scientificMissions.map((sm, i) => (
              <EntryItem
                key={i}
                title={sm.missionName}
                meta={[
                  sm.universityOrFaculty,
                  sm.countryOrCity,
                  dateRange(sm.startDate, sm.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Conferences */}
        {data.conferencesAndSeminars?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.conferencesAndSeminars")}
            </MainSectionTitle>
            {data.conferencesAndSeminars.map((cs, i) => (
              <EntryItem
                key={i}
                title={cs.name}
                meta={[
                  getVal(cs.roleOfParticipation, isArabic),
                  cs.organizingAuthority,
                  cs.venue,
                  dateRange(cs.startDate, cs.endDate, isArabic),
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
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.trainingPrograms")}
            </MainSectionTitle>
            {data.trainingPrograms.map((tp, i) => (
              <EntryItem
                key={i}
                title={tp.trainingProgramName}
                meta={[tp.venue, dateRange(tp.startDate, tp.endDate, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.projects")}
            </MainSectionTitle>
            {data.projects.map((p, i) => (
              <EntryItem
                key={i}
                title={p.nameOfProject}
                meta={[
                  getVal(p.typeOfProject, isArabic),
                  getVal(p.participationRole, isArabic),
                  p.financingAuthority,
                  dateRange(p.startDate, p.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Scientific Writings */}
        {data.scientificWritings?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.scientificWritings")}
            </MainSectionTitle>
            {data.scientificWritings.map((sw, i) => (
              <EntryItem
                key={i}
                title={sw.title}
                meta={[
                  getVal(sw.authorRole, isArabic),
                  sw.publishingHouse,
                  sw.isbn,
                  fmt(sw.publishingDate, isArabic),
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
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.patents")}
            </MainSectionTitle>
            {data.patents.map((p, i) => (
              <EntryItem
                key={i}
                title={p.nameOfPatent}
                meta={[
                  p.accreditingAuthorityOrCountry,
                  fmt(p.accreditationDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Committees */}
        {data.committeesAndAssociations?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.committeesAndAssociations")}
            </MainSectionTitle>
            {data.committeesAndAssociations.map((ca, i) => (
              <EntryItem
                key={i}
                title={ca.nameOfCommitteeOrAssociation}
                meta={[
                  getVal(ca.typeOfCommitteeOrAssociation, isArabic),
                  getVal(ca.degreeOfSubscription, isArabic),
                  dateRange(ca.startDate, ca.endDate, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Magazines, Articles */}
        {data.participationInMagazines?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.participationInMagazines")}
            </MainSectionTitle>
            {data.participationInMagazines.map((pm, i) => (
              <EntryItem
                key={i}
                title={pm.nameOfMagazine}
                meta={getVal(pm.typeOfParticipation, isArabic)}
              />
            ))}
          </>
        )}

        {data.reviewingArticles?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.reviewingArticles")}
            </MainSectionTitle>
            {data.reviewingArticles.map((ra, i) => (
              <EntryItem
                key={i}
                title={ra.titleOfArticle}
                meta={[ra.authority, fmt(ra.reviewingDate, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Awards */}
        {data.prizesAndRewards?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.prizesAndRewards")}
            </MainSectionTitle>
            {data.prizesAndRewards.map((pr, i) => (
              <EntryItem
                key={i}
                title={getVal(pr.prize, isArabic)}
                meta={[pr.awardingAuthority, fmt(pr.dateReceived, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Manifestations */}
        {data.manifestationsOfScientificAppreciation?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.manifestationsOfScientificAppreciation")}
            </MainSectionTitle>
            {data.manifestationsOfScientificAppreciation.map((m, i) => (
              <EntryItem
                key={i}
                title={m.titleOfAppreciation}
                meta={[m.issuingAuthority, fmt(m.dateOfAppreciation, isArabic)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Contributions */}
        {data.contributionsToCommunityService?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.contributionsToCommunityService")}
            </MainSectionTitle>
            {data.contributionsToCommunityService.map((c, i) => (
              <EntryItem
                key={i}
                title={c.contributionTitle}
                meta={fmt(c.dateOfContribution, isArabic)}
              />
            ))}
          </>
        )}
        {data.contributionsToUniversity?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.contributionsToUniversity")}
            </MainSectionTitle>
            {data.contributionsToUniversity.map((c, i) => (
              <EntryItem
                key={i}
                title={c.contributionTitle}
                meta={[
                  getVal(c.typeOfContribution, isArabic),
                  fmt(c.dateOfContribution, isArabic),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </>
        )}

        {/* Quality Work */}
        {data.participationInQualityWork?.length > 0 && (
          <>
            <MainSectionTitle isArabic={isArabic}>
              {t("sections.participationInQualityWork")}
            </MainSectionTitle>
            {data.participationInQualityWork.map((pq, i) => (
              <EntryItem
                key={i}
                title={pq.participationTitle}
                meta={dateRange(pq.startDate, pq.endDate, isArabic)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
