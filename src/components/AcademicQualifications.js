import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X, University } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AcademicQualificationsPage() {
  const { t, i18n } = useTranslation("AcademicQualifications");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ===========================
  // DATA
  // ===========================
  const qualifications = [
    {
      degree: "دكتوراه في هندسة البرمجيات",
      major: "هندسة البرمجيات",
  
      faculty: "كلية الحاسبات و الذكاء الاصطناعي، جامعة حلوان",
      grade: "امتياز مع مرتبة الشرف",
      scholarship: "بعثة داخلية",
      location: "القاهرة - مصر",
      date: "يونيو 2018",
      fileName: "شهادة الدكتوراه.pdf",
    },
    {
      degree: "ماجستير في الذكاء الاصطناعي",
      major: "الذكاء الاصطناعي",
      faculty: "كلية علوم الحاسب، جامعة شتوتغارت",
      grade: "جيد جداً",
      scholarship: "بعثة خارجية",
      location: "شتوتغارت - ألمانيا",
      date: "أكتوبر 2012",
      fileName: "شهادة الماجستير.pdf",
    },
    {
      degree: "بكالوريوس في علوم الحاسب",
      major: "علوم الحاسب",
      faculty: "كلية الحاسبات و الذكاء الاصطناعي، جامعة حلوان",
      grade: "جيد جداً مع مرتبة الشرف",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "يونيو 2008",
      fileName: "شهادة البكالوريوس.pdf",
    },
    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },
        {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },    {
      degree: "دبلومة في تحليل البيانات",
      major: "تحليل البيانات",
      faculty: "كلية الحاسبات والمعلومات، جامعة القاهرة",
      grade: "امتياز",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "مايو 2006",
      fileName: "شهادة الدبلومة.pdf",
    },
  ];

  // ===========================
  // PAGINATION
  // ===========================
  const itemsPerPage = 9;
  const totalPages = Math.ceil(qualifications.length / itemsPerPage);
  const paginatedData = qualifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.degree);
    setShowModal(false);
    setSelectedItem(null);
  };

  // ===========================
  // UI
  // ===========================
  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("academicQualifications") || "Academic Qualifications"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

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
              className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition-transform ${
                isArabic ? "border-r-[19px]" : "border-l-[19px]"
              }`}
            >

              {/* Edit + Delete Icons */}
              <div
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
                } flex gap-3`}
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil
                  className="text-[#b38e19] cursor-pointer w-5 h-5 hover:scale-110 transition"
                  onClick={() =>
                    navigate("/edit-academic-qualification", { state: { item } })
                  }
                />
                <Trash2
                  className="text-[#E53935] cursor-pointer w-5 h-5 hover:scale-110 transition"
                  onClick={() => handleDeleteClick(item)}
                />
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-semibold mb-1">{item.degree}</h3>
              <p className="text-s  text-gray-700">{item.faculty}</p>
              <p className="text-xs text-gray-600 mt-1">{item.grade}</p>
              <p className="text-xs text-gray-400 mt-1 ">{item.scholarship}</p>
  
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="flex justify-center items-center gap-3 mt-10"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 rounded-md border border-gray-400 ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
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
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            {isArabic ? "التالي" : "Next"}
          </button>
        </div>
          {/* Bottom Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end max-w-6xl absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => navigate("/add-academic-qualification")}
            className="bg-[#b38e19] text-white w-24 h-10 rounded-md text-sm"
          >
            {t("edit") || "Edit"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black w-24 h-10 rounded-md text-sm"
          >
            {t("back") || "Back"}
          </button>
        </div>
      </div>

      {/* ============================== */}
      {/* Delete Confirmation Modal      */}
      {/* ============================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold mb-3">
              {t("areYouSureDelete") || "Are you sure you want to delete this?"}
            </h3>
            <p className="text-sm text-gray-600 mb-5">{selectedItem?.degree}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-[#E53935] text-white px-5 py-2 rounded-md hover:bg-red-600"
              >
                {t("delete") || "Delete"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400"
              >
                {t("cancel") || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* DETAILS MODAL (UPDATED)        */}

      {showDetails && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-8 relative animate-fadeIn border-2 border-[#b38e19]"
          >
            <button
              onClick={() => setShowDetails(false)}
              className={`absolute top-4 ${
                isArabic ? "left-4" : "right-4"
              } text-gray-500 hover:text-[#19355a]`}
            >
              <X size={22} />
            </button>

            <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold ">
                {selectedItem.degree}
              </h2>

            </div>

            {/* FULL REQUIRED FIELDS */}
            <div className="space-y-3 text-gray-700">

              <div className="flex justify-between">
                <span className="font-medium ">
                  المؤهل
                </span>
                <span>{selectedItem.degree}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  التخصص
                </span>
                <span>{selectedItem.major}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  التقدير
                </span>
                <span>{selectedItem.grade}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  الإيفاد
                </span>
                <span>{selectedItem.scholarship}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  الجامعة / الكلية
                </span>
                <span>{selectedItem.faculty}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  الدولة / المدينة
                </span>
                <span>{selectedItem.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium ">
                  تاريخ الحصول
                </span>
                <span>{selectedItem.date}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="font-medium ">
                  المرفقات
                </span>
                <a
                  href="#"
                  className="text-[#b38e19] underline hover:text-[#a17810]"
                >
                  {selectedItem.fileName}
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
