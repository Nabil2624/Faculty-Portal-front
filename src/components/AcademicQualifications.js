import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Pencil, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AcademicQualificationsPage() {
  const { t, i18n } = useTranslation("AcademicQualifications");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", selectedItem.degree);
    // Delete api logic goes here
    setShowModal(false);
    setSelectedItem(null);
  };

  const qualifications = [
    {
      degree: "دكتوراه في هندسة البرمجيات",
      faculty: "كلية الحاسبات و الذكاء الاصطناعي، جامعة حلوان",
      grade: "امتياز مع مرتبة الشرف",
      scholarship: "بعثة داخلية",
      location: "القاهرة - مصر",
      date: "يونيو 2018",
      fileName: "شهادة الدكتوراه.pdf",
    },
    {
      degree: "ماجستير في الذكاء الاصطناعي",
      faculty: "كلية علوم الحاسب، جامعة شتوتغارت",
      grade: "جيد جداً",
      scholarship: "بعثة خارجية",
      location: "شتوتغارت - ألمانيا",
      date: "أكتوبر 2012",
      fileName: "شهادة الماجستير.pdf",
    },
    {
      degree: "بكالوريوس في علوم الحاسب",
      faculty: "كلية الحاسبات و الذكاء الاصطناعي، جامعة حلوان",
      grade: "جيد جداً مع مرتبة الشرف",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "يونيو 2008",
      fileName: "شهادة البكالوريوس.pdf",
    },
    {
      degree: "بكالوريوس في علوم الحاسب",
      faculty: "كلية الحاسبات و الذكاء الاصطناعي، جامعة حلوان",
      grade: "جيد جداً مع مرتبة الشرف",
      scholarship: "دراسة داخلية",
      location: "القاهرة - مصر",
      date: "يونيو 2008",
      fileName: "شهادة البكالوريوس.pdf",
    },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("academicQualifications")}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          {/* Centered filter icon inside square */}
          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>

        {/* Timeline wrapper */}
        <div
          className="relative transition-all duration-300"
          style={{
            transform: isArabic ? "translateX(65px)" : "translateX(-65px)",
          }}
        >
          {/* Vertical gold line */}
          {/* Vertical gold line */}
          <div
            className={`absolute top-0 w-[4px] bg-[#b38e19]`}
            style={{
              height: "100%",
              borderRadius: "2px",
              right: isArabic ? "calc(4rem + 4px)" : "auto",
              left: !isArabic ? "calc(4rem + 4px)" : "auto",
            }}
          ></div>

          {/* Cards column */}
          <div
            className="relative pr-1 overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: "calc(100vh - 250px)",
            }}
          >
            <div className="flex flex-col gap-16 relative">
              {qualifications.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center ${
                    isArabic
                      ? "justify-start pr-[60px]"
                      : "justify-start pl-[60px]"
                  }`}
                >
                  <div
                    className={`absolute top-[50px] -translate-y-1/2 ${
                      isArabic ? "right-16" : "left-16"
                    }`}
                  >
                    {/* Rounded gold curve SVG */}
                    <svg
                      width="120"
                      height="80"
                      viewBox="0 0 270 40"
                      className={isArabic ? "scale-x-[-1]" : ""}
                    >
                      <path
                        d="M10 10 C30 60, 90 60, 110 10"
                        stroke="#b38e19"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Card */}
                  <div
                    className={`bg-gray-100 rounded-[12px] shadow-md p-4 relative w-[680px] transition-transform hover:scale-[1.01] 
      ${
        isArabic
          ? "mr-8 text-left border-r-[19px] border-[#19355a]"
          : "ml-8 text-left border-l-[19px] border-[#19355a]"
      }`}
                  >
                    {/* Action icons */}
                    <div
                      className={`absolute top-4 ${
                        isArabic ? "left-4" : "right-4"
                      } flex gap-3`}
                    >
                      <Pencil
                        className="text-[#b38e19] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                        onClick={() =>
                          navigate("/edit-academic-qualification", {
                            state: { item },
                          })
                        }
                      />

                      <Trash2
                        className="text-[#E53935] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`${
                        isArabic ? "text-right" : "text-left"
                      } flex flex-col space-y-1`}
                    >
                      <h3 className="text-xl font-semibold text-[#1A1A1A]">
                        {item.degree}
                      </h3>
                      <p className="text-base font-medium text-[#1A1A1A]">
                        {item.faculty}
                      </p>
                      <p className="text-base font-normal text-[#1A1A1A]">
                        {item.grade}
                      </p>
                      <p className="text-base font-light text-gray-500">
                        {item.scholarship}
                      </p>
                      <p className="text-base font-light text-gray-500 absolute bottom-3">
                        {item.location}
                      </p>
                      <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-base font-light text-gray-500">
                        {item.date}
                      </p>
                      <div
                        className={`flex ${
                          isArabic ? "justify-end" : "justify-end"
                        } mt-2`}
                      >
                        <a
                          href="#"
                          className="text-base text-[#1A1A1A] font-medium underline hover:text-[#b38e19]"
                          download
                        >
                          {item.fileName}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        {/* Buttons at bottom-left (Arabic) or bottom-right (English) */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end w-full max-w-6xl absolute ${
            isArabic ? "left-[53px]" : "right-[53px]"
          } bottom-[28px]`}
        >
          <button
            onClick={() => navigate("/add-academic-qualification")}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("edit")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`bg-gray-300 text-black w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("back")}
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
              {t("areYouSureDelete") ||
                "Are you sure you want to delete this item?"}
            </h3>
            <p className="text-sm text-gray-600 mb-5">{selectedItem?.degree}</p>

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
    </Layout>
  );
}
