import React from "react";
import { useNavigate } from "react-router-dom"; // 1. استيراد الهوك
import {
  FiFilter,
  FiX,
  FiEdit3,
  FiTrash2,
  FiInbox,
  FiCheck,
  FiPlus,
} from "react-icons/fi";

const ResearchesTable = ({
  researches,
  loading,
  isArabic,
  t,
  isSelectionMode,
  toggleSelectionMode,
  selectedId,
  setSelectedId,
  selectedResearch,
  handleEditAction,
  setShowDeleteModal,
  setShowFilterModal,
  handleResetFilters,
  sortValue,
  filtersState,
  page,
  totalPages,
  setPage,
  handleAddAction,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (res) => {
    if (isSelectionMode) {
      setSelectedId((prev) => (prev === res.id ? null : res.id));
    } else {
      navigate("/InternalProfile", {
        state: { research: res },
      });
    }
  };

  return (
    <div className="mt-10 w-full">
      {/* Toolbar - يبقى كما هو بدون تغيير */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-3 mb-4 px-2 gap-4">
        <div className="flex items-center gap-4">
          <span
            className="text-[#19355A] font-bold uppercase tracking-widest"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            {t("ScientificResearches:titleText") || "Title"}
          </span>
          <FiFilter
            className="text-gray-400 hover:text-[#B38E19] cursor-pointer"
            size={18}
            onClick={() => setShowFilterModal(true)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 border-x border-gray-100 px-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleAddAction();
              }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer hover:text-[#B38E19]"
              style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
            >
              <FiPlus size={14} />
              {t("ScientificResearches:add") || (isArabic ? "اضافة" : "Add")}
            </button>

            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                isSelectionMode
                  ? "text-[#B38E19]"
                  : "text-gray-400 hover:text-[#19355A]"
              }`}
              style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
            >
              {isSelectionMode ? <FiX size={14} /> : null}
              {t("ScientificResearches:select") ||
                (isArabic ? "تحديد" : "Select")}
            </button>

            {isSelectionMode && (
              <>
                <button
                  onClick={handleEditAction}
                  disabled={
                    !selectedId || selectedResearch?.source === "External"
                  }
                  className={`flex items-center gap-1.5 text-[13px] font-bold transition-all cursor-pointer ${
                    selectedId && selectedResearch?.source !== "External"
                      ? "text-[#19355A] hover:text-[#B38E19]"
                      : "text-gray-200 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
                >
                  <FiEdit3 size={16} />
                  {t("ScientificResearches:edit") ||
                    (isArabic ? "تعديل" : "Edit")}
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!selectedId}
                  className={`flex items-center gap-1.5 text-[13px] font-bold transition-all cursor-pointer ${
                    selectedId
                      ? "text-red-500 hover:text-red-700"
                      : "text-gray-200 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
                >
                  <FiTrash2 size={16} />
                  {t("ScientificResearches:delete") ||
                    (isArabic ? "حذف" : "Delete")}
                </button>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-10">
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest text-[11px] w-20 text-center"
              style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
            >
              {t("ScientificResearches:citedBy")}
            </span>
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest text-[11px] w-16 text-center"
              style={{ fontSize: "clamp(0.4rem, 0.77vw, 0.75rem)" }}
            >
              {t("ScientificResearches:year")}
            </span>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex flex-col w-full min-h-[200px] relative">
        {loading && page === 1 ? (
          <div className="flex justify-center py-20"></div>
        ) : researches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 rounded-xl my-4">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <FiInbox size={48} className="text-gray-300" />
            </div>
            <h3 className="text-[#19355A] font-bold text-lg mb-2">
              {t("ScientificResearches:empty") ||
                (isArabic ? "لا توجد أبحاث علمية" : "No researches found")}
            </h3>
          </div>
        ) : (
          researches.map((res) => {
            const isSelected = selectedId === res.id;
            const namesString = res.contributions
              ? [...res.contributions]
                  .sort(
                    (a, b) => b.isTheMajorResearcher - a.isTheMajorResearcher,
                  )
                  .map((c) => c.memberAcademicName)
                  .join(", ")
              : "";

            return (
              <div
                key={res.id}
                // 4. استدعاء الفانكشن الجديدة وتمرير الكائن بالكامل
                onClick={() => handleRowClick(res)}
                className={`group flex items-start justify-between border-b border-gray-50 py-5 transition-all px-3 cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/40 ring-1 ring-inset ring-[#B38E19]/20"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-0 flex-1 pr-4">
                  <div
                    className={`mt-1.5 transition-all duration-200 overflow-hidden ${isSelected && isSelectionMode ? "w-8 opacity-100" : "w-0 opacity-0"}`}
                  >
                    <div
                      className="rounded-sm bg-[#B38E19] flex items-center justify-center"
                      style={{
                        width: "clamp(1rem, 1.2vw, 1.5rem)",
                        height: "clamp(1rem, 1.2vw, 1.5rem)",
                      }}
                    >
                      <FiCheck className="text-white" size={14} />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h4
                      className={`font-bold transition-colors mb-1 ${isSelected ? "text-[#B38E19]" : "text-[#19355A] group-hover:text-[#B38E19]"}`}
                      style={{ fontSize: "clamp(0.4rem, 1.2vw, 1.6rem)" }}
                    >
                      {res.title}
                      {res.source === "External" && (
                        <span className="mx-2 text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-bold uppercase">
                          External
                        </span>
                      )}
                    </h4>
                    <p
                      className="text-gray-500 text-sm mb-1"
                      style={{ fontSize: "clamp(0.4rem, 0.9vw, 1.4rem)" }}
                    >
                      {namesString}
                    </p>
                    <p
                      className="text-gray-400 italic text-xs"
                      style={{ fontSize: "clamp(0.4rem, 0.8vw, 1.2rem)" }}
                    >
                      {res.journalOrConfernce} {res.volume && `, ${res.volume}`}{" "}
                      {res.issue && `,(${res.issue})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-10 pt-1">
                  <span
                    className="text-[#19355A] font-semibold w-20 text-center underline decoration-gray-100 underline-offset-8"
                    style={{ fontSize: "clamp(0.4rem, 0.9vw, 1.4rem)" }}
                  >
                    {res.noOfCititations || 0}
                  </span>
                  <span
                    className="text-gray-500 w-16 text-center font-medium"
                    style={{ fontSize: "clamp(0.4rem, 0.9vw, 1.4rem)" }}
                  >
                    {res.pubYear}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show More Button */}
      <div className="mt-8 flex flex-col items-center">
        {!loading && page < totalPages && researches.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPage((prev) => prev + 1);
            }}
            style={{ fontSize: "clamp(0.4rem, 0.9vw, 1.4rem)" }}
            className="px-10 py-2 border-2 border-[#19355A] text-[#19355A] rounded-full font-bold hover:bg-[#19355A] hover:text-white transition-all text-xs cursor-pointer"
          >
            {t("ScientificResearches:showMore")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResearchesTable;
