import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Search,
  Paperclip,
  UserPlus,
} from "lucide-react";
import {
  adminGetTheses,
  adminAddThesis,
  adminGetThesisById,
  adminUpdateThesis,
  adminDeleteThesis,
  adminUploadThesisAttachments,
  adminDeleteThesisAttachment,
  adminSearchResearchByTitle,
  adminGetAcademicGradeLookups,
  adminGetUniversitiesLookup,
  adminGetJobRankLookups,
} from "../../../services/adminFacultyData.service";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ─── helpers ──────────────────────────────────────────────────────────────────

const THESIS_TYPES = [
  { value: 1, labelKey: "phd" },
  { value: 2, labelKey: "master" },
];

const SUPERVISOR_ROLES = [
  { value: 1, labelKey: "supervisionAdministrator" },
  { value: 2, labelKey: "supervisionReviewer" },
  { value: 3, labelKey: "supervisionAdministratorAndReviewer" },
];

function Label({ children }) {
  return (
    <span
      style={{
        display: "block",
        fontWeight: 600,
        fontSize: "clamp(0.6rem,0.78vw,1.1rem)",
        color: "#374151",
        marginBottom: "0.25rem",
      }}
    >
      {children}
    </span>
  );
}

function Input({ style, ...props }) {
  return (
    <input
      style={{
        width: "100%",
        borderRadius: "0.6rem",
        border: "1px solid #d1d5db",
        padding: "clamp(0.35rem,0.55vw,0.85rem) clamp(0.5rem,0.7vw,1.1rem)",
        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
        color: "#111827",
        outline: "none",
        ...style,
      }}
      {...props}
    />
  );
}

