import { useTranslation } from "react-i18next";
import { User, Mail, CreditCard, Shield } from "lucide-react";

// ─── Role badge colours ───────────────────────────────────────────────────────

const ROLE_STYLES = {
  FacultyMember: { bg: "#dbeafe", text: "#1d4ed8", border: "#3b82f6" },
  ManagementAdmin: { bg: "#f3e8ff", text: "#7c3aed", border: "#a855f7" },
  SupportAdmin: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
  // Legacy aliases (in case API returns these names)
  Support: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
  Management: { bg: "#f3e8ff", text: "#7c3aed", border: "#a855f7" },
};

// Shared padding/font so th and td always match exactly
const CELL_PAD = "clamp(0.65rem, 0.95vw, 1.6rem) clamp(0.75rem, 1.2vw, 2rem)";
const CELL_FONT = "clamp(0.65rem, 0.85vw, 1.3rem)";

function RoleBadge({ roleName }) {
  const { t } = useTranslation("Users");
  const style = ROLE_STYLES[roleName] || {
    bg: "#f3f4f6",
    text: "#374151",
    border: "#9ca3af",
  };
  return (
    <span
      className="inline-flex items-center rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        padding:
          "clamp(0.18rem, 0.35vw, 0.55rem) clamp(0.45rem, 0.7vw, 1.1rem)",
        fontSize: "clamp(0.6rem, 0.85vw, 1.3rem)",
      }}
    >
      {t(`roleBadge.${roleName}`, roleName)}
    </span>
  );
}

// ─── UsersTable ───────────────────────────────────────────────────────────────

export default function UsersTable({
  users,
  selectedUserId,
  onSelectUser,
  onEditUser,
}) {
  const { t } = useTranslation("Users");

  const headers = [
    { key: "no", label: t("table.no"), width: "4%" },
    { key: "name", label: t("table.name"), width: "26%" },
    { key: "email", label: t("table.email"), width: "27%" },
    { key: "nationalId", label: t("table.nationalId"), width: "19%" },
    { key: "role", label: t("table.role"), width: "20%" },
    { key: "actions", label: t("table.actions"), width: "8%" },
  ];

  return (
    <div
      className="w-full overflow-x-auto rounded-2xl shadow"
      style={{ border: "1px solid #e5e7eb" }}
    >
      {/* table-layout:fixed + colgroup guarantee header and body columns line up */}
      <table
        className="w-full border-collapse"
        style={{ minWidth: "680px", tableLayout: "fixed" }}
      >
        <colgroup>
          {headers.map((h) => (
            <col key={h.key} style={{ width: h.width }} />
          ))}
        </colgroup>

        <thead>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            {headers.map((h) => (
              <th
                key={h.key}
                style={{
                  textAlign: "start",
                  verticalAlign: "middle",
                  padding: CELL_PAD,
                  fontSize: "clamp(0.68rem, 0.9vw, 1.35rem)",
                  fontWeight: 600,
                  color: "#374151",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user, idx) => {
            const isSelected = user.id === selectedUserId;
            return (
              <tr
                key={user.id}
                onClick={() =>
                  onSelectUser(user.id === selectedUserId ? null : user.id)
                }
                className="cursor-pointer transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? "#eff6ff"
                    : idx % 2 === 0
                      ? "#ffffff"
                      : "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                  borderLeft: isSelected
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                }}
              >
                {/* # */}
                <td
                  style={{
                    padding: CELL_PAD,
                    fontSize: CELL_FONT,
                    color: "#9ca3af",
                    fontWeight: 500,
                    verticalAlign: "middle",
                  }}
                >
                  {idx + 1}
                </td>

                {/* Name + username */}
                <td
                  style={{
                    padding: CELL_PAD,
                    verticalAlign: "middle",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{ minWidth: 0 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: "clamp(28px, 2.2vw, 56px)",
                        height: "clamp(28px, 2.2vw, 56px)",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      }}
                    >
                      <User
                        style={{
                          width: "clamp(13px, 1.1vw, 26px)",
                          height: "clamp(13px, 1.1vw, 26px)",
                          color: "#fff",
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: CELL_FONT,
                          fontWeight: 600,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: "clamp(0.58rem, 0.75vw, 1.1rem)",
                          color: "#6b7280",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.username}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td
                  style={{
                    padding: CELL_PAD,
                    fontSize: CELL_FONT,
                    color: "#374151",
                    verticalAlign: "middle",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="flex items-center gap-1"
                    style={{ minWidth: 0 }}
                  >
                    <Mail
                      style={{
                        width: "clamp(11px, 0.95vw, 20px)",
                        height: "clamp(11px, 0.95vw, 20px)",
                        color: "#9ca3af",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </span>
                  </div>
                </td>

                {/* National ID */}
                <td
                  style={{
                    padding: CELL_PAD,
                    fontSize: CELL_FONT,
                    color: "#374151",
                    fontFamily: "monospace",
                    letterSpacing: "0.03em",
                    verticalAlign: "middle",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="flex items-center gap-1"
                    style={{ minWidth: 0 }}
                  >
                    <CreditCard
                      style={{
                        width: "clamp(11px, 0.95vw, 20px)",
                        height: "clamp(11px, 0.95vw, 20px)",
                        color: "#9ca3af",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.nationalId}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td style={{ padding: CELL_PAD, verticalAlign: "middle" }}>
                  <div className="flex flex-wrap gap-1">
                    {(user.roles && user.roles.length > 0
                      ? user.roles
                      : [user.role?.name].filter(Boolean)
                    ).map((roleName) => (
                      <RoleBadge key={roleName} roleName={roleName} />
                    ))}
                  </div>
                </td>

                {/* Actions */}
                <td
                  style={{ padding: CELL_PAD, verticalAlign: "middle" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditUser(user)}
                    className="inline-flex items-center gap-1 rounded-lg font-medium transition hover:opacity-80 active:scale-95"
                    style={{
                      backgroundColor: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      padding:
                        "clamp(0.25rem, 0.4vw, 0.45rem) clamp(0.45rem, 0.75vw, 0.8rem)",
                      fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Shield
                      style={{
                        width: "clamp(11px, 0.9vw, 13px)",
                        height: "clamp(11px, 0.9vw, 13px)",
                      }}
                    />
                    {t("table.edit")}
                  </button>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "clamp(2rem, 4vw, 3rem)",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: CELL_FONT,
                }}
              >
                {t("table.noUsers")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
