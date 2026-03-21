import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  X,
  Search,
  Paperclip,
  UserPlus,
} from "lucide-react";
import {
  adminGetResearches,
  adminAddResearch,
  adminGetResearchById,
  adminUpdateResearch,
  adminDeleteResearch,
  adminGetRecommendedResearches,
  adminConfirmResearch,
  adminRejectResearch,
  adminUploadResearchAttachments,
  adminDeleteResearchAttachment,
  adminSearchResearchByDOI,
  adminGetContributorByORCID,
} from "../../../services/adminFacultyData.service";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ─── helpers ──────────────────────────────────────────────────────────────────

const PUBLISHER_TYPES = [
  { value: 1, labelKey: "magazine" },
  { value: 2, labelKey: "conference" },
  { value: 3, labelKey: "unspecified" },
];

const PUBLICATION_TYPES = [
  { value: 1, labelKey: "local" },
  { value: 2, labelKey: "international" },
  { value: 3, labelKey: "unspecified" },
];

const DERIVED_FROM = [
  { value: 1, labelKey: "master" },
  { value: 2, labelKey: "phd" },
  { value: 3, labelKey: "other" },
];

const SOURCES = [
  { value: "Internal", labelKey: "internal" },
  { value: "External", labelKey: "external" },
];

// ─── tiny shared UI pieces ────────────────────────────────────────────────────

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

