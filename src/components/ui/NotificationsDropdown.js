import React, { useState, useEffect, useRef } from "react";
import { Bell, Clock, Inbox } from "lucide-react";

const NotificationsDropdown = ({
  isArabic,
  notifications = [],
  onMarkAllRead,
  loadMore,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== format time =====
  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;

    return date.toLocaleDateString();
  };

  // ===== mapping backend → UI =====
  const mappedNotifications = notifications.map((n) => ({
    id: n.id || `${n.receiverId}-${n.createdAt}`,
    title: n.title || n.message,
    time: formatTime(n.createdAt),
    unread: n.unread ?? true,
  }));

  const hasUnread = mappedNotifications.some((n) => n.unread);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl transition-all relative group ${
          isOpen ? "bg-white/10" : "hover:bg-white/10"
        }`}
      >
        <Bell
          size={20}
          className={`${
            isOpen ? "text-[#b38e19]" : "text-white/40"
          } group-hover:text-white transition-colors`}
        />

        {hasUnread && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#b38e19] rounded-full border-2 border-[#19355a] animate-pulse"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full mt-4 w-[320px] bg-[#19355a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[999] ${
            isArabic ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
              {isArabic ? "مركز التنبيهات" : "Notification Center"}
            </h4>

            {mappedNotifications.length > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[10px] text-[#b38e19] hover:text-white transition-colors font-bold"
              >
                {isArabic ? "تحديد كـ مقروء" : "Mark all read"}
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {mappedNotifications.length > 0 ? (
              mappedNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer flex gap-3 items-start group ${
                    n.unread ? "bg-[#b38e19]/5" : ""
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 transition-all duration-500 ${
                      n.unread ? "bg-[#b38e19] scale-125" : "bg-white/10"
                    } group-hover:scale-150`}
                  />

                  <div className="flex-1">
                    <p
                      className={`text-[12px] leading-relaxed transition-colors ${
                        n.unread
                          ? "text-white font-bold"
                          : "text-white/40 group-hover:text-white/60"
                      }`}
                    >
                      {n.title}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-[9px] text-white/20 font-medium">
                      <Clock size={10} />
                      {n.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 flex flex-col items-center justify-center opacity-20">
                <Inbox size={32} className="mb-2" />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isArabic ? "لا توجد تنبيهات" : "No Notifications"}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <button onClick={loadMore} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-[#b38e19] hover:text-[#19355a] transition-all text-[#b38e19] border-t border-white/10">
            {isArabic ? "مشاهدة السجل الكامل" : "View Full Activity"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
