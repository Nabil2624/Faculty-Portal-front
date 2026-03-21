import { Pencil, Trash2 } from "lucide-react";

// الأبعاد باستخدام clamp للحفاظ على الـ Responsiveness بتاعك
const containerStyle = {
  width: "clamp(35px, 3vw, 50px)",
  height: "clamp(35px, 3vw, 50px)",
};

const iconSize = "clamp(16px, 1.4vw, 24px)";

export default function ActionIcons({ item, onEdit, onDelete }) {
  return (
    <div className="flex gap-4 items-center" onClick={(e) => e.stopPropagation()}>
      {/* زر التعديل */}
      <button
        onClick={() => onEdit(item)}
        style={containerStyle}
        className="flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-[#b38e19] hover:shadow-md hover:shadow-amber-200/50 transition-all duration-300 group active:scale-90"
        title="Edit"
      >
        <Pencil 
          style={{ width: iconSize, height: iconSize }} 
          className="transition-transform group-hover:rotate-12"
        />
      </button>

      {/* زر الحذف */}
      <button
        onClick={() => onDelete(item)}
        style={containerStyle}
        className="flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-md hover:shadow-red-200/50 transition-all duration-300 group active:scale-90"
        title="Delete"
      >
        <Trash2 
          style={{ width: iconSize, height: iconSize }} 
          className="transition-transform group-hover:shake" 
        />
      </button>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        .group-hover\\:shake {
          group-hover: animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}