function Select({ options, ...props }) {
  return (
    <select
      style={{
        width: "100%",
        borderRadius: "0.6rem",
        border: "1px solid #d1d5db",
        padding: "clamp(0.35rem,0.55vw,0.85rem) clamp(0.5rem,0.7vw,1.1rem)",
        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
        color: "#111827",
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

function Textarea({ style, ...props }) {
  return (
    <textarea
      style={{
        width: "100%",
        borderRadius: "0.6rem",
        border: "1px solid #d1d5db",
        padding: "clamp(0.35rem,0.55vw,0.85rem) clamp(0.5rem,0.7vw,1.1rem)",
        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
        color: "#111827",
        resize: "vertical",
        minHeight: "4rem",
        ...style,
      }}
      {...props}
    />
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

// ─── Research Form Modal ──────────────────────────────────────────────────────

function ResearchFormModal({ userId, item, onSave, onClose }) {
  const { t } = useTranslation("AdminFacultyData");
  const isEdit = !!item;

  const empty = {
    sourceMode: "doi",
    doi: "",
    title: "",
    journalOrConference: "",
    publisherType: 1,
    publicationType: 1,
    publisher: "",
    source: "Internal",
    volume: "",
    issue: "",
    noOfPages: "",
    pubYear: "",
    researchDerivedFrom: "",
    abstract: "",
    researchLink: "",
    relatedResearchLink: "",
    contributors: [],
    newAttachments: [],
  };

  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loadingItem, setLoadingItem] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [forbiddenError, setForbiddenError] = useState(false);

  // DOI search
  const [doiSearching, setDoiSearching] = useState(false);
  const [doiError, setDoiError] = useState(null);

  // ORCID search
  const [orcidInput, setOrcidInput] = useState("");
  const [orcidSearching, setOrcidSearching] = useState(false);
  const [orcidFound, setOrcidFound] = useState(null);
  const [orcidError, setOrcidError] = useState(null);
  const [newContributor, setNewContributor] = useState({
    name: "",
    isInternal: false,
    isMainResearcher: false,
  });

  // Attachments existing (edit mode)
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [deletingAttachment, setDeletingAttachment] = useState(null);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Load existing item in edit mode
  useEffect(() => {
    if (!isEdit) return;
    adminGetResearchById(item.id, userId)
      .then((r) => {
        const d = r.data;
        setForm({
          sourceMode: d.doi ? "doi" : "manual",
          doi: d.doi || "",
          title: d.title || "",
          journalOrConference: d.journalOrConference || "",
          publisherType: d.publisherType ?? 1,
          publicationType: d.publicationType ?? 1,
          publisher: d.publisher || "",
          source: d.source || "Internal",
          volume: d.volume || "",
          issue: d.issue || "",
          noOfPages: d.noOfPages || "",
          pubYear: d.pubYear || "",
          researchDerivedFrom: d.researchDerivedFrom ?? "",
          abstract: d.abstract || "",
          researchLink: d.researchLink || "",
          relatedResearchLink: d.relatedResearchLink || "",
          contributors: (d.researchContributions || []).map((c) => ({
            ...c,
            _orig: true,
          })),
          newAttachments: [],
        });
        setExistingAttachments(d.attachments || []);
      })
      .catch(() => {})
      .finally(() => setLoadingItem(false));
  }, [isEdit, item?.id, userId]);

  const handleDOISearch = async () => {
    if (!form.doi.trim()) return;
    setDoiSearching(true);
    setDoiError(null);
    try {
      const r = await adminSearchResearchByDOI(form.doi.trim());
      const d = r.data;
      setForm((p) => ({
        ...p,
        title: d.title || p.title,
        journalOrConference: d.journalOrConference || p.journalOrConference,
        publisherType: d.publisherType ?? p.publisherType,
        publicationType: d.publicationType ?? p.publicationType,
        publisher: d.publisher || p.publisher,
        volume: d.volume || p.volume,
        issue: d.issue || p.issue,
        noOfPages: d.noOfPages || p.noOfPages,
        pubYear: d.pubYear || p.pubYear,
        abstract: d.abstract || p.abstract,
        relatedResearchLink: d.relatedResearchLink || p.relatedResearchLink,
      }));
    } catch {
      setDoiError(t("fields.doiNotFound"));
    } finally {
      setDoiSearching(false);
    }
  };

  const handleOrcidSearch = async () => {
    if (!orcidInput.trim()) return;
    setOrcidSearching(true);
    setOrcidError(null);
    setOrcidFound(null);
    try {
      const r = await adminGetContributorByORCID(orcidInput.trim());
      const d = r.data;
      setOrcidFound(d);
      setNewContributor({
        name: d.name || "",
        isInternal: !!d.isInternal,
        isMainResearcher: false,
      });
    } catch {
      setOrcidError(t("fields.orcidNotFound"));
      setNewContributor({
        name: "",
        isInternal: false,
        isMainResearcher: false,
      });
    } finally {
      setOrcidSearching(false);
    }
  };

  const addContributor = () => {
    if (!newContributor.name.trim()) return;
    setForm((p) => ({
      ...p,
      contributors: [
        ...p.contributors,
        { ...newContributor, _new: true, _id: Date.now() },
      ],
    }));
    setNewContributor({ name: "", isInternal: false, isMainResearcher: false });
    setOrcidInput("");
    setOrcidFound(null);
  };

  const removeContributor = (idx) => {
    setForm((p) => {
      const updated = [...p.contributors];
      updated[idx] = { ...updated[idx], _deleted: true };
      return { ...p, contributors: updated };
    });
  };

  const handleDeleteAttachment = async (att) => {
    if (!item?.id) return;
    setDeletingAttachment(att.id);
    try {
      await adminDeleteResearchAttachment(item.id, att.id);
      setExistingAttachments((p) => p.filter((a) => a.id !== att.id));
    } catch {
      // ignore
    } finally {
      setDeletingAttachment(null);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setForbiddenError(false);

    const origContribs = form.contributors.filter(
      (c) => c._orig && !c._deleted,
    );
    const newContribs = form.contributors.filter((c) => c._new && !c._deleted);
    const deletedContribs = form.contributors.filter(
      (c) => c._orig && c._deleted,
    );
    const updatedContribs = form.contributors.filter(
      (c) => c._orig && !c._deleted && c._changed,
    );

    const payload = {
      title: form.title,
      doi: form.doi || null,
      journalOrConference: form.journalOrConference || null,
      publisherType: Number(form.publisherType),
      publicationType: Number(form.publicationType),
      publisher: form.publisher || null,
      source: form.source,
      volume: form.volume || null,
      issue: form.issue || null,
      noOfPages: form.noOfPages || null,
      pubYear: form.pubYear ? Number(form.pubYear) : null,
      researchDerivedFrom: form.researchDerivedFrom
        ? Number(form.researchDerivedFrom)
        : null,
      abstract: form.abstract || null,
      researchLink: form.researchLink || null,
      relatedResearchLink: form.relatedResearchLink || null,
    };

    if (isEdit) {
      payload.researchContributionsToAdd = newContribs.map((c) => ({
        name: c.name,
        isInternal: c.isInternal,
        isMainResearcher: c.isMainResearcher,
      }));
      payload.researchContributionsToDelete = deletedContribs
        .map((c) => c.id)
        .filter(Boolean);
      payload.researchContributionsToUpdate = updatedContribs.map((c) => ({
        id: c.id,
        name: c.name,
        isInternal: c.isInternal,
        isMainResearcher: c.isMainResearcher,
      }));
    } else {
      payload.researchContributions = form.contributors
        .filter((c) => !c._deleted)
        .map((c) => ({
          name: c.name,
          isInternal: c.isInternal,
          isMainResearcher: c.isMainResearcher,
        }));
    }

    try {
      let savedId;
      if (isEdit) {
        await adminUpdateResearch(item.id, userId, payload);
        savedId = item.id;
      } else {
        const r = await adminAddResearch(userId, payload);
        savedId = r.data?.id || r.data;
      }
      // Upload new attachments
      if (form.newAttachments.length > 0 && savedId) {
        await adminUploadResearchAttachments(
          savedId,
          form.newAttachments,
        ).catch(() => {});
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

  const visibleContributors = form.contributors.filter((c) => !c._deleted);

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
        style={{ maxWidth: "clamp(320px,54vw,860px)", maxHeight: "90vh" }}
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
            {isEdit ? t("edit") : t("addNew")} — {t("subModules.researches")}
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
              {t("fields.contributorConfirmedError")}
            </div>
          )}

          {/* Source mode toggle */}
          <div className="flex gap-2">
            {["doi", "manual"].map((mode) => (
              <button
                key={mode}
                onClick={() => set("sourceMode", mode)}
                style={{
                  padding: "0.3rem 0.9rem",
                  borderRadius: "0.5rem",
                  border: "1px solid",
                  borderColor: form.sourceMode === mode ? "#2563eb" : "#d1d5db",
                  background: form.sourceMode === mode ? "#eff6ff" : "#fff",
                  color: form.sourceMode === mode ? "#2563eb" : "#6b7280",
                  fontWeight: form.sourceMode === mode ? 700 : 400,
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                  cursor: "pointer",
                }}
              >
                {t(`fields.${mode}`)}
              </button>
            ))}
          </div>

          {/* DOI row */}
          {form.sourceMode === "doi" && (
            <Field label="DOI">
              <div className="flex gap-2">
                <Input
                  value={form.doi}
                  onChange={(e) => set("doi", e.target.value)}
                  placeholder="10.1000/xyz123"
                />
                <button
                  onClick={handleDOISearch}
                  disabled={doiSearching}
                  className="flex items-center gap-1 rounded-xl font-medium transition hover:opacity-80"
                  style={{
                    padding: "0 clamp(0.7rem,1vw,1.6rem)",
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    color: "#fff",
                    border: "none",
                    whiteSpace: "nowrap",
                    fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                    cursor: "pointer",
                  }}
                >
                  {doiSearching ? (
                    <Loader2
                      className="animate-spin"
                      style={{ width: 14, height: 14 }}
                    />
                  ) : (
                    <Search style={{ width: 14, height: 14 }} />
                  )}
                  {t("fields.searchByDoi")}
                </button>
              </div>
              {doiError && (
                <div
                  style={{
                    color: "#b91c1c",
                    fontSize: "0.7rem",
                    marginTop: "0.2rem",
                  }}
                >
                  {doiError}
                </div>
              )}
            </Field>
          )}

          {/* Title */}
          <Field label={t("fields.researchTitle")}>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              disabled={form.sourceMode === "doi"}
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

          {/* 2-col grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.journalOrConference")}>
              <Input
                value={form.journalOrConference}
                onChange={(e) => set("journalOrConference", e.target.value)}
              />
            </Field>
            <Field label={t("fields.publisher")}>
              <Input
                value={form.publisher}
                onChange={(e) => set("publisher", e.target.value)}
              />
            </Field>
            <Field label={t("fields.publisherType")}>
              <Select
                value={form.publisherType}
                onChange={(e) => set("publisherType", e.target.value)}
                options={PUBLISHER_TYPES.map((x) => ({
                  value: x.value,
                  label: t(`fields.${x.labelKey}`),
                }))}
              />
            </Field>
            <Field label={t("fields.publicationType")}>
              <Select
                value={form.publicationType}
                onChange={(e) => set("publicationType", e.target.value)}
                options={PUBLICATION_TYPES.map((x) => ({
                  value: x.value,
                  label: t(`fields.${x.labelKey}`),
                }))}
              />
            </Field>
            <Field label={t("fields.source")}>
              <Select
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                options={SOURCES.map((x) => ({
                  value: x.value,
                  label: t(`fields.${x.labelKey}`),
                }))}
              />
            </Field>
            <Field label={t("fields.researchDerivedFrom")}>
              <Select
                value={form.researchDerivedFrom}
                onChange={(e) => set("researchDerivedFrom", e.target.value)}
                options={[
                  { value: "", label: "—" },
                  ...DERIVED_FROM.map((x) => ({
                    value: x.value,
                    label: t(`fields.${x.labelKey}`),
                  })),
                ]}
              />
            </Field>
            <Field label={t("fields.volume")}>
              <Input
                value={form.volume}
                onChange={(e) => set("volume", e.target.value)}
              />
            </Field>
            <Field label={t("fields.issue")}>
              <Input
                value={form.issue}
                onChange={(e) => set("issue", e.target.value)}
              />
            </Field>
            <Field label={t("fields.noOfPages")}>
              <Input
                type="number"
                value={form.noOfPages}
                onChange={(e) => set("noOfPages", e.target.value)}
              />
            </Field>
            <Field label={t("fields.pubYear")}>
              <Input
                type="number"
                value={form.pubYear}
                onChange={(e) => set("pubYear", e.target.value)}
                min={1900}
                max={2100}
              />
            </Field>
          </div>

          <Field label={t("fields.abstract")}>
            <Textarea
              rows={3}
              value={form.abstract}
              onChange={(e) => set("abstract", e.target.value)}
            />
          </Field>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <Field label={t("fields.researchLink")}>
              <Input
                value={form.researchLink}
                onChange={(e) => set("researchLink", e.target.value)}
              />
            </Field>
            <Field label={t("fields.relatedResearchLink")}>
              <Input
                value={form.relatedResearchLink}
                onChange={(e) => set("relatedResearchLink", e.target.value)}
              />
            </Field>
          </div>

          {/* ── Contributors ── */}
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
              {t("fields.contributions")}
            </div>

            {/* ORCID search row */}
            <div className="flex gap-2 mb-3">
              <Input
                value={orcidInput}
                onChange={(e) => setOrcidInput(e.target.value)}
                placeholder="ORCID"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleOrcidSearch}
                disabled={orcidSearching}
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
                {orcidSearching ? (
                  <Loader2
                    className="animate-spin"
                    style={{ width: 14, height: 14 }}
                  />
                ) : (
                  <Search style={{ width: 14, height: 14 }} />
                )}
                {t("fields.searchByOrcid")}
              </button>
            </div>
            {orcidError && (
              <div
                style={{
                  color: "#b91c1c",
                  fontSize: "0.7rem",
                  marginBottom: "0.4rem",
                }}
              >
                {orcidError}
              </div>
            )}

            {/* New contributor row */}
            <div className="flex gap-2 items-end mb-2">
              <div style={{ flex: 1 }}>
                <Label>{t("fields.contributorName")}</Label>
                <Input
                  value={newContributor.name}
                  onChange={(e) =>
                    setNewContributor((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <label
                className="flex items-center gap-1 cursor-pointer"
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                  whiteSpace: "nowrap",
                  paddingBottom: "0.3rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={newContributor.isInternal}
                  onChange={(e) =>
                    setNewContributor((p) => ({
                      ...p,
                      isInternal: e.target.checked,
                    }))
                  }
                />
                {t("fields.isInternal")}
              </label>
              <label
                className="flex items-center gap-1 cursor-pointer"
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.15rem)",
                  whiteSpace: "nowrap",
                  paddingBottom: "0.3rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={newContributor.isMainResearcher}
                  onChange={(e) =>
                    setNewContributor((p) => ({
                      ...p,
                      isMainResearcher: e.target.checked,
                    }))
                  }
                />
                {t("fields.isMainResearcher")}
              </label>
              <button
                onClick={addContributor}
                disabled={!newContributor.name.trim()}
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
                  marginBottom: "0.05rem",
                }}
              >
                <UserPlus style={{ width: 14, height: 14 }} />
                {t("fields.addContributor")}
              </button>
            </div>

            {/* List */}
            {visibleContributors.length > 0 && (
              <div className="flex flex-col gap-1">
                {visibleContributors.map((c, idx) => (
                  <div
                    key={c._id || c.id || idx}
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
                      {c.name}
                    </span>
                    {c.isMainResearcher && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          background: "#eff6ff",
                          color: "#2563eb",
                          borderRadius: "0.4rem",
                          padding: "0.1rem 0.4rem",
                        }}
                      >
                        {t("fields.isMainResearcher")}
                      </span>
                    )}
                    {c.isInternal && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          background: "#f0fdf4",
                          color: "#15803d",
                          borderRadius: "0.4rem",
                          padding: "0.1rem 0.4rem",
                        }}
                      >
                        {t("fields.internal")}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const realIdx = form.contributors.indexOf(c);
                        removeContributor(realIdx);
                      }}
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
            {/* Existing */}
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
            {/* New */}
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

// ─── Detail modal for recommended research ───────────────────────────────────

function RecommendedResearchDetailModal({ item, onClose }) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  if (!item) return null;

  const field = (label, value) =>
    value &&
    value !== "Unknown" &&
    value !== "Not Avaliable" &&
    value !== "Unspecified" ? (
      <div style={{ marginBottom: "0.6rem" }}>
        <span
          style={{
            fontWeight: 700,
            color: "#374151",
            fontSize: "clamp(0.62rem,0.8vw,1.1rem)",
          }}
        >
          {label}:{" "}
        </span>
        <span
          style={{ color: "#6b7280", fontSize: "clamp(0.62rem,0.8vw,1.1rem)" }}
        >
          {value}
        </span>
      </div>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        dir={i18n.dir()}
        style={{
          background: "#fff",
          borderRadius: "1rem",
          width: "min(90vw,750px)",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "clamp(0.8rem,1.2vw,1.6rem)",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: "clamp(0.75rem,1vw,1.4rem)",
                color: "#111827",
                lineHeight: 1.4,
              }}
            >
              {item.title}
            </div>
            {(item.journalOrConfernce || item.journalOrConference) && (
              <div
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.1rem)",
                  color: "#7c3aed",
                  marginTop: "0.25rem",
                  fontWeight: 600,
                }}
              >
                {item.journalOrConfernce || item.journalOrConference}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "0.25rem",
              flexShrink: 0,
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "clamp(0.8rem,1.2vw,1.6rem)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Meta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
              gap: "0.5rem",
              background: "#f9fafb",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              border: "1px solid #e5e7eb",
            }}
          >
            {field(t("detail.publisher"), item.publisher)}
            {field(t("detail.year"), item.pubYear)}
            {field(t("detail.volume"), item.volume)}
            {field(t("detail.issue"), item.issue)}
            {field(t("detail.pages"), item.noOfPages)}
            {field(t("detail.doi"), item.doi)}
            {field(t("detail.source"), item.source)}
            {field(t("detail.derivedFrom"), item.researchDerivedFrom)}
            {field(
              t("detail.citations"),
              item.noOfCititations != null
                ? String(item.noOfCititations)
                : null,
            )}
          </div>

          {/* Abstract */}
          {item.abstract && (
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(0.65rem,0.85vw,1.15rem)",
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                {t("detail.abstract")}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.1rem)",
                  color: "#6b7280",
                  lineHeight: 1.6,
                  background: "#f9fafb",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 0.8rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                {item.abstract}
              </div>
            </div>
          )}

          {/* Contributors */}
          {item.contributions && item.contributions.length > 0 && (
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(0.65rem,0.85vw,1.15rem)",
                  color: "#374151",
                  marginBottom: "0.4rem",
                }}
              >
                {t("detail.contributors")}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {item.contributions.map((c) => (
                  <span
                    key={c.id}
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "clamp(0.58rem,0.75vw,1rem)",
                      background: c.isTheMajorResearcher
                        ? "#eff6ff"
                        : "#f3f4f6",
                      color: c.isTheMajorResearcher ? "#2563eb" : "#374151",
                      border: `1px solid ${c.isTheMajorResearcher ? "#93c5fd" : "#e5e7eb"}`,
                      fontWeight: c.isTheMajorResearcher ? 700 : 400,
                    }}
                  >
                    {c.memberAcademicName}
                    {c.isTheMajorResearcher && " ★"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {item.researchLink && (
            <div>
              <a
                href={item.researchLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "clamp(0.62rem,0.8vw,1.1rem)",
                  color: "#2563eb",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                {t("detail.viewResearch")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Row card for recommended researches ─────────────────────────────────────

function RecommendedResearchRow({
  item,
  userId,
  onAccepted,
  onRejected,
  onView,
}) {
  const { t } = useTranslation("AdminFacultyData");
  const [saving, setSaving] = useState(false);

  const handleAccept = async (e) => {
    e.stopPropagation();
    setSaving(true);
    try {
      await adminConfirmResearch(item.id, userId);
      onAccepted();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    setSaving(true);
    try {
      await adminRejectResearch(item.id, userId);
      onRejected();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex items-center justify-between flex-wrap gap-2 rounded-xl bg-white"
      onClick={() => onView(item)}
      style={{
        padding: "clamp(0.6rem,1vw,1.4rem)",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(124,58,237,0.1)";
        e.currentTarget.style.borderColor = "#c4b5fd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "clamp(0.7rem,0.95vw,1.4rem)",
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </div>
        {(item.journalOrConfernce || item.journalOrConference) && (
          <div
            style={{
              fontSize: "clamp(0.6rem,0.78vw,1.1rem)",
              color: "#6b7280",
            }}
          >
            {item.journalOrConfernce || item.journalOrConference}
          </div>
        )}
        {item.pubYear && (
          <div
            style={{
              fontSize: "clamp(0.58rem,0.72vw,1rem)",
              color: "#9ca3af",
              marginTop: "0.1rem",
            }}
          >
            {item.pubYear}
            {item.noOfCititations != null &&
              ` · ${item.noOfCititations} citations`}
          </div>
        )}
      </div>
      <div className="flex gap-2" style={{ flexShrink: 0 }}>
        <button
          onClick={handleAccept}
          disabled={saving}
          className="flex items-center gap-1 rounded-xl font-medium transition hover:opacity-80"
          style={{
            padding: "0.35rem 0.8rem",
            background: "#f0fdf4",
            color: "#15803d",
            border: "1px solid #86efac",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
          }}
        >
          {saving ? (
            <Loader2
              className="animate-spin"
              style={{ width: 13, height: 13 }}
            />
          ) : (
            <CheckCircle style={{ width: 13, height: 13 }} />
          )}
          {t("accept")}
        </button>
        <button
          onClick={handleReject}
          disabled={saving}
          className="flex items-center gap-1 rounded-xl font-medium transition hover:opacity-80"
          style={{
            padding: "0.35rem 0.8rem",
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fca5a5",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
          }}
        >
          {saving ? (
            <Loader2
              className="animate-spin"
              style={{ width: 13, height: 13 }}
            />
          ) : (
            <XCircle style={{ width: 13, height: 13 }} />
          )}
          {t("reject")}
        </button>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function AdminResearchesPanel({ user, subModule }) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isRecommended = subModule === "recommendedResearches";

  const REC_PAGE_SIZE = 9;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // recommended-specific state
  const [recPage, setRecPage] = useState(1);
  const [recTotal, setRecTotal] = useState(0);
  const [recSearchInput, setRecSearchInput] = useState("");
  const [recSearch, setRecSearch] = useState("");
  const [selectedResearch, setSelectedResearch] = useState(null);

  // modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // debounce search → reset to page 1
  useEffect(() => {
    if (!isRecommended) return;
    const timer = setTimeout(() => {
      setRecPage(1);
      setRecSearch(recSearchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [recSearchInput, isRecommended]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const fetcher = isRecommended
      ? adminGetRecommendedResearches(
          user.id,
          recPage,
          REC_PAGE_SIZE,
          recSearch,
        )
      : adminGetResearches(user.id);
    fetcher
      .then((r) => {
        if (isRecommended) {
          setItems(r.data?.data || []);
          setRecTotal(r.data?.totalCount || 0);
        } else {
          setItems(r.data?.data || r.data || []);
        }
      })
      .catch((e) =>
        setError(
          e?.response?.data?.ErrorMessage || e?.message || t("loadError"),
        ),
      )
      .finally(() => setLoading(false));
  }, [user?.id, isRecommended, t, recPage, recSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteResearch(deleteTarget.id, user.id);
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

  return (
    <div
      dir={i18n.dir()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8rem,1.2vw,2rem)",
      }}
    >
      {/* Form modal */}
      {formOpen && (
        <ResearchFormModal
          userId={user.id}
          item={editItem}
          onSave={handleSaved}
          onClose={() => setFormOpen(false)}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Top bar */}
      {!isRecommended && (
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
      )}

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
          <button
            onClick={load}
            className="ms-auto underline font-medium hover:opacity-80"
          >
            {t("retry")}
          </button>
        </div>
      )}

      {/* Recommended list */}
      {!loading && !error && isRecommended && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                insetInlineStart: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(13px,1vw,18px)",
                height: "clamp(13px,1vw,18px)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            />
            <input
              value={recSearchInput}
              onChange={(e) => setRecSearchInput(e.target.value)}
              placeholder={t("searchResearches") || "Search researches…"}
              style={{
                width: "100%",
                paddingInlineStart: "2.25rem",
                paddingInlineEnd: "0.9rem",
                paddingTop: "0.55rem",
                paddingBottom: "0.55rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "clamp(0.65rem,0.85vw,1.15rem)",
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Summary row */}
          {recTotal > 0 && (
            <div
              style={{
                fontSize: "clamp(0.6rem,0.78vw,1.05rem)",
                color: "#6b7280",
              }}
            >
              {t("totalItems", { count: recTotal })}
            </div>
          )}

          {/* Rows */}
          {items.length === 0 && (
            <div
              className="text-center rounded-2xl bg-white"
              style={{
                padding: "clamp(2rem,4vw,5rem)",
                color: "#9ca3af",
                border: "1px solid #e5e7eb",
                fontSize: "clamp(0.75rem,1vw,1.5rem)",
              }}
            >
              {t("noItems")}
            </div>
          )}
          {items.map((item) => (
            <RecommendedResearchRow
              key={item.id}
              item={item}
              userId={user.id}
              onAccepted={load}
              onRejected={load}
              onView={setSelectedResearch}
            />
          ))}

          {/* Pagination */}
          {recTotal > REC_PAGE_SIZE && (
            <div
              className="flex items-center justify-center gap-2"
              style={{ marginTop: "0.25rem", flexWrap: "wrap" }}
            >
              <button
                disabled={recPage <= 1}
                onClick={() => setRecPage((p) => p - 1)}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e5e7eb",
                  background: recPage <= 1 ? "#f9fafb" : "#fff",
                  color: recPage <= 1 ? "#d1d5db" : "#374151",
                  cursor: recPage <= 1 ? "not-allowed" : "pointer",
                  fontSize: "clamp(0.6rem,0.78vw,1.05rem)",
                  fontWeight: 600,
                }}
              >
                {t("prev") || "Prev"}
              </button>

              {Array.from(
                { length: Math.ceil(recTotal / REC_PAGE_SIZE) },
                (_, i) => i + 1,
              )
                .filter(
                  (p) =>
                    p === 1 ||
                    p === Math.ceil(recTotal / REC_PAGE_SIZE) ||
                    Math.abs(p - recPage) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      style={{
                        fontSize: "clamp(0.6rem,0.78vw,1.05rem)",
                        color: "#9ca3af",
                        padding: "0 0.2rem",
                      }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setRecPage(p)}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "0.6rem",
                        border: `1px solid ${p === recPage ? "#7c3aed" : "#e5e7eb"}`,
                        background: p === recPage ? "#7c3aed" : "#fff",
                        color: p === recPage ? "#fff" : "#374151",
                        cursor: "pointer",
                        fontSize: "clamp(0.6rem,0.78vw,1.05rem)",
                        fontWeight: p === recPage ? 700 : 400,
                        minWidth: "2rem",
                      }}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                disabled={recPage >= Math.ceil(recTotal / REC_PAGE_SIZE)}
                onClick={() => setRecPage((p) => p + 1)}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e5e7eb",
                  background:
                    recPage >= Math.ceil(recTotal / REC_PAGE_SIZE)
                      ? "#f9fafb"
                      : "#fff",
                  color:
                    recPage >= Math.ceil(recTotal / REC_PAGE_SIZE)
                      ? "#d1d5db"
                      : "#374151",
                  cursor:
                    recPage >= Math.ceil(recTotal / REC_PAGE_SIZE)
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "clamp(0.6rem,0.78vw,1.05rem)",
                  fontWeight: 600,
                }}
              >
                {t("next") || "Next"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail modal */}
      {selectedResearch && (
        <RecommendedResearchDetailModal
          item={selectedResearch}
          onClose={() => setSelectedResearch(null)}
        />
      )}

      {/* Standard table */}
      {!loading && !error && !isRecommended && (
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
                    t("cols.title"),
                    t("cols.journalOrConference"),
                    t("cols.pubYear"),
                    t("cols.source"),
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
                      {item.journalOrConference || "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {item.pubYear || "—"}
                    </td>
                    <td
                      style={{
                        padding: "clamp(0.5rem,0.8vw,1.2rem)",
                        fontSize: "clamp(0.62rem,0.82vw,1.2rem)",
                        color: "#374151",
                      }}
                    >
                      {item.source || "—"}
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
