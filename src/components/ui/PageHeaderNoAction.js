import React from 'react';

export default function PageHeaderNoAction({ title, icon: Icon }) {
  return (
    <>
      <style>{`
        :root {
          --fluid-h2: clamp(1.125rem, 1.2vw + 0.5rem, 3rem);
        }
      `}</style>

      <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-[3px] border-[#b38e19] mb-6">
        <div className="flex items-center gap-3">
          {/* Icon Container */}
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-[#b38e19]/5 border-2 border-gray-100 flex items-center justify-center text-[#b38e19] shrink-0">
              <Icon size={24} />
            </div>
          )}

          {/* Title Section */}
          <div>
            <h2
              className="text-black font-semibold leading-tight tracking-tight"
              style={{ fontSize: "var(--fluid-h2)" }}
            >
              {title}
            </h2>
          </div>
        </div>

      </div>
    </>
  );
}