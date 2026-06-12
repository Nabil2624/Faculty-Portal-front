// ─── FilterModal ──────────────────────────────────────────────────────────────
// Popup for selecting faculties → departments.
// Props:
//   open          – boolean
//   onClose       – callback()
//   onConfirm     – callback({ facultyIds: number[], departmentIds: number[] })
//   facultiesTree – array from getUniversityFacultiesWithDepartments()
//                   [{ id, nameAR, nameEN, departments: [{ id, nameAR, nameEN }] }]
//   treeLoading   – boolean
//   t             – i18next translation function (Reports namespace)
//   isArabic      – boolean
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
  facultiesTree,
  treeLoading,
  treeError,
  t,
  isArabic,
}) {
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [checkedFaculties, setCheckedFaculties] = useState(new Set());
  const [checkedDepts, setCheckedDepts] = useState(new Set());

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setCheckedFaculties(new Set());
      setCheckedDepts(new Set());
      setExpandedFaculties({});
    }
  }, [open]);

  if (!open) return null;

  const isForbidden =
    treeError?.response?.status === 403 || treeError?.status === 403;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const name = (item) => (isArabic ? item.nameAR : item.nameEN);

  // Collect all department IDs under a faculty
  const facDeptIds = (fac) => fac.departments.map((d) => d.id);

  // ── Faculty toggle ────────────────────────────────────────────────────────
  const toggleFaculty = (fac) => {
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
    if (!isChecked)
      setExpandedFaculties((prev) => ({ ...prev, [fac.id]: true }));
  };

  // ── Department toggle ─────────────────────────────────────────────────────
  const toggleDept = (fac, dept) => {
    const isChecked = checkedDepts.has(dept.id);
    const newDepts = new Set(checkedDepts);
    isChecked ? newDepts.delete(dept.id) : newDepts.add(dept.id);
    setCheckedDepts(newDepts);

    // Sync faculty checkbox
    const allDeptChecked = fac.departments.every((d) => newDepts.has(d.id));
    setCheckedFaculties((prev) => {
      const next = new Set(prev);
      allDeptChecked ? next.add(fac.id) : next.delete(fac.id);
      return next;
    });
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    onConfirm({
      facultyIds: [...checkedFaculties],
      departmentIds: [...checkedDepts],
    });
    onClose();
  };

  const hasSelection = checkedDepts.size > 0 || checkedFaculties.size > 0;

  // ── Select All / Deselect All ─────────────────────────────────────────────
  const allFacultyIds = facultiesTree.map((f) => f.id);
  const allDeptIds = facultiesTree.flatMap((f) =>
    f.departments.map((d) => d.id),
  );
  const allSelected =
    allFacultyIds.length > 0 &&
    allFacultyIds.every((id) => checkedFaculties.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setCheckedFaculties(new Set());
      setCheckedDepts(new Set());
    } else {
      setCheckedFaculties(new Set(allFacultyIds));
      setCheckedDepts(new Set(allDeptIds));
    }
  };

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

          {!treeLoading && facultiesTree.length === 0 && (
            <p
              className="text-center text-gray-500 py-8"
              style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
            >
              {isForbidden ? t("permissionDenied") : t("filterModal.noData")}
            </p>
          )}

          {/* Select All row */}
          {!treeLoading && facultiesTree.length > 0 && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#19355a]/10">
              <span
                className="text-gray-500 font-medium"
                style={{ fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)" }}
              >
                {isArabic
                  ? `${checkedFaculties.size} ${"كليات"} · ${checkedDepts.size} ${"أقسام"}`
                  : `${checkedFaculties.size} faculties · ${checkedDepts.size} departments`}
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-[#19355a] hover:text-[#b38e19] font-semibold transition-colors"
                style={{ fontSize: "clamp(0.62rem, 0.85vw, 0.9rem)" }}
              >
                {allSelected
                  ? isArabic
                    ? "إلغاء تحديد الكل"
                    : "Deselect All"
                  : isArabic
                    ? "تحديد الكل"
                    : "Select All"}
              </button>
            </div>
          )}

          {!treeLoading &&
            facultiesTree.map((fac) => {
              const facExpanded = expandedFaculties[fac.id];
              const deptIds = facDeptIds(fac);
              const someDepts = deptIds.some((id) => checkedDepts.has(id));

              return (
                <div
                  key={fac.id}
                  className="mb-3 rounded-xl border border-[#19355a]/12 overflow-hidden"
                >
                  {/* Faculty row */}
                  <div className="flex items-center justify-between bg-[#19355a]/6 px-4 py-3">
                    <Checkbox
                      checked={checkedFaculties.has(fac.id)}
                      indeterminate={!checkedFaculties.has(fac.id) && someDepts}
                      onChange={() => toggleFaculty(fac)}
                      label={name(fac)}
                      bold
                    />
                    {fac.departments.length > 0 && (
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
                            style={{ width: "1.1rem", height: "1.1rem" }}
                          />
                        ) : (
                          <ChevronDown
                            style={{ width: "1.1rem", height: "1.1rem" }}
                          />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Departments */}
                  {facExpanded && fac.departments.length > 0 && (
                    <ul className="px-4 py-2">
                      {fac.departments.map((dept) => (
                        <li key={dept.id} className="py-1">
                          <Checkbox
                            checked={checkedDepts.has(dept.id)}
                            onChange={() => toggleDept(fac, dept)}
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
