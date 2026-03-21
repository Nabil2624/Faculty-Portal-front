import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderWithFilter from "../components/ui/PageHeaderWithFilter";
import RecommendedSupervisionsTable from "../components/widgets/RecommendedSupervision/RecommendedSupervisionsTable"; // المكون الجديد
import ModalWrapper from "../components/ui/ModalWrapper";
import CustomizeResultsModal from "../components/ui/CustomizeResultsPopup";

// Hooks
import useRecommendedSupervisions from "../hooks/useRecommendedSupervisions";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import useAcademicGradesLookups from "../hooks/useAcademicGradesLookups";
export default function RecommendedSupervisions() {
  const navigate = useNavigate();
  const [selectedSupervision, setSelectedSupervision] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const [filtersState, setFiltersState] = useState({});
  const [gradeIds, setGradeIds] = useState([]);
  const [type, setType] = useState([]);
  const [role, setRole] = useState([]);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const {
    t,
    isArabic,
    items,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    handleApprove,
    handleReject,
  } = useRecommendedSupervisions(searchTerm, sortValue, gradeIds, role, type);

  // Handlers
  const handleBulkApprove = async () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    for (const item of selectedItems) {
      await handleApprove(item);
    }
    setSelectedIds([]);
    setIsSelectionMode(false);
  };
  const { types } = useAcademicGradesLookups();
  const mappedGrades =
    types?.map((item) => ({
      value: item.id,
      label: isArabic ? item.valueAr : item.valueEn,
    })) || [];

  const filtersConfig = [
    { key: "GradeIds", title: "dependAcademicGrade", options: mappedGrades },
    {
      key: "Type",
      title: "dependOnType",
      options: [
        { value: 1, label: "PhD" },
        { value: 2, label: "Master" },
      ],
    },
    {
      key: "Role",
      title: "dependOnRole",
      options: [
        { value: 1, label: "Administrator" },
        { value: 2, label: "Reviewer" },
        { value: 3, label: "AdministratorAndReviewer" },
      ],
    },
  ];

  const sortOptions = [
    { value: 1, label: "TitleASC" },
    { value: 2, label: "TitleDESC" },
    { value: 3, label: "StudentNameASC" },
    { value: 4, label: "StudentNameDESC" },
    { value: 5, label: "RegistrationDateASC" },
    { value: 6, label: "RegistrationDateDESC" },
    { value: 7, label: "SupervisionFormationDateASC" },
    { value: 8, label: "SupervisionFormationDateDESC" },
    { value: 9, label: "DiscussionDateASC" },
    { value: 10, label: "DiscussionDateDESC" },
    { value: 11, label: "GrantingDateASC" },
    { value: 12, label: "GrantingDateDESC" },
  ];

  const handleApplyFilters = ({ sortValue, filters }) => {
    setSortValue(sortValue);
    setFiltersState(filters);
    setRole(filters?.Role || []);
    setGradeIds(filters?.GradeIds || []);
    setType(filters?.Type || []);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderNoAction title={t("title")} />

        <RecommendedSupervisionsTable
          items={items}
          loading={loading}
          isArabic={isArabic}
          t={t}
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]);
          }}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleApprove={handleApprove}
          handleReject={(item) => {
            setSelectedSupervision(item);
            setIsRejectModalOpen(true);
          }}
          handleBulkApprove={handleBulkApprove}
          setShowFilterModal={setShowFilterModal}
          page={currentPage}
          totalPages={totalPages}
          setPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* مودال التأكيد للرفض */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-[450px] shadow-2xl border-t-4 border-red-500">
            <h2 className="text-xl font-bold mb-4 text-[#19355A] text-center">
              {isArabic ? "تأكيد رفض الإشراف" : "Confirm Supervision Rejection"}
            </h2>
            <p className="text-gray-500 text-center mb-8">
              {isArabic
                ? "هل أنت متأكد من رفض الإشراف على هذا الطالب؟"
                : "Are you sure you want to reject this student's supervision?"}
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-all"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSelectedSupervision(null);
                }}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200"
                onClick={async () => {
                  await handleReject(selectedSupervision);
                  setIsRejectModalOpen(false);
                  setSelectedSupervision(null);
                }}
              >
                {isArabic ? "تأكيد الرفض" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showFilterModal && (
        <ModalWrapper onClose={() => setShowFilterModal(false)}>
          <CustomizeResultsModal
            onClose={() => setShowFilterModal(false)}
            onApply={handleApplyFilters}
            onReset={() => {
              setSortValue(null);
              setFiltersState({});
              setRole([]);
              setGradeIds([]); 
              setType([]); 
              setCurrentPage(1);
            }}
            currentSort={sortValue}
            currentFilters={filtersState}
            filtersConfig={filtersConfig}
            translationNamespace="filter-sort"
            sortOptions={sortOptions}
          />
        </ModalWrapper>
      )}
    </ResponsiveLayoutProvider>
  );
}
