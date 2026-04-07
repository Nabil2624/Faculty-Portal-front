import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Pencil,
  X,
  Save,
  User,
  Phone,
  CreditCard,
  Share2,
  CheckCircle2,
} from "lucide-react";
import useAdminPersonalData from "../../../hooks/useAdminPersonalData";

// ─── Shared primitives ────────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: "clamp(0.55rem,0.72vw,1rem)",
        fontWeight: 700,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: "0.2rem",
      }}
    >
      {children}
    </span>
  );
}

function FieldValue({ children }) {
  const empty = !children || children === "";
  return (
    <span
      style={{
        fontSize: "clamp(0.7rem,0.9vw,1.3rem)",
        color: empty ? "#d1d5db" : "#111827",
        fontStyle: empty ? "italic" : "normal",
      }}
    >
      {empty ? "—" : children}
    </span>
  );
}

function TextInput({ value, onChange, disabled, type = "text", ...rest }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        borderRadius: "0.55rem",
        border: disabled ? "1px solid #e5e7eb" : "1px solid #d1d5db",
        padding: "clamp(0.3rem,0.5vw,0.75rem) clamp(0.45rem,0.65vw,1rem)",
        fontSize: "clamp(0.65rem,0.85vw,1.2rem)",
        color: disabled ? "#9ca3af" : "#111827",
        backgroundColor: disabled ? "#f9fafb" : "#fff",
        outline: "none",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "#2563eb";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = disabled ? "#e5e7eb" : "#d1d5db";
      }}
      {...rest}
    />
  );
}

function SelectInput({ value, onChange, options, isAr }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        borderRadius: "0.55rem",
        border: "1px solid #d1d5db",
        padding: "clamp(0.3rem,0.5vw,0.75rem) clamp(0.45rem,0.65vw,1rem)",
        fontSize: "clamp(0.65rem,0.85vw,1.2rem)",
        color: value ? "#111827" : "#9ca3af",
        backgroundColor: "#fff",
        outline: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {isAr ? o.valueAr : o.valueEn}
        </option>
      ))}
    </select>
  );
}

function SectionCard({ children, style }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "1rem",
        border: "1px solid #e5e7eb",
        padding: "clamp(1rem,1.5vw,2.2rem)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Grid2({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(clamp(180px,16vw,280px), 1fr))",
        gap: "clamp(0.8rem,1.2vw,1.8rem)",
      }}
    >
      {children}
    </div>
  );
}

