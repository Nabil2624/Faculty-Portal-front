import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorCard = ({ pageName, backendMessage, isAr = true }) => {
  const navigate = useNavigate();

  const texts = {
    title: isAr ? "تنبيه تقني: تعذر استيفاء البيانات" : "Technical Alert: Data Retrieval Error",
    action: isAr ? "تقديم طلب دعم فني" : "Submit Support Request",
    defaultSub: isAr 
      ? `نعتذر لسيادتكم، حدث عطل فني حال دون عرض بيانات (${pageName}) بشكل صحيح.` 
      : `We apologize; a technical malfunction prevented the correct display of (${pageName}) data.`
  };

  const safeMsg = backendMessage && !backendMessage.toLowerCase().includes('exception') ? backendMessage : null;

  return (
    <div className={`w-full max-w-2xl mx-auto ${isAr ? 'rtl font-arabic' : 'ltr font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative bg-white border border-red-200 shadow-2xl rounded-lg overflow-hidden">
        
        {/* خلفية جمالية خفيفة جداً بتدرج أحمر ورمادي */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-slate-50/30 pointer-events-none"></div>

        {/* الشريط العلوي "الثقيل" - كحلي مع لمسة ذهبية */}
        <div className="h-2 bg-[#19355A] relative">
          <div className="absolute top-0 right-10 left-10 h-full bg-[#B38E19] opacity-30 blur-sm"></div>
        </div>

        <div className="relative p-12 text-center">
          
          {/* أيقونة الإيرور - "الخطر" الواضح بشياكة */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* النبض الأحمر خلف الأيقونة لجذب الانتباه */}
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-20 h-20 bg-white border-4 border-red-600 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* العنوان - أحمر داكن "رسمي" */}
          <h2 className="text-red-800 text-2xl font-black mb-4 uppercase tracking-tight">
            {texts.title}
          </h2>

          {/* خط فاصل أنيق بالذهب */}
          <div className="w-24 h-1 bg-[#B38E19] mx-auto mb-6 rounded-full opacity-60"></div>
          
          {/* الرسالة الأساسية - كحلي ثقيل */}
          <p className="text-[#19355A] text-lg font-bold leading-relaxed mb-8">
            {texts.defaultSub}
          </p>
          
          {/* صندوق تفاصيل الخطأ التقني */}
          <div className="bg-slate-900/5 border-dashed border border-slate-300 rounded-md p-4 mb-10 text-start">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Diagnostic Report</span>
             </div>
             <p className="text-sm text-slate-700 font-mono italic">
               {safeMsg ? safeMsg : "Error Code: CORE_DATA_UNAVAILABLE"}
             </p>
          </div>

          {/* الزرار - كحلي فخم ببرواز ذهبي */}
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/tickets')}
              className="
                group relative px-12 py-4 bg-[#19355A] text-white font-black text-sm uppercase tracking-[0.2em]
                rounded border-b-4 border-[#B38E19] transition-all duration-300
                hover:bg-[#1e40af] hover:-translate-y-1 active:translate-y-0 active:border-b-0
              "
            >
              {texts.action}
            </button>
          </div>

          {/* التوقيع الفني للسيستم */}
          <p className="mt-12 text-[10px] text-slate-400 font-medium tracking-[0.3em] uppercase border-t border-slate-100 pt-6">
            University Strategic Portal • Support Division
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;