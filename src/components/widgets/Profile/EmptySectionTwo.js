export default function EmptySectionTwo({ title, action }) {
  return (
    <div
      className="
        bg-white border border-slate-200 shadow-sm
        rounded-[clamp(0.75rem,1vw,1.25rem)]
        p-[clamp(1rem,3vw,2rem)]
        h-[clamp(160px,17vw,320px)]
        w-[clamp(160px,26vw,320px)]
        flex flex-col items-center justify-center
        text-center
      "
    >
      <h3
        className="
          text-gray-600
          mb-[clamp(0.5rem,1vw,1rem)]
          text-[clamp(0.9rem,1.2vw,1.2rem)]
        "
      >
        {title}
      </h3>

      {action && (
        <p
          className="
            text-yellow-600 font-medium cursor-pointer
            text-[clamp(0.85rem,1vw,1.1rem)]
          "
        >
          {action}
        </p>
      )}
    </div>
  );
}
