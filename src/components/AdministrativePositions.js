import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import { Pencil, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddAdministrativePosition from "../components/AddAdministrativePosition";
import EditAdminPosition from "./EditAdminPosition";


export default function AdministrativePositions() {
  const { t, i18n } = useTranslation("AdministrativePositions");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPositionsForm, setShowPositionsForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

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

  const positions = [
    {
      title: "رئيس قسم نظم المعلومات",
      period: "من 1 يوليو 2023 - حتى الآن",
      description: "يشرف على تطوير المناهج وتنظيم البحث العلمي داخل القسم.",
    },
    {
      title: "منسق برنامج هندسة البرمجيات",
      period: "من 1 أكتوبر 2021 - حتى 30 يونيو 2023",
      description:
        "مسؤول عن إدارة مقررات هندسة البرمجيات وتقييم الأداء الأكاديمي.",
    },
    {
      title: "عضو لجنة الدراسات العليا والبحوث",
      period: "من 1 أكتوبر 2019 - حتى 30 سبتمبر 2021",
      description: "شارك في تقييم المقترحات البحثية واعتماد مشروعات الماجستير.",
    },
    {
      title: "مدير وحدة الجودة",
      period: "من 1 يوليو 2017 - حتى 30 سبتمبر 2019",
      description: "أشرف على توثيق إجراءات الجودة وضمان الاعتماد الأكاديمي.",
    },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-bold relative text-start">
            {t("administrativePositions") || "Administrative Positions"}
            <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
          </h2>

          {/* Filter icon */}
          <div className="absolute top-18 left-1/2 transform -translate-x-1/5">
            <div className="w-10 h-10 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer hover:text-[#b38e19] transition">
              <Filter className="w-5 h-6 text-gray-700 hover:text-[#b38e19]" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          className="relative transition-all duration-300"
          style={{
            transform: isArabic ? "translateX(65px)" : "translateX(-65px)",
          }}
        >
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
              {positions.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center ${
                    isArabic
                      ? "justify-start pr-[60px]"
                      : "justify-start pl-[60px]"
                  }`}
                >
                  {/* Curved SVG */}
                  <div
                    className={`absolute top-[50px] -translate-y-1/2 ${
                      isArabic ? "right-16" : "left-16"
                    }`}
                  >
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
                    className={`bg-gray-100 rounded-[12px] shadow-md p-4 relative w-[680px] transition-transform hover:scale-[1.01] ${
                      isArabic
                        ? "mr-8 text-left border-r-[19px] border-[#19355a]"
                        : "ml-8 text-left border-l-[19px] border-[#19355a]"
                    }`}
                  >
                    {/* Icons */}
                    <div
                      className={`absolute top-4 ${
                        isArabic ? "left-4" : "right-4"
                      } flex gap-3`}
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

                    {/* Text */}
                    <div
                      className={`${
                        isArabic ? "text-right" : "text-left"
                      } flex flex-col space-y-2`}
                    >
                      <h3 className="text-xl font-semibold text-[#1A1A1A]">
                        {item.title}
                      </h3>
                      <p className="text-base font-medium text-gray-700">
                        {item.period}
                      </p>
                      <p className="text-base font-normal text-[#1A1A1A]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-end w-full max-w-6xl absolute ${
                isArabic ? "left-[53px]" : "right-[53px]"
              } bottom-[28px]`}
        >
          <button
            onClick={() => setShowPositionsForm(true)}
            className={`bg-[#b38e19] text-white w-24 h-10 rounded-md cursor-pointer font-${
              isArabic ? "cairo" : "roboto"
            } text-sm`}
          >
            {t("edit") || "Add"}
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

      {/* Confirmation Modal */}
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

      {/*  AdministrativePositionsForm Modal */}
      {showPositionsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="rounded-lg shadow-none p-0 w-[480px] relative bg-transparent">
            <AddAdministrativePosition
              onCancel={() => setShowPositionsForm(false)}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="rounded-lg shadow-none p-0 w-[480px] relative bg-transparent">
            <EditAdminPosition
              data={selectedItem}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
