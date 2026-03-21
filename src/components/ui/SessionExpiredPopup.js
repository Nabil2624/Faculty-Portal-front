// components/SessionExpiredPopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, ShieldAlert } from "lucide-react";

export default function SessionExpiredPopup({ isVisible, onClose }) {
  const { t } = useTranslation("session-popup");
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleLoginRedirect = () => {
    onClose();
    // مسح أي بيانات محلية إذا وجدت (مثل الدور)
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 " />

      {/* Modal */}
      <div className="relative bg-[#19355a] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} className="text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {t("sessionExpiredTitle") || "انتهت الجلسة"}
        </h2>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          {t("sessionExpiredDesc") || "يرجى تسجيل الدخول مرة أخرى لمتابعة العمل وحماية بياناتك."}
        </p>

        <button
          onClick={handleLoginRedirect}
          className="w-full py-4 bg-[#B38e19] hover:bg-[#d4aa25] text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-[#B38e19]/20"
        >
          <LogOut size={20} />
          {t("goToLogin") || "الذهاب لتسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}