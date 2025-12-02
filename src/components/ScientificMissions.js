// src/pages/ScientificMissions.jsx
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function ScientificMissions() {
  const { t, i18n } = useTranslation("ScientificMissions");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const missions = [
    {
      title: "مهمة بحثية في الذكاء الاصطناعي الطبي",
      institution: "كلية علوم الحاسب جامعة ميونخ",
      period: "من 1 مارس 2022 - حتى 30 يونيو 2022",
      description:
        "المشاركة في مشروع بحثي لتحليل صور الأشعة باستخدام تقنيات الذكاء الاصطناعي، بالتعاون مع فريق من جامعة ميونخ.",
      location: "ميونخ - ألمانيا",
    },
    {
      title: "زيارة علمية لتطوير مناهج نظم المعلومات",
      institution: "كلية الحاسبات والذكاء الاصطناعي جامعة القاهرة",
      period: "من 1 نوفمبر 2021 - حتى 25 نوفمبر 2021",
      description:
        "تنسيق ورشة عمل حول تطوير مناهج نظم المعلومات وتحسين مخرجات التعليم الجامعي.",
      location: "القاهرة - مصر",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    {
      title: "زيارة بحثية في تقنيات البرمجيات الحديثة",
      institution: "جامعة طوكيو للعلوم والتكنولوجيا",
      period: "من 10 يناير 2020 - حتى 10 أبريل 2020",
      description:
        "إجراء أبحاث حول تقنيات تطوير البرمجيات باستخدام الذكاء الاصطناعي والتحليل الكمي.",
      location: "طوكيو - اليابان",
    },
    // ... أضف باقي المهام هنا
  ];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(missions.length / itemsPerPage);
  const paginatedData = missions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-4 sm:p-6`}>
        {/* Header */}
        <div className="flex sm:flex-row justify-between items-start sm:items-start mb-6 sm:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-start truncate">
            {t("scientificMissions") || "Scientific Missions"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          {/* Right actions: Filter + Add */}
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-4 h-5 sm:w-5 sm:h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
            <button
              onClick={() => navigate("/add-scientific-task")}
              className="bg-[#b38e19] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-semibold"
            >
              {t("add") || "Add"}
            </button>
          </div>
        </div>

        {/* Grid of cards */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ${
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
              className={`relative bg-gray-100 rounded-lg shadow-md p-2 sm:p-3 border-[3px] sm:border-[4px] border-[#19355a] cursor-pointer hover:scale-[1.02] transition-transform ${
                isArabic
                  ? "border-r-[16px] sm:border-r-[19px]"
                  : "border-l-[16px] sm:border-l-[19px]"
              }`}
            >
              {/* Icons */}
              <div
                className={`absolute top-2 sm:top-4 ${
                  isArabic ? "left-2 sm:left-4" : "right-2 sm:right-4"
                } flex gap-2 sm:gap-3`}
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil
                  className="text-[#b38e19] cursor-pointer w-4 h-4 sm:w-5 sm:h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() =>
                    navigate("/edit-scientific-task", {
                      state: { taskData: item },
                    })
                  }
                />
                <Trash2
                  className="text-[#E53935] cursor-pointer w-4 h-4 sm:w-5 sm:h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                  onClick={() => handleDeleteClick(item)}
                />
              </div>

              {/* Card Content */}
              <h3 className="text-xs sm:text-lg  font-semibold text-[#1A1A1A] mb-1 truncate">
                {item.title}
              </h3>
              <p className="text-[10px] sm:text-base  text-gray-700 truncate">
                {item.period}
              </p>
              <p className="text-[10px] sm:text-sm text-gray-700 truncate">
                {item.institution}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-400 mt-1 truncate">
                {item.location}
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-[520px] max-w-[90%] p-6 sm:p-8 relative animate-fadeIn border-2 border-[#b38e19]"
          >
            <button
              onClick={() => setShowDetails(false)}
              className={`absolute top-4 ${
                isArabic ? "left-4" : "right-4"
              } text-gray-500 transition`}
            >
              <X size={22} />
            </button>

            <div className="border-b-2 border-[#b38e19]/40 pb-3 mb-4">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("location") ||
                    (isArabic ? "الدولة / المدينة" : "Country / City")}
                </span>
                <span>{selectedItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("institution") ||
                    (isArabic ? "الجامعة / الكلية" : "University / College")}
                </span>
                <span>{selectedItem.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("startDate") ||
                    (isArabic ? "تاريخ البداية" : "Start Date")}
                </span>
                <span>{selectedItem.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("endDate") || (isArabic ? "تاريخ النهاية" : "End Date")}
                </span>
                <span>{selectedItem.period}</span>
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
    </ResponsiveLayoutProvider>
  );
}
