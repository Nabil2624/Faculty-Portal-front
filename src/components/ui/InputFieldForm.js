import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import "react-datepicker/dist/react-datepicker.css";

export function InputFieldForm({ label, type = 'text', value, onChange, name, placeholder, ...rest }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const isEmail = type === 'email';
  const isTel = type === 'tel';
  const isDate = type === 'date';

  const handleDateChange = (date) => {
    if (!onChange) return;
    if (!date) {
      onChange({ target: { name, value: '' } });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    onChange({
      target: {
        name: name,
        value: formattedDate
      }
    });
  };

  const alignmentClass = isEmail 
    ? 'text-left' 
    : isTel 
      ? (isArabic ? 'text-right' : 'text-left') 
      : '';

  // 💡 التوليفة السحرية اللي بتجمع بين الحجم الكبير والبادنج القليل:
  // - h-12: بتثبت الارتفاع الكلي للإنبت على 48px عشان يفضل فخم وكبير.
  // - py-1: قللنا البادنج العمودي خالص عشان نلغي أي ضغط على الحروف من تحت أو فوق.
  // - text-[clamp(0.95rem,1.1vw,1.2rem)]: حجم خط ممتاز ومريح للعين.
  const baseInputClasses = `w-full 
    bg-gray-50
    disabled:bg-gray-200/50 disabled:text-gray-400 disabled:cursor-not-allowed
    ${isDate ? 'cursor-pointer' : ''} 
    ${isDate ? (isArabic ? 'pl-12 pr-4' : 'pr-10 pl-4') : 'px-4'}
    h-11
   
    rounded-[clamp(6px,0.6vw,10px)]
    border-[clamp(1px,0.15vw,2px)] border-slate-300
    text-[clamp(0.95rem,1.1vw,1.2rem)] text-black 
    placeholder:text-gray-400 placeholder:text-[clamp(0.6rem,0.8vw,1rem)]
    transition-all duration-200
    
    outline-none focus:outline-none focus-visible:outline-none
    focus:border-[#b38e19] 
    focus:shadow-[0_0_0_2px_rgba(179,142,25,0.2)]
    focus-visible:shadow-[0_0_0_2px_rgba(179,142,25,0.2)]
    ${alignmentClass}`;

  return (
    <div className="w-full">
      <label className="block text-[clamp(0.85rem,1vw,1.1rem)] font-semibold text-[#19355a] mb-1.5">
        {label}
      </label>
      
      <div className="relative flex items-center w-full">
        {isDate ? (
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText={placeholder} 
            className={baseInputClasses}
            wrapperClassName="w-full cursor-pointer"
            name={name}
            {...rest}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className={baseInputClasses}
            {...rest}
          />
        )}

        {/* أيكونة Lucide الجولد - متسنترة عمودياً بالملّي */}
        {isDate && (
          <div 
            className={`absolute pointer-events-none text-[#b38e19] z-10 flex items-center top-1/2 -translate-y-1/2
              ${isArabic ? 'left-4' : 'right-4'}`}
          >
            <Calendar className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}