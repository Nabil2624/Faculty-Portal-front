import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PageHeaderAction from "../components/ui/PageHeaderAction";
import { History } from "lucide-react";
const HistoryPage = () => {
  const { t } = useTranslation("history");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // داتا ضخمة ومعقدة لاختبار قوة التصميم
    setRecords([
      {
        id: 1,
        orderName:
          "طلب تمويل لحضور المؤتمر الدولي لتكنولوجيا الذكاء الاصطناعي وتطبيقاته المتقدمة في هندسة البرمجيات",
        owner: "أستاذ دكتور / أحمد محمد محمود عبد الرحمن",
        event:
          "المؤتمر العلمي الدولي السنوي لتكنولوجيا المعلومات والاتصالات - النسخة الخامسة والعشرون",
        date: "2026-06-04",
        status: "drafted",
      },
      {
        id: 2,
        orderName: "مهمة علمية لدراسة أنظمة الطاقة المتجددة",
        owner: "د. سارة محمود حسن",
        event:
          "برنامج التبادل الأكاديمي مع جامعة برلين التقنية للعلوم التطبيقية بألمانيا",
        date: "2026-05-20",
        status: "completed",
      },
    ]);
  }, []);

  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen bg-slate-50 px-2">
        {/* التايتل مع أنيميشن خفيف ولمسة ذهبية */}
        <div className="w-full">
          <PageHeaderAction title={t("title")} icon={History} />
        </div>

        {/* Grid للشاشات الكبيرة (كارتين أو ٣ في الصف حسب الشاشة) */}
        <div className="max-w-[1600px]  mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10">
          {records.map((record, index) => (
            <div
              key={record.id}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between
                       shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(10,25,47,0.12)]
                       border border-slate-100 hover:border-[#d4af37]/40
                       transition-all duration-500 ease-out transform hover:-translate-y-2"
              // أنيميشن دخول الكروت بالتدريج
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
              }}
            >
              {/* خط جمالي بيظهر مع الـ Hover */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#0a192f] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>

              <div className="flex flex-col gap-6 z-10">
                {/* شريط الحالة والتاريخ */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-semibold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                    {record.date}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm
                  ${
                    record.status === "drafted"
                      ? "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200"
                      : "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                  >
                    {record.status}
                  </span>
                </div>

                {/* المحتوى الأساسي (معزول عن بعضه عشان الطول) */}
                <div>
                  <h2 className="text-2xl font-bold text-[#0a192f] leading-snug line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300">
                    {record.orderName}
                  </h2>

                  {/* تم فصل اسم المؤتمر/المهمة وصاحب الطلب في سطور مستقلة */}
                  <div className="mt-5 flex flex-col gap-3">
                    <p className="text-base text-slate-700 line-clamp-2 font-medium bg-slate-50 p-3 rounded-lg border-r-4 border-[#0a192f]/20">
                      {record.event}
                    </p>
                    <p className="text-sm text-slate-500 font-semibold flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                      {record.owner}
                    </p>
                  </div>
                </div>
              </div>

              {/* الزراير والتفاعلات (Actions) */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-end">
                {record.status === "drafted" ? (
                  <button
                    className="w-full sm:w-auto relative overflow-hidden px-8 py-3 bg-[#0a192f] text-[#d4af37] rounded-xl font-bold 
                                   shadow-lg hover:shadow-2xl hover:shadow-[#0a192f]/30 transform active:scale-95 transition-all duration-300
                                   before:absolute before:inset-0 before:bg-white/10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300"
                  >
                    <span className="relative z-10">{t("complete")}</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-[#0a192f] font-bold border-2 border-transparent 
                                     hover:border-[#0a192f]/10 hover:bg-slate-50 transition-all duration-300 active:scale-95"
                    >
                      {t("reapply")}
                    </button>
                    <button
                      className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#bda036] text-white font-bold 
                                     shadow-md hover:shadow-xl hover:shadow-[#d4af37]/40 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300"
                    >
                      {t("track")}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* أنيميشن الدخول (Keyframes) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
      `,
          }}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default HistoryPage;
