import { useState, useEffect, useCallback, useMemo } from "react";
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
  adminDownloadThesisAttachment,
  adminSearchResearchByTitle,
  adminGetAcademicGradeLookups,
  adminGetUniversitiesLookup,
  adminGetJobRankLookups,
} from "../../../services/adminFacultyData.service";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ─── helpers ──────────────────────────────────────────────────────────────────

const THESIS_TYPES = [
  { value: "PHD", labelKey: "phd" },
  { value: "Master", labelKey: "master" },
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

const EMPTY_MEMBER = () => ({
  id: null,
  memberId: null,
  role: 1,
  name: "",
  jobLevelId: "",
  authority: "",
});

const EMPTY_FORM = () => ({
  type: "PHD",
  link: "",
  title: "",
  gradeId: "",
  enrollmentDate: "",
  registrationDate: "",
  internalGradeDate: "",
  supervisionConfirmationDate: "",
  discussionDate: "",
  universityOrFaculty: "",
  comitteeMembers: [EMPTY_MEMBER()],
  researches: [],
  newAttachments: [],
});

const normalizeDate = (value) => (value ? String(value).substring(0, 10) : "");

const normalizeRole = (role) => {
  if (typeof role === "number") {
    return role;
  }

  const value = String(role || "").toLowerCase();
  if (
    value === "administration" ||
    value === "adminstration" ||
    value === "adminstrator"
  ) {
    return 1;
  }
  if (value === "reviewer" || value === "reviewing") {
    return 2;
  }
  return 3;
};

const toMemberPayload = (member, thesisId = 0) => ({
  memberId: member.memberId || null,
  role: Number(member.role),
  name: member.name.trim(),
  jobLevelId: member.jobLevelId || null,
  authority: member.authority || "",
  thesesId: thesisId,
});

const toResearchPayload = (research) => ({
  ...research,
  contributions: Array.isArray(research.contributions)
    ? research.contributions.map((contribution) => ({
        ...contribution,
      }))
    : [],
  attachments: Array.isArray(research.attachments)
    ? research.attachments.map((attachment) => ({
        ...attachment,
      }))
    : [],
  cites: Array.isArray(research.cites)
    ? research.cites.map((cite) => ({
        ...cite,
      }))
    : [],
});

const getLookupLabel = (item, isArabic) => {
  if (!item) {
    return "";
  }

  return isArabic ? item.valueAr || item.valueEn : item.valueEn || item.valueAr;
};

const formatDate = (value, locale) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(locale);
};

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
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isEdit = !!item;

  const isArabic = i18n.language === "ar";
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loadingItem, setLoadingItem] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [forbiddenError, setForbiddenError] = useState(false);

  // Attachments
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [deletingAttachment, setDeletingAttachment] = useState(null);

  // Research search
  const [researchQuery, setResearchQuery] = useState("");
  const [researchSearching, setResearchSearching] = useState(false);
  const [researchResults, setResearchResults] = useState([]);
  const [researchSearchError, setResearchSearchError] = useState(null);
  const [initialMembers, setInitialMembers] = useState([]);
  const [initialResearches, setInitialResearches] = useState([]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const visibleMembers = form.comitteeMembers.filter(
    (member) => !member._deleted,
  );
  const visibleResearches = form.researches.filter(
    (research) => !research._deleted,
  );
  const universitySuggestions = useMemo(
    () =>
      (universityLookups || [])
        .map((item) => getLookupLabel(item, isArabic))
        .filter(Boolean),
    [isArabic, universityLookups],
  );

  const updateMember = (index, key, value) => {
    setForm((prev) => {
      const nextMembers = [...prev.comitteeMembers];
      const target = nextMembers[index];
      if (!target) {
        return prev;
      }

      nextMembers[index] = {
        ...target,
        [key]: value,
        _changed: target._orig ? true : target._changed,
      };

      return { ...prev, comitteeMembers: nextMembers };
    });
  };

  // Load existing thesis in edit mode
  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY_FORM());
      setExistingAttachments([]);
      setInitialMembers([]);
      setInitialResearches([]);
      setLoadingItem(false);
      return;
    }

    setLoadingItem(true);
    adminGetThesisById(item.id, userId)
      .then((r) => {
        const d = r.data;
        const members = (d.comitteeMembers || []).map((member) => ({
          id: member.id,
          memberId: member.memberId || null,
          role: normalizeRole(member.role),
          name: member.name || "",
          jobLevelId: member.jobLevelId || "",
          authority: member.authority || "",
          _orig: true,
          _changed: false,
        }));
        const researches = (d.researches || []).map((research) => ({
          ...research,
          _orig: true,
          _deleted: false,
        }));

        setForm({
          type: d.type === "Master" ? "Master" : "PHD",
          link: d.link || "",
          title: d.title || "",
          gradeId: d.gradeId || "",
          universityOrFaculty: d.universityOrFaculty || "",
          enrollmentDate: normalizeDate(d.enrollmentDate),
          registrationDate: (d.registrationDate || "").substring(0, 10),
          internalGradeDate: normalizeDate(d.internalGradeDate),
          supervisionConfirmationDate: normalizeDate(
            d.supervisionConfirmationDate,
          ),
          discussionDate: normalizeDate(d.discussionDate),
          comitteeMembers: members.length > 0 ? members : [EMPTY_MEMBER()],
          researches,
          newAttachments: [],
        });
        setInitialMembers(members);
        setInitialResearches(researches);
        setExistingAttachments(d.attachments || []);
      })
      .catch(() => {})
      .finally(() => setLoadingItem(false));
  }, [isEdit, item?.id, userId]);

  useEffect(() => {
    if (!researchQuery || researchQuery.trim().length < 2) {
      setResearchResults([]);
      setResearchSearchError(null);
      setResearchSearching(false);
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      setResearchSearching(true);
      setResearchSearchError(null);
      try {
        const response = await adminSearchResearchByTitle(researchQuery.trim());
        const results = Array.isArray(response.data)
          ? response.data
          : response.data
            ? [response.data]
            : [];

        setResearchResults(results);
        if (results.length === 0) {
          setResearchSearchError(t("fields.researchNotFound"));
        }
      } catch {
        setResearchResults([]);
        setResearchSearchError(t("fields.researchNotFound"));
      } finally {
        setResearchSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [researchQuery, t]);

  const addResearch = (res) => {
    if (form.researches.some((r) => r.id === res.id && !r._deleted)) {
      return;
    }

    setForm((p) => ({
      ...p,
      researches: [...p.researches, { ...res, _new: true, _deleted: false }],
    }));
    setResearchResults([]);
    setResearchQuery("");
    setResearchSearchError(null);
  };

  const removeResearch = (id) => {
    setForm((p) => ({
      ...p,
      researches: p.researches.map((r) =>
        r.id === id ? { ...r, _deleted: true } : r,
      ),
    }));
  };

  const addMember = () => {
    setForm((p) => ({
      ...p,
      comitteeMembers: [
        ...p.comitteeMembers,
        { ...EMPTY_MEMBER(), _new: true, _id: Date.now() },
      ],
    }));
  };

  const removeMember = (idx) => {
    setForm((p) => {
      const next = [...p.comitteeMembers];
      if (!next[idx]) {
        return p;
      }

      if (next[idx]._new) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], _deleted: true, _changed: false };
      }

      return {
        ...p,
        comitteeMembers: next.length > 0 ? next : [EMPTY_MEMBER()],
      };
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

  const handleDownloadAttachment = async (att) => {
    if (!item?.id) {
      return;
    }

    try {
      const response = await adminDownloadThesisAttachment(item.id, att.id);
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = att.fileName || "attachment";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      /* ignore */
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    if (!form.gradeId) e.gradeId = true;
    if (!form.enrollmentDate) e.enrollmentDate = true;
    if (!form.registrationDate) e.registrationDate = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setForbiddenError(false);

    const currentMembers = form.comitteeMembers
      .filter(
        (member) => !member._deleted && member.name.trim() && member.jobLevelId,
      )
      .map((member) => ({
        ...member,
        name: member.name.trim(),
      }));
    const currentResearches = visibleResearches.map((research) => ({
      ...research,
    }));

    const payload = {
      type: form.type,
      link: form.link || "",
      title: form.title.trim(),
      gradeId: form.gradeId,
      enrollmentDate: form.enrollmentDate,
      registrationDate: form.registrationDate,
      internalGradeDate: form.internalGradeDate || null,
      supervisionConfirmationDate: form.supervisionConfirmationDate || null,
      discussionDate: form.discussionDate || null,
      universityOrFaculty: form.universityOrFaculty || null,
      facultyMemberId: userId,
    };

    if (isEdit) {
      payload.supervisorsToAdd = currentMembers
        .filter((member) => !member.id)
        .map((member) => toMemberPayload(member, item.id));
      payload.supervisorsToUpdate = currentMembers
        .filter((member) => member.id && member._changed)
        .map((member) => ({
          id: member.id,
          data: toMemberPayload(member, item.id),
        }));
      payload.supervisorsToDelete = initialMembers.filter(
        (initialMember) =>
          !currentMembers.some((member) => member.id === initialMember.id),
      );
      payload.researchesToAdd = currentResearches
        .filter(
          (research) =>
            !initialResearches.some(
              (initialResearch) => initialResearch.id === research.id,
            ),
        )
        .map((research) => toResearchPayload(research));
      payload.researchesToUpdate = [];
      payload.researchesToDelete = initialResearches.filter(
        (initialResearch) =>
          !currentResearches.some(
            (research) => research.id === initialResearch.id,
          ),
      );
    } else {
      payload.comitteeMembers = currentMembers.map((member) =>
        toMemberPayload(member),
      );
      payload.researches = currentResearches.map((research) =>
        toResearchPayload(research),
      );
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
                onChange={(e) => set("type", e.target.value)}
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
                style={{ borderColor: errors.gradeId ? "#ef4444" : "#d1d5db" }}
                options={[
                  { value: "", label: "—" },
                  ...(gradeLookups || []).map((g) => ({
                    value: g.id,
                    label: getLookupLabel(g, isArabic),
                  })),
                ]}
              />
              {errors.gradeId && (
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

          {/* University or faculty */}
          <Field label={t("fields.universityOrFaculty")}>
            <>
              <Input
                value={form.universityOrFaculty}
                onChange={(e) => set("universityOrFaculty", e.target.value)}
                list="admin-theses-universities"
              />
              <datalist id="admin-theses-universities">
                {universitySuggestions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </>
          </Field>

          {/* Dates */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.enrollmentDate")}>
              <Input
                type="date"
                value={form.enrollmentDate}
                onChange={(e) => set("enrollmentDate", e.target.value)}
                style={{
                  borderColor: errors.enrollmentDate ? "#ef4444" : "#d1d5db",
                }}
              />
              {errors.enrollmentDate && (
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
            <Field label={t("fields.registrationDate")}>
              <Input
                type="date"
                value={form.registrationDate}
                onChange={(e) => set("registrationDate", e.target.value)}
                style={{
                  borderColor: errors.registrationDate ? "#ef4444" : "#d1d5db",
                }}
              />
              {errors.registrationDate && (
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
            <Field label={t("fields.internalGradeDate")}>
              <Input
                type="date"
                value={form.internalGradeDate}
                onChange={(e) => set("internalGradeDate", e.target.value)}
              />
            </Field>
            <Field label={t("fields.supervisionConfirmationDate")}>
              <Input
                type="date"
                value={form.supervisionConfirmationDate}
                onChange={(e) =>
                  set("supervisionConfirmationDate", e.target.value)
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
            {visibleMembers.length > 0 && (
              <div className="flex flex-col gap-1">
                {visibleMembers.map((member) => {
                  const realIdx = form.comitteeMembers.indexOf(member);
                  return (
                    <div
                      key={member._id || member.id || realIdx}
                      className="rounded-lg"
                      style={{
                        padding: "0.6rem",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr)) auto",
                          gap: "0.5rem",
                          alignItems: "end",
                        }}
                      >
                        <div>
                          <Label>{t("fields.supervisorName")}</Label>
                          <Input
                            value={member.name}
                            onChange={(e) =>
                              updateMember(realIdx, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("fields.supervisionRole")}</Label>
                          <Select
                            value={member.role}
                            onChange={(e) =>
                              updateMember(
                                realIdx,
                                "role",
                                Number(e.target.value),
                              )
                            }
                            options={SUPERVISOR_ROLES.map((option) => ({
                              value: option.value,
                              label: t(`fields.${option.labelKey}`),
                            }))}
                          />
                        </div>
                        <div>
                          <Label>{t("fields.jobLevel")}</Label>
                          <Select
                            value={member.jobLevelId}
                            onChange={(e) =>
                              updateMember(
                                realIdx,
                                "jobLevelId",
                                e.target.value,
                              )
                            }
                            options={[
                              { value: "", label: "—" },
                              ...(jobRankLookups || []).map((jobRank) => ({
                                value: jobRank.id,
                                label: getLookupLabel(jobRank, isArabic),
                              })),
                            ]}
                          />
                        </div>
                        <div>
                          <Label>{t("fields.university")}</Label>
                          <Input
                            value={member.authority}
                            onChange={(e) =>
                              updateMember(realIdx, "authority", e.target.value)
                            }
                            list="admin-theses-member-universities"
                          />
                        </div>
                        <button
                          onClick={() => removeMember(realIdx)}
                          style={{
                            padding: "0.4rem",
                            borderRadius: "0.6rem",
                            background: "#fef2f2",
                            border: "1px solid #fca5a5",
                            color: "#b91c1c",
                            cursor: "pointer",
                          }}
                        >
                          <X style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <datalist id="admin-theses-member-universities">
              {universitySuggestions.map((name) => (
                <option key={`member-${name}`} value={name} />
              ))}
            </datalist>
            <button
              onClick={addMember}
              style={{
                marginTop: "0.6rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.6rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
              }}
            >
              <UserPlus style={{ width: 14, height: 14 }} />
              {t("fields.addMember")}
            </button>
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
              />
              <div
                className="flex items-center gap-1 rounded-xl font-medium"
                style={{
                  padding: "0 clamp(0.7rem,1vw,1.6rem)",
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  whiteSpace: "nowrap",
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
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
              </div>
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
                <button
                  onClick={() => handleDownloadAttachment(att)}
                  style={{
                    flex: 1,
                    textAlign: "start",
                    fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                    color: "#2563eb",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {att.fileName || att.name}
                </button>
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

  const gradeMap = useMemo(
    () =>
      new Map(
        (gradeLookups || []).map((grade) => [
          grade.id,
          getLookupLabel(grade, i18n.language === "ar"),
        ]),
      ),
    [gradeLookups, i18n.language],
  );

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
                    t("fields.grade"),
                    t("fields.enrollmentDate"),
                    t("fields.registrationDate"),
                    t("fields.discussionDate"),
                    t("cols.attachments"),
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
                      {gradeMap.get(item.gradeId) ||
                        getLookupLabel(item.grade, i18n.language === "ar") ||
                        "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {formatDate(
                        item.enrollmentDate,
                        i18n.language === "ar" ? "ar-EG" : "en-GB",
                      )}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {formatDate(
                        item.registrationDate,
                        i18n.language === "ar" ? "ar-EG" : "en-GB",
                      )}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {item.discussionDate
                        ? formatDate(
                            item.discussionDate,
                            i18n.language === "ar" ? "ar-EG" : "en-GB",
                          )
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {Array.isArray(item.attachments)
                        ? item.attachments.length
                        : 0}
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
