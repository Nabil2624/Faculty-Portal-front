import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Mail, AtSign, Lock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

// ─── EditUserModal ─────────────────────────────────────────────────────────────
// Allows admin to edit: name, username, password.
// National ID is intentionally read-only.

export default function EditUserModal({ user, saving, onSave, onClose }) {
  const { t, i18n } = useTranslation("Users");
  const isArabic = i18n.language === "ar";
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Sync if user prop changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.username);
      setPassword("");
      setConfirmPassword("");
      setValidationError("");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!email.trim()) {
      setValidationError(t("editModal.emailRequired"));
      return;
    }
    if (!username.trim()) {
      setValidationError(t("editModal.usernameRequired"));
      return;
    }
    if (password && password !== confirmPassword) {
      setValidationError(t("editModal.passwordMismatch"));
      return;
    }

    onSave({
      email: email.trim(),
      username: username.trim(),
      nationalNumber: user.nationalId,
      password: password || undefined,
    });
  };

  if (!user) return null;

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.6rem",
    padding: "clamp(0.5rem, 0.8vw, 1.2rem) clamp(0.6rem, 1vw, 1.4rem)",
    fontSize: "clamp(0.75rem, 0.95vw, 1.4rem)",
    outline: "none",
    color: "#111827",
    backgroundColor: "#fff",
    transition: "border-color 0.15s",
  };

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

  const labelStyle = {
    display: "block",
    fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.3rem",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        dir={isArabic ? "rtl" : "ltr"}
        style={{
          width: "clamp(320px, 28vw, 760px)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "clamp(1.2rem, 2.5vw, 3.5rem)",
          gap: "clamp(0.9rem, 1.5vw, 2rem)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{
                fontSize: "clamp(1rem, 1.4vw, 2rem)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {t("editModal.title")}
            </h2>
            <p
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 1.2rem)",
                color: "#6b7280",
                marginTop: "0.15rem",
              }}
            >
              {t("editModal.editing")}: <strong>{user.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <X
              style={{
                width: "clamp(16px, 1.3vw, 20px)",
                height: "clamp(16px, 1.3vw, 20px)",
                color: "#6b7280",
              }}
            />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.8rem, 1.2vw, 1.1rem)",
          }}
        >
          {/* National ID — disabled */}
          <div>
            <label style={labelStyle}>{t("editModal.nationalId")}</label>
            <input
              type="text"
              value={user.nationalId}
              readOnly
              style={disabledInputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>{t("editModal.email")}</label>
            <div className="relative">
              <Mail
                style={{
                  position: "absolute",
                  [isArabic ? "right" : "left"]: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "clamp(13px, 1.1vw, 22px)",
                  height: "clamp(13px, 1.1vw, 22px)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("editModal.emailPlaceholder")}
                required
                style={{
                  ...inputStyle,
                  paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
                }}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label style={labelStyle}>{t("editModal.username")}</label>
            <div className="relative">
              <AtSign
                style={{
                  position: "absolute",
                  [isArabic ? "right" : "left"]: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "clamp(13px, 1.1vw, 22px)",
                  height: "clamp(13px, 1.1vw, 22px)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("editModal.usernamePlaceholder")}
                required
                style={{
                  ...inputStyle,
                  paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
                }}
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={labelStyle}>
              {t("editModal.password")}
              <span
                style={{
                  marginLeft: "0.39rem",
                  marginRight: "0.39rem",
                  fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                  color: "#6b7280",
                  fontWeight: 400,
                }}
              >
                {t("editModal.passwordHint")}
              </span>
            </label>
            <div className="relative">
              <Lock
                style={{
                  position: "absolute",
                  [isArabic ? "right" : "left"]: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "clamp(13px, 1.1vw, 22px)",
                  height: "clamp(13px, 1.1vw, 22px)",
                  color: "#9ca3af",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("editModal.passwordPlaceholder")}
                style={{
                  ...inputStyle,
                  paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
                  paddingInlineEnd: "clamp(2rem, 2.5vw, 2.5rem)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute"
                style={{
                  [isArabic ? "left" : "right"]: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? (
                  <EyeOff
                    style={{
                      width: "clamp(13px, 1.1vw, 22px)",
                      height: "clamp(13px, 1.1vw, 22px)",
                      color: "#9ca3af",
                    }}
                  />
                ) : (
                  <Eye
                    style={{
                      width: "clamp(13px, 1.1vw, 22px)",
                      height: "clamp(13px, 1.1vw, 22px)",
                      color: "#9ca3af",
                    }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {password && (
            <div>
              <label style={labelStyle}>{t("editModal.confirmPassword")}</label>
              <div className="relative">
                <Lock
                  style={{
                    position: "absolute",
                    [isArabic ? "right" : "left"]: "0.7rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "clamp(13px, 1.1vw, 16px)",
                    height: "clamp(13px, 1.1vw, 16px)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("editModal.confirmPlaceholder")}
                  style={{
                    ...inputStyle,
                    paddingInlineStart: "clamp(2rem, 2.5vw, 2.5rem)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <div
              className="flex items-center gap-2 rounded-lg"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                padding:
                  "clamp(0.4rem, 0.7vw, 0.65rem) clamp(0.6rem, 1vw, 0.85rem)",
                fontSize: "clamp(0.65rem, 0.85vw, 0.875rem)",
              }}
            >
              <AlertCircle
                style={{
                  width: "clamp(13px, 1.1vw, 15px)",
                  height: "clamp(13px, 1.1vw, 15px)",
                  flexShrink: 0,
                }}
              />
              {validationError}
            </div>
          )}

          {/* Buttons */}
          <div
            className="flex justify-end gap-2"
            style={{ marginTop: "0.25rem" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl font-medium transition hover:bg-gray-100"
              style={{
                padding:
                  "clamp(0.45rem, 0.7vw, 1.1rem) clamp(1rem, 1.5vw, 2rem)",
                fontSize: "clamp(0.7rem, 0.9vw, 1.3rem)",
                color: "#374151",
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
              }}
            >
              {t("editModal.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl font-medium transition"
              style={{
                padding:
                  "clamp(0.45rem, 0.7vw, 1.1rem) clamp(1rem, 1.5vw, 2rem)",
                fontSize: "clamp(0.7rem, 0.9vw, 1.3rem)",
                color: "#fff",
                backgroundColor: saving ? "#93c5fd" : "#2563eb",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? t("editModal.saving") : t("editModal.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
