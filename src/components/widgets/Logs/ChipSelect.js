export function ChipSelect({ options, selected, onToggle, colorFn }) {
  return (
    <div
      className="flex flex-wrap"
      style={{ gap: "clamp(0.3rem, 0.6vw, 0.6rem)" }}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = selected.includes(val);
        const colors = colorFn ? colorFn(val) : null;
        return (
          <button
            key={val}
            onClick={() => onToggle(val)}
            className="rounded-full border transition-all"
            style={{
              padding:
                "clamp(0.2rem, 0.4vw, 0.4rem) clamp(0.5rem, 0.9vw, 1rem)",
              fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
              backgroundColor: active
                ? colors?.text || "#b38e19"
                : colors?.bg || "transparent",
              color: active ? "white" : colors?.text || "#b38e19",
              borderColor: colors?.border || "#b38e19",
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
