import React, { useState, useEffect } from "react";

export const BulletPointsFieldForm = ({
  label,
  name,
  value = [],
  onChange,
  placeholder,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // حالة مؤقتة نحفظ فيها النقاط لحد ما المستخدم يدوس "حفظ"
  const [draftItems, setDraftItems] = useState([]);

  // التأكد إن القيمة دايما مصفوفة
  const safeValue = Array.isArray(value) ? value : [];

  // لما نفتح البوب أب، بناخد نسخة من النقاط اللي كانت محفوظة قبل كده
  const handleOpen = () => {
    if (!disabled) {
      setDraftItems([...safeValue]);
      setIsOpen(true);
    }
  };

  // إضافة نقطة للقائمة المؤقتة (بدون ما نأثر على الفورم الأساسي لسه)
  const handleAddItem = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setDraftItems([...draftItems, inputValue.trim()]);
      setInputValue("");
    }
  };

  // حذف نقطة من القائمة المؤقتة
  const handleRemoveItem = (indexToRemove) => {
    setDraftItems(draftItems.filter((_, index) => index !== indexToRemove));
  };

  // لما المستخدم يدوس "حفظ والتأكيد"، نبعت الداتا للفورم الأساسي
  const handleSave = () => {
    onChange({
      target: {
        name,
        value: draftItems,
      },
    });
    setIsOpen(false);
    setInputValue("");
  };

  // الإلغاء (قفل البوب أب بدون حفظ)
  const handleCancel = () => {
    setIsOpen(false);
    setInputValue("");
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-[clamp(0.85rem,1vw,1rem)] font-bold text-[#19355a]">
        {label}
      </label>

      {/* الحقل الأساسي اللي بيظهر في الفورم */}
      <div
        onClick={handleOpen}
        className={`w-full border border-slate-300 rounded-[clamp(6px,0.8vw,10px)] p-2.5 bg-white transition-all 
          ${disabled ? "bg-slate-100 cursor-not-allowed" : "cursor-pointer hover:border-[#19355a]"}
          min-h-[100px] max-h-[150px] overflow-y-auto custom-scrollbar`}
      >
        {safeValue.length === 0 ? (
          <span className="text-slate-400 text-[clamp(0.85rem,1vw,1rem)]">
            {placeholder}
          </span>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-[clamp(0.85rem,1vw,1rem)] text-slate-700">
            {safeValue.map((item, index) => (
              <li key={index} className="break-words">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* النافذة المنبثقة (Popup) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* الهيدر */}
            <div className="bg-[#19355a] px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">{label}</h3>
              <button
                onClick={handleCancel}
                className="text-white/70 hover:text-white text-2xl leading-none font-bold"
                title="إغلاق بدون حفظ"
              >
                &times;
              </button>
            </div>

            {/* المحتوى */}
            <div className="p-5 flex-1 flex flex-col overflow-hidden">
              {/* فورم إضافة النقطة */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 👈 ده اللي بيمنع الـ Refresh
                  handleAddItem(e);
                }}
                className="flex gap-2 mb-5 "
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب هنا ثم اضغط إضافة..."
                  className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#19355a] focus:ring-1 focus:ring-[#19355a]"
                  autoFocus
                />
                <button
                  type="button" // 👈 خليته button بدل ما يسيب المتصفح يخمّن إنه submit
                  onClick={handleAddItem} // 👈 ناديت الدالة هنا مباشرة
                  disabled={!inputValue.trim()}
                  className="bg-[#19355a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#112540] disabled:opacity-50 transition-all cursor-pointer"
                >
                  إضافة
                </button>
              </form>

              {/* القائمة المؤقتة بداخل البوب أب (مسموح فيها بالـ Scrolling) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded-lg p-2 bg-slate-50 min-h-[150px]">
                {draftItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    لا توجد نقاط مضافة حتى الآن. اكتب بالأعلى واضغط "إضافة".
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {draftItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-start gap-2 bg-white p-3 rounded border border-slate-200 shadow-sm"
                      >
                        <span className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap break-words flex-1 leading-relaxed">
                          • {item}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* الفوتر فيه زر الحفظ */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all shadow-sm cursor-pointer"
              >
                حفظ النقاط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
