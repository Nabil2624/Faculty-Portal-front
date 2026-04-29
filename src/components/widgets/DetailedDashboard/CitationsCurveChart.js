import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, ChevronLeft, Quote } from 'lucide-react';

const CitationsCurveChart = ({ isRTL = true }) => {
  const primary = '#19355A';
  const gold = '#B38E19';

  const data = [
    { year: '2018', citations: 120 },
    { year: '2019', citations: 300 },
    { year: '2020', citations: 450 },
    { year: '2021', citations: 800 },
    { year: '2022', citations: 650 },
    { year: '2023', citations: 1100 },
    { year: '2024', citations: 1400 },
  ];

  return (
    <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(25,53,90,0.15)] rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col transition-all duration-500">
      
      {/* Header */}
      <div style={{ backgroundColor: primary }} className="px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className={`flex items-center justify-between relative z-10 `}>
          <div className={`flex items-center gap-3 `}>
            <div className="p-2 bg-white/10 rounded-lg">
              <Quote size={20} className="text-[#B38E19]" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black tracking-wide">
                {isRTL ? 'معدل الاقتباسات السنوي' : 'Annual Citations Rate'}
              </h2>
              <p className="text-blue-100/50 text-[13px] font-bold uppercase tracking-widest">الاقتباسات لكل سنة</p>
              <p className="text-[#B38E19] text-[12px] font-bold uppercase tracking-widest">اجمالي عدد الاقتباسات 1500</p>
            </div>
          </div>

          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors border border-white/10">
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors border border-white/10">
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="flex-grow p-6 bg-gray-50/30">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
    
              margin={{ 
                top: 10, 
                right: isRTL ? 30 : 10, 
                left: isRTL ? 10 : 30, 
                bottom: 0 
              }}
            >
              <defs>
                <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                reversed={isRTL}
                dy={10} // دفع أرقام السنوات للأسفل قليلاً
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                /* tickMargin هو السر هنا لإبعاد الأرقام عن المحور */
                tickMargin={15} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                orientation={isRTL ? 'right' : 'left'}
              />
              
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '15px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}
              />
              
              <Area 
                type="monotone" 
                dataKey="citations" 
                stroke={gold} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCitations)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {isRTL ? 'زيادة عن العام الماضي' : 'Growth vs last year'}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#B38E19]' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitationsCurveChart;