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
      className="flex justify-center items-center gap-3 mt-4"
    >
      <button
        disabled={currentPage === 1}
        onClick={onPrev}
        className={`px-4 py-2 rounded-md border border-gray-400 ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        {t("previous")}
      </button>

      <span className="text-sm text-gray-600">
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={onNext}
        className={`px-4 py-2 rounded-md border border-gray-400 ${
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
