import React, { useState } from "react";
import { User, Phone, Video, MoreVertical, Send, Search, CheckCheck, Paperclip, Smile } from "lucide-react";

const ProfessionalChat = () => {
  // الحالة الافتراضية للغة (يمكنك ربطها بـ i18next)
  const [isArabic, setIsArabic] = useState(true);

  const contacts = [
    { id: 1, name: "أحمد هشام", lastMsg: "تم تحديث ملفات المشروع بنجاح", time: "10:30 ص", active: true },
    { id: 2, name: "فريق التطوير", lastMsg: "هل جربت التعديلات الجديدة؟", time: "أمس", active: false },
    { id: 3, name: "الخدمات الأكاديمية", lastMsg: "تم اعتماد التقرير النهائي", time: "الاثنين", active: false },
  ];

  return (
    <div 
      className="flex h-screen bg-[#f8fafc] text-slate-700 antialiased overflow-hidden" 
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 1. Sidebar - قائمة المحادثات بجودة عالية */}
      <aside className="w-80 md:w-96 bg-white flex flex-col border-e border-gray-100 shadow-2xl z-20">
        {/* Sidebar Header */}
        <header className="h-20 bg-[#19355a] text-white flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-wide">المحادثات</h1>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-0">
            <MoreVertical size={20} />
          </button>
        </header>

        {/* Search Field */}
        <div className="p-4 bg-gray-50/30">
          <div className="relative group">
            <Search className="absolute right-3 top-3 text-gray-400 group-focus-within:text-[#19355a] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-0 focus:border-[#19355a]/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Contact Cards */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              className={`flex items-center p-4 gap-4 cursor-pointer transition-all border-b border-gray-50/50 hover:bg-gray-50 ${
                contact.active ? 'bg-blue-50/60 border-r-4 border-r-[#19355a] shadow-inner' : ''
              }`}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#19355a] to-[#2a528a] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {contact.name[0]}
                </div>
                {contact.active && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 truncate text-[15px]">{contact.name}</h3>
                  <span className="text-[11px] text-gray-400 font-medium">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate leading-relaxed">{contact.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#f4f7f9]">
        {/* Chat Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 border-b border-gray-100 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#19355a]/10 flex items-center justify-center border border-[#19355a]/10 shadow-sm">
              <User size={26} className="text-[#19355a]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg leading-tight">أحمد هشام</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all focus:outline-none focus:ring-0 active:scale-90"><Video size={22} /></button>
            <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all focus:outline-none focus:ring-0 active:scale-90"><Phone size={22} /></button>
            <div className="w-[1px] h-8 bg-gray-200 mx-2"></div>
            <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all focus:outline-none focus:ring-0 active:scale-90"><MoreVertical size={22} /></button>
          </div>
        </header>

        {/* Conversation View */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-chat-pattern">
          {/* Incoming Message */}
          <div className="flex justify-start items-end gap-3">
            <div className="max-w-[65%] bg-white text-gray-800 p-4 rounded-3xl rounded-bl-none shadow-sm border border-gray-100">
              <p className="text-[14.5px] leading-relaxed">
                مرحباً أحمد، لقد قمت بمراجعة الأكواد الجديدة، التصميم رائع جداً خصوصاً استخدامك للظلال.
              </p>
              <span className="text-[10px] text-gray-400 block mt-2 text-left">09:45 م</span>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end items-end gap-3">
            <div className="max-w-[65%] bg-[#19355a] text-white p-4 rounded-3xl rounded-br-none shadow-xl shadow-[#19355a]/20">
              <p className="text-[14.5px] leading-relaxed">
                شكراً جزيلاً! قمت أيضاً بإلغاء كل الـ Outlines لتحسين تجربة المستخدم كما طلبت.
              </p>
              <div className="flex justify-end items-center gap-1.5 mt-2">
                <span className="text-[10px] text-blue-200/70 font-light">09:47 م</span>
                <CheckCheck size={15} className="text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Modern Message Input */}
        <footer className="p-6 bg-transparent border-t-0">
          <div className="max-w-5xl mx-auto flex items-center gap-3 bg-white border border-gray-100 rounded-[2rem] px-5 py-3 shadow-xl shadow-gray-200/50">
            <button className="text-gray-400 hover:text-[#19355a] transition-colors focus:outline-none focus:ring-0"><Smile size={24} /></button>
            <button className="text-gray-400 hover:text-[#19355a] transition-colors focus:outline-none focus:ring-0"><Paperclip size={22} /></button>
            <input 
              type="text" 
              placeholder="اكتب رسالتك الآن..." 
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-2 px-2 placeholder:text-gray-300"
            />
            <button className="bg-[#19355a] text-white p-3 rounded-full hover:bg-[#122844] transition-all active:scale-90 shadow-lg shadow-[#19355a]/30 focus:outline-none focus:ring-0">
              <Send size={20} className={isArabic ? "rotate-180" : ""} />
            </button>
          </div>
        </footer>
      </main>

      {/* Custom Global CSS */}
      <style jsx global>{`
        /* إلغاء الـ Outline والـ Focus لجميع العناصر */
        *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        .bg-chat-pattern {
          background-color: #f4f7f9;
          background-image: radial-gradient(#19355a08 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalChat;