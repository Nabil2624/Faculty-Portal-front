import React from "react";

const ResearcherHero = ({ researcher, t, isArabic }) => {
  if (!researcher) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-center sm:items-start w-full text-center sm:text-start"
      style={{ gap: "clamp(1rem, 1.5vw, 2.5rem)" }}
    >
      {/* صورة الباحث */}
      <div className="flex-shrink-0">
        <div
          className="rounded-full shadow-md transition-transform duration-300 hover:scale-105"
          style={{
            border: `clamp(2px, 0.3vw, 4px) solid #B38E19`,
            padding: "clamp(2px, 0.2vw, 5px)",
          }}
        >
          <img
            src={researcher.scholarProfileImageURL}
            alt={researcher.academicName}
            className="rounded-full object-cover"
            style={{
              width: "clamp(100px, 11vw, 160px)",
              height: "clamp(100px, 11vw, 160px)",
            }}
          />
        </div>
      </div>

      {/* تفاصيل الباحث */}
      <div
        className="flex flex-col items-center sm:items-start flex-1"
        style={{ paddingTop: "0.5rem" }}
      >
        <h1
          className="font-bold text-[#19355A] leading-tight"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 2.8rem)" }}
        >
          {researcher.academicName}
        </h1>
        <p
          className="text-gray-600 font-medium mt-1"
          style={{ fontSize: "clamp(0.85rem, 1.1vw, 1.7rem)" }}
        >
          {researcher.jobTitle}
        </p>
        
        {/* الاهتمامات البحثية */}
        <div
          className="flex flex-wrap justify-center sm:justify-start text-[#B38E19] font-semibold mt-4 w-full"
          style={{
            fontSize: "clamp(0.7rem, 0.9vw, 1.1rem)",
            gap: "0.5rem",
          }}
        >
          {researcher.researcherInterests?.map((interest, idx) => (
            <div key={idx} className="flex items-center">
              {/* في الموبايل بتظهر كـ Chip بسيط، وفي الشاشات الأكبر بنرجع الفاصل */}
              <span className="bg-[#B38E19]/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-md whitespace-nowrap border border-[#B38E19]/10 sm:border-none">
                {interest.name}
              </span>
              
              {/* الفاصل يظهر فقط من شاشة الـ sm (التابلت/لابتوب) وما فوق */}
              {idx !== researcher.researcherInterests.length - 1 && (
                <span className="hidden sm:inline text-gray-300 font-light mx-2"> | </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearcherHero;