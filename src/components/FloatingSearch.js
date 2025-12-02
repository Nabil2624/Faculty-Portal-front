import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FloatingSearch({ isOpen, onClose }) {
  const { t } = useTranslation("headerandsidebar");
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={searchRef}
      className={`
        fixed top-20 left-1/2 w-96 bg-white text-black shadow-xl rounded-xl px-4 py-3 border border-gray-300 z-40
        transform -translate-x-1/2 transition-all duration-500 ease-in-out
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}
    >
      <div className="flex items-center gap-2">
        <Search size={18} className="text-gray-500" />
        <input
          autoFocus={isOpen}
          type="text"
          placeholder={t("searchPlaceholder")}
          className="flex-1 outline-none text-gray-700"
        />
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
