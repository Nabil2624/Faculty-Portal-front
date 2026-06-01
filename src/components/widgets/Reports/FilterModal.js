// ─── FilterModal ──────────────────────────────────────────────────────────────
// Popup for selecting universities → faculties → departments.
// Props:
//   open              – boolean
//   onClose           – callback()
//   onConfirm         – callback(departmentIds: number[])
//   universitiesTree  – array from getUniversitiesTree()
//   treeLoading       – boolean
//   t                 – i18next translation function (Reports namespace)
//   isArabic          – boolean
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  X,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

export function FilterModal({
  open,
  onClose,
  onConfirm,
  universitiesTree,
  treeLoading,
  t,
  isArabic,
}) {
  // Track which universities / faculties are expanded
  const [expandedUnivs, setExpandedUnivs] = useState({});
  const [expandedFaculties, setExpandedFaculties] = useState({});

  // Selection state: sets of checked IDs
  const [checkedUnivs, setCheckedUnivs] = useState(new Set());
  const [checkedFaculties, setCheckedFaculties] = useState(new Set());
  const [checkedDepts, setCheckedDepts] = useState(new Set());

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setCheckedUnivs(new Set());
      setCheckedFaculties(new Set());
      setCheckedDepts(new Set());
      setExpandedUnivs({});
      setExpandedFaculties({});
    }
  }, [open]);

  if (!open) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const name = (item) => (isArabic ? item.name_ar : item.name_en);

  // Collect all department IDs under a university
  const univDeptIds = (univ) =>
    univ.faculties.flatMap((f) => f.departments.map((d) => d.id));
  // Collect all department IDs under a faculty
  const facDeptIds = (fac) => fac.departments.map((d) => d.id);

  // ── University toggle ─────────────────────────────────────────────────────
  const toggleUniv = (univ) => {
    const deptIds = univDeptIds(univ);
    const facIds = univ.faculties.map((f) => f.id);
    const isChecked = checkedUnivs.has(univ.id);

    setCheckedUnivs((prev) => {
      const next = new Set(prev);
      isChecked ? next.delete(univ.id) : next.add(univ.id);
      return next;
    });
    setCheckedFaculties((prev) => {
      const next = new Set(prev);
      facIds.forEach((id) => (isChecked ? next.delete(id) : next.add(id)));
      return next;
    });
    setCheckedDepts((prev) => {
      const next = new Set(prev);
      deptIds.forEach((id) => (isChecked ? next.delete(id) : next.add(id)));
      return next;
    });
    // Auto-expand when checking
    if (!isChecked) setExpandedUnivs((prev) => ({ ...prev, [univ.id]: true }));
  };

  // ── Faculty toggle ────────────────────────────────────────────────────────
  const toggleFaculty = (univ, fac) => {
    const deptIds = facDeptIds(fac);
    const isChecked = checkedFaculties.has(fac.id);

    setCheckedFaculties((prev) => {
      const next = new Set(prev);
      isChecked ? next.delete(fac.id) : next.add(fac.id);
      return next;
    });
    setCheckedDepts((prev) => {
      const next = new Set(prev);
      deptIds.forEach((id) => (isChecked ? next.delete(id) : next.add(id)));
      return next;
    });
    // Sync university checkbox
    const allFacChecked = univ.faculties.every((f) =>
      f.id === fac.id ? !isChecked : checkedFaculties.has(f.id),
    );
    setCheckedUnivs((prev) => {
      const next = new Set(prev);
      allFacChecked ? next.add(univ.id) : next.delete(univ.id);
      return next;
    });
    if (!isChecked)
      setExpandedFaculties((prev) => ({ ...prev, [fac.id]: true }));
  };

  // ── Department toggle ─────────────────────────────────────────────────────
  const toggleDept = (univ, fac, dept) => {
    const isChecked = checkedDepts.has(dept.id);
    setCheckedDepts((prev) => {
      const next = new Set(prev);
      isChecked ? next.delete(dept.id) : next.add(dept.id);
      return next;
    });
    // Sync faculty
    const newDepts = new Set(checkedDepts);
    isChecked ? newDepts.delete(dept.id) : newDepts.add(dept.id);
    const allDeptChecked = fac.departments.every((d) => newDepts.has(d.id));
    setCheckedFaculties((prev) => {
      const next = new Set(prev);
      allDeptChecked ? next.add(fac.id) : next.delete(fac.id);
      return next;
    });
    // Sync university
    const allFacChecked = univ.faculties.every((f) =>
      f.id === fac.id ? allDeptChecked : checkedFaculties.has(f.id),
    );
    setCheckedUnivs((prev) => {
      const next = new Set(prev);
      allFacChecked ? next.add(univ.id) : next.delete(univ.id);
      return next;
    });
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    // If no departments explicitly checked but faculties/univs are: collect all
    let ids = [...checkedDepts];
    if (ids.length === 0 && checkedFaculties.size > 0) {
      universitiesTree.forEach((u) =>
        u.faculties.forEach((f) => {
          if (checkedFaculties.has(f.id))
            ids.push(...f.departments.map((d) => d.id));
        }),
      );
    }
    onConfirm(ids);
    onClose();
  };

  const hasSelection =
    checkedDepts.size > 0 || checkedFaculties.size > 0 || checkedUnivs.size > 0;

  // ── Checkbox UI helper ────────────────────────────────────────────────────
  const Checkbox = ({ checked, indeterminate, onChange, label, bold }) => (
    <button
      onClick={onChange}
      className="flex items-center gap-2 text-start w-full hover:text-[#19355a] transition-colors"
      style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)" }}
    >
      {checked ? (
        <CheckSquare
          className="text-[#19355a] flex-shrink-0"
          style={{
            width: "clamp(0.95rem, 1.2vw, 1.3rem)",
            height: "clamp(0.95rem, 1.2vw, 1.3rem)",
          }}
        />
      ) : (
        <Square
          className={`flex-shrink-0 ${indeterminate ? "text-[#b38e19]" : "text-gray-400"}`}
          style={{
            width: "clamp(0.95rem, 1.2vw, 1.3rem)",
            height: "clamp(0.95rem, 1.2vw, 1.3rem)",
          }}
        />
      )}
      <span className={bold ? "font-semibold text-gray-800" : "text-gray-700"}>
        {label}
      </span>
    </button>
  );

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,25,47,0.45)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          width: "clamp(320px, 50vw, 680px)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#19355a] text-white px-5 py-4 flex-shrink-0">
          <span
            className="font-bold"
            style={{ fontSize: "clamp(0.85rem, 1.1vw, 1.15rem)" }}
          >
            {t("filterModal.title")}
          </span>
          <button
            onClick={onClose}
            className="hover:text-[#b38e19] transition-colors rounded-lg p-1"
          >
            <X
              style={{
                width: "clamp(1rem, 1.4vw, 1.5rem)",
                height: "clamp(1rem, 1.4vw, 1.5rem)",
              }}
            />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {treeLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2
                className="animate-spin text-[#19355a]"
                style={{ width: "2rem", height: "2rem" }}
              />
            </div>
          )}

          {!treeLoading && universitiesTree.length === 0 && (
            <p
              className="text-center text-gray-500 py-8"
              style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
            >
              {t("filterModal.noData")}
            </p>
          )}

          {!treeLoading &&
            universitiesTree.map((univ) => {
              const univExpanded = expandedUnivs[univ.id];
              const deptIds = univDeptIds(univ);
              const someDeptsChecked = deptIds.some((id) =>
                checkedDepts.has(id),
              );

              return (
                <div
                  key={univ.id}
                  className="mb-3 rounded-xl border border-[#19355a]/12 overflow-hidden"
                >
                  {/* University row */}
                  <div className="flex items-center justify-between bg-[#19355a]/6 px-4 py-3">
                    <Checkbox
                      checked={checkedUnivs.has(univ.id)}
                      indeterminate={
                        !checkedUnivs.has(univ.id) && someDeptsChecked
                      }
                      onChange={() => toggleUniv(univ)}
                      label={name(univ)}
                      bold
                    />
                    <button
                      onClick={() =>
                        setExpandedUnivs((p) => ({
                          ...p,
                          [univ.id]: !p[univ.id],
                        }))
                      }
                      className="text-[#19355a] hover:text-[#b38e19] transition-colors flex-shrink-0 ms-2"
                    >
                      {univExpanded ? (
                        <ChevronUp
                          style={{ width: "1.1rem", height: "1.1rem" }}
                        />
                      ) : (
                        <ChevronDown
                          style={{ width: "1.1rem", height: "1.1rem" }}
                        />
                      )}
                    </button>
                  </div>

                  {/* Faculties */}
                  {univExpanded && (
                    <div className="px-4 py-2">
                      {univ.faculties.map((fac) => {
                        const facExpanded = expandedFaculties[fac.id];
                        const facDepts = facDeptIds(fac);
                        const someDepts = facDepts.some((id) =>
                          checkedDepts.has(id),
                        );

                        return (
                          <div key={fac.id} className="mb-2">
                            {/* Faculty row */}
                            <div className="flex items-center justify-between py-2 border-b border-[#19355a]/8">
                              <Checkbox
                                checked={checkedFaculties.has(fac.id)}
                                indeterminate={
                                  !checkedFaculties.has(fac.id) && someDepts
                                }
                                onChange={() => toggleFaculty(univ, fac)}
                                label={name(fac)}
                              />
                              <button
                                onClick={() =>
                                  setExpandedFaculties((p) => ({
                                    ...p,
                                    [fac.id]: !p[fac.id],
                                  }))
                                }
                                className="text-[#19355a] hover:text-[#b38e19] transition-colors flex-shrink-0 ms-2"
                              >
                                {facExpanded ? (
                                  <ChevronUp
                                    style={{ width: "1rem", height: "1rem" }}
                                  />
                                ) : (
                                  <ChevronDown
                                    style={{ width: "1rem", height: "1rem" }}
                                  />
                                )}
                              </button>
                            </div>

                            {/* Departments */}
                            {facExpanded && (
                              <ul className="ps-4 pt-1">
                                {fac.departments.map((dept) => (
                                  <li key={dept.id} className="py-1">
                                    <Checkbox
                                      checked={checkedDepts.has(dept.id)}
                                      onChange={() =>
                                        toggleDept(univ, fac, dept)
                                      }
                                      label={name(dept)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t border-[#19355a]/10 bg-gray-50 px-5 py-4 flex-shrink-0"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.9rem, 1.3vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
            }}
          >
            {t("filterModal.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasSelection}
            className={`rounded-lg text-white font-semibold transition
              ${hasSelection ? "bg-[#19355a] hover:bg-[#19355a]/85" : "bg-gray-300 cursor-not-allowed"}`}
            style={{
              padding:
                "clamp(0.4rem, 0.6vw, 0.65rem) clamp(0.9rem, 1.3vw, 1.4rem)",
              fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)",
            }}
          >
            {t("filterModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