function EditSaveBar({ editing, saving, onEdit, onSave, onCancel, t }) {
  return (
    <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
      {editing ? (
        <>
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80 disabled:opacity-50"
            style={{
              padding: "clamp(0.3rem,0.5vw,0.75rem) clamp(0.6rem,0.9vw,1.4rem)",
              fontSize: "clamp(0.6rem,0.8vw,1.1rem)",
              border: "1px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
            }}
          >
            <X
              style={{
                width: "clamp(12px,1vw,16px)",
                height: "clamp(12px,1vw,16px)",
              }}
            />
            {t("cancel")}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80 disabled:opacity-50"
            style={{
              padding: "clamp(0.3rem,0.5vw,0.75rem) clamp(0.6rem,0.9vw,1.4rem)",
              fontSize: "clamp(0.6rem,0.8vw,1.1rem)",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              color: "#fff",
              border: "none",
            }}
          >
            {saving ? (
              <Loader2
                style={{
                  width: "clamp(12px,1vw,16px)",
                  height: "clamp(12px,1vw,16px)",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <Save
                style={{
                  width: "clamp(12px,1vw,16px)",
                  height: "clamp(12px,1vw,16px)",
                }}
              />
            )}
            {saving ? t("saving") : t("save")}
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80"
          style={{
            padding: "clamp(0.3rem,0.5vw,0.75rem) clamp(0.6rem,0.9vw,1.4rem)",
            fontSize: "clamp(0.6rem,0.8vw,1.1rem)",
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#374151",
          }}
        >
          <Pencil
            style={{
              width: "clamp(12px,1vw,16px)",
              height: "clamp(12px,1vw,16px)",
            }}
          />
          {t("edit")}
        </button>
      )}
    </div>
  );
}

// ─── Tab: Personal ────────────────────────────────────────────────────────────

function PersonalTab({ data, saving, lookups, isAr, t, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [sectionError, setSectionError] = useState(null);

  const startEdit = () => {
    setForm({
      id: data?.id,
      nameAr: data?.nameAr || "",
      nameEn: data?.nameEn || "",
      titleId: data?.title?.id || "",
      maritalStatusId: data?.maritalStatus?.id || "",
      universityId: data?.university?.id || "",
      departmentId: data?.department?.id || "",
      authorityId: data?.authority?.id || "",
      fieldId: data?.field?.id || "",
      birthDate: data?.birthDate || "",
      birthPlace: data?.birthPlace || "",
      generalSpecialization: data?.generalSpecialization || "",
      accurateSpecialization: data?.accurateSpecialization || "",
      nameInComposition: data?.nameInComposition || "",
      compositionTopics: data?.compositionTopics || "",
    });
    setSectionError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSectionError(null);
      await onSave(form);
      setEditing(false);
    } catch (e) {
      setSectionError(
        e?.response?.data?.message ||
          e?.response?.data?.title ||
          t("personalData.saveError"),
      );
    }
  };

  const f = (key) => form[key];
  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  const getLookupLabel = (lookup, id) => {
    const item = lookup?.find((x) => x.id === id);
    if (!item) return "";
    return isAr ? item.valueAr : item.valueEn;
  };

  const displayVal = (lookup, obj) => {
    if (!obj) return "";
    return isAr ? obj.valueAr || "" : obj.valueEn || "";
  };

  return (
    <SectionCard>
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ marginBottom: "clamp(0.8rem,1.2vw,1.8rem)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(28px,2.2vw,40px)",
              height: "clamp(28px,2.2vw,40px)",
              background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
            }}
          >
            <User
              style={{
                width: "clamp(13px,1.1vw,18px)",
                height: "clamp(13px,1.1vw,18px)",
                color: "#2563eb",
              }}
            />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "clamp(0.75rem,1vw,1.4rem)",
              color: "#111827",
            }}
          >
            {t("personalData.personalTab")}
          </h3>
        </div>
        <EditSaveBar
          editing={editing}
          saving={saving}
          onEdit={startEdit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          t={t}
        />
      </div>

      {sectionError && (
        <div
          className="flex items-center gap-2 rounded-lg"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            padding: "clamp(0.5rem,0.8vw,1rem)",
            marginBottom: "clamp(0.6rem,1vw,1.4rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.1rem)",
          }}
        >
          <AlertCircle
            style={{
              width: "clamp(14px,1.1vw,18px)",
              height: "clamp(14px,1.1vw,18px)",
              flexShrink: 0,
            }}
          />
          {sectionError}
        </div>
      )}

      <Grid2>
        {/* nameAr */}
        <div>
          <FieldLabel>{t("personalData.nameAr")}</FieldLabel>
          {editing ? (
            <TextInput value={f("nameAr")} onChange={set("nameAr")} />
          ) : (
            <FieldValue>{data?.nameAr}</FieldValue>
          )}
        </div>
        {/* nameEn */}
        <div>
          <FieldLabel>{t("personalData.nameEn")}</FieldLabel>
          {editing ? (
            <TextInput value={f("nameEn")} onChange={set("nameEn")} />
          ) : (
            <FieldValue>{data?.nameEn}</FieldValue>
          )}
        </div>
        {/* nationalNumber - read only */}
        <div>
          <FieldLabel>{t("personalData.nationalNumber")}</FieldLabel>
          <FieldValue>{data?.nationalNumber}</FieldValue>
        </div>
        {/* gender - read only */}
        <div>
          <FieldLabel>{t("personalData.gender")}</FieldLabel>
          <FieldValue>{displayVal(lookups.genders, data?.gender)}</FieldValue>
        </div>
        {/* title */}
        <div>
          <FieldLabel>{t("personalData.title")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("titleId")}
              onChange={set("titleId")}
              options={lookups.titles}
              isAr={isAr}
            />
          ) : (
            <FieldValue>{displayVal(lookups.titles, data?.title)}</FieldValue>
          )}
        </div>
        {/* maritalStatus */}
        <div>
          <FieldLabel>{t("personalData.maritalStatus")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("maritalStatusId")}
              onChange={set("maritalStatusId")}
              options={lookups.socialStates}
              isAr={isAr}
            />
          ) : (
            <FieldValue>
              {displayVal(lookups.socialStates, data?.maritalStatus)}
            </FieldValue>
          )}
        </div>
        {/* birthDate */}
        <div>
          <FieldLabel>{t("personalData.birthDate")}</FieldLabel>
          {editing ? (
            <TextInput
              type="date"
              value={f("birthDate")}
              onChange={set("birthDate")}
            />
          ) : (
            <FieldValue>{data?.birthDate}</FieldValue>
          )}
        </div>
        {/* birthPlace */}
        <div>
          <FieldLabel>{t("personalData.birthPlace")}</FieldLabel>
          {editing ? (
            <TextInput value={f("birthPlace")} onChange={set("birthPlace")} />
          ) : (
            <FieldValue>{data?.birthPlace}</FieldValue>
          )}
        </div>
        {/* university */}
        <div>
          <FieldLabel>{t("personalData.university")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("universityId")}
              onChange={set("universityId")}
              options={lookups.universities}
              isAr={isAr}
            />
          ) : (
            <FieldValue>
              {displayVal(lookups.universities, data?.university)}
            </FieldValue>
          )}
        </div>
        {/* department */}
        <div>
          <FieldLabel>{t("personalData.department")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("departmentId")}
              onChange={set("departmentId")}
              options={lookups.departments}
              isAr={isAr}
            />
          ) : (
            <FieldValue>
              {displayVal(lookups.departments, data?.department)}
            </FieldValue>
          )}
        </div>
        {/* authority */}
        <div>
          <FieldLabel>{t("personalData.authority")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("authorityId")}
              onChange={set("authorityId")}
              options={lookups.faculties}
              isAr={isAr}
            />
          ) : (
            <FieldValue>
              {displayVal(lookups.faculties, data?.authority)}
            </FieldValue>
          )}
        </div>
        {/* field */}
        <div>
          <FieldLabel>{t("personalData.field")}</FieldLabel>
          {editing ? (
            <SelectInput
              value={f("fieldId")}
              onChange={set("fieldId")}
              options={lookups.studyFields}
              isAr={isAr}
            />
          ) : (
            <FieldValue>
              {displayVal(lookups.studyFields, data?.field)}
            </FieldValue>
          )}
        </div>
        {/* generalSpecialization */}
        <div>
          <FieldLabel>{t("personalData.generalSpecialization")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("generalSpecialization")}
              onChange={set("generalSpecialization")}
            />
          ) : (
            <FieldValue>{data?.generalSpecialization}</FieldValue>
          )}
        </div>
        {/* accurateSpecialization */}
        <div>
          <FieldLabel>{t("personalData.accurateSpecialization")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("accurateSpecialization")}
              onChange={set("accurateSpecialization")}
            />
          ) : (
            <FieldValue>{data?.accurateSpecialization}</FieldValue>
          )}
        </div>
        {/* nameInComposition */}
        <div>
          <FieldLabel>{t("personalData.nameInComposition")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("nameInComposition")}
              onChange={set("nameInComposition")}
            />
          ) : (
            <FieldValue>{data?.nameInComposition}</FieldValue>
          )}
        </div>
        {/* compositionTopics */}
        <div>
          <FieldLabel>{t("personalData.compositionTopics")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("compositionTopics")}
              onChange={set("compositionTopics")}
            />
          ) : (
            <FieldValue>{data?.compositionTopics}</FieldValue>
          )}
        </div>
      </Grid2>
    </SectionCard>
  );
}

// ─── Tab: Contact ─────────────────────────────────────────────────────────────

function ContactTab({ data, saving, isAr, t, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [sectionError, setSectionError] = useState(null);

  const startEdit = () => {
    setForm({
      workPhoneNumber: data?.workPhoneNumber || "",
      homePhoneNumber: data?.homePhoneNumber || "",
      personalEmail: data?.personalEmail || "",
      alternativeEmail: data?.alternativeEmail || "",
      faxNumber: data?.faxNumber || "",
      address: data?.address || "",
    });
    setSectionError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSectionError(null);
      await onSave(form);
      setEditing(false);
    } catch (e) {
      setSectionError(
        e?.response?.data?.message ||
          e?.response?.data?.title ||
          t("personalData.saveError"),
      );
    }
  };

  const f = (key) => form[key];
  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <SectionCard>
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ marginBottom: "clamp(0.8rem,1.2vw,1.8rem)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(28px,2.2vw,40px)",
              height: "clamp(28px,2.2vw,40px)",
              background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
            }}
          >
            <Phone
              style={{
                width: "clamp(13px,1.1vw,18px)",
                height: "clamp(13px,1.1vw,18px)",
                color: "#059669",
              }}
            />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "clamp(0.75rem,1vw,1.4rem)",
              color: "#111827",
            }}
          >
            {t("personalData.contactTab")}
          </h3>
        </div>
        <EditSaveBar
          editing={editing}
          saving={saving}
          onEdit={startEdit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          t={t}
        />
      </div>

      {sectionError && (
        <div
          className="flex items-center gap-2 rounded-lg"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            padding: "clamp(0.5rem,0.8vw,1rem)",
            marginBottom: "clamp(0.6rem,1vw,1.4rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.1rem)",
          }}
        >
          <AlertCircle
            style={{
              width: "clamp(14px,1.1vw,18px)",
              height: "clamp(14px,1.1vw,18px)",
              flexShrink: 0,
            }}
          />
          {sectionError}
        </div>
      )}

      <Grid2>
        {/* officialEmail - read only */}
        <div>
          <FieldLabel>{t("personalData.officialEmail")}</FieldLabel>
          <FieldValue>{data?.officialEmail}</FieldValue>
        </div>
        {/* mainPhoneNumber - read only */}
        <div>
          <FieldLabel>{t("personalData.mainPhoneNumber")}</FieldLabel>
          <FieldValue>{data?.mainPhoneNumber}</FieldValue>
        </div>
        {/* workPhoneNumber */}
        <div>
          <FieldLabel>{t("personalData.workPhoneNumber")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("workPhoneNumber")}
              onChange={set("workPhoneNumber")}
            />
          ) : (
            <FieldValue>{data?.workPhoneNumber}</FieldValue>
          )}
        </div>
        {/* homePhoneNumber */}
        <div>
          <FieldLabel>{t("personalData.homePhoneNumber")}</FieldLabel>
          {editing ? (
            <TextInput
              value={f("homePhoneNumber")}
              onChange={set("homePhoneNumber")}
            />
          ) : (
            <FieldValue>{data?.homePhoneNumber}</FieldValue>
          )}
        </div>
        {/* personalEmail */}
        <div>
          <FieldLabel>{t("personalData.personalEmail")}</FieldLabel>
          {editing ? (
            <TextInput
              type="email"
              value={f("personalEmail")}
              onChange={set("personalEmail")}
            />
          ) : (
            <FieldValue>{data?.personalEmail}</FieldValue>
          )}
        </div>
        {/* alternativeEmail */}
        <div>
          <FieldLabel>{t("personalData.alternativeEmail")}</FieldLabel>
          {editing ? (
            <TextInput
              type="email"
              value={f("alternativeEmail")}
              onChange={set("alternativeEmail")}
            />
          ) : (
            <FieldValue>{data?.alternativeEmail}</FieldValue>
          )}
        </div>
        {/* faxNumber */}
        <div>
          <FieldLabel>{t("personalData.faxNumber")}</FieldLabel>
          {editing ? (
            <TextInput value={f("faxNumber")} onChange={set("faxNumber")} />
          ) : (
            <FieldValue>{data?.faxNumber}</FieldValue>
          )}
        </div>
        {/* address */}
        <div>
          <FieldLabel>{t("personalData.address")}</FieldLabel>
          {editing ? (
            <TextInput value={f("address")} onChange={set("address")} />
          ) : (
            <FieldValue>{data?.address}</FieldValue>
          )}
        </div>
      </Grid2>
    </SectionCard>
  );
}

// ─── Tab: Identification ──────────────────────────────────────────────────────

function IdentificationTab({ data, saving, t, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [sectionError, setSectionError] = useState(null);

  const FIELDS = [
    "orcid",
    "ekb",
    "researcherId",
    "researcherGate",
    "academiaEdu",
    "googleScholar",
    "scopus",
  ];

  const startEdit = () => {
    const next = {};
    FIELDS.forEach((k) => (next[k] = data?.[k] || ""));
    setForm(next);
    setSectionError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSectionError(null);
      await onSave(form);
      setEditing(false);
    } catch (e) {
      setSectionError(
        e?.response?.data?.message ||
          e?.response?.data?.title ||
          t("personalData.saveError"),
      );
    }
  };

  const f = (key) => form[key];
  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <SectionCard>
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ marginBottom: "clamp(0.8rem,1.2vw,1.8rem)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(28px,2.2vw,40px)",
              height: "clamp(28px,2.2vw,40px)",
              background: "linear-gradient(135deg,#fdf4ff,#f3e8ff)",
            }}
          >
            <CreditCard
              style={{
                width: "clamp(13px,1.1vw,18px)",
                height: "clamp(13px,1.1vw,18px)",
                color: "#7c3aed",
              }}
            />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "clamp(0.75rem,1vw,1.4rem)",
              color: "#111827",
            }}
          >
            {t("personalData.identificationTab")}
          </h3>
        </div>
        <EditSaveBar
          editing={editing}
          saving={saving}
          onEdit={startEdit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          t={t}
        />
      </div>

      {sectionError && (
        <div
          className="flex items-center gap-2 rounded-lg"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            padding: "clamp(0.5rem,0.8vw,1rem)",
            marginBottom: "clamp(0.6rem,1vw,1.4rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.1rem)",
          }}
        >
          <AlertCircle
            style={{
              width: "clamp(14px,1.1vw,18px)",
              height: "clamp(14px,1.1vw,18px)",
              flexShrink: 0,
            }}
          />
          {sectionError}
        </div>
      )}

      <Grid2>
        {FIELDS.map((key) => (
          <div key={key}>
            <FieldLabel>{t(`personalData.id_${key}`)}</FieldLabel>
            {editing ? (
              <TextInput value={f(key)} onChange={set(key)} />
            ) : (
              <FieldValue>{data?.[key]}</FieldValue>
            )}
          </div>
        ))}
      </Grid2>
    </SectionCard>
  );
}

// ─── Tab: Social Media ────────────────────────────────────────────────────────

function SocialTab({ data, saving, t, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [sectionError, setSectionError] = useState(null);

  const FIELDS = [
    "linkedIn",
    "instagram",
    "personalWebsite",
    "facebook",
    "x",
    "youTube",
  ];

  const startEdit = () => {
    const next = {};
    FIELDS.forEach((k) => (next[k] = data?.[k] || ""));
    setForm(next);
    setSectionError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSectionError(null);
      await onSave(form);
      setEditing(false);
    } catch (e) {
      setSectionError(
        e?.response?.data?.message ||
          e?.response?.data?.title ||
          t("personalData.saveError"),
      );
    }
  };

  const f = (key) => form[key];
  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <SectionCard>
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ marginBottom: "clamp(0.8rem,1.2vw,1.8rem)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(28px,2.2vw,40px)",
              height: "clamp(28px,2.2vw,40px)",
              background: "linear-gradient(135deg,#fff7ed,#fed7aa)",
            }}
          >
            <Share2
              style={{
                width: "clamp(13px,1.1vw,18px)",
                height: "clamp(13px,1.1vw,18px)",
                color: "#ea580c",
              }}
            />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "clamp(0.75rem,1vw,1.4rem)",
              color: "#111827",
            }}
          >
            {t("personalData.socialTab")}
          </h3>
        </div>
        <EditSaveBar
          editing={editing}
          saving={saving}
          onEdit={startEdit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          t={t}
        />
      </div>

      {sectionError && (
        <div
          className="flex items-center gap-2 rounded-lg"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            padding: "clamp(0.5rem,0.8vw,1rem)",
            marginBottom: "clamp(0.6rem,1vw,1.4rem)",
            fontSize: "clamp(0.62rem,0.82vw,1.1rem)",
          }}
        >
          <AlertCircle
            style={{
              width: "clamp(14px,1.1vw,18px)",
              height: "clamp(14px,1.1vw,18px)",
              flexShrink: 0,
            }}
          />
          {sectionError}
        </div>
      )}

      <Grid2>
        {FIELDS.map((key) => (
          <div key={key}>
            <FieldLabel>{t(`personalData.social_${key}`)}</FieldLabel>
            {editing ? (
              <TextInput value={f(key)} onChange={set(key)} />
            ) : (
              <FieldValue>{data?.[key]}</FieldValue>
            )}
          </div>
        ))}
      </Grid2>
    </SectionCard>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

