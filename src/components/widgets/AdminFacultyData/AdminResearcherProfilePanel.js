import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FlaskConical,
  Loader2,
  AlertCircle,
  TrendingUp,
  Tag,
  BarChart2,
} from "lucide-react";
import { adminGetResearcherProfile } from "../../../services/adminFacultyData.service";

// â”€â”€â”€ Citation Bar Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CitationBarChart({ data }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.noOfCitations || 0), 1);

  // Compute nice round ticks (4 intervals)
  const rawStep = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(rawStep, 1))));
  const step = Math.ceil(rawStep / mag) * mag || 1;
  const ticks = [];
  for (let v = 0; v <= max + step; v += step) {
    ticks.push(v);
    if (v >= max) break;
  }
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  const topTick = ticks[ticks.length - 1];

  const CHART_H = "clamp(130px,17vw,260px)";
  const GAP = "clamp(0.12rem,0.28vw,0.45rem)";
  const PAD = "clamp(0.05rem,0.1vw,0.2rem)";

  return (
    <div style={{ display: "flex", gap: "clamp(0.5rem,0.8vw,1.2rem)" }}>
      {/* Y-axis labels */}
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "space-between",
          width: "clamp(26px,3.2vw,50px)",
          flexShrink: 0,
          paddingBottom: "clamp(1.5rem,2.2vw,2.4rem)",
          userSelect: "none",
        }}
      >
        {ticks.map((v) => (
          <span
            key={v}
            style={{
              fontSize: "clamp(0.46rem,0.6vw,0.85rem)",
              color: "#94a3b8",
              textAlign: "right",
              lineHeight: 1,
            }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* Chart body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Grid + bars container â€” explicit height so bar height:% resolves */}
        <div style={{ position: "relative", height: CHART_H }}>
          {/* Horizontal grid lines */}
          {ticks.map((v) => (
            <div
              key={v}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(v / topTick) * 100}%`,
                borderTop: v === 0 ? "2px solid #cbd5e1" : "1px dashed #e2e8f0",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Bars row â€” direct flex children so height:% resolves against explicit parent */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              gap: GAP,
              padding: `0 ${PAD}`,
            }}
          >
            {data.map((d) => {
              const pct = ((d.noOfCitations || 0) / topTick) * 100;
              const isHov = hovered === d.year;

              return (
                <div
                  key={d.year}
                  style={{
                    flex: 1,
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHovered(d.year)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* React tooltip â€” positioned above the bar top */}
                  {isHov && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: `calc(${Math.max(pct, 2)}% + clamp(6px,0.6vw,10px))`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#0f172a",
                        color: "#f8fafc",
                        borderRadius: "0.5rem",
                        padding:
                          "clamp(0.18rem,0.28vw,0.4rem) clamp(0.35rem,0.5vw,0.75rem)",
                        fontSize: "clamp(0.55rem,0.7vw,1rem)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 10,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                      }}
                    >
                      <span
                        style={{
                          opacity: 0.55,
                          fontWeight: 400,
                          marginRight: "0.25rem",
                          fontSize: "0.85em",
                        }}
                      >
                        {d.year}
                      </span>
                      {d.noOfCitations}
                      {/* Caret */}
                      <span
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderTop: "5px solid #0f172a",
                          display: "block",
                        }}
                      />
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: pct > 0 ? `${pct}%` : "3px",
                      background: isHov
                        ? "linear-gradient(180deg, #60a5fa 0%, #818cf8 100%)"
                        : "linear-gradient(180deg, #3b82f6 0%, #7c3aed 100%)",
                      borderRadius: `clamp(3px,0.4vw,6px) clamp(3px,0.4vw,6px) 0 0`,
                      transition:
                        "background 0.18s ease, box-shadow 0.18s ease",
                      boxShadow: isHov
                        ? "0 -4px 18px rgba(99,102,241,0.55)"
                        : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis year labels */}
        <div
          style={{
            display: "flex",
            gap: GAP,
            padding: `clamp(0.35rem,0.5vw,0.65rem) ${PAD} 0`,
          }}
        >
          {data.map((d) => (
            <div
              key={d.year}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "clamp(0.44rem,0.58vw,0.82rem)",
                color: hovered === d.year ? "#3b82f6" : "#94a3b8",
                fontWeight: hovered === d.year ? 700 : 400,
                transition: "color 0.15s",
                userSelect: "none",
              }}
            >
              {d.year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ AdminResearcherProfilePanel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AdminResearcherProfilePanel({ user }) {
  const { t, i18n } = useTranslation("AdminFacultyData");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    adminGetResearcherProfile(user.id)
      .then((r) => setProfile(r.data))
      .catch((e) =>
        setError(
          e?.response?.data?.ErrorMessage || e?.message || t("loadError"),
        ),
      )
      .finally(() => setLoading(false));
  }, [user?.id, t]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ padding: "clamp(3rem,6vw,8rem)" }}
      >
        <Loader2
          className="animate-spin"
          style={{
            width: "clamp(28px,3vw,52px)",
            height: "clamp(28px,3vw,52px)",
            color: "#2563eb",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl"
        style={{
          padding: "clamp(1rem,1.8vw,2.6rem)",
          backgroundColor: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#b91c1c",
          fontSize: "clamp(0.7rem,0.9vw,1.4rem)",
        }}
      >
        <AlertCircle
          style={{
            width: "clamp(16px,1.3vw,28px)",
            height: "clamp(16px,1.3vw,28px)",
            flexShrink: 0,
          }}
        />
        {error}
      </div>
    );
  }

  if (!profile) return null;

  // â”€â”€ Stat definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Citation stat cards
  const citationCards = [
    {
      label: t("researcherProfile.totalCitations"),
      sublabel: "All Time",
      value: profile.totalNumberOfCitiations,
      color: "#2563eb",
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      border: "#bfdbfe",
    },
    {
      label: t("researcherProfile.citationsLast5"),
      sublabel: "Last 5 Years",
      value: profile.numberOfCitiationsInLastFiveYears,
      color: "#0d9488",
      bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
      border: "#99f6e4",
    },
  ];

  // Cycling colors for interest tags
  const tagPalette = [
    { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
    { color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
    { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  ];

  return (
    <div
      dir={i18n.dir()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(1rem,1.4vw,2rem)",
      }}
    >
      {/* â”€â”€ Profile Hero Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="rounded-2xl bg-white overflow-hidden"
        style={{
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}
      >
        {/* Gradient banner */}
        <div
          style={{
            height: "clamp(44px,5vw,72px)",
            background:
              "linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #ec4899 100%)",
          }}
        />

        {/* Content row */}
        <div
          className="flex items-center gap-4 flex-wrap"
          style={{
            padding: "clamp(0.75rem,1.1vw,1.8rem) clamp(1rem,1.6vw,2.5rem)",
          }}
        >
          {/* Avatar */}
          {profile.scholarProfileImageURL ? (
            <img
              src={profile.scholarProfileImageURL}
              alt={profile.academicName}
              style={{
                width: "clamp(52px,6.5vw,92px)",
                height: "clamp(52px,6.5vw,92px)",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                flexShrink: 0,
                marginTop: "clamp(-28px,-3.5vw,-52px)",
                background: "#f9fafb",
              }}
            />
          ) : (
            <div
              style={{
                width: "clamp(52px,6.5vw,92px)",
                height: "clamp(52px,6.5vw,92px)",
                borderRadius: "50%",
                border: "3px solid #fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "clamp(-28px,-3.5vw,-52px)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.1rem,2.2vw,2.8rem)",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {(profile.academicName || user?.name || "?")[0].toUpperCase()}
              </span>
            </div>
          )}

          {/* Name / title / badges */}
          <div style={{ flex: 1, minWidth: "clamp(160px,20vw,320px)" }}>
            <div
              style={{
                fontSize: "clamp(0.85rem,1.3vw,2rem)",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              {profile.academicName || user?.name || "â€”"}
            </div>
            {profile.jobTitle && (
              <div
                style={{
                  fontSize: "clamp(0.62rem,0.82vw,1.25rem)",
                  color: "#6b7280",
                  marginTop: "0.2rem",
                }}
              >
                {profile.jobTitle}
              </div>
            )}
            <div
              className="flex flex-wrap gap-1.5"
              style={{ marginTop: "clamp(0.3rem,0.5vw,0.7rem)" }}
            >
              {profile.organisationalDomain && (
                <span
                  style={{
                    fontSize: "clamp(0.58rem,0.74vw,1.08rem)",
                    color: "#4b5563",
                    background: "#f3f4f6",
                    borderRadius: "0.4rem",
                    padding: "0.15rem 0.55rem",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {profile.organisationalDomain}
                </span>
              )}
              {profile.orcid && (
                <span
                  style={{
                    fontSize: "clamp(0.58rem,0.74vw,1.08rem)",
                    color: "#15803d",
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "0.4rem",
                    padding: "0.15rem 0.55rem",
                    fontFamily: "monospace",
                  }}
                >
                  ORCID: {profile.orcid}
                </span>
              )}
            </div>
          </div>

          {/* Scholar link button */}
          {profile.scholarProfileLink && (
            <a
              href={profile.scholarProfileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
              style={{
                padding:
                  "clamp(0.4rem,0.6vw,0.9rem) clamp(0.8rem,1.2vw,1.8rem)",
                fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <FlaskConical
                style={{
                  width: "clamp(12px,1vw,18px)",
                  height: "clamp(12px,1vw,18px)",
                }}
              />
              {t("researcherProfile.viewScholar")}
            </a>
          )}
        </div>
      </div>

      {/* Citation Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "clamp(0.75rem,1.1vw,1.6rem)",
        }}
      >
        {citationCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl"
            style={{
              padding: "clamp(1.1rem,1.7vw,2.6rem)",
              background: s.bg,
              border: `1px solid ${s.border}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(0.3rem,0.5vw,0.75rem)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                fontSize: "clamp(0.5rem,0.62vw,0.82rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: s.color,
                opacity: 0.7,
              }}
            >
              {s.sublabel}
            </span>
            <div
              style={{
                fontSize: "clamp(2rem,4.5vw,6.5rem)",
                fontWeight: 900,
                color: s.color,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {(s.value ?? 0).toLocaleString()}
            </div>
            <div
              className="flex items-center gap-1.5"
              style={{
                fontSize: "clamp(0.6rem,0.82vw,1.15rem)",
                color: s.color,
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              <TrendingUp
                style={{
                  width: "clamp(11px,1vw,16px)",
                  height: "clamp(11px,1vw,16px)",
                  flexShrink: 0,
                }}
              />
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Citation Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {Array.isArray(profile.researcherCites) &&
        profile.researcherCites.length > 0 && (
          <div
            className="rounded-2xl bg-white"
            style={{
              padding: "clamp(1rem,1.5vw,2.4rem)",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 flex-wrap"
              style={{ marginBottom: "clamp(1rem,1.4vw,2rem)" }}
            >
              <BarChart2
                style={{
                  width: "clamp(14px,1.2vw,22px)",
                  height: "clamp(14px,1.2vw,22px)",
                  color: "#2563eb",
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(0.75rem,1vw,1.6rem)",
                  color: "#111827",
                }}
              >
                {t("researcherProfile.citationsPerYear")}
              </span>
            </div>

            <CitationBarChart data={profile.researcherCites} />
          </div>
        )}

      {/* â”€â”€ Research Interests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {Array.isArray(profile.researcherInterests) &&
        profile.researcherInterests.length > 0 && (
          <div
            className="rounded-2xl bg-white"
            style={{
              padding: "clamp(1rem,1.5vw,2.4rem)",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: "clamp(0.6rem,1vw,1.4rem)" }}
            >
              <Tag
                style={{
                  width: "clamp(14px,1.2vw,22px)",
                  height: "clamp(14px,1.2vw,22px)",
                  color: "#2563eb",
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(0.75rem,1vw,1.6rem)",
                  color: "#111827",
                }}
              >
                {t("researcherProfile.interests")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.researcherInterests.map((interest, idx) => {
                const c = tagPalette[idx % tagPalette.length];
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                      padding:
                        "clamp(0.25rem,0.4vw,0.6rem) clamp(0.55rem,0.85vw,1.3rem)",
                      borderRadius: "2rem",
                      backgroundColor: c.bg,
                      color: c.color,
                      border: `1px solid ${c.border}`,
                      fontWeight: 600,
                    }}
                  >
                    {interest.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}
