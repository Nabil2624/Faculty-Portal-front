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

const SupervisionThesisTable = ({
  items,
  loading,
  isArabic,
  t,
  isSelectionMode,
  toggleSelectionMode,
  selectedIds = [], // مصفوفة المعرفات المختارة
  setSelectedIds,   // دالة تحديث المصفوفة
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

  // معالج النقر على السطر
  const handleRowClick = (item) => {
    if (isSelectionMode) {
      setSelectedIds((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id) // إلغاء تحديد
          : [...prev, item.id] // إضافة تحديد
      );
    } else {
      navigate("/supervision-info", { state: { ...item } });
    }
  };

  // شروط تفعيل الأزرار
  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length > 0;

  return (
    <div className="mt-10 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-3 mb-4 px-2 gap-y-4">
        
        {/* الجزء الأيمن: العنوان + الفلتر + البحث */}
        <div className="flex items-center flex-1 gap-4 min-w-[280px]">
          <span
            className="text-[#19355A] font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            {t("titleText") || (isArabic ? "رسائل الإشراف" : "Supervised Thesis")}
          </span>
          
          <FiFilter
            className="text-gray-400 hover:text-[#B38E19] cursor-pointer shrink-0"
            size={18}
            onClick={() => setShowFilterModal(true)}
          />

          <div className="relative group flex-1 max-w-xs ml-2">
            <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-2.5' : 'left-0 pl-2.5'} flex items-center pointer-events-none`}>
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
                fontSize: "clamp(0.7rem, 0.9vw, 1rem)",
                paddingTop: "0.4rem",
                paddingBottom: "0.4rem",
                paddingInlineStart: "2.2rem"
              }}
            />
          </div>
        </div>

        {/* الجزء الأيسر: التحكم */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 border-x border-gray-100 px-2 sm:px-4">
            <button
              onClick={handleAddAction}
              className="flex items-center gap-1 text-[#19355A] font-bold uppercase tracking-widest transition-colors cursor-pointer hover:text-[#B38E19]"
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              <FiPlus size={14} />
              {t("add")}
            </button>

            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-1 font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                isSelectionMode ? "text-[#B38E19]" : "text-gray-400 hover:text-[#19355A]"
              }`}
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isSelectionMode ? <FiX size={14} /> : null}
              {isArabic ? "تحديد" : "Select"}
              {isSelectionMode && selectedIds.length > 0 && ` (${selectedIds.length})`}
            </button>

            {isSelectionMode && (
              <>
                <button
                  onClick={handleEditAction}
                  disabled={!canEdit}
                  className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                    canEdit ? "text-[#19355A] hover:text-[#B38E19]" : "text-gray-200 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "clamp(0.8rem, 0.9vw, 1rem)" }}
                >
                  <FiEdit3 size={16} />
                  {isArabic ? "تعديل" : "Edit"}
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!canDelete}
                  className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                    canDelete ? "text-red-500 hover:text-red-700" : "text-gray-200 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "clamp(0.8rem, 0.9vw, 1rem)" }}
                >
                  <FiTrash2 size={16} />
                  {isArabic ? "حذف" : "Delete"}
                </button>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-10">
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest w-20 md:w-24 text-center"
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isArabic ? "النوع" : "Type"}
            </span>
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest w-20 md:w-24 text-center"
              style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)" }}
            >
              {isArabic ? "تاريخ التسجيل" : "Registration Date"}
            </span>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex flex-col w-full min-h-[200px] relative">
        {loading && page === 1 ? (
          <div className="flex justify-center py-20"></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-100 rounded-xl my-4">
            <FiInbox size={48} className="text-gray-200 mb-4" />
            <h3 className="text-[#19355A] font-bold text-lg">
              {t("empty") || (isArabic ? "لا توجد سجلات" : "No records found")}
            </h3>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
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
                  {/* مؤشر التحديد المتعدد */}
                  <div className={`mt-1.5 transition-all duration-200 overflow-hidden flex-shrink-0 ${isSelectionMode ? "w-8 opacity-100 me-3" : "w-0 opacity-0 me-0"}`}>
                    <div
                      className={`rounded-sm flex items-center justify-center border transition-all ${
                        isSelected 
                        ? "bg-[#B38E19] border-[#B38E19]" 
                        : "border-gray-300 bg-white"
                      }`}
                      style={{ width: "clamp(1rem, 1.2vw, 1.5rem)", height: "clamp(1rem, 1.2vw, 1.5rem)" }}
                    >
                      {isSelected && <FiCheck className="text-white" size={12} />}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4
                      className={`font-bold transition-colors mb-1 ${isSelected && isSelectionMode ? "text-[#B38E19]" : "text-[#19355A] group-hover:text-[#B38E19]"}`}
                      style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.3rem)" }}
                    >
                      {item.title}
                    </h4>
                    
                    <p className="text-gray-500 font-medium mb-1" style={{ fontSize: "clamp(0.75rem, 0.9vw, 1rem)" }}>
                      {item.studentName}
                    </p>

                    <p className="text-[#B38E19] font-bold uppercase tracking-widest flex flex-wrap gap-x-1 items-center" style={{ fontSize: "clamp(0.65rem, 0.77vw, 0.85rem)" }}>
                      {t(item.facultyMemberRole)}
                      
                      <span className="md:hidden inline-flex items-center gap-1 text-gray-400 font-medium">
                        <span className="text-gray-300 mx-1">•</span> {t(item.type)}
                      </span>
                      <span className="md:hidden inline-flex items-center gap-1 text-gray-400 font-medium">
                        <span className="text-gray-300 mx-1">•</span> {item.registrationDate?.split("T")[0] || "-"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 lg:gap-10 pt-1 shrink-0">
                  <span className="text-gray-600 font-semibold w-20 md:w-24 text-center" style={{ fontSize: "clamp(0.85rem, 0.9vw, 1.1rem)" }}>
                    {t(item.type)}
                  </span>
                  <span className="text-gray-400 w-20 md:w-24 text-center font-medium" style={{ fontSize: "clamp(0.85rem, 0.9vw, 1.1rem)" }}>
                    {item.registrationDate?.split("T")[0] || "-"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show More Button */}
      <div className="mt-8 flex flex-col items-center">
        {!loading && page < totalPages && items.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setPage((prev) => prev + 1); }}
            className="px-10 py-2 border-2 border-[#19355A] text-[#19355A] rounded-full font-black hover:bg-[#19355A] hover:text-white transition-all text-xs cursor-pointer uppercase tracking-widest"
          >
            {t("showMore") || (isArabic ? "عرض المزيد" : "Show More")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SupervisionThesisTable;