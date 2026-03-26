import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import LogsCategoryMultiSelect from "./LogsCategoryMultiSelect";

export default function LogsActionFormModal({
  initial,
  categories,
  onSave,
  onClose,
  saving,
  t,
  isArabic,
}) {
  const [name, setName] = useState(initial?.actionName ?? "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    initial?.categoryIds ?? [],
  );
  const [nameError, setNameError] = useState("");
  const [catError, setCatError] = useState("");

  const handleToggle = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setCatError("");
  };

  const handleSubmit = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError(t("errors.nameRequired"));
      valid = false;
    }
    if (selectedCategoryIds.length === 0) {
      setCatError(t("errors.categoryRequired"));
      valid = false;
    }
    if (!valid) return;
    onSave(name.trim(), selectedCategoryIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          width: "clamp(320px, 36vw, 520px)",
          padding: "clamp(1.2rem, 2.5vw, 2rem)",
          gap: "clamp(0.9rem, 1.5vw, 1.4rem)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="font-semibold text-[#19355a]"
            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.35rem)" }}
          >
            {initial ? t("actions.edit") : t("actions.add")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X
              style={{
                width: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
              }}
            />
          </button>
        </div>

        {/* Action Name field */}
        <div>
          <label
            className="block font-medium text-gray-600"
            style={{
              fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
              marginBottom: "0.35rem",
            }}
          >
            {t("actions.name")}
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            placeholder={t("actions.namePlaceholder")}
            className="w-full rounded-xl border outline-none transition"
            style={{
              padding: "clamp(0.45rem, 0.8vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
              borderColor: nameError ? "#ef4444" : "#d1d5db",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = nameError ? "#ef4444" : "#b38e19")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = nameError ? "#ef4444" : "#d1d5db")
            }
          />
          {nameError && (
            <p
              className="text-red-500 mt-1"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.82rem)" }}
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Categories multi-select */}
        <div>
          <label
            className="block font-medium text-gray-600"
            style={{
              fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
              marginBottom: "0.35rem",
            }}
          >
            {t("actions.categories")}
          </label>
          <LogsCategoryMultiSelect
            categories={categories}
            selected={selectedCategoryIds}
            onToggle={handleToggle}
            t={t}
          />
          {catError && (
            <p
              className="text-red-500 mt-1"
              style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.82rem)" }}
            >
              {catError}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-[#19355a] text-white hover:bg-[#19355a]/90 transition flex items-center gap-1"
            style={{
              padding:
                "clamp(0.35rem, 0.6vw, 0.6rem) clamp(0.9rem, 1.5vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {saving && (
              <Loader2
                className="animate-spin"
                style={{
                  width: "clamp(0.7rem, 0.9vw, 1rem)",
                  height: "clamp(0.7rem, 0.9vw, 1rem)",
                }}
              />
            )}
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
