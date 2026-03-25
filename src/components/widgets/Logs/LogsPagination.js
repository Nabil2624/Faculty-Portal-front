export function LogsPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  setExpandedRow,
  t,
}) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ gap: "clamp(0.5rem, 1.2vw, 1rem)" }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => {
          setCurrentPage((p) => p - 1);
          setExpandedRow(null);
        }}
        className="transition rounded-lg border border-gray-300 font-medium"
        style={{
          padding:
            "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.75rem, 1.3vw, 1.4rem)",
          fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
          color: currentPage === 1 ? "#d1d5db" : "#374151",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        {t("previous")}
      </button>

      <div
        className="flex items-center"
        style={{ gap: "clamp(0.2rem, 0.5vw, 0.5rem)" }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2,
          )
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-gray-400"
                style={{ fontSize: "clamp(0.65rem, 0.9vw, 1rem)" }}
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => {
                  setCurrentPage(p);
                  setExpandedRow(null);
                }}
                className="rounded-lg transition font-medium"
                style={{
                  minWidth: "clamp(1.6rem, 2.2vw, 2.6rem)",
                  height: "clamp(1.6rem, 2.2vw, 2.6rem)",
                  fontSize: "clamp(0.6rem, 0.85vw, 0.95rem)",
                  backgroundColor:
                    p === currentPage ? "#19355a" : "transparent",
                  color: p === currentPage ? "white" : "#374151",
                  border: `1px solid ${p === currentPage ? "#19355a" : "#d1d5db"}`,
                }}
              >
                {p}
              </button>
            ),
          )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => {
          setCurrentPage((p) => p + 1);
          setExpandedRow(null);
        }}
        className="transition rounded-lg border border-gray-300 font-medium"
        style={{
          padding:
            "clamp(0.35rem, 0.6vw, 0.65rem) clamp(0.75rem, 1.3vw, 1.4rem)",
          fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
          color: currentPage === totalPages ? "#d1d5db" : "#374151",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        {t("next")}
      </button>
    </div>
  );
}
