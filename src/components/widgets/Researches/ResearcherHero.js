import React from "react";

const ResearcherHero = ({ researcher, t, isArabic }) => {
  if (!researcher) return null;

  return (
    <div
      className="flex flex-row items-start w-full"
      style={{ gap: "clamp(1rem, 1.5vw, 2.5rem)" }}
    >
      {/* صورة الباحث */}
      <div className="flex-shrink-0">
        <div
          className="rounded-full shadow-md"
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
              width: "clamp(90px, 11vw, 160px)",
              height: "clamp(90px, 11vw, 160px)",
            }}
          />
        </div>
      </div>

      {/* تفاصيل الباحث */}
      <div
        className="flex flex-col items-start"
        style={{ paddingTop: "0.5rem" }}
      >
        <h1
          className="font-bold text-[#19355A] leading-tight"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.8rem)" }}
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
          className="flex flex-wrap text-[#B38E19] font-semibold mt-4"
          style={{
            fontSize: "clamp(0.75rem, 0.9vw, 1.1rem)",
            gap: "0.5rem",
          }}
        >
          {researcher.researcherInterests?.map((interest, idx) => (
            <span key={idx} className="flex items-center">
              {interest.name}
              {idx !== researcher.researcherInterests.length - 1 && (
                <span className="text-gray-300 font-light mx-2"> | </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearcherHero;