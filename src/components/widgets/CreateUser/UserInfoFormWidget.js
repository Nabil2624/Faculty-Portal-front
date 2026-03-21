import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const INPUT_STYLE = {
  width: "100%",
  padding: "clamp(0.5rem, 0.75vw, 1.1rem) clamp(0.6rem, 1vw, 1.4rem)",
  fontSize: "clamp(0.7rem, 0.9vw, 1.4rem)",
  borderRadius: "clamp(6px, 0.6vw, 12px)",
  border: "1.5px solid #d1d5db",
  outline: "none",
  background: "#fff",
  color: "#111827",
  transition: "border-color 0.15s",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: "clamp(0.65rem, 0.82vw, 1.2rem)",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "clamp(0.25rem, 0.35vw, 0.55rem)",
};

const ERROR_STYLE = {
  fontSize: "clamp(0.6rem, 0.78vw, 1.1rem)",
  color: "#dc2626",
  marginTop: "clamp(0.2rem, 0.3vw, 0.45rem)",
};

function PasswordField({ label, id, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  const iconSz = "clamp(14px, 1.1vw, 20px)";

  return (
    <div>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            ...INPUT_STYLE,
            borderColor: error ? "#dc2626" : "#d1d5db",
            paddingRight: "clamp(2.2rem, 3vw, 3.5rem)",
          }}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          style={{
            position: "absolute",
            right: "clamp(0.5rem, 0.8vw, 1.2rem)",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          tabIndex={-1}
        >
          {show ? (
            <EyeOff style={{ width: iconSz, height: iconSz }} />
          ) : (
            <Eye style={{ width: iconSz, height: iconSz }} />
          )}
        </button>
      </div>
      {error && <p style={ERROR_STYLE}>{error}</p>}
    </div>
  );
}

export default function UserInfoFormWidget({ form, setField, formErrors }) {
  const { t } = useTranslation("Users");

  const fields = [
    {
      key: "userName",
      type: "text",
      label: t("createUser.userInfo.userName"),
      placeholder: t("createUser.userInfo.userNamePlaceholder"),
    },
    {
      key: "email",
      type: "email",
      label: t("createUser.userInfo.email"),
      placeholder: t("createUser.userInfo.emailPlaceholder"),
    },
    {
      key: "nationalNumber",
      type: "text",
      label: t("createUser.userInfo.nationalNumber"),
      placeholder: t("createUser.userInfo.nationalNumberPlaceholder"),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "clamp(10px, 1vw, 20px)",
        padding: "clamp(1rem, 1.5vw, 2.5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(0.75rem, 1vw, 1.6rem)",
      }}
    >
      {/* Card title */}
      <h2
        style={{
          fontSize: "clamp(0.85rem, 1.1vw, 1.7rem)",
          fontWeight: 700,
          color: "#1e3a5f",
          paddingBottom: "clamp(0.5rem, 0.6vw, 0.9rem)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {t("createUser.userInfo.title")}
      </h2>

      {/* Text fields */}
      {fields.map(({ key, type, label, placeholder }) => (
        <div key={key}>
          <label htmlFor={key} style={LABEL_STYLE}>
            {label}
          </label>
          <input
            id={key}
            type={type}
            value={form[key]}
            onChange={(e) => setField(key, e.target.value)}
            placeholder={placeholder}
            style={{
              ...INPUT_STYLE,
              borderColor: formErrors[key] ? "#dc2626" : "#d1d5db",
            }}
          />
          {formErrors[key] && (
            <p style={ERROR_STYLE}>
              {t(`createUser.validation.${formErrors[key]}`)}
            </p>
          )}
        </div>
      ))}

      {/* Password */}
      <PasswordField
        id="password"
        label={t("createUser.userInfo.password")}
        value={form.password}
        onChange={(v) => setField("password", v)}
        placeholder={t("createUser.userInfo.passwordPlaceholder")}
        error={
          formErrors.password
            ? t(`createUser.validation.${formErrors.password}`)
            : null
        }
      />

      {/* Confirm Password */}
      <PasswordField
        id="confirmPassword"
        label={t("createUser.userInfo.confirmPassword")}
        value={form.confirmPassword}
        onChange={(v) => setField("confirmPassword", v)}
        placeholder={t("createUser.userInfo.confirmPasswordPlaceholder")}
        error={
          formErrors.confirmPassword
            ? t(`createUser.validation.${formErrors.confirmPassword}`)
            : null
        }
      />
    </div>
  );
}
