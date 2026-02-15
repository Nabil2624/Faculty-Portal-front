import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  t,
  isArabic,
}) {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="flex justify-center items-center"
      style={{
        gap: "clamp(0.5rem, 1.5vw, 1rem)",
        marginTop: "clamp(1rem, 3vw, 2rem)",
      }}
    >
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={onPrev}
        style={{
          padding:
            "clamp(0.4rem, 0.7vw, 0.7rem) clamp(0.8rem, 1.7vw, 12rem)",
          fontSize: "clamp(0.75rem, 1.2vw, 3rem)",
          borderRadius: "clamp(6px, 1.2vw, 18px)", // 👈 هنا التحكم
          border: "1px solid #9ca3af",
        }}
        className={`transition ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        {t("previous")}
      </button>

      {/* Page info */}
      <span
        style={{
          fontSize: "clamp(0.75rem, 1.2vw, 3rem)",
        }}
        className="text-gray-600"
      >
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>

      {/* Next */}
      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={onNext}
        style={{
          padding:
            "clamp(0.4rem, 0.9vw, 0.7rem) clamp(0.8rem, 2vw, 12rem)",
          fontSize: "clamp(0.75rem, 1.2vw, 3rem)",
          borderRadius: "clamp(6px, 1.2vw, 18px)", // 👈 وهنا
          border: "1px solid #9ca3af",
        }}
        className={`transition ${
          currentPage === totalPages || totalPages === 0
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        {t("next")}
      </button>
    </div>
  );
}
