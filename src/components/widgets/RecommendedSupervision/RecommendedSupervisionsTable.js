import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiInbox,
  FiCheck,
  FiSearch,
  FiEye,
} from "react-icons/fi";

const RecommendedSupervisionsTable = ({
  items,
  loading,
  isArabic,
  t,
  isSelectionMode,
  toggleSelectionMode,
  selectedIds,
  setSelectedIds,
  handleApprove,
  handleReject,
  handleBulkApprove,
  setShowFilterModal,
  page,
  totalPages,
  setPage,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (item) => {
    if (isSelectionMode) {
      setSelectedIds((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id],
      );
    } else {
      navigate(`/supervision-info`, { state: { ...item } });
    }
  };

  return (
    <div className="mt-10 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-3 mb-4 px-2 gap-y-4">
        <div className="flex items-center flex-1 gap-4 min-w-[280px]">
          <span
            className="text-[#19355A] font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            {isArabic ? "عنوان " : "Title"}
          </span>
          <FiFilter
            className="text-gray-400 hover:text-[#B38E19] cursor-pointer shrink-0"
            size={18}
            onClick={() => setShowFilterModal(true)}
          />

          <div className="relative group flex-1 max-w-xs ml-2">
            <div
              className={`absolute inset-y-0 ${isArabic ? "right-0 pr-2.5" : "left-0 pl-2.5"} flex items-center pointer-events-none`}
            >
              <FiSearch
                className="text-gray-300 group-focus-within:text-[#B38E19] transition-colors"
                size={14}
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isArabic ? "بحث..." : "Search..."}
              className="w-full bg-gray-50/50 border border-gray-100 text-[#19355A] rounded-md focus:ring-2 focus:ring-[#B38E19]/10 focus:border-[#B38E19] transition-all duration-300"
              style={{
                fontSize: "clamp(0.7rem, 0.8vw, 0.95rem)",
                paddingTop: "0.4rem",
                paddingBottom: "0.4rem",
                paddingInlineStart: "2.2rem",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 border-x border-gray-100 px-2 sm:px-4">
            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-1 font-bold uppercase tracking-widest transition-colors ${isSelectionMode ? "text-[#B38E19]" : "text-gray-400 hover:text-[#19355A]"}`}
              style={{ fontSize: "clamp(0.6rem, 0.77vw, 0.75rem)" }}
            >
              {isSelectionMode && <FiX size={14} />}{" "}
              {isArabic ? "تحديد" : "Select"}
            </button>
            {isSelectionMode && (
              <button
                onClick={handleBulkApprove}
                disabled={selectedIds.length === 0}
                className={`flex items-center gap-1.5 font-bold transition-all ${selectedIds.length > 0 ? "text-green-600 hover:text-green-800" : "text-gray-200 cursor-not-allowed"}`}
                style={{ fontSize: "clamp(0.6rem, 0.77vw, 0.75rem)" }}
              >
                <FiCheckCircle size={16} /> {isArabic ? "قبول" : "Approve"}
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-10">
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest w-24 text-center"
              style={{ fontSize: "clamp(0.45rem, 0.77vw, 0.75rem)" }}
            >
              {isArabic ? "الدرجة" : "Degree"}
            </span>
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest w-24 text-center"
              style={{ fontSize: "clamp(0.45rem, 0.77vw, 0.75rem)" }}
            >
              {isArabic ? "الإجراءات" : "Actions"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-[200px]">
        {loading && page === 1 ? (
          <div className="py-20 flex justify-center"></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-xl my-4">
            <FiInbox size={48} className="text-gray-200 mb-4" />
            <h3 className="text-[#19355A] font-bold text-lg">
              {isArabic ? "لا توجد بيانات" : "No data found"}
            </h3>
          </div>
        ) : (
          items.map((item) => {
            const selected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`group flex items-start justify-between border-b border-gray-50 py-5 transition-all px-3 cursor-pointer ${selected ? "bg-[#B38E19]/5 ring-1 ring-inset ring-[#B38E19]/20" : "hover:bg-gray-50/50"}`}
              >
                <div className="flex items-start gap-0 flex-1 pr-4">
                  <div
                    className={`mt-1.5 transition-all duration-200 overflow-hidden flex-shrink-0 ${isSelectionMode ? "w-8 opacity-100 me-3" : "w-0 opacity-0 me-0"}`}
                  >
                    <div
                      className={`rounded-sm flex items-center justify-center border ${selected ? "bg-[#B38E19] border-[#B38E19]" : "border-gray-300 bg-white"}`}
                      style={{
                        width: "clamp(1rem, 1.2vw, 1.5rem)",
                        height: "clamp(1rem, 1.2vw, 1.5rem)",
                      }}
                    >
                      {selected && <FiCheck className="text-white" size={12} />}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4
                      className={`font-bold transition-colors mb-1 ${selected ? "text-[#B38E19]" : "text-[#19355A] group-hover:text-[#B38E19]"}`}
                      style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.3rem)" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-gray-500 font-medium mb-1"
                      style={{ fontSize: "clamp(0.75rem, 0.9vw, 1rem)" }}
                    >
                      {item.studentName}
                    </p>

                    <div
                      className="flex flex-wrap items-center gap-x-2 text-gray-400 italic font-medium"
                      style={{ fontSize: "clamp(0.7rem, 0.8vw, 0.95rem)" }}
                    >
                      <span>{item.facultyMemberRole || "-"}</span>
                      {/* عرض الدرجة في الموبايل فقط تحت العنوان */}
                      <span className="md:hidden flex items-center gap-2">
                        <span className="text-gray-300">•</span>
                        <span className="text-[#B38E19] font-bold not-italic">
                          {item.degreeType}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* الأكشنز والدرجة تظهر فقط في الشاشات المتوسطة وما فوق */}
                <div className="hidden md:flex items-center gap-4 lg:gap-10 pt-1 shrink-0">
                  <span
                    className="text-[#19355A] font-semibold w-24 text-center underline decoration-gray-100 underline-offset-8"
                    style={{ fontSize: "clamp(0.85rem, 0.9vw, 1.1rem)" }}
                  >
                    {item.degreeType || "-"}
                  </span>

                  <div className="flex items-center gap-3 w-24 justify-center">
                    <FiCheckCircle
                      className="text-green-600 transition-colors"
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item);
                      }}
                    />
                    <FiXCircle
                      className="text-red-500 transition-colors"
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(item);
                      }}
                    />
                    <FiEye
                      className="text-[#B38E19] transition-colors"
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/supervision-info`, { state: { ...item } });
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 mb-20 flex justify-center">
        {!loading && page < totalPages && items.length > 0 && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-10 py-2 border-2 border-[#19355A] text-[#19355A] rounded-full font-black hover:bg-[#19355A] hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer"
          >
            {isArabic ? "عرض المزيد" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendedSupervisionsTable;
