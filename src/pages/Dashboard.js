import React, { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  LabelList,
  Area,
  PieChart, // تم الإضافة
  Pie, // تم الإضافة
  Cell, // تم الإضافة
  Legend, // تم الإضافة
} from "recharts";
import {
  User,
  GraduationCap,
  Search,
  Users,
  ShieldCheck,
  FileText,
  X,
  Printer,
  RefreshCw,
  Eye,
} from "lucide-react";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import AcademicLoader from "../components/AcademicLoader";
import { useDashboard } from "../hooks/useDashboard";
import { useTranslation } from "react-i18next";
import CollegeCard from "../components/widgets/DetailedDashboard/CollegeCard";
import {
  getOverallSystemPerformanceReportPreview,
  downloadGeneralSystemReportPdf,
} from "../services/dashboardAndReports.service";
const Dashboard = () => {
  const { dashboard, loading, error } = useDashboard();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // ── Report modal state ────────────────────────────────────────────────────
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportNotes, setReportNotes] = useState("");
  const [reportPreview, setReportPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(0.85);

  const ZOOM_STEP = 0.15;
  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 2.5;

  const fetchPreview = useCallback(async (notes) => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await getOverallSystemPerformanceReportPreview(notes);
      setReportPreview(res.data);
    } catch {
      setPreviewError("تعذّر تحميل المعاينة. يرجى المحاولة مرة أخرى.");
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const openReportModal = () => {
    setReportModalOpen(true);
    setReportNotes("");
    setReportPreview(null);
    setPreviewError(null);
    setDownloadError(null);
    setPreviewZoom(0.85);
    fetchPreview("");
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await downloadGeneralSystemReportPdf(reportNotes);
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "system-performance-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setDownloadError("تعذّر تحميل الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setDownloading(false);
    }
  };

  // Render the preview data (handles both HTML strings and JSON objects)
  const renderPreviewData = (data) => {
    if (!data) return null;
    if (typeof data === "string") {
      return (
        <div
          className="prose max-w-none text-slate-700"
          style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)" }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      );
    }
    if (typeof data === "object") {
      const entries = Object.entries(data);
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-[#f8fafc] rounded-xl border border-slate-100 px-4 py-3 flex flex-col gap-1"
            >
              <span
                className="text-[#B38E19] font-bold uppercase tracking-wide"
                style={{ fontSize: "clamp(0.6rem, 0.75vw, 0.72rem)" }}
              >
                {key}
              </span>
              <span
                className="text-[#19355A] font-black"
                style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.1rem)" }}
              >
                {Array.isArray(value) ? value.join(", ") : String(value ?? "—")}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  // ─────────────────────────────────────────────────────────────────────────
  const tooltipStyle = {
    backgroundColor: "#ffffff",
    border: "2px solid #B38E19",
    borderRadius: "12px",
    color: "#000000",
    fontSize: "12px",
    direction: isArabic ? "rtl" : "ltr",
    textAlign: "start",
  };

  if (loading)
    return (
      <ResponsiveLayoutProvider>
        <div className="flex justify-center items-center h-screen text-[#19355A] font-bold">
          جاري تحميل البيانات الاستراتيجية...
        </div>
      </ResponsiveLayoutProvider>
    );

  if (error || !dashboard)
    return (
      <ResponsiveLayoutProvider>
        <div className="text-red-500 text-center p-10 font-bold">
          {error ? "حدث خطأ أثناء تحميل البيانات" : "لا يوجد بيانات حالياً"}
        </div>
      </ResponsiveLayoutProvider>
    );

  const sortedRadarData = dashboard?.researchesPerFaculty
    ? [...dashboard.researchesPerFaculty]
        .sort((a, b) => b.totalNumberOfResearches - a.totalNumberOfResearches)
        .map((item) => ({
          name: isArabic ? item.facultyNameAR : item.facultyNameEN,
          researches: item.totalNumberOfResearches,
        }))
    : [];

  const usersAreaData =
    dashboard?.usersPerFaculty?.map((item) => ({
      name: isArabic ? item.facultyNameAR : item.facultyNameEN,
      users: item.totalNumberOfUsers,
    })) || [];

  const growthData =
    dashboard?.researchesMonthlyRate?.map((item) => ({
      month: isArabic ? item.monthAR : item.monthEN,
      count: item.totalNumberOfResearches,
    })) || [];

  const internalResearches = dashboard?.internalResearchesCount || 120;
  const externalResearches = dashboard?.externalResearchesCount || 80;

  const openTickets = dashboard?.openTicketsCount || 15;
  const closedTickets = dashboard?.closedTicketsCount || 45;

  const totalResearches = (internalResearches || 0) + (externalResearches || 0);
  const totalTickets = (openTickets || 0) + (closedTickets || 0);
  const researchesData = [
    {
      name: "أبحاث داخلية",
      value: internalResearches,
      percentage: ((internalResearches / totalResearches) * 100).toFixed(1),
    },
    {
      name: "أبحاث خارجية",
      value: externalResearches,
      percentage: ((externalResearches / totalResearches) * 100).toFixed(1),
    },
  ];

  const ticketsData = [
    {
      name: "تذاكر مفتوحة",
      value: openTickets,
      percentage: ((openTickets / totalTickets) * 100).toFixed(1),
    },
    {
      name: "تذاكر مغلقة",
      value: closedTickets,
      percentage: ((closedTickets / totalTickets) * 100).toFixed(1),
    },
  ];

  const RESEARCH_COLORS = ["#19355A", "#B38E19"];
  const TICKET_COLORS = ["#19355A", "#B38E19"];
  return (
    <ResponsiveLayoutProvider>
      <div
        className="min-h-[90vh] bg-[#f8fafc] text-slate-800 font-sans pb-10"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <style>{`
          .custom-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            border-inline-start: 5px solid #19355A;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }
          .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .recharts-tooltip-item-list, .recharts-tooltip-label { color: #000000 !important; }
        `}</style>

        <div className="max-w-[1420px] mx-auto p-6 md:p-1 pt-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="flex items-center gap-4 w-full md:w-auto justify-start">
              <div className="w-11 h-11 rounded-2xl bg-[#19355A] flex items-center justify-center border-2 border-[#B38E19]/30">
                <User className="text-white" size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-black">
                  {dashboard.currentUserName || "مستخدم النظام"}
                </p>
                <p className="text-[10px] text-[#B38E19] font-bold uppercase tracking-widest">
                  {dashboard.currentUserRoles?.[0] || "مدير البوابة"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#19355A] text-white px-5 rounded-xl font-black text-[clamp(10px,1.2vw,18px)] uppercase tracking-[2px] hover:bg-[#2a4a75] transition-all active:scale-95 shadow-lg">
                {" "}
                عرض التفاصيل{" "}
              </button>
              <button
                onClick={openReportModal}
                className="h-[clamp(2.5rem,3.2vw,3rem)] flex items-center justify-center gap-2 bg-[#B38E19] text-white px-5 rounded-xl font-black text-[clamp(10px,1.2vw,18px)] uppercase tracking-[2px] hover:bg-[#cfa82a] transition-all active:scale-95 shadow-lg shadow-amber-900/10"
              >
                {" "}
                طباعة تقرير{" "}
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              {
                label: "إجمالي المستخدمين",
                val: (dashboard?.totalUsersNumber ?? 0).toLocaleString(),
                icon: <Users size={22} />,
              },
              {
                label: "هيئة التدريس",
                val: (
                  dashboard?.totalFacultyMembersNumber ?? 0
                ).toLocaleString(),
                icon: <GraduationCap size={22} />,
              },
              {
                label: "المديرين",
                val: (
                  dashboard?.totalSystemManagersNumber ?? 0
                ).toLocaleString(),
                icon: <ShieldCheck size={22} />,
              },
              {
                label: "إجمالي الأبحاث",
                val: (
                  dashboard?.researchesStats.totalResearchesNumber ?? 0
                ).toLocaleString(),
                icon: <FileText size={22} />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="custom-card p-6 transition-transform hover:scale-[1.02]"
              >
                <div className="p-3 bg-slate-50 rounded-xl text-[#B38E19] w-fit mb-3">
                  {stat.icon}
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
                <h4 className="text-3xl font-black text-black mt-1">
                  {stat.val}
                </h4>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* الباي شارت الأولى: الأبحاث */}
            <div className="custom-card p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
              {/* الهيدر */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-black flex items-center">
                  <div
                    className={`w-1 h-6 bg-[#B38E19] rounded-full ${isArabic ? "ml-3" : "mr-3"}`}
                  ></div>
                  {isArabic
                    ? "نسبة الأبحاث (داخلية / خارجية)"
                    : "Research Ratio (Internal / External)"}
                </h3>
                <a
                  href="/details"
                  className="text-sm font-bold text-[#B38E19] hover:underline transition-all"
                >
                  {isArabic ? "عرض التفاصيل" : "View Details"}
                </a>
              </div>

              <div className="h-[250px] relative outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  {/* أضفنا ستايل لمنع الأوتلاين عن الشارت بالكامل */}
                  <PieChart style={{ outline: "none" }} tabIndex={-1}>
                    <Pie
                      data={researchesData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      style={{ outline: "none" }}
                      tabIndex="-1"
                    >
                      {researchesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={RESEARCH_COLORS[index]}
                          style={{ outline: "none" }} // منع الأوتلاين عن كل خلية
                          tabIndex="-1"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      wrapperStyle={{ zIndex: 1000, outline: "none" }}
                      contentStyle={tooltipStyle}
                      formatter={(value, name, props) => [
                        `${value} (${props.payload.percentage}%)`,
                        name,
                      ]}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="rect"
                      // منع الأوتلاين عن منطقة الألوان
                      wrapperStyle={{ outline: "none" }}
                      formatter={(value) => (
                        <span
                          style={{
                            outline: "none",
                            marginRight: "10px",
                            marginLeft: "20px",
                            color: "#444",
                            fontSize: "13px",
                            display: "inline-block",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* الإجمالي في المنتصف */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {isArabic ? "إجمالي" : "TOTAL"}
                  </span>
                  <span className="text-xl font-black text-[#19355A]">
                    {totalResearches}
                  </span>
                </div>
              </div>
            </div>

            {/* الباي شارت الثانية: التذاكر */}
            <div className="custom-card p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
              {/* الهيدر: العنوان + عرض التفاصيل */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-black flex items-center">
                  <div
                    className={`w-1 h-6 bg-[#B38E19] rounded-full ${isArabic ? "ml-3" : "mr-3"}`}
                  ></div>
                  {isArabic
                    ? "حالة تذاكر الدعم الفني"
                    : "Technical Support Tickets"}
                </h3>
                <a
                  href="/s"
                  className="text-sm font-bold text-[#B38E19] hover:underline transition-all"
                >
                  {isArabic ? "عرض التفاصيل" : "View Details"}
                </a>
              </div>

              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketsData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ticketsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={TICKET_COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      wrapperStyle={{ zIndex: 1000 }}
                      formatter={(value, name, props) => [
                        `${value} (${props.payload.percentage}%)`,
                        name,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="rect"
                      formatter={(value) => (
                        <span
                          style={{
                            marginRight: "10px",
                            marginLeft: "20px",
                            color: "#444",
                            fontSize: "13px",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    التذاكر
                  </span>
                  <span className="text-xl font-black text-[#19355A]">
                    {totalTickets}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* 1. مخطط الأعمدة - النص أبيض داخل البار من جهة اليمين */}
            <div className="custom-card p-6 md:p-6">
              <h3 className="text-xl font-black text-black mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#B38E19] rounded-full"></div>
                توزيع الأبحاث العلمية حسب الكلية
              </h3>

              <div className="w-full overflow-x-auto custom-scroll md:overflow-hidden">
                <div
                  style={{
                    minWidth: "1000px",
                    height: isArabic ? "450px" : "600px",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sortedRadarData}
                      margin={{ bottom: 80, left: 10, right: 10, top: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="glowGoldResearch"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#B38E19"
                            stopOpacity={0.3}
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
                        stroke="#f1f5f9"
                      />

                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-90}
                        textAnchor="end"
                        height={isArabic ? 100 : 190}
                        dy={isArabic ? 140 : 0}
                        tick={{
                          fill: "#64748b",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />

                      <YAxis hide />

                      <Tooltip contentStyle={tooltipStyle} />

                      <Area
                        type="stepAfter"
                        dataKey="researches"
                        stroke="#B38E19"
                        strokeWidth={3}
                        fill="url(#glowGoldResearch)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* 2. Area Chart: المستخدمين */}
            <div className="custom-card p-6 md:p-6">
              <h3 className="text-xl font-black text-black mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#B38E19] rounded-full"></div>
                المستخدمين حسب الكلية
              </h3>
              <div className="w-full overflow-x-auto custom-scroll md:overflow-hidden">
                <div
                  style={{
                    minWidth: "1000px",
                    height: isArabic ? "450px" : "600px",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={usersAreaData}
                      margin={{ bottom: 80, left: 10, right: 10, top: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="glowGold"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#B38E19"
                            stopOpacity={0.3}
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
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-90}
                        textAnchor="end"
                        height={isArabic ? 100 : 190}
                        dy={isArabic ? 140 : 0}
                        tick={{
                          fill: "#64748b",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />
                      <YAxis hide />
                      <Tooltip contentStyle={tooltipStyle} />
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

            {/* 3. Monthly Growth */}
            <div className="custom-card p-6 md:p-10">
              <h3 className="text-xl font-black text-black mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#B38E19] rounded-full"></div>
                معدل نمو الأبحاث الشهري
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#B38E19"
                      strokeWidth={4}
                      fill="rgba(25, 53, 90, 0.05)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Modal ─────────────────────────────────────────────────── */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setReportModalOpen(false);
          }}
        >
          <div
            dir="rtl"
            className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
            style={{ maxWidth: "760px", maxHeight: "90vh" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#19355A] flex items-center justify-center">
                  <Printer size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-black text-[#19355A] text-base leading-none">
                    تقرير أداء النظام العام
                  </h2>
                  <p className="text-[10px] text-[#B38E19] font-bold tracking-widest uppercase mt-0.5">
                    Overall System Performance Report
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Notes section */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#19355A] uppercase tracking-widest">
                  ملاحظات التقرير
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك هنا… (اختياري)"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 outline-none resize-none text-slate-700 bg-[#f8fafc] focus:border-[#B38E19] transition"
                  style={{
                    padding:
                      "clamp(0.5rem,0.8vw,0.75rem) clamp(0.75rem,1vw,1rem)",
                    fontSize: "clamp(0.8rem,1vw,0.95rem)",
                  }}
                />
                <button
                  onClick={() => fetchPreview(reportNotes)}
                  disabled={previewLoading}
                  className="self-start flex items-center gap-2 rounded-lg border border-[#19355A] text-[#19355A] font-bold hover:bg-[#19355A] hover:text-white transition disabled:opacity-50"
                  style={{
                    padding:
                      "clamp(0.3rem,0.5vw,0.45rem) clamp(0.8rem,1vw,1rem)",
                    fontSize: "clamp(0.7rem,0.9vw,0.85rem)",
                  }}
                >
                  {previewLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Eye size={13} />
                  )}
                  تحديث المعاينة
                </button>
              </div>

              {/* Divider + zoom controls */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  معاينة التقرير
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                {/* Zoom controls — only shown when preview has content */}
                {!previewLoading && !previewError && reportPreview && (
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 py-0.5">
                    <button
                      onClick={() =>
                        setPreviewZoom((z) =>
                          Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={previewZoom <= ZOOM_MIN}
                      title="تصغير"
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setPreviewZoom(1)}
                      title="إعادة الحجم الافتراضي"
                      className="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-bold text-[#19355A] hover:bg-slate-100 transition tabular-nums"
                    >
                      {Math.round(previewZoom * 100)}%
                    </button>
                    <button
                      onClick={() =>
                        setPreviewZoom((z) =>
                          Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)),
                        )
                      }
                      disabled={previewZoom >= ZOOM_MAX}
                      title="تكبير"
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 text-base font-bold leading-none"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Preview area */}
              <div className="min-h-[120px] overflow-auto rounded-xl border border-slate-100 bg-[#f8fafc]">
                {previewLoading && (
                  <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm font-medium">
                      جاري تحميل المعاينة…
                    </span>
                  </div>
                )}
                {previewError && !previewLoading && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                    {previewError}
                  </div>
                )}
                {!previewLoading && !previewError && reportPreview && (
                  <div
                    style={{
                      transform: `scale(${previewZoom})`,
                      transformOrigin: "top right",
                      transition: "transform 0.15s ease",
                      // Push the container height so the scrollable parent reflects the scaled size
                      minHeight: `${previewZoom * 100}%`,
                      padding: "1rem",
                    }}
                  >
                    {renderPreviewData(reportPreview)}
                  </div>
                )}
                {!previewLoading && !previewError && !reportPreview && (
                  <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                    لا توجد بيانات للمعاينة حالياً
                  </div>
                )}
              </div>

              {downloadError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm font-medium">
                  {downloadError}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-between items-center gap-3">
              <button
                onClick={() => setReportModalOpen(false)}
                className="rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.2rem,1.8vw,1.8rem)",
                  fontSize: "clamp(0.75rem,1vw,0.9rem)",
                }}
              >
                إغلاق
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center gap-2 rounded-xl bg-[#B38E19] text-white font-black hover:bg-[#cfa82a] transition disabled:opacity-50 active:scale-95 shadow-md"
                style={{
                  padding:
                    "clamp(0.45rem,0.7vw,0.65rem) clamp(1.5rem,2vw,2.5rem)",
                  fontSize: "clamp(0.8rem,1.1vw,1rem)",
                }}
              >
                {downloading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Printer size={15} />
                )}
                {downloading ? "جاري التحميل…" : "طباعة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayoutProvider>
  );
};

export default Dashboard;
