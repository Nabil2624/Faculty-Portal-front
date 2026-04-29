import {
  ScrollText,
  XCircle,
  Tag,
  Zap,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { LevelBadge, CodeBadge } from "./LogsBadges";
import { ExpandedRow } from "./ExpandedRow";
import { LEVEL_CONFIG, COL_COUNT, PAGE_SIZE } from "./logsConstants";

const TABLE_COLUMNS = [
  { key: "no", w: "3rem" },
  { key: "timestamp", w: "9rem" },
  { key: "level", w: "7rem" },
  { key: "code", w: "6.5rem" },
  { key: "category", w: "10rem" },
  { key: "categoryAction", w: "9rem" },
  { key: "userName", w: "10rem" },
  { key: "userIp", w: "8rem" },
  { key: "renderedMessage", w: "auto" },
  { key: "details", w: "4rem" },
];

export function LogsTable({
  logs,
  loading,
  error,
  currentPage,
  expandedRow,
  setExpandedRow,
  formatTimestamp,
  loadData,
  t,
  isArabic,
}) {
  return (
    <div
      className="rounded-[14px] overflow-hidden border border-[#19355a]/20 shadow-sm"
      style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)" }}
    >
      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <XCircle
            className="text-red-400 mb-3"
            style={{
              width: "clamp(2rem, 3vw, 4rem)",
              height: "clamp(2rem, 3vw, 4rem)",
            }}
          />
          <p
            className="text-gray-600 font-medium"
            style={{ fontSize: "clamp(0.75rem, 1.1vw, 1.2rem)" }}
          >
            {t("error")}
          </p>
          <button
            onClick={loadData}
            className="mt-4 bg-[#19355a] text-white rounded-lg hover:bg-[#19355a]/90 transition"
            style={{
              padding:
                "clamp(0.4rem, 0.7vw, 0.7rem) clamp(1rem, 1.5vw, 1.5rem)",
              fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
            }}
          >
            {t("retry")}
          </button>
        </div>
      )}

      {!error && (
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ minWidth: "clamp(700px, 85vw, 1400px)" }}
          >
            <thead>
              <tr className="bg-[#19355a] text-white">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="text-left font-semibold whitespace-nowrap"
                    style={{
                      padding:
                        "clamp(0.5rem, 0.9vw, 1rem) clamp(0.6rem, 1vw, 1rem)",
                      fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)",
                      width:
                        col.w !== "auto"
                          ? `clamp(${col.w}, ${col.w}, 20rem)`
                          : undefined,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {t(`table.${col.key}`)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Loading skeleton */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={`sk-${i}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {Array.from({ length: COL_COUNT }).map((__, j) => (
                      <td
                        key={j}
                        style={{
                          padding:
                            "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                        }}
                      >
                        <div
                          className="rounded animate-pulse bg-gray-200"
                          style={{
                            height: "clamp(10px, 1.2vw, 16px)",
                            width: j === 0 ? "1.5rem" : "70%",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={COL_COUNT} className="text-center py-16">
                    <ScrollText
                      className="text-gray-300 mx-auto mb-3"
                      style={{
                        width: "clamp(2rem, 4vw, 5rem)",
                        height: "clamp(2rem, 4vw, 5rem)",
                      }}
                    />
                    <p
                      className="font-medium text-gray-500"
                      style={{ fontSize: "clamp(0.75rem, 1.1vw, 1.2rem)" }}
                    >
                      {t("noLogs")}
                    </p>
                    <p
                      className="text-gray-400 mt-1"
                      style={{ fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}
                    >
                      {t("noLogsHint")}
                    </p>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                logs.map((log, idx) => {
                  const isExpanded = expandedRow === log.id;
                  const isEven = idx % 2 === 0;
                  const { date, time } = formatTimestamp(log.timestamp);

                  return (
                    <>
                      <tr
                        key={log.id}
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : log.id)
                        }
                        className="cursor-pointer transition-colors"
                        style={{
                          backgroundColor: isExpanded
                            ? "#fdf8ec"
                            : isEven
                              ? "#ffffff"
                              : "#f9fafb",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.backgroundColor =
                              "rgba(179,142,25,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.backgroundColor = isEven
                              ? "#ffffff"
                              : "#f9fafb";
                        }}
                      >
                        {/* # */}
                        <td
                          className="text-gray-400 font-mono border-b border-gray-100"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                          }}
                        >
                          {(currentPage - 1) * PAGE_SIZE + idx + 1}
                        </td>

                        {/* Timestamp */}
                        <td
                          className="border-b border-gray-100"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                          }}
                        >
                          <span
                            className="block text-gray-700 font-medium"
                            style={{
                              fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                            }}
                          >
                            {date}
                          </span>
                          <span
                            className="block text-gray-400 font-mono"
                            style={{
                              fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
                            }}
                          >
                            {time}
                          </span>
                        </td>

                        {/* Level */}
                        <td
                          className="border-b border-gray-100"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                          }}
                        >
                          <LevelBadge level={log.level} />
                        </td>

                        {/* Code */}
                        <td
                          className="border-b border-gray-100"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                          }}
                        >
                          <CodeBadge code={log.code} t={t} />
                        </td>

                        {/* Category */}
                        <td
                          className="border-b border-gray-100 text-gray-700"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <Tag
                              className="text-[#b38e19] shrink-0"
                              style={{
                                width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                height: "clamp(0.6rem, 0.8vw, 0.9rem)",
                              }}
                            />
                            {log.category}
                          </span>
                        </td>

                        {/* Category Action */}
                        <td
                          className="border-b border-gray-100 text-gray-600"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <Zap
                              className="text-gray-400 shrink-0"
                              style={{
                                width: "clamp(0.6rem, 0.8vw, 0.9rem)",
                                height: "clamp(0.6rem, 0.8vw, 0.9rem)",
                              }}
                            />
                            {log.categoryAction}
                          </span>
                        </td>

                        {/* Username */}
                        <td
                          className="border-b border-gray-100 text-gray-600"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                            maxWidth: "10rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.userName ?? (
                            <span className="text-gray-400 italic">
                              {isArabic ? "لا يوجد" : "Not Found"}
                            </span>
                          )}
                        </td>

                        {/* User IP */}
                        <td
                          className="border-b border-gray-100 font-mono text-gray-500"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.55rem, 0.78vw, 0.85rem)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.userIp ?? (
                            <span className="text-gray-400 italic">
                              {isArabic ? "لا يوجد" : "Not Found"}
                            </span>
                          )}
                        </td>

                        {/* Rendered Message */}
                        <td
                          className="border-b border-gray-100 text-gray-700"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.6rem, 1vw, 1rem)",
                            fontSize: "clamp(0.6rem, 0.82vw, 0.9rem)",
                            maxWidth: "clamp(10rem, 20vw, 26rem)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={log.renderedMessage}
                        >
                          {log.renderedMessage}
                        </td>

                        {/* Expand toggle */}
                        <td
                          className="border-b border-gray-100 text-center"
                          style={{
                            padding:
                              "clamp(0.5rem, 0.85vw, 0.9rem) clamp(0.4rem, 0.7vw, 0.7rem)",
                          }}
                        >
                          <button
                            className="rounded-full transition flex items-center justify-center mx-auto"
                            style={{
                              width: "clamp(1.4rem, 2vw, 2rem)",
                              height: "clamp(1.4rem, 2vw, 2rem)",
                              backgroundColor: isExpanded
                                ? "#b38e19"
                                : "transparent",
                              border: `1.5px solid ${isExpanded ? "#b38e19" : "#d1d5db"}`,
                            }}
                            aria-label={
                              isExpanded ? t("collapseRow") : t("expandRow")
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown
                                style={{
                                  width: "clamp(0.65rem, 1vw, 1.1rem)",
                                  height: "clamp(0.65rem, 1vw, 1.1rem)",
                                  color: "white",
                                }}
                              />
                            ) : (
                              <ChevronRight
                                style={{
                                  width: "clamp(0.65rem, 1vw, 1.1rem)",
                                  height: "clamp(0.65rem, 1vw, 1.1rem)",
                                  color: "#6b7280",
                                }}
                              />
                            )}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <ExpandedRow
                          key={`exp-${log.id}`}
                          log={log}
                          colSpan={COL_COUNT}
                          t={t}
                          isArabic={isArabic}
                        />
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
