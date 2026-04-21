import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMail,
  FiLinkedin,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";

// الـ Dummy Users اللي سألت عليهم
const DUMMY_USERS = [
  {
    id: 1,
    name: "أ.د. أحمد محمد محمود",
    role: "أستاذ دكتور",
    specialty: "ذكاء اصطناعي",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "ahmed@cu.edu",
    linkedin: "#",
  },
  {
    id: 2,
    name: "د. سارة إبراهيم حسن",
    role: "أستاذ مساعد",
    specialty: "نظم معلومات",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sara@cu.edu",
    linkedin: "#",
  },
  {
    id: 3,
    name: "د. خالد عبد الرحمن",
    role: "مدرس",
    specialty: "هندسة برمجيات",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    email: "khaled@cu.edu",
    linkedin: "#",
  },
  {
    id: 4,
    name: "د. منى زكي الخولي",
    role: "أستاذ مشارك",
    specialty: "الأمن السيبراني",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    email: "mona@cu.edu",
    linkedin: "#",
  },
  {
    id: 5,
    name: "د. ياسر جلال عثمان",
    role: "أستاذ دكتور",
    specialty: "علوم الحاسب",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    email: "yasser@cu.edu",
    linkedin: "#",
  },
  {
    id: 6,
    name: "د. ليلى يوسف نصار",
    role: "مدرس",
    specialty: "معالجة لغات طبيعية",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    email: "layla@cu.edu",
    linkedin: "#",
  },
  {
    id: 7,
    name: "أ. محمد علي رضا",
    role: "مدرس مساعد",
    specialty: "التعلم الآلي",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    email: "mohamed@cu.edu",
    linkedin: "#",
  },
  {
    id: 8,
    name: "د. نهى مصطفى كامل",
    role: "أستاذ مشارك",
    specialty: "تحليل البيانات",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    email: "noha@cu.edu",
    linkedin: "#",
  },
  {
    id: 9,
    name: "د. محمود شاكر",
    role: "أستاذ دكتور",
    specialty: "إنترنت الأشياء",
    image: null,
    email: "shaker@cu.edu",
    linkedin: "#",
  },
  {
    id: 10,
    name: "د. هند رستم فوزي",
    role: "أستاذ مساعد",
    specialty: "تفاعل الإنسان والحاسب",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    email: "hind@cu.edu",
    linkedin: "#",
  },
];

const UsersList = ({
  users = DUMMY_USERS, 
  loading = false,
  isArabic = true,
  t = (key) => key,
  searchTerm = "",
  setSearchTerm = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <ResponsiveLayoutProvider>
      <div className="w-full  mx-auto px-4 " dir={isArabic ? "rtl" : "ltr"}>
        <PageHeaderNoAction
          title={isArabic ? "مستخدمين اخرين" : "Another Users"}
          icon={FiUser}
        />

        {/* Toolbar - بستايل السايد بار والبحث العلمي */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-2 mb-6 px-2 gap-y-4">
          <div className="flex items-center flex-1 gap-4 min-w-[280px]">
            <span
              className="text-[#19355A] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.4rem)" }}
            >
              {isArabic ? "أعضاء هيئة التدريس" : "Faculty Members"}
            </span>

            <div className="relative group flex-1 max-w-xs">
              <div
                className={`absolute inset-y-0 ${isArabic ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}
              >
                <FiSearch
                  className="text-gray-300 group-focus-within:text-[#B38E19]"
                  size={16}
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isArabic ? "بحث في الأسماء..." : "Search members..."
                }
                className="w-full bg-gray-50/30 border border-gray-100 text-[#19355A] rounded-md focus:ring-2 focus:ring-[#B38E19]/10 focus:border-[#B38E19] transition-all"
                style={{
                  fontSize: "clamp(0.75rem, 0.9vw, 1rem)",
                  padding: "0.5rem 1rem",
                  paddingInlineStart: "2.5rem",
                }}
              />
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="flex flex-col w-full">
          {loading ? (
            <div className="flex justify-center py-20 text-[#19355A]/20 font-black animate-pulse uppercase tracking-[5px]">
              Loading...
            </div>
          ) : !users || users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-2xl text-[#19355A]/30">
              <FiInbox size={50} className="mb-4" />
              <p className="font-bold uppercase tracking-widest">
                {isArabic ? "لا توجد بيانات" : "No Data"}
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/Profile/${user.id}`)}
                className="group flex items-center justify-between border-b border-gray-50 py-6 transition-all px-4 cursor-pointer hover:bg-[#19355A]/[0.02]"
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* صورة اليوزر */}
                  <div className="shrink-0 relative">
                    <div className="w-[clamp(50px,5vw,75px)] h-[clamp(50px,5vw,75px)] rounded-full overflow-hidden border-2 border-[#19355A]/10 group-hover:border-[#B38E19] transition-all duration-500 bg-white">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                          <FiUser size={30} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* بيانات اليوزر */}
                  <div className="flex flex-col">
                    <h4
                      className="font-bold text-[#19355A] group-hover:text-[#B38E19] transition-colors leading-none mb-2"
                      style={{ fontSize: "clamp(1rem, 1.25vw, 1.4rem)" }}
                    >
                      {user.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#B38E19] font-black text-[clamp(0.7rem,0.8vw,0.9rem)] uppercase tracking-tight">
                        {user.role}
                      </span>
                      <span className="text-gray-200">|</span>
                      <span className="text-gray-500 font-medium text-[clamp(0.8rem,0.9vw,1.1rem)]">
                        {user.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* الأكشنات والزرار الثابت */}
                <div className="flex items-center gap-8 shrink-0">
                  <div className="hidden lg:flex items-center gap-5 border-x border-gray-100 px-8 h-10">
                    <a
                      href={`mailto:${user.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-[#19355A]"
                    >
                      <FiMail size={20} />
                    </a>
                    <a
                      href={user.linkedin}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-[#0077b5]"
                    >
                      <FiLinkedin size={20} />
                    </a>
                  </div>

                  {/* الزرار ثابت لا يختفي */}
                  <div className="flex items-center gap-2 text-[#19355A] font-black text-[clamp(0.7rem,0.8vw,0.85rem)] uppercase tracking-widest border-2 border-[#19355A] px-5 py-2.5 rounded-full group-hover:bg-[#19355A] group-hover:text-white transition-all duration-300">
                    <span>{isArabic ? "الملف الشخصي" : "View Profile"}</span>
                    {isArabic ? (
                      <FiChevronLeft size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default UsersList;
