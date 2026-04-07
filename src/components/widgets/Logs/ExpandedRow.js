import { Info, XCircle } from "lucide-react";

const isPresent = (val) => val && val !== "null";

export function ExpandedRow({ log, colSpan, t }) {
  const hasException =
    isPresent(log.exception) ||
    isPresent(log.exceptionMessage) ||
    isPresent(log.exceptionDetail);

  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-[#f8fafc]"
        style={{
          padding: "clamp(0.6rem, 1.2vw, 1.2rem) clamp(1rem, 2vw, 2rem)",
        }}
      >
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: hasException ? "1fr 1fr" : "1fr" }}
        >
          {/* Exception block */}
          {hasException && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 overflow-hidden"
              style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
            >
              <p
                className="font-semibold text-red-700 flex items-center gap-1"
                style={{
                  fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                  marginBottom: "clamp(0.4rem, 0.7vw, 0.7rem)",
                }}
              >
                <XCircle
                  style={{
                    width: "clamp(0.75rem, 1vw, 1.1rem)",
                    height: "clamp(0.75rem, 1vw, 1.1rem)",
                  }}
                />
                {t("expanded.exception")}
              </p>

              {isPresent(log.exception) && (
                <div style={{ marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)" }}>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    Type
                  </span>
                  <code
                    className="text-red-800 font-mono bg-red-100 rounded px-1 break-all block"
                    style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
                  >
                    {log.exception}
                  </code>
                </div>
              )}

              {isPresent(log.exceptionMessage) && (
                <div style={{ marginBottom: "clamp(0.4rem, 0.6vw, 0.6rem)" }}>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    {t("expanded.exceptionMessage")}
                  </span>
                  <p
                    className="text-red-700"
                    style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
                  >
                    {log.exceptionMessage}
                  </p>
                </div>
              )}

              {isPresent(log.exceptionDetail) && (
                <div>
                  <span
                    className="text-gray-500 block"
                    style={{
                      fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)",
                      marginBottom: "2px",
                    }}
                  >
                    {t("expanded.exceptionDetail")}
                  </span>
                  <pre
                    className="bg-gray-900 text-green-400 rounded-lg overflow-x-auto"
                    style={{
                      fontSize: "clamp(0.5rem, 0.7vw, 0.75rem)",
                      padding: "clamp(0.4rem, 0.7vw, 0.7rem)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                      maxHeight: "clamp(6rem, 10vw, 12rem)",
                    }}
                  >
                    {log.exceptionDetail}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Additional Information block */}
          <div
            className="rounded-xl border border-[#19355a]/20 bg-[#19355a]/5"
            style={{ padding: "clamp(0.6rem, 1vw, 1rem)" }}
          >
            <p
              className="font-semibold text-[#19355a] flex items-center gap-1"
              style={{
                fontSize: "clamp(0.65rem, 0.9vw, 0.95rem)",
                marginBottom: "clamp(0.4rem, 0.7vw, 0.7rem)",
              }}
            >
              <Info
                style={{
                  width: "clamp(0.75rem, 1vw, 1.1rem)",
                  height: "clamp(0.75rem, 1vw, 1.1rem)",
                }}
              />
              {t("expanded.additionalInfo")}
            </p>
            {log.additionalInformation ? (
              <p
                className="text-gray-700"
                style={{
                  fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
                  lineHeight: 1.5,
                }}
              >
                {log.additionalInformation}
              </p>
            ) : (
              <p
                className="text-gray-400 italic"
                style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)" }}
              >
                —
              </p>
            )}

            {!hasException && (
              <p
                className="text-gray-400 italic mt-3"
                style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)" }}
              >
                {t("expanded.noException")}
              </p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
