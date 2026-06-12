import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import useSearch from "../../../hooks/useSearch";
import ProfileImage from "./ProfileImage";

export default function SearchComponent({ isArabic }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // منطق الـ Debounce لتقليل عدد الريكويستات
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { users, loading } = useSearch(debouncedTerm);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-[400px] group">
      {/* أيقونة البحث */}
      <Search
        className={`absolute ${
          isArabic ? "right-3" : "left-3"
        } top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#b38e19] transition-colors z-10`}
      />

      {/* حقل الإدخال */}
      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (searchTerm) setIsOpen(true);
        }}
        type="text"
        placeholder={isArabic ? "بحث في النظام..." : "Search system..."}
        className={`w-full h-[clamp(35px,2.5vw,45px)] bg-white/5 border border-white/10 rounded-xl ${
          isArabic ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
        } text-sm focus:bg-white/10 focus:border-[#b38e19] outline-none transition-all placeholder:text-white/60 text-white`}
      />

      {/* قائمة النتائج (Dropdown) */}
      {isOpen && debouncedTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#19355a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[110] max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-4 flex justify-center items-center text-[#b38e19]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : users && users.length > 0 ? (
            <ul className="flex flex-col">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-3 hover:bg-white/10 border-b border-white/5 last:border-0 cursor-pointer transition-colors flex items-center gap-3"
                  onClick={() => {
                    console.log("Selected user:", user.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <ProfileImage user={user} />

                  <div className={`flex flex-col flex-1 overflow-hidden ${isArabic ? "text-right" : "text-left"}`}>
                    <span className="text-white text-sm font-semibold truncate">
                      {user.facultyMemberName}
                    </span>
                    <span className="text-white/60 text-xs truncate">
                      {user.facultyMemberDepartment} - {user.facultyMemberPosition}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-white/60 text-sm">
              {isArabic ? "لا توجد نتائج" : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}