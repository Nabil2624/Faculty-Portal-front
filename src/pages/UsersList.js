import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderNoAction from "../components/ui/PageHeaderNoAction";
import useUsersSearch from "../hooks/useUsersSearch";
import ProfileImage from "../components/widgets/UsersList/ProfileImage";

const UsersList = ({ isArabic = true }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [take, setTake] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce للبحث
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(inputValue);
      setTake(10);
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const { users, loading, hasMore } = useUsersSearch(searchTerm, take);

  const userList = users?.items || [];
  const filteredUsers = userList.filter((u) => u.facultyMemberName !== null);

  const handleShowMore = () => {
    setLoadingMore(true);
    setTake((prev) => prev + 10);
    setTimeout(() => setLoadingMore(false), 500);
  };

  return (
    <ResponsiveLayoutProvider>
      <div className="w-full mx-auto px-4" dir={isArabic ? "rtl" : "ltr"}>
        <PageHeaderNoAction
          title={isArabic ? "مستخدمين اخرين" : "Another Users"}
          icon={FiUser}
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#19355A] pb-2 mb-6 px-2 gap-y-4">
          <div className="flex items-center flex-1 gap-4 min-w-[280px]">
            <span className="text-[#19355A] font-bold uppercase tracking-widest whitespace-nowrap" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.4rem)" }}>
              {isArabic ? "أعضاء هيئة التدريس" : "Faculty Members"}
            </span>

            <div className="relative group flex-1 max-w-xs">
              <div className={`absolute inset-y-0 ${isArabic ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}>
                <FiSearch className="text-gray-300 group-focus-within:text-[#B38E19]" size={16} />
              </div>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isArabic ? "بحث في الأسماء..." : "Search members..."}
                className={`w-full bg-gray-50/30 border border-gray-100 text-[#19355A] rounded-md focus:ring-2 focus:ring-[#B38E19]/10 focus:border-[#B38E19] transition-all p-2 ${
                  isArabic ? "pr-10 pl-3" : "pl-10 pr-3"
                }`}
              />
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="flex flex-col w-full">
          {loading && take === 10 ? (
            <div className="flex justify-center py-20 text-[#19355A]/20 font-black animate-pulse uppercase tracking-[5px]">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-2xl text-[#19355A]/30">
              <FiInbox size={50} className="mb-4" />
              <p className="font-bold uppercase tracking-widest">{isArabic ? "لا توجد بيانات" : "No Data"}</p>
            </div>
          ) : (
            <>
              {filteredUsers.map((user) => (
                <div 
                  key={user.id} 

                  onClick={() => navigate("/profile-page", { state: { userId: user.id } })} 
                  className="group flex items-center justify-between border-b border-gray-50 py-6 transition-all px-4 cursor-pointer hover:bg-[#19355A]/[0.02]"
                >
                  <div className="flex items-center gap-6 flex-1">
                    
                    <div className="w-[75px] h-[75px] rounded-full border-2 border-[#19355A]/10 group-hover:border-[#B38E19] transition-all duration-500 bg-white flex items-center justify-center overflow-hidden">
                      <ProfileImage user={user} className="w-full h-full" />
                    </div>

                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#19355A] group-hover:text-[#B38E19] transition-colors">{user.facultyMemberName}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {user.facultyMemberPosition && <span className="text-[#B38E19] font-black text-xs uppercase tracking-tight">{user.facultyMemberPosition}</span>}
                        {user.facultyMemberPosition && user.facultyMemberDepartment && <span className="text-gray-200">|</span>}
                        {user.facultyMemberDepartment && <span className="text-gray-500 font-medium text-sm">{user.facultyMemberDepartment}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 shrink-0">
                    <div className="hidden lg:flex items-center gap-5 border-x border-gray-100 px-8 h-10">
                      {user.facultyMemberEmail && (
                        <a 
                          href={`mailto:${user.facultyMemberEmail}`} 
                          onClick={(e) => e.stopPropagation()} 
                          className="text-gray-400 hover:text-[#19355A]"
                        >
                          <FiMail size={20} />
                        </a>
                      )}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.linkedinUrl) window.open(user.linkedinUrl, '_blank');
                        }} 
                        className="text-gray-400 hover:text-[#0077b5] bg-transparent border-none cursor-pointer p-0"
                      >
                        <FiLinkedin size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[#19355A] font-black text-xs uppercase tracking-widest border-2 border-[#19355A] px-5 py-2.5 rounded-full group-hover:bg-[#19355A] group-hover:text-white transition-all duration-300">
                      <span>{isArabic ? "الملف الشخصي" : "View Profile"}</span>
                      {isArabic ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="flex justify-center py-10">
                  <button onClick={handleShowMore} disabled={loadingMore} className="flex items-center gap-3 px-10 py-3 bg-[#19355A] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#B38E19] transition-all disabled:opacity-50 shadow-lg">
                    {loadingMore ? <Loader2 className="animate-spin" size={20} /> : (isArabic ? "عرض المزيد" : "Show More")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default UsersList;