function Select({ options, style, ...props }) {
  return (
    <select
      style={{
        width: "100%",
        borderRadius: "0.6rem",
        border: "1px solid #d1d5db",
        padding: "clamp(0.35rem,0.55vw,0.85rem) clamp(0.5rem,0.7vw,1.1rem)",
        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
        color: "#111827",
        ...style,
      }}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── Thesis Form Modal ────────────────────────────────────────────────────────

function ThesisFormModal({
  userId,
  item,
  gradeLookups,
  jobRankLookups,
  universityLookups,
  onSave,
  onClose,
}) {
  const { t } = useTranslation("AdminFacultyData");
  const isEdit = !!item;

  const emptyForm = {
    type: 1,
    title: "",
    studentName: "",
    specialization: "",
    gradeId: "",
    universityOrFaculty: "",
    registrationDate: "",
    supervisionFormationDate: "",
    discussionDate: "",
    grantingDate: "",
    supervisors: [],
    researches: [],
    newAttachments: [],
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingItem, setLoadingItem] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [forbiddenError, setForbiddenError] = useState(false);

  // Attachments
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [deletingAttachment, setDeletingAttachment] = useState(null);

  // Committee member form
  const [newSupervisor, setNewSupervisor] = useState({
    name: "",
    role: 1,
    jobLevelId: "",
    authority: "",
  });

  // Research search
  const [researchQuery, setResearchQuery] = useState("");
  const [researchSearching, setResearchSearching] = useState(false);
  const [researchResults, setResearchResults] = useState([]);
  const [researchSearchError, setResearchSearchError] = useState(null);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Load existing thesis in edit mode
  useEffect(() => {
    if (!isEdit) return;
    adminGetThesisById(item.id, userId)
      .then((r) => {
        const d = r.data;
        setForm({
          type: d.type === "Master" ? 2 : 1,
          title: d.title || "",
          studentName: d.studentName || "",
          specialization: d.specialization || "",
          gradeId: d.gradeId || "",
          universityOrFaculty: d.universityOrFaculty || "",
          registrationDate: (d.registrationDate || "").substring(0, 10),
          supervisionFormationDate: (
            d.supervisionFormationDate || ""
          ).substring(0, 10),
          discussionDate: (d.discussionDate || "").substring(0, 10),
          grantingDate: (d.grantingDate || "").substring(0, 10),
          supervisors: (d.supervisors || []).map((s) => ({
            ...s,
            _orig: true,
          })),
          researches: (d.researches || []).map((res) => ({
            ...res,
            _orig: true,
          })),
          newAttachments: [],
        });
        setExistingAttachments(d.attachments || []);
      })
      .catch(() => {})
      .finally(() => setLoadingItem(false));
  }, [isEdit, item?.id, userId]);

  const handleResearchSearch = async () => {
    if (!researchQuery.trim()) return;
    setResearchSearching(true);
    setResearchSearchError(null);
    setResearchResults([]);
    try {
      const r = await adminSearchResearchByTitle(researchQuery.trim());
      setResearchResults(r.data || []);
    } catch {
      setResearchSearchError(t("fields.researchNotFound"));
    } finally {
      setResearchSearching(false);
    }
  };

  const addResearch = (res) => {
    if (form.researches.some((r) => r.id === res.id)) return;
    setForm((p) => ({
      ...p,
      researches: [...p.researches, { ...res, _new: true }],
    }));
    setResearchResults([]);
    setResearchQuery("");
  };

  const removeResearch = (id) => {
    setForm((p) => ({
      ...p,
      researches: p.researches.map((r) =>
        r.id === id ? { ...r, _deleted: true } : r,
      ),
    }));
  };

  const addSupervisor = () => {
    if (!newSupervisor.name.trim()) return;
    setForm((p) => ({
      ...p,
      supervisors: [
        ...p.supervisors,
        { ...newSupervisor, _new: true, _id: Date.now() },
      ],
    }));
    setNewSupervisor({ name: "", role: 1, jobLevelId: "", authority: "" });
  };

  const removeSupervisor = (idx) => {
    setForm((p) => {
      const next = [...p.supervisors];
      next[idx] = { ...next[idx], _deleted: true };
      return { ...p, supervisors: next };
    });
  };

  const handleDeleteAttachment = async (att) => {
    if (!item?.id) return;
    setDeletingAttachment(att.id);
    try {
      await adminDeleteThesisAttachment(item.id, att.id);
      setExistingAttachments((p) => p.filter((a) => a.id !== att.id));
    } catch {
      /* ignore */
    } finally {
      setDeletingAttachment(null);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    if (!form.studentName.trim()) e.studentName = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setForbiddenError(false);

    const newSupervs = form.supervisors.filter((s) => s._new && !s._deleted);
    const deletedSupervs = form.supervisors.filter(
      (s) => s._orig && s._deleted,
    );
    const updatedSupervs = form.supervisors.filter(
      (s) => s._orig && !s._deleted && s._changed,
    );
    const newResearches = form.researches.filter((r) => r._new && !r._deleted);
    const deletedResearches = form.researches.filter(
      (r) => r._orig && r._deleted,
    );

    const payload = {
      type: Number(form.type),
      title: form.title,
      studentName: form.studentName,
      specialization: form.specialization || null,
      gradeId: form.gradeId ? Number(form.gradeId) : null,
      universityOrFaculty: form.universityOrFaculty || null,
      registrationDate: form.registrationDate || null,
      supervisionFormationDate: form.supervisionFormationDate || null,
      discussionDate: form.discussionDate || null,
      grantingDate: form.grantingDate || null,
    };

    if (isEdit) {
      payload.supervisorsToAdd = newSupervs.map((s) => ({
        name: s.name,
        role: Number(s.role),
        jobLevelId: s.jobLevelId ? Number(s.jobLevelId) : null,
        authority: s.authority || null,
      }));
      payload.supervisorsToDelete = deletedSupervs
        .map((s) => s.id)
        .filter(Boolean);
      payload.supervisorsToUpdate = updatedSupervs.map((s) => ({
        id: s.id,
        name: s.name,
        role: Number(s.role),
        jobLevelId: s.jobLevelId ? Number(s.jobLevelId) : null,
        authority: s.authority || null,
      }));
      payload.researchesToAdd = newResearches.map((r) => ({ id: r.id }));
      payload.researchesToDelete = deletedResearches
        .map((r) => r.id)
        .filter(Boolean);
      payload.researchesToUpdate = [];
    } else {
      payload.supervisors = form.supervisors
        .filter((s) => !s._deleted)
        .map((s) => ({
          name: s.name,
          role: Number(s.role),
          jobLevelId: s.jobLevelId ? Number(s.jobLevelId) : null,
          authority: s.authority || null,
        }));
      payload.researches = form.researches
        .filter((r) => !r._deleted)
        .map((r) => ({ id: r.id }));
    }

    try {
      let savedId;
      if (isEdit) {
        await adminUpdateThesis(item.id, userId, payload);
        savedId = item.id;
      } else {
        const r = await adminAddThesis(userId, payload);
        savedId = r.data?.id || r.data;
      }
      if (form.newAttachments.length > 0 && savedId) {
        await adminUploadThesisAttachments(savedId, form.newAttachments).catch(
          () => {},
        );
      }
      onSave();
    } catch (err) {
      if (err?.response?.status === 403) {
        setForbiddenError(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const visibleSupervisors = form.supervisors.filter((s) => !s._deleted);
  const visibleResearches = form.researches.filter((r) => !r._deleted);

  if (loadingItem) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <Loader2
          className="animate-spin"
          style={{ width: 40, height: 40, color: "#fff" }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", padding: "1rem" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full overflow-y-auto"
        style={{ maxWidth: "clamp(320px,60vw,960px)", maxHeight: "92vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "clamp(0.8rem,1.2vw,2rem)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: "clamp(0.85rem,1.1vw,1.7rem)",
              color: "#111827",
            }}
          >
            {isEdit ? t("edit") : t("addNew")} — {t("subModules.theses")}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X style={{ width: 20, height: 20, color: "#6b7280" }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "clamp(0.8rem,1.2vw,2rem)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {forbiddenError && (
            <div
              className="flex items-center gap-2 rounded-xl"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                padding: "0.6rem 0.9rem",
                fontSize: "clamp(0.65rem,0.85vw,1.3rem)",
              }}
            >
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {t("fields.supervisionAcceptedError")}
            </div>
          )}

          {/* 2-col: type + grade */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.thesisType")}>
              <Select
                value={form.type}
                onChange={(e) => set("type", Number(e.target.value))}
                options={THESIS_TYPES.map((x) => ({
                  value: x.value,
                  label: t(`fields.${x.labelKey}`),
                }))}
              />
            </Field>
            <Field label={t("fields.grade")}>
              <Select
                value={form.gradeId}
                onChange={(e) => set("gradeId", e.target.value)}
                options={[
                  { value: "", label: "—" },
                  ...(gradeLookups || []).map((g) => ({
                    value: g.id,
                    label: g.name,
                  })),
                ]}
              />
            </Field>
          </div>

          {/* Title */}
          <Field label={t("fields.thesisTitle")}>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              style={{ borderColor: errors.title ? "#ef4444" : "#d1d5db" }}
            />
            {errors.title && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.7rem",
                  marginTop: "0.2rem",
                }}
              >
                {t("validation.required")}
              </div>
            )}
          </Field>

          {/* Student + specialization */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.studentName")}>
              <Input
                value={form.studentName}
                onChange={(e) => set("studentName", e.target.value)}
                style={{
                  borderColor: errors.studentName ? "#ef4444" : "#d1d5db",
                }}
              />
              {errors.studentName && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.7rem",
                    marginTop: "0.2rem",
                  }}
                >
                  {t("validation.required")}
                </div>
              )}
            </Field>
            <Field label={t("fields.specialization")}>
              <Input
                value={form.specialization}
                onChange={(e) => set("specialization", e.target.value)}
              />
            </Field>
          </div>

          {/* University */}
          <Field label={t("fields.universityOrFaculty")}>
            <Select
              value={form.universityOrFaculty}
              onChange={(e) => set("universityOrFaculty", e.target.value)}
              options={[
                { value: "", label: "—" },
                ...(universityLookups || []).map((u) => ({
                  value: u.name || u.id,
                  label: u.name,
                })),
              ]}
            />
          </Field>

          {/* Dates */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.registrationDate")}>
              <Input
                type="date"
                value={form.registrationDate}
                onChange={(e) => set("registrationDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.supervisionFormationDate")}>
              <Input
                type="date"
                value={form.supervisionFormationDate}
                onChange={(e) =>
                  set("supervisionFormationDate", e.target.value)
                }
              />
            </Field>
            <Field label={t("fields.discussionDate")}>
              <Input
                type="date"
                value={form.discussionDate}
                onChange={(e) => set("discussionDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.grantingDate")}>
              <Input
                type="date"
                value={form.grantingDate}
                onChange={(e) => set("grantingDate", e.target.value)}
              />
            </Field>
          </div>

          {/* ── Committee members ── */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.8rem",
              padding: "0.8rem",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "clamp(0.7rem,0.9vw,1.3rem)",
                marginBottom: "0.8rem",
                color: "#374151",
              }}
            >
              {t("fields.commiteeMembers")}
            </div>
            {/* New supervisor row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                gap: "0.5rem",
                alignItems: "end",
                marginBottom: "0.6rem",
              }}
            >
              <div>
                <Label>{t("fields.supervisorName")}</Label>
                <Input
                  value={newSupervisor.name}
                  onChange={(e) =>
                    setNewSupervisor((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>{t("fields.supervisionRole")}</Label>
                <Select
                  value={newSupervisor.role}
                  onChange={(e) =>
                    setNewSupervisor((p) => ({
                      ...p,
                      role: Number(e.target.value),
                    }))
                  }
                  options={SUPERVISOR_ROLES.map((x) => ({
                    value: x.value,
                    label: t(`fields.${x.labelKey}`),
                  }))}
                />
              </div>
              <div>
                <Label>{t("fields.jobLevel")}</Label>
                <Select
                  value={newSupervisor.jobLevelId}
                  onChange={(e) =>
                    setNewSupervisor((p) => ({
                      ...p,
                      jobLevelId: e.target.value,
                    }))
                  }
                  options={[
                    { value: "", label: "—" },
                    ...(jobRankLookups || []).map((j) => ({
                      value: j.id,
                      label: j.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <Label>{t("fields.university")}</Label>
                <Select
                  value={newSupervisor.authority}
                  onChange={(e) =>
                    setNewSupervisor((p) => ({
                      ...p,
                      authority: e.target.value,
                    }))
                  }
                  options={[
                    { value: "", label: "—" },
                    ...(universityLookups || []).map((u) => ({
                      value: u.name || u.id,
                      label: u.name,
                    })),
                  ]}
                />
              </div>
              <button
                onClick={addSupervisor}
                disabled={!newSupervisor.name.trim()}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.6rem",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                  whiteSpace: "nowrap",
                  marginBottom: "0.05rem",
                }}
              >
                <UserPlus style={{ width: 14, height: 14 }} />
                {t("fields.addMember")}
              </button>
            </div>
            {/* Supervisors list */}
            {visibleSupervisors.length > 0 && (
              <div className="flex flex-col gap-1">
                {visibleSupervisors.map((s, idx) => {
                  const realIdx = form.supervisors.indexOf(s);
                  return (
                    <div
                      key={s._id || s.id || idx}
                      className="flex items-center gap-2 rounded-lg flex-wrap"
                      style={{
                        padding: "0.35rem 0.6rem",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                          color: "#374151",
                          minWidth: "6rem",
                        }}
                      >
                        {s.name}
                      </span>
                      {s.role && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            background: "#eff6ff",
                            color: "#2563eb",
                            borderRadius: "0.4rem",
                            padding: "0.1rem 0.4rem",
                          }}
                        >
                          {t(
                            `fields.${SUPERVISOR_ROLES.find((r) => r.value === Number(s.role))?.labelKey || ""}`,
                          ) || s.role}
                        </span>
                      )}
                      {s.authority && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderRadius: "0.4rem",
                            padding: "0.1rem 0.4rem",
                          }}
                        >
                          {s.authority}
                        </span>
                      )}
                      <button
                        onClick={() => removeSupervisor(realIdx)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                        }}
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Researches ── */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.8rem",
              padding: "0.8rem",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "clamp(0.7rem,0.9vw,1.3rem)",
                marginBottom: "0.8rem",
                color: "#374151",
              }}
            >
              {t("fields.researches")}
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder={t("fields.researchSearchPlaceholder")}
                style={{ flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && handleResearchSearch()}
              />
              <button
                onClick={handleResearchSearch}
                disabled={researchSearching}
                className="flex items-center gap-1 rounded-xl font-medium"
                style={{
                  padding: "0 clamp(0.7rem,1vw,1.6rem)",
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  whiteSpace: "nowrap",
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                  cursor: "pointer",
                }}
              >
                {researchSearching ? (
                  <Loader2
                    className="animate-spin"
                    style={{ width: 14, height: 14 }}
                  />
                ) : (
                  <Search style={{ width: 14, height: 14 }} />
                )}
                {t("search")}
              </button>
            </div>
            {researchSearchError && (
              <div
                style={{
                  color: "#b91c1c",
                  fontSize: "0.7rem",
                  marginBottom: "0.4rem",
                }}
              >
                {researchSearchError}
              </div>
            )}
            {/* Search results */}
            {researchResults.length > 0 && (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.6rem",
                  marginBottom: "0.5rem",
                  maxHeight: "160px",
                  overflowY: "auto",
                }}
              >
                {researchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => addResearch(res)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "start",
                      padding: "0.4rem 0.7rem",
                      fontSize: "clamp(0.62rem,0.8vw,1.2rem)",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      color: "#111827",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#eff6ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {res.title}
                  </button>
                ))}
              </div>
            )}
            {/* Added researches */}
            {visibleResearches.length > 0 && (
              <div className="flex flex-col gap-1">
                {visibleResearches.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center gap-2 rounded-lg"
                    style={{
                      padding: "0.35rem 0.6rem",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                        color: "#374151",
                      }}
                    >
                      {res.title}
                    </span>
                    <button
                      onClick={() => removeResearch(res.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                    >
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Attachments ── */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.8rem",
              padding: "0.8rem",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "clamp(0.7rem,0.9vw,1.3rem)",
                marginBottom: "0.6rem",
                color: "#374151",
              }}
            >
              {t("fields.attachments")}
            </div>
            {existingAttachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 mb-1 rounded-lg"
                style={{
                  padding: "0.3rem 0.6rem",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Paperclip
                  style={{ width: 14, height: 14, color: "#6b7280" }}
                />
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                    color: "#2563eb",
                    textDecoration: "underline",
                  }}
                >
                  {att.fileName || att.name}
                </a>
                <button
                  onClick={() => handleDeleteAttachment(att)}
                  disabled={deletingAttachment === att.id}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                  }}
                >
                  {deletingAttachment === att.id ? (
                    <Loader2
                      className="animate-spin"
                      style={{ width: 13, height: 13 }}
                    />
                  ) : (
                    <X style={{ width: 13, height: 13 }} />
                  )}
                </button>
              </div>
            ))}
            <input
              type="file"
              multiple
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  newAttachments: [
                    ...p.newAttachments,
                    ...Array.from(e.target.files),
                  ],
                }))
              }
              style={{
                fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                marginTop: "0.4rem",
              }}
            />
            {form.newAttachments.length > 0 && (
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#6b7280",
                  marginTop: "0.3rem",
                }}
              >
                {form.newAttachments.length} {t("fields.newFilesSelected")}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2"
          style={{
            padding: "clamp(0.8rem,1.2vw,2rem)",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
            style={{
              padding: "0.4rem 1.2rem",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              color: "#fff",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
            }}
          >
            {saving && (
              <Loader2
                className="animate-spin"
                style={{ width: 14, height: 14 }}
              />
            )}
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function AdminThesesPanel({ user }) {
  const { t, i18n } = useTranslation("AdminFacultyData");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lookups
  const [gradeLookups, setGradeLookups] = useState([]);
  const [jobRankLookups, setJobRankLookups] = useState([]);
  const [universityLookups, setUniversityLookups] = useState([]);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    adminGetTheses(user.id)
      .then((r) => setItems(r.data?.data || r.data || []))
      .catch((e) =>
        setError(
          e?.response?.data?.ErrorMessage || e?.message || t("loadError"),
        ),
      )
      .finally(() => setLoading(false));
  }, [user?.id, t]);

  useEffect(() => {
    load();
    // Load lookups in parallel
    adminGetAcademicGradeLookups()
      .then((r) => setGradeLookups(r.data || []))
      .catch(() => {});
    adminGetJobRankLookups()
      .then((r) => setJobRankLookups(r.data || []))
      .catch(() => {});
    adminGetUniversitiesLookup()
      .then((r) => setUniversityLookups(r.data || []))
      .catch(() => {});
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteThesis(deleteTarget.id, user.id);
      setDeleteTarget(null);
      load();
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditItem(null);
    load();
  };

  const typeLabel = (type) => {
    if (type === "PHD" || type === 1) return t("fields.phd");
    if (type === "Master" || type === 2) return t("fields.master");
    return type || "—";
  };

  return (
    <div
      dir={i18n.dir()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8rem,1.2vw,2rem)",
      }}
    >
      {formOpen && (
        <ThesisFormModal
          userId={user.id}
          item={editItem}
          gradeLookups={gradeLookups}
          jobRankLookups={jobRankLookups}
          universityLookups={universityLookups}
          onSave={handleSaved}
          onClose={() => setFormOpen(false)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
          style={{
            padding: "clamp(0.4rem,0.7vw,1.1rem) clamp(0.7rem,1.1vw,1.8rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            color: "#374151",
            cursor: "pointer",
          }}
        >
          <RefreshCw
            style={{
              width: "clamp(12px,1vw,20px)",
              height: "clamp(12px,1vw,20px)",
              animation: loading ? "spin 1s linear infinite" : "none",
            }}
          />
          {t("refresh")}
        </button>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl font-medium transition hover:opacity-80"
          style={{
            padding: "clamp(0.4rem,0.7vw,1.1rem) clamp(0.7rem,1.1vw,1.8rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Plus
            style={{
              width: "clamp(12px,1vw,20px)",
              height: "clamp(12px,1vw,20px)",
            }}
          />
          {t("addNew")}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="flex items-center justify-center gap-2 rounded-2xl bg-white"
          style={{
            padding: "clamp(2rem,4vw,5rem)",
            border: "1px solid #e5e7eb",
            color: "#6b7280",
            fontSize: "clamp(0.75rem,1vw,1.5rem)",
          }}
        >
          <Loader2
            style={{
              width: "clamp(18px,1.5vw,32px)",
              height: "clamp(18px,1.5vw,32px)",
              animation: "spin 1s linear infinite",
            }}
          />
          {t("loading")}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="flex items-center gap-3 rounded-2xl"
          style={{
            padding: "clamp(0.9rem,1.4vw,2.2rem)",
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
          <button onClick={load} className="ms-auto underline font-medium">
            {t("retry")}
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div
          className="rounded-2xl bg-white overflow-auto"
          style={{ border: "1px solid #e5e7eb" }}
        >
          {items.length === 0 ? (
            <div
              className="text-center"
              style={{
                padding: "clamp(2rem,4vw,5rem)",
                color: "#9ca3af",
                fontSize: "clamp(0.75rem,1vw,1.5rem)",
              }}
            >
              {t("noItems")}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  {[
                    t("fields.thesisTitle"),
                    t("cols.thesisType"),
                    t("fields.studentName"),
                    t("fields.discussionDate"),
                    t("actions"),
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        textAlign: "start",
                        fontSize: "clamp(0.6rem,0.78vw,1.1rem)",
                        fontWeight: 700,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom:
                        i < items.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#111827",
                        maxWidth: "clamp(100px,20vw,320px)",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {typeLabel(item.type)}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {item.studentName || "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {item.discussionDate
                        ? new Date(item.discussionDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80"
                          style={{
                            padding: "0.3rem 0.7rem",
                            background: "#eff6ff",
                            color: "#2563eb",
                            border: "1px solid #bfdbfe",
                            cursor: "pointer",
                            fontSize: "clamp(0.6rem,0.78vw,1.1rem)",
                          }}
                        >
                          <Pencil style={{ width: 12, height: 12 }} />
                          {t("edit")}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80"
                          style={{
                            padding: "0.3rem 0.7rem",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            border: "1px solid #fca5a5",
                            cursor: "pointer",
                            fontSize: "clamp(0.6rem,0.78vw,1.1rem)",
                          }}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
