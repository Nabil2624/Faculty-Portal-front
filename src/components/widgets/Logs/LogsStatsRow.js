import { BarChart3 } from "lucide-react";
import { StatCard } from "./StatCard";
import { LEVEL_CONFIG } from "./logsConstants";

export function LogsStatsRow({ totalAll, levelCounts, t }) {
  return (
    <div
      className="flex flex-wrap"
      style={{
        gap: "clamp(0.5rem, 1.2vw, 1.2rem)",
        marginBottom: "clamp(1rem, 2vw, 2rem)",
      }}
    >
      {/* Total card */}
      <div
        className="flex items-center gap-3 rounded-[14px] text-white"
        style={{
          background: "linear-gradient(135deg, #19355a 0%, #1e4a82 100%)",
          padding: "clamp(0.65rem, 1.2vw, 1.4rem) clamp(0.8rem, 1.5vw, 1.6rem)",
          flex: "1 1 0",
          minWidth: 0,
        }}
      >
        <div
          className="rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
          style={{
            width: "clamp(2.2rem, 3.5vw, 3.8rem)",
            height: "clamp(2.2rem, 3.5vw, 3.8rem)",
          }}
        >
          <BarChart3
            className="text-[#b38e19]"
            style={{
              width: "clamp(0.9rem, 1.5vw, 1.8rem)",
              height: "clamp(0.9rem, 1.5vw, 1.8rem)",
            }}
          />
        </div>
        <div className="min-w-0">
          <p
            className="text-white/70 truncate"
            style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)" }}
          >
            {t("stats.total")}
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: "clamp(1.1rem, 1.8vw, 2.2rem)",
              lineHeight: 1.1,
            }}
          >
            {totalAll.toLocaleString()}
          </p>
        </div>
      </div>

      <StatCard
        label={t("stats.information")}
        count={levelCounts.Information}
        Icon={LEVEL_CONFIG.Information.icon}
        borderColor={LEVEL_CONFIG.Information.border}
        statBg={LEVEL_CONFIG.Information.statBg}
        textColor={LEVEL_CONFIG.Information.text}
      />
      <StatCard
        label={t("stats.warning")}
        count={levelCounts.Warning}
        Icon={LEVEL_CONFIG.Warning.icon}
        borderColor={LEVEL_CONFIG.Warning.border}
        statBg={LEVEL_CONFIG.Warning.statBg}
        textColor={LEVEL_CONFIG.Warning.text}
      />
      <StatCard
        label={t("stats.error")}
        count={levelCounts.Error}
        Icon={LEVEL_CONFIG.Error.icon}
        borderColor={LEVEL_CONFIG.Error.border}
        statBg={LEVEL_CONFIG.Error.statBg}
        textColor={LEVEL_CONFIG.Error.text}
      />
      <StatCard
        label={t("stats.critical")}
        count={levelCounts.Critical}
        Icon={LEVEL_CONFIG.Critical.icon}
        borderColor={LEVEL_CONFIG.Critical.border}
        statBg={LEVEL_CONFIG.Critical.statBg}
        textColor={LEVEL_CONFIG.Critical.text}
      />
    </div>
  );
}
