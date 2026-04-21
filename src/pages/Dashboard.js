import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Bell,
  User,
  GraduationCap,
  Zap,
  Activity,
  Search,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

const colleges = [
  "طب",
  "هندسة",
  "صيدلة",
  "علوم",
  "حقوق",
  "تجارة",
  "آداب",
  "تمريض",
  "زراعة",
  "تربية",
  "أسنان",
  "حاسبات",
  "فنون",
  "موسيقى",
  "سياحة",
  "رياضية",
  "ألسن",
  "خدمة",
  "إعلام",
  "اقتصاد",
  "آثار",
  "بيطري",
  "تطبيقي",
  "دراسات",
];

// داتا الكليات
const facultyData = colleges.map((name) => ({
  name,
  researches: Math.floor(Math.random() * 80) + 20,
  users: Math.floor(Math.random() * 500) + 100,
}));

// داتا الأبحاث الشهرية
const monthlyData = [
  { month: "Jan", count: 400 },
  { month: "Feb", count: 300 },
  { month: "Mar", count: 550 },
  { month: "Apr", count: 480 },
  { month: "May", count: 700 },
  { month: "Jun", count: 620 },
  { month: "Jul", count: 450 },
  { month: "Aug", count: 500 },
  { month: "Sep", count: 850 },
  { month: "Oct", count: 900 },
  { month: "Nov", count: 780 },
  { month: "Dec", count: 950 },
];

const Dashboard = () => {
  return (
    <ResponsiveLayoutProvider>
      <div className="min-h-screen bg-white text-slate-800 font-sans pb-10">
        <style>{`
        .navy-card {
          background: #19355A;
          border-radius: 28px;
          box-shadow: 0 20px 40px rgba(25, 53, 90, 0.12);
          border: 1px solid rgba(179, 142, 25, 0.2);
        }
        .recharts-polar-grid-concentric-path { stroke: rgba(255, 255, 255, 0.1); }
        .recharts-polar-grid-angle-line { stroke: rgba(255, 255, 255, 0.1); }
      `}</style>

        <div className="max-w-[1600px] mx-auto p-8 pt-6">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-[#19355A] rounded-2xl flex items-center justify-center border border-[#B38E19]/30 shadow-lg">
                <GraduationCap className="text-[#B38E19]" size={28} />
              </div>
              <div className="flex items-center gap-4 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
                <Search className="text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Strategic Data..."
                  className="bg-transparent border-none outline-none text-slate-700 text-sm w-80 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-[#19355A]">
                  Ahmed Hisham
                </p>
                <p className="text-[10px] text-[#B38E19] font-bold uppercase tracking-widest">
                  Portal Manager
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#19355A] flex items-center justify-center border-2 border-[#B38E19]/30">
                <User className="text-white" size={20} />
              </div>
            </div>
          </header>

          {/* Top Stats Squares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                label: "إجمالي المستخدمين",
                val: "18,540",
                icon: <Users size={22} />,
              },
              {
                label: "هيئة التدريس",
                val: "2,105",
                icon: <GraduationCap size={22} />,
              },
              { label: "المديرين", val: "42", icon: <ShieldCheck size={22} /> },
              {
                label: "إجمالي الأبحاث",
                val: "24,801",
                icon: <FileText size={22} />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="navy-card p-6 relative overflow-hidden group hover:translate-y-[-5px] transition-transform duration-300"
              >
                <div className="p-3 bg-white/5 rounded-xl text-[#B38E19] w-fit mb-3">
                  {stat.icon}
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
                <h4 className="text-3xl font-black text-white mt-1">
                  {stat.val}
                </h4>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-12 gap-8 mb-8">
            {/* Radar Chart: Researches */}
            <div className="col-span-12 lg:col-span-6 navy-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B38E19]/5 blur-[60px]"></div>
              <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#B38E19] rounded-full"></div>
                FACULTY RESEARCH POWER
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={facultyData}
                  >
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <Radar
                      name="Researches"
                      dataKey="researches"
                      stroke="#B38E19"
                      strokeWidth={3}
                      fill="#B38E19"
                      fillOpacity={0.2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#19355A",
                        border: "1px solid #B38E19",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Area Chart: Users (THE STEP STYLE YOU LIKED) */}
            <div className="col-span-12 lg:col-span-6 navy-card p-8 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B38E19]/5 blur-[60px]"></div>
              <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#B38E19] rounded-full"></div>
                USERS PER FACULTY (TRAFFIC DENSITY)
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={facultyData}>
                    <defs>
                      <linearGradient id="glowGold" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#B38E19"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#B38E19"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 9 }}
                      axisLine={false}
                    />
                    <YAxis hide={true} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#19355A",
                        border: "1px solid #B38E19",
                        borderRadius: "16px",
                      }}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="users"
                      stroke="#B38E19"
                      strokeWidth={3}
                      fill="url(#glowGold)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Full Width Chart: Monthly Growth */}
          <div className="col-span-12 navy-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-[#B38E19] rounded-full"></div>
                MONTHLY RESEARCH OUTPUT (ANNUAL VIEW)
              </h3>
              <Zap className="text-[#B38E19]" size={20} />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="areaGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B38E19" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B38E19" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#B38E19"
                    strokeWidth={4}
                    fill="url(#areaGold)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
};

export default Dashboard;
