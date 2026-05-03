import React from "react";
// Ensure this path matches your project structure
import facultyImg from "../assets/helwan-university.jpeg";

/**
 * FacultyProgressLoader Component
 *
 * @param {number} progress - Current percentage (0 to 100)
 * @param {number} total - Total number of items/records to be processed
 * @param {number} completed - Number of items already finished
 * @param {number} eta - Estimated time remaining in seconds
 * @param {string} message - Status text to display (e.g., "Fetching data...")
 */
const FacultyProgressLoader = ({
  progress = 0,
  total = 0,
  completed = 0,
  eta = 0,
  message = "جاري التحميل...",
}) => {
  const navyColor = "#19355A";
  const goldColor = "#B38E19";

  // --- Circular Progress Logic ---
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Clamp progress between 0 and 100 to prevent SVG errors
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans"
      style={{ backgroundColor: navyColor }}
    >
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          src={facultyImg}
          alt="University Background"
          className="w-full h-full object-cover filter blur-sm"
        />
      </div>

      {/* Glassmorphic Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-10 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl min-w-[420px]">
        {/* Progress Circle & Percentage */}
        <div className="relative flex items-center justify-center w-48 h-48">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 160 160"
          >
            {/* Background Track Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
              className="opacity-10"
            />
            {/* Active Gold Progress Stroke */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={goldColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-in-out"
              style={{ filter: `drop-shadow(0 0 8px ${goldColor}90)` }}
            />
          </svg>

          {/* Center Percentage Display */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-black" style={{ color: goldColor }}>
              {Math.round(safeProgress)}
              <span className="text-2xl font-light">%</span>
            </span>
          </div>
        </div>

        {/* Info & Stats Section */}
        <div className="mt-8 w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            بوابة أعضاء هيئة التدريس
          </h2>
          <p className="text-[#B38E19] text-[10px] tracking-[0.3em] uppercase font-bold mb-6 animate-pulse min-h-[1.5rem]">
            {message}
          </p>

          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-0 border-t border-b border-white/10 py-4 mb-4">
            <div className="border-r border-white/10 px-4 text-right">
              <p className="text-gray-400 text-[9px] uppercase tracking-tighter">
                إجمالي الأبحاث
              </p>
              <p className="text-white font-mono text-xl">{total}</p>
            </div>
            <div className="px-4 text-left">
              <p className="text-gray-400 text-[9px] uppercase tracking-tighter">
                تمت معالجة
              </p>
              <p className="text-[#B38E19] font-mono text-xl">{completed}</p>
            </div>
          </div>

          {/* ETA Display */}
          <div className="text-xs text-gray-400 font-light">
            الوقت المتوقع للانتهاء:
            <span className="text-white font-bold ml-2">{eta}</span>
          </div>
        </div>
      </div>

      {/* Animated Bottom Scanner Line */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 overflow-hidden bg-black/20">
        <div
          className="h-full bg-gradient-to-r from-transparent via-[#B38E19] to-transparent"
          style={{
            width: "40%",
            animation: "smoothLine 3s infinite linear",
          }}
        />
      </div>

      {/* Scoped CSS for Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes smoothLine {
              0% { transform: translateX(-150%); }
              100% { transform: translateX(350%); }
            }
          `,
        }}
      />
    </div>
  );
};

export default FacultyProgressLoader;
