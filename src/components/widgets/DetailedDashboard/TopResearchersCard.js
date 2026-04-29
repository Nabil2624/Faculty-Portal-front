import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, ChevronDown, Globe } from 'lucide-react';

const TopResearchersCard = ({ title = "أفضل الباحثين" }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(false);

  const primary = '#19355A';
  const gold = '#B38E19';

  useEffect(() => {
    setColleges([
      { id: 1, name: 'كلية الهندسة' },
      { id: 2, name: 'كلية الحاسبات والمعلومات' },
      { id: 3, name: 'كلية العلوم' },
      { id: 4, name: 'كلية الطب' }
    ]);
  }, []);

  useEffect(() => {
    if (selectedCollegeId) {
      setLoading(true);
      setTimeout(() => {
        const mockData = [
          { id: 1, name: "أ.د. أحمد هشام محمد", dept: "قسم هندسة النظم", papers: 45, impact: 9.8 },
          { id: 2, name: "د. سارة محمود علي", dept: "قسم الذكاء الاصطناعي", papers: 38, impact: 9.2 },
          { id: 3, name: "د. ياسين إبراهيم", dept: "قسم العلوم الأساسية", papers: 30, impact: 8.5 },
          { id: 4, name: "د. منى القاضي", dept: "قسم طب الفم", papers: 25, impact: 7.9 },
          { id: 5, name: "د. عمر خالد", dept: "قسم الصيدلة الإكلينيكية", papers: 22, impact: 7.5 },
        ];
        setResearchers(mockData);
        setLoading(false);
      }, 600);
    }
  }, [selectedCollegeId]);

  const getRankStyle = (index) => {
    if (index === 0) return { borderColor: gold, bg: 'bg-gradient-to-l from-[#B38E19]/10 to-transparent', icon: <Trophy size={18} className="text-[#B38E19] animate-bounce" /> };
    if (index === 1) return { borderColor: '#94a3b8', bg: 'bg-slate-50', icon: <Medal size={18} className="text-slate-400" /> };
    if (index === 2) return { borderColor: '#cd7f32', bg: 'bg-orange-50/20', icon: <Award size={18} className="text-orange-700" /> };
    return { borderColor: 'transparent', bg: 'bg-white', icon: null };
  };

  return (
    <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.15)] rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col transition-all duration-500">
      
      {/* Header - نفس حجم الكارت العام */}
      <div style={{ backgroundColor: primary }} className="relative px-5 py-5 text-center overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <h2 className="text-white text-lg font-black flex justify-center items-center gap-2 relative z-10">
          <Star size={18} fill={gold} color={gold} className="animate-pulse" />
          {title}
        </h2>
        <p className="text-blue-100/60 text-[10px] font-medium relative z-10 uppercase tracking-widest">
          University Ranking System
        </p>
      </div>

      <div className="py-2 px-4 bg-gray-50/50 flex-grow">
        {/* Dropdown Section - محاذاة موزونة */}
        <div className="relative mb-4 h-[46px] flex items-center group">
          <select 
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full py-2 px-4 bg-white border border-gray-100 text-[#19355A] text-[10px] font-bold rounded-xl outline-none transition-all focus:border-[#B38E19] appearance-none shadow-sm cursor-pointer pr-10"
          >
            <option value="">-- اختر الكلية لعرض التوب 5 --</option>
            {colleges.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: gold }}></div>
          </div>
        ) : selectedCollegeId ? (
          <div className="space-y-2.5">
            {researchers.map((res, index) => {
              const style = getRankStyle(index);
              const isTopThree = index < 3;

              return (
                <div 
                  key={res.id}
                  className={`relative flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 
                    ${isTopThree ? (style.bg + ' scale-[1.02] shadow-md z-10 hover:scale-[1.04]') : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'}`}
                  style={{ borderColor: style.borderColor }}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge - نفس مقاس الـ 9x9 في التصنيف العام */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] bg-white"
                      style={{ color: index === 0 ? gold : (index === 1 ? '#94a3b8' : (index === 2 ? '#cd7f32' : '#d1d5db')) }}
                    >
                      {style.icon ? style.icon : index + 1}
                    </div>

                    <div>
                      <h3 className={`font-bold leading-tight ${index === 0 ? 'text-sm' : 'text-xs'}`} style={{ color: primary }}>
                        {res.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold tracking-tight">
                        {res.dept}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* عمود الأبحاث - مطابق للكارت العام */}
                    <div className="hidden sm:block text-center px-3 border-l border-gray-100">
                      <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest">Papers</p>
                      <p className="text-xs font-bold text-[#19355A]">{res.papers}</p>
                    </div>
                    
                    {/* عمود الـ Score/Impact - مطابق للكارت العام */}
                    <div className="min-w-[55px] py-1.5 px-2 rounded-xl bg-white shadow-inner flex flex-col items-center border border-gray-50">
                      <p className="text-[8px] font-black text-gray-400">IMPACT</p>
                      <span className="text-sm font-black" style={{ color: isTopThree ? gold : primary }}>
                        {res.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-14 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
              <Globe size={24} className="text-gray-200 mx-auto mb-3" />
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">اختر الكلية للبدء</p>
          </div>
        )}
      </div>

      {/* Footer الموحد */}
      <div className="bg-gray-50/50 py-3 px-6 flex justify-between items-center border-t border-gray-100 mt-auto shrink-0">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          Statistical Insight 2026
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B38E19]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default TopResearchersCard;