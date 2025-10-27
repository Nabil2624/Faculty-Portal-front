import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JobGradeForm from "../components/JobGradeForm";
import EditJobGrade from "../components/EditJobGrade";

export default function JobRanks() {
  const { t, i18n } = useTranslation("JobRanks");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showJobGradeForm, setShowJobGradeForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.title);
    // Delete API logic here
    setShowModal(false);
    setSelectedItem(null);
  };

  // Expanded Dummy Data
  const jobRanks = [
    {
      title: "أستاذ مساعد",
      period: "من 1 أكتوبر 2020 - حتى الآن",
      department: "قسم علوم الحاسب",
      description:
        "مسؤول عن الإشراف على مشاريع التخرج وتدريس مقررات البرمجة المتقدمة.",
      level: "الدرجة الأكاديمية الرابعة",
      supervisor: "د. أحمد حسن",
      salary: "25,000 جنيه",
    },
    {
      title: "مدرس",
      period: "من 1 أكتوبر 2016 - حتى 30 سبتمبر 2020",
      department: "قسم نظم المعلومات",
      description:
        "تدريس مقررات تحليل الأنظمة وتصميم قواعد البيانات والإشراف الأكاديمي.",
      level: "الدرجة الأكاديمية الثالثة",
      supervisor: "د. سامي علي",
      salary: "18,000 جنيه",
    },
    {
      title: "مدرس مساعد",
      period: "من 1 أكتوبر 2012 - حتى 30 سبتمبر 2016",
      department: "قسم الذكاء الاصطناعي",
      description:
        "مساعدة أعضاء هيئة التدريس في إعداد المواد التعليمية وتنسيق الامتحانات.",
      level: "الدرجة الأكاديمية الثانية",
      supervisor: "د. هالة إبراهيم",
      salary: "14,000 جنيه",
    },
    {
      title: "معيد",
      period: "من 1 أكتوبر 2008 - حتى 30 سبتمبر 2012",
      department: "قسم علوم البيانات",
      description:
        "تقديم حصص عملية ومراجعة للطلاب، وتحضير دراسات بحثية تحت إشراف الأساتذة.",
      level: "الدرجة الأكاديمية الأولى",
      supervisor: "د. محمد فؤاد",
      salary: "10,000 جنيه",
    },
    {
      title: "باحث",
      period: "من 1 أكتوبر 2005 - حتى 30 سبتمبر 2008",
      department: "قسم هندسة البرمجيات",
      description:
        "العمل في فريق بحثي لتحليل وتطوير البرمجيات باستخدام تقنيات حديثة.",
      level: "باحث مبتدئ",
      supervisor: "د. نهى سمير",
      salary: "9,000 جنيه",
    },
    {
      title: "مساعد باحث",
      period: "من 1 أكتوبر 2002 - حتى 30 سبتمبر 2005",
      department: "قسم البرمجة",
      description: "المشاركة في إعداد مشاريع أكاديمية ودعم عملية البحث العلمي.",
      level: "مستوى متدرب",
      supervisor: "د. محمود الشافعي",
      salary: "7,000 جنيه",
    },
        {
      title: "مساعد باحث",
      period: "من 1 أكتوبر 2002 - حتى 30 سبتمبر 2005",
      department: "قسم البرمجة",
      description: "المشاركة في إعداد مشاريع أكاديمية ودعم عملية البحث العلمي.",
      level: "مستوى متدرب",
      supervisor: "د. محمود الشافعي",
      salary: "7,000 جنيه",
    },
        {
      title: "مساعد باحث",
      period: "من 1 أكتوبر 2002 - حتى 30 سبتمبر 2005",
      department: "قسم البرمجة",
      description: "المشاركة في إعداد مشاريع أكاديمية ودعم عملية البحث العلمي.",
      level: "مستوى متدرب",
      supervisor: "د. محمود الشافعي",
      salary: "7,000 جنيه",
    },
        {
      title: "مساعد باحث",
      period: "من 1 أكتوبر 2002 - حتى 30 سبتمبر 2005",
      department: "قسم البرمجة",
      description: "المشاركة في إعداد مشاريع أكاديمية ودعم عملية البحث العلمي.",
      level: "مستوى متدرب",
      supervisor: "د. محمود الشافعي",
      salary: "7,000 جنيه",
    },
  ];

  // Pagination Logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(jobRanks.length / itemsPerPage);
  const paginatedData = jobRanks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("jobRanks") || "Job Grades"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          {/* Filter icon */}
          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>
        {/* Grid of cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedItem(item);
                setShowDetails(true);
              }}
              className={`relative bg-gray-100 rounded-[12px] shadow-md p-5 border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition-transform ${
                isArabic ? "border-r-[19px]" : "border-l-[19px]"
              }`}
            >
              {/* Icons */}
              <div
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
                } flex gap-3`}
                onClick={(e) => e.stopPropagation()} // prevent card click from firing
              >
                <Pencil
                  className="text-[#b38e19] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowEditForm(true);
                  }}
                />
                <Trash2
                  className="text-[#E53935] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() => handleDeleteClick(item)}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                {item.title}
              </h3>
              <p className="text-base font-medium text-gray-700">
                {item.period}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="flex justify-center items-center gap-3 mt-8"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            {isArabic ? "السابق" : "Previous"}
          </button>

          <span className="text-sm text-gray-600">
            {isArabic
              ? `الصفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            {isArabic ? "التالي" : "Next"}
          </button>
        </div>

        {/* Bottom Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end w-full max-w-6xl absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => setShowJobGradeForm(true)}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("edit") || "Edit"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("back") || "Back"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
              {t("areYouSureDelete") || "Are you sure you want to delete this?"}
            </h3>
            <p className="text-sm text-gray-600 mb-5">{selectedItem?.title}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
              >
                {t("delete") || "Delete"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400 transition"
              >
                {t("cancel") || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-8 relative animate-fadeIn"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetails(false)}
              className={`absolute top-4 ${
                isArabic ? "left-4" : "right-4"
              } text-gray-500 hover:text-[#19355a] transition`}
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold text-[#19355a]">
                {selectedItem.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedItem.period}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {t("department") || (isArabic ? "القسم" : "Department")}
                </span>
                <span>{selectedItem.department}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {t("rankLevel") || (isArabic ? "الدرجة" : "Rank Level")}
                </span>
                <span>{selectedItem.level}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {t("supervisor") || (isArabic ? "المشرف" : "Supervisor")}
                </span>
                <span>{selectedItem.supervisor}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {t("salary") || (isArabic ? "الراتب" : "Salary")}
                </span>
                <span className="font-semibold text-[#b38e19]">
                  {selectedItem.salary}
                </span>
              </div>

              <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Grade Modal */}
      {showJobGradeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="rounded-lg shadow-none p-0 w-[480px] relative">
            <JobGradeForm onCancel={() => setShowJobGradeForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Job Grade Modal */}
      {showEditForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="rounded-lg shadow-none p-0 w-[480px] relative">
            <EditJobGrade
              data={selectedItem}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
