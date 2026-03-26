import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function LogsCategoryMultiSelect({
  categories,
  selected,
  onToggle,
  t,
}) {
  const [open, setOpen] = useState(false);
  const selectedNames = categories
    .filter((c) => selected.includes(c.id))
    .map((c) => c.categoryName);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-gray-300 bg-white flex items-center justify-between text-left hover:border-[#b38e19] transition"
        style={{
          padding: "clamp(0.45rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
          fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
        }}
      >
        <span
          className={
            selectedNames.length === 0 ? "text-gray-400" : "text-gray-700"
          }
        >
          {selectedNames.length === 0
            ? t("actions.categoriesPlaceholder")
            : selectedNames.join(", ")}
        </span>
        <ChevronDown
          className="text-gray-400 flex-shrink-0 transition-transform"
          style={{
            width: "clamp(0.8rem, 1.1vw, 1.2rem)",
            height: "clamp(0.8rem, 1.1vw, 1.2rem)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div
          className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto"
          style={{
            top: "calc(100% + 4px)",
            maxHeight: "clamp(10rem, 18vw, 18rem)",
          }}
        >
          {categories.length === 0 ? (
            <p
              className="text-gray-400 text-center py-4"
              style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
            >
              {t("categories.empty")}
            </p>
          ) : (
            categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
                  style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(cat.id)}
                    className="rounded accent-[#b38e19]"
                  />
                  <span className="text-gray-700">{cat.categoryName}</span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
