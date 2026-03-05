import { X } from "lucide-react";

export default function CustomErrorModal({ message, onClose, isArabic }) {
  if (!message) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="relative bg-white border-[clamp(1.5px,0.3vw,3px)] border-[#b38e19] 
                   rounded-[clamp(14px,2vw,22px)] shadow-2xl 
                   w-[clamp(320px,35vw,600px)] max-w-[92%] p-[clamp(1rem,2.5vw,2rem)]"
      >
        {/* Close button X */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-500`}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <div className="text-center border-b pb-3 mb-4">
          <h2 className="font-semibold text-[clamp(1.2rem,2vw,2rem)]">
            {isArabic ? "تنبيه" : "Notice"}
          </h2>
        </div>

        {/* Message */}
        <div className="text-center text-[clamp(0.9rem,1.2vw,1.2rem)] mb-6">
          {message}
        </div>

        {/* OK Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#B38E19] text-white px-10 py-2 rounded-md"
          >
            {isArabic ? "حسناً" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}