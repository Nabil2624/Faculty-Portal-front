import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter,
  FiX,
  FiEdit3,
  FiTrash2,
  FiInbox,
  FiCheck,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

const ThesesTable = ({
  items,
  loading,
  isArabic,
  t,
  isSelectionMode,
  toggleSelectionMode,
  selectedIds = [], // مصفوفة المعرفات المختارة
  setSelectedIds, // دالة تحديث المصفوفة
  handleEditAction,
  setShowDeleteModal,
  setShowFilterModal,
  page,
  totalPages,
  setPage,
  handleAddAction,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();

  const getTranslatedType = (type) => {
    if (!type) return "-";
    const upperType = type.toString().toUpperCase();
    if (upperType === "PHD") return t("phd") || (isArabic ? "دكتوراه" : "PhD");
    if (upperType === "MASTER")
      return t("master") || (isArabic ? "ماجستير" : "Master");
    return type;
  };

  // معالج النقر على السطر للتبديل بين التحديد وعدمه
  const handleRowClick = (item) => {
    if (isSelectionMode) {
      setSelectedIds(
        (prev) =>
          prev.includes(item.id)
            ? prev.filter((id) => id !== item.id) // إلغاء التحديد
            : [...prev, item.id], // إضافة للتحديد
      );
    } else {
      navigate(`/ThesesDetails`, { state: { thesis: item } });
    }
  };

  return (
    <div className="mt-10 w-full">
      {/* --- Toolbar --- */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-3 mb-4 px-2 gap-y-4">
        <div className="flex items-center flex-1 gap-4 min-w-[280px]">
          <span
            className="text-[#19355A] font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            {t("titleText") || (isArabic ? "الرسائل العلمية" : "Theses")}
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
              className="w-full bg-gray-50/50 border border-gray-100 text-[#19355A] rounded-md focus:ring-2 focus:ring-[#B38E19]/10 focus:border-[#B38E19] transition-all duration-300 p-2 px-9 text-sm outline-none"
              style={{
                fontSize: "clamp(0.7rem, 0.9vw, 1rem)",
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
              onClick={handleAddAction}
              className="flex items-center gap-1 text-[#19355A] font-bold uppercase hover:text-[#B38E19] transition-colors "
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              <FiPlus size={14} /> {t("add")}
            </button>

            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-1 font-bold uppercase transition-colors ${isSelectionMode ? "text-[#B38E19]" : "text-gray-400 hover:text-[#19355A]"} `}
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isSelectionMode ? <FiX size={14} /> : null}{" "}
              {isArabic ? "تحديد" : "Select"}
              {isSelectionMode &&
                selectedIds.length > 0 &&
                ` (${selectedIds.length})`}
            </button>

            {isSelectionMode && (
              <>
                <button
                  onClick={handleEditAction}
                  disabled={selectedIds.length !== 1}
                  className={`flex items-center gap-1 font-bold uppercase transition-colors ${selectedIds.length === 1 ? "text-[#19355A] hover:text-[#B38E19]" : "text-gray-200 cursor-not-allowed"} `}
                  style={{ fontSize: "clamp(0.8rem, 0.9vw, 1rem)" }}
                >
                  <FiEdit3 size={14} /> {isArabic ? "تعديل" : "Edit"}
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={selectedIds.length === 0}
                  className={`flex items-center gap-1 font-bold uppercase transition-colors ${selectedIds.length > 0 ? "text-red-500 hover:text-red-700" : "text-gray-200 cursor-not-allowed"}`}
                  style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
                >
                  <FiTrash2 size={14} /> {isArabic ? "حذف" : "Delete"}
                </button>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest w-28 text-center "
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isArabic ? "تاريخ القيد" : "Enrollment"}
            </span>
            <span className="text-[#19355A] font-bold uppercase tracking-widest w-28 text-center "
            style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isArabic ? "تاريخ التسجيل" : "Registration"}
            </span>
          </div>
        </div>
      </div>

      {/* --- Content --- */}
      <div className="flex flex-col w-full min-h-[200px] relative">
        {items.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-xl my-4">
            <FiInbox size={48} className="text-gray-200 mb-4" />
            <h3 className="text-[#19355A] font-bold text-lg">{t("empty")}</h3>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const translatedType = getTranslatedType(item.type);

            return (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`group flex items-start justify-between border-b border-gray-50 py-5 transition-all px-3 cursor-pointer ${
                  isSelected && isSelectionMode
                    ? "bg-[#B38E19]/5 ring-1 ring-inset ring-[#B38E19]/20"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-0 flex-1 pr-4">
                  <div
                    className={`mt-1.5 transition-all duration-200 overflow-hidden flex-shrink-0 ${isSelectionMode ? "w-8 opacity-100 me-3" : "w-0 opacity-0 me-0"}`}
                  >
                    <div
                      className={`rounded-sm flex items-center justify-center w-5 h-5 border transition-colors ${isSelected ? "bg-[#B38E19] border-[#B38E19]" : "bg-white border-gray-300"}`}
                    >
                      {isSelected && (
                        <FiCheck className="text-white" size={12} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4
                      className={`font-bold transition-colors mb-1 ${isSelected && isSelectionMode ? "text-[#B38E19]" : "text-[#19355A] group-hover:text-[#B38E19]"}`}
                      style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.2rem)" }}
                    >
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="text-[#B38E19] font-bold uppercase tracking-widest text-[clamp(0.65rem,0.77vw,0.85rem)]">
                        {translatedType}
                      </span>
                      <span className="md:hidden flex items-center text-gray-400 font-medium text-[clamp(0.65rem,0.77vw,0.85rem)]">
                        <span className="text-gray-300 mx-1">•</span>
                        {item.registrationDate || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 lg:gap-8 pt-1 shrink-0">
                  <span className="text-gray-500 w-28 text-center font-medium text-[clamp(0.8rem,0.9vw,1rem)]">
                    {item.enrollmentDate || "-"}
                  </span>
                  <span className="text-gray-400 w-28 text-center font-medium text-[clamp(0.8rem,0.9vw,1rem)]">
                    {item.registrationDate || "-"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- Pagination --- */}
      <div className="mt-12 flex flex-col items-center">
        {!loading && page < totalPages && items.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPage((prev) => prev + 1);
            }}
            className="px-10 py-2 border-2 border-[#19355A] text-[#19355A] rounded-full font-black hover:bg-[#19355A] hover:text-white transition-all text-xs cursor-pointer uppercase tracking-widest"
          style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
          >
            {isArabic ? "عرض المزيد" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ThesesTable;