const TABS = ["personal", "contact", "identification", "social"];

export default function AdminPersonalDataPanel({ user }) {
  const { t, i18n } = useTranslation("AdminFacultyData");
  const isAr = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("personal");
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    personalData,
    contactData,
    identificationData,
    socialData,
    loading,
    error,
    saving,
    reload,
    savePersonal,
    saveContact,
    saveIdentification,
    saveSocial,
    lookups,
  } = useAdminPersonalData(user?.email);

  const showSuccess = useCallback(() => {
    setSuccessMsg(t("personalData.saveSuccess"));
    setTimeout(() => setSuccessMsg(null), 3000);
  }, [t]);

  const handleSavePersonal = useCallback(
    async (data) => {
      await savePersonal(data);
      showSuccess();
    },
    [savePersonal, showSuccess],
  );

  const handleSaveContact = useCallback(
    async (data) => {
      await saveContact(data);
      showSuccess();
    },
    [saveContact, showSuccess],
  );

  const handleSaveIdentification = useCallback(
    async (data) => {
      await saveIdentification(data);
      showSuccess();
    },
    [saveIdentification, showSuccess],
  );

  const handleSaveSocial = useCallback(
    async (data) => {
      await saveSocial(data);
      showSuccess();
    },
    [saveSocial, showSuccess],
  );

  const TAB_ICONS = {
    personal: User,
    contact: Phone,
    identification: CreditCard,
    social: Share2,
  };

  const TAB_COLORS = {
    personal: "#2563eb",
    contact: "#059669",
    identification: "#7c3aed",
    social: "#ea580c",
  };

  // Loading
  if (loading) {
    return (
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
    );
  }

  // Error
  if (error) {
    return (
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
        {t("loadError")}
        <button
          onClick={reload}
          className="ms-auto flex items-center gap-1 underline font-medium hover:opacity-80"
        >
          <RefreshCw
            style={{
              width: "clamp(12px,1vw,18px)",
              height: "clamp(12px,1vw,18px)",
            }}
          />
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.8rem,1.2vw,1.8rem)",
      }}
    >
      {/* Success toast */}
      {successMsg && (
        <div
          className="flex items-center gap-2 rounded-2xl"
          style={{
            padding: "clamp(0.6rem,0.9vw,1.4rem) clamp(0.9rem,1.3vw,2rem)",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            color: "#15803d",
            fontSize: "clamp(0.65rem,0.88vw,1.2rem)",
          }}
        >
          <CheckCircle2
            style={{
              width: "clamp(14px,1.1vw,20px)",
              height: "clamp(14px,1.1vw,20px)",
              flexShrink: 0,
            }}
          />
          {successMsg}
        </div>
      )}

      {/* Tab bar */}
      <div
        className="flex flex-wrap gap-2"
        style={{
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "0.5rem",
        }}
      >
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 rounded-xl font-semibold transition"
              style={{
                padding:
                  "clamp(0.35rem,0.55vw,0.9rem) clamp(0.6rem,0.9vw,1.4rem)",
                fontSize: "clamp(0.62rem,0.82vw,1.1rem)",
                backgroundColor: active ? TAB_COLORS[tab] : "transparent",
                color: active ? "#fff" : "#6b7280",
                border: active
                  ? `1px solid ${TAB_COLORS[tab]}`
                  : "1px solid transparent",
              }}
            >
              <Icon
                style={{
                  width: "clamp(12px,1vw,16px)",
                  height: "clamp(12px,1vw,16px)",
                }}
              />
              {t(`personalData.tab_${tab}`)}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "personal" && (
        <PersonalTab
          data={personalData}
          saving={saving}
          lookups={lookups}
          isAr={isAr}
          t={t}
          onSave={handleSavePersonal}
        />
      )}
      {activeTab === "contact" && (
        <ContactTab
          data={contactData}
          saving={saving}
          isAr={isAr}
          t={t}
          onSave={handleSaveContact}
        />
      )}
      {activeTab === "identification" && (
        <IdentificationTab
          data={identificationData}
          saving={saving}
          t={t}
          onSave={handleSaveIdentification}
        />
      )}
      {activeTab === "social" && (
        <SocialTab
          data={socialData}
          saving={saving}
          t={t}
          onSave={handleSaveSocial}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
