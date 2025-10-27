import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SeminarsAndConferences() {
  const { t, i18n } = useTranslation("SeminarsAndConferences");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.title);
    setShowModal(false);
    setSelectedItem(null);
  };

  // Data
  const events = [
    {
      title: "المؤتمر الدولي للذكاء الاصطناعي التطبيقي",
      organizer: "IEEE",
      period: "من 12 نوفمبر 2024 - حتى 16 نوفمبر 2024",
      description:
        "عرض ورقة بحثية عن استخدام الذكاء الاصطناعي في التشخيص الطبي وتحليل الصور الشعاعية.",
      role: "متحدث رئيسي",
      type: "مؤتمر-دولي",
      location: "دبي - الإمارات",
      fileName: "ملف العرض التقديمي.pdf",
      link: "https://www.ieee-aiconf.org",
    },
    {
      title: "ندوة التحول الرقمي في التعليم العالي",
      organizer: "وزارة التعليم العالي",
      period: "10 مارس 2023",
      description:
        "تنظيم ندوة توعوية حول تطبيق الأنظمة الذكية في إدارة الجامعات المصرية.",
      role: "منظم",
      type: "ندوة-محلي",
      location: "القاهرة - مصر",
      fileName: "دعوة المشاركة.pdf",
      link: "https://www.mohe.gov.eg/seminars",
    },
    {
      title: "مؤتمر أمن المعلومات والخصوصية",
      organizer: "ACM",
      period: "من 7 فبراير 2021 - حتى 14 فبراير 2021",
      description:
        "قدمت بحثًا عن أساليب حماية البيانات باستخدام التعلم العميق.",
      role: "مشارك بورقة بحثية",
      type: "مؤتمر-دولي",
      location: "باريس - فرنسا",
      fileName: "",
      link: "",
    },
  ];

  // Pagination logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedData = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("seminarsAndConferences") || "Seminars & Conferences"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          {/* Filter icon */}
          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>

        {/* Cards grid */}
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
                onClick={(e) => e.stopPropagation()} // prevent card click
              >
                <Pencil
                  className="text-[#b38e19] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() =>
                    navigate("/edit-conference", { state: { existingData: item } })
                  }
                />
                <Trash2
                  className="text-[#E53935] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() => handleDeleteClick(item)}
                />
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                {item.title}
              </h3>
              <p className="text-base font-medium text-gray-700">
                {item.organizer}
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
            onClick={() => navigate("/add-conference")}
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
                {selectedItem.organizer}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {isArabic ? "الفترة" : "Period"}
                </span>
                <span>{selectedItem.period}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {isArabic ? "الدور" : "Role"}
                </span>
                <span>{selectedItem.role}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {isArabic ? "النوع" : "Type"}
                </span>
                <span>{selectedItem.type}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-[#19355a]">
                  {isArabic ? "الموقع" : "Location"}
                </span>
                <span>{selectedItem.location}</span>
              </div>

              {selectedItem.fileName && (
                <div className="flex justify-between">
                  <span className="font-medium text-[#19355a]">
                    {isArabic ? "الملف" : "File"}
                  </span>
                  <a
                    href={selectedItem.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#b38e19] underline"
                  >
                    {selectedItem.fileName}
                  </a>
                </div>
              )}

              {selectedItem.link && (
                <div className="flex justify-between">
                  <span className="font-medium text-[#19355a]">
                    {isArabic ? "الرابط" : "Link"}
                  </span>
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#b38e19] underline"
                  >
                    {selectedItem.link.replace("https://", "")}
                  </a>
                </div>
              )}

              <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
