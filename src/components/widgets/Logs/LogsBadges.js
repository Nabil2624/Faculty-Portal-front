import { LEVEL_CONFIG, CODE_CONFIG, getLevelLabel } from "./logsConstants";

export function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        padding:
          "clamp(0.18rem, 0.35vw, 0.35rem) clamp(0.45rem, 0.7vw, 0.75rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
      }}
    >
      {getLevelLabel(level)}
    </span>
  );
}

export function CodeBadge({ code, t }) {
  const cfg = CODE_CONFIG[code] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-flex flex-col items-center rounded-lg font-mono font-semibold whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        padding: "clamp(0.15rem, 0.3vw, 0.3rem) clamp(0.4rem, 0.6vw, 0.65rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 0.875rem)",
        lineHeight: "1.2",
      }}
    >
      <span>{code}</span>
      <span
        style={{ fontSize: "clamp(0.5rem, 0.65vw, 0.7rem)", opacity: 0.75 }}
      >
        {t(`codes.${code}`)}
      </span>
    </span>
  );
}
