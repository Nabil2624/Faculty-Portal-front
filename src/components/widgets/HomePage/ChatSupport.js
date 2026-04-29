import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, X, Send } from "lucide-react";

const ChatSupport = ({ isAr }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null); // مرجع لعنصر الشات والزرار

  const accentGold = "#b38e19";
  const mainBlue = "#19355A";

  // وظيفة لتبديل حالة الفتح والإغلاق
  const toggleChat = () => setIsOpen((prev) => !prev);

  // مراقبة الضغط خارج البوب اب
  useEffect(() => {
    const handleClickOutside = (event) => {
      // إذا كان البوب اب مفتوحاً والضغط تم خارج الـ container (chatRef)
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={chatRef}>
      {/* Button - Toggle on click */}
      <button
        onClick={toggleChat}
        title={isAr ? "الدعم الفني" : "Technical Support"}
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 group"
        style={{
          backgroundColor: accentGold,
          width: "clamp(50px, 4vw, 70px)",
          height: "clamp(50px, 4vw, 70px)",
        }}
      >
        {isOpen ? (
          <X className="text-white transition-transform duration-300" size={28} />
        ) : (
          <Headset className="text-white group-hover:rotate-12 transition-transform duration-300" size={28} />
        )}
      </button>

      {/* Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed bottom-24 z-[70] w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 ${
              isAr ? "right-6" : "right-6" // موحد لليمين بناءً على مكان الزرار
            }`}
            style={{ direction: isAr ? "rtl" : "ltr" }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: mainBlue }}>
              <div className="flex items-center gap-3">
                <Headset size={20} />
                <span className="font-bold">{isAr ? "الدعم الفني" : "Live Support"}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-64 p-4 bg-gray-50 overflow-y-auto flex flex-col gap-3">
              <div className="p-3 rounded-lg max-w-[80%] text-sm bg-gray-200 text-gray-800 self-start">
                {isAr ? "مرحباً! كيف يمكننا مساعدتك اليوم؟" : "Hello! How can we help you today?"}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                placeholder={isAr ? "اكتب رسالتك..." : "Type your message..."}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1"
                style={{ "--tw-ring-color": accentGold }}
              />
              <button 
                className="p-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: accentGold }}
              >
                <Send size={18} className={isAr ? "rotate-180" : ""} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSupport;