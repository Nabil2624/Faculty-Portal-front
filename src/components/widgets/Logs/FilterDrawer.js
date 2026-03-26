import { useState, useEffect, useRef } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { ChipSelect } from "./ChipSelect";
import { LEVEL_CONFIG, CODE_CONFIG } from "./logsConstants";
import { LOG_LEVELS, LOG_CODES } from "../../../services/logs.service";

function Section({
  sectionKey,
  label,
  badgeCount,
  children,
  openSections,
  toggleSection,
}) {
  const isOpen = !!openSections[sectionKey];
  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden"
      style={{ marginBottom: "clamp(0.5rem, 1vw, 0.9rem)" }}
    >
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between text-left transition-colors hover:bg-gray-50"
        style={{
          padding: "clamp(0.55rem, 0.9vw, 0.9rem) clamp(0.7rem, 1.1vw, 1.1rem)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-gray-700"
            style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}
          >
            {label}
          </span>
          {badgeCount > 0 && (
            <span
              className="bg-[#b38e19] text-white rounded-full font-bold flex items-center justify-center"
              style={{
                minWidth: "clamp(1rem, 1.4vw, 1.4rem)",
                height: "clamp(1rem, 1.4vw, 1.4rem)",
                fontSize: "clamp(0.5rem, 0.65vw, 0.7rem)",
                padding: "0 clamp(3px, 0.4vw, 5px)",
              }}
            >
              {badgeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className="text-gray-400 transition-transform flex-shrink-0"
          style={{
            width: "clamp(0.8rem, 1.1vw, 1.2rem)",
            height: "clamp(0.8rem, 1.1vw, 1.2rem)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      <div
        style={{
          maxHeight: isOpen ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div
          className="border-t border-gray-100"
          style={{
            padding:
              "clamp(0.55rem, 0.9vw, 0.9rem) clamp(0.7rem, 1.1vw, 1.1rem)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  isArabic,
  t,
  categoriesList,
  actionsList,
}) {
  const [local, setLocal] = useState(filters);
  const drawerRef = useRef(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setLocal(filters);
  }, [filters, open]);

  const toggleArr = (key, val) => {
    setLocal((prev) => {
      const cur = prev[key] || [];
      return {
        ...prev,
        [key]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val],
      };
    });
  };

  const uniqueActions = (() => {
    if (local.categories.length === 0) return [];
    const selectedIds = local.categories
      .map((name) => categoriesList.find((c) => c.categoryName === name)?.id)
      .filter((id) => id !== undefined);
    return [
      ...new Set(
        actionsList
          .filter((a) => a.categoryIds.some((id) => selectedIds.includes(id)))
          .map((a) => a.actionName),
      ),
    ];
  })();

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeCount = (...keys) =>
    keys.reduce((sum, k) => {
      const v = local[k];
      if (Array.isArray(v)) return sum + v.length;
      return sum + (v ? 1 : 0);
    }, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        dir={isArabic ? "rtl" : "ltr"}
        className="fixed top-0 h-full bg-white z-50 shadow-2xl flex flex-col"
        style={{
          [isArabic ? "left" : "right"]: 0,
          width: "clamp(280px, 32vw, 520px)",
          transform: open
            ? "translateX(0)"
            : isArabic
              ? "translateX(-100%)"
              : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between bg-[#19355a]"
          style={{ padding: "clamp(0.75rem, 1.3vw, 1.3rem)" }}
        >
          <div className="flex items-center gap-2">
            <Filter
              className="text-[#b38e19]"
              style={{
                width: "clamp(0.9rem, 1.3vw, 1.4rem)",
                height: "clamp(0.9rem, 1.3vw, 1.4rem)",
              }}
            />
            <h3
              className="font-semibold text-white"
              style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.3rem)" }}
            >
              {t("filterTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition rounded-full hover:bg-white/10 p-1"
          >
            <X
              style={{
                width: "clamp(1rem, 1.3vw, 1.4rem)",
                height: "clamp(1rem, 1.3vw, 1.4rem)",
              }}
            />
          </button>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "clamp(0.8rem, 1.5vw, 1.5rem)" }}
        >
          {/* Date Range */}
          <Section
            sectionKey="dateRange"
            label={t("filterSections.dateRange")}
            badgeCount={activeCount("dateFrom", "dateTo")}
            openSections={openSections}
            toggleSection={toggleSection}
          >
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1" style={{ minWidth: "8rem" }}>
                <label
                  className="block text-gray-500"
                  style={{
                    fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("filterSections.dateFrom")}
                </label>
                <input
                  type="date"
                  value={local.dateFrom}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, dateFrom: e.target.value }))
                  }
                  className="w-full rounded-lg bg-[#E2E2E2] outline-none focus:ring-2 focus:ring-[#b38e19]/50 text-gray-700"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                    fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
                  }}
                />
              </div>
              <div className="flex-1" style={{ minWidth: "8rem" }}>
                <label
                  className="block text-gray-500"
                  style={{
                    fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("filterSections.dateTo")}
                </label>
                <input
                  type="date"
                  value={local.dateTo}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, dateTo: e.target.value }))
                  }
                  className="w-full rounded-lg bg-[#E2E2E2] outline-none focus:ring-2 focus:ring-[#b38e19]/50 text-gray-700"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.5rem, 0.8vw, 0.8rem)",
                    fontSize: "clamp(0.65rem, 0.9vw, 0.9rem)",
                  }}
                />
              </div>
            </div>
          </Section>

          {/* Level */}
          <Section
            sectionKey="level"
            label={t("filterSections.level")}
            badgeCount={activeCount("levels")}
            openSections={openSections}
            toggleSection={toggleSection}
          >
            <ChipSelect
              options={LOG_LEVELS}
              selected={local.levels}
              onToggle={(v) => toggleArr("levels", v)}
              colorFn={(v) => LEVEL_CONFIG[v]}
            />
          </Section>

          {/* Category */}
          <Section
            sectionKey="category"
            label={t("filterSections.category")}
            badgeCount={activeCount("categories")}
            openSections={openSections}
            toggleSection={toggleSection}
          >
            <ChipSelect
              options={categoriesList.map((c) => c.categoryName)}
              selected={local.categories}
              onToggle={(v) => {
                setLocal((prev) => {
                  const newCats = prev.categories.includes(v)
                    ? prev.categories.filter((c) => c !== v)
                    : [...prev.categories, v];
                  const newCatIds = newCats
                    .map(
                      (name) =>
                        categoriesList.find((c) => c.categoryName === name)?.id,
                    )
                    .filter((id) => id !== undefined);
                  const allowedActions = actionsList
                    .filter((a) =>
                      a.categoryIds.some((id) => newCatIds.includes(id)),
                    )
                    .map((a) => a.actionName);
                  return {
                    ...prev,
                    categories: newCats,
                    categoryActions: prev.categoryActions.filter((a) =>
                      allowedActions.includes(a),
                    ),
                  };
                });
              }}
            />
          </Section>

          {/* Category Action */}
          <Section
            sectionKey="categoryAction"
            label={t("filterSections.categoryAction")}
            badgeCount={activeCount("categoryActions")}
            openSections={openSections}
            toggleSection={toggleSection}
          >
            {uniqueActions.length === 0 ? (
              <p
                className="text-gray-400 italic"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.85rem)" }}
              >
                {t("filterSections.selectCategoryFirst")}
              </p>
            ) : (
              <ChipSelect
                options={uniqueActions}
                selected={local.categoryActions}
                onToggle={(v) => toggleArr("categoryActions", v)}
              />
            )}
          </Section>

          {/* Code */}
          <Section
            sectionKey="code"
            label={t("filterSections.code")}
            badgeCount={activeCount("codes")}
            openSections={openSections}
            toggleSection={toggleSection}
          >
            <ChipSelect
              options={LOG_CODES}
              selected={local.codes}
              onToggle={(v) => toggleArr("codes", v)}
              colorFn={(v) => CODE_CONFIG[v]}
            />
          </Section>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-200 flex gap-2"
          style={{ padding: "clamp(0.6rem, 1.2vw, 1.2rem)" }}
        >
          <button
            onClick={() => {
              const cleared = {
                levels: [],
                categories: [],
                categoryActions: [],
                codes: [],
                dateFrom: "",
                dateTo: "",
              };
              setLocal(cleared);
              onApply(cleared);
            }}
            className="flex-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
            style={{
              padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("reset")}
          </button>
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="flex-1 rounded-lg bg-[#19355a] text-white hover:bg-[#19355a]/90 transition font-medium"
            style={{
              padding: "clamp(0.4rem, 0.8vw, 0.8rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("apply")}
          </button>
        </div>
      </div>
    </>
  );
}
