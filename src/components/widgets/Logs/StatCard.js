export function StatCard({
  label,
  count,
  Icon,
  borderColor,
  statBg,
  textColor,
}) {
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-[14px] shadow-sm"
      style={{
        borderLeft: `clamp(3px, 0.35vw, 5px) solid ${borderColor}`,
        padding: "clamp(0.65rem, 1.2vw, 1.4rem) clamp(0.8rem, 1.5vw, 1.6rem)",
        flex: "1 1 0",
        minWidth: 0,
      }}
    >
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: statBg,
          width: "clamp(2.2rem, 3.5vw, 3.8rem)",
          height: "clamp(2.2rem, 3.5vw, 3.8rem)",
        }}
      >
        <Icon
          style={{
            color: textColor,
            width: "clamp(0.9rem, 1.5vw, 1.8rem)",
            height: "clamp(0.9rem, 1.5vw, 1.8rem)",
          }}
        />
      </div>
      <div className="min-w-0">
        <p
          className="text-gray-500 truncate"
          style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)" }}
        >
          {label}
        </p>
        <p
          className="font-bold text-gray-800"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 2.2rem)", lineHeight: 1.1 }}
        >
          {count.